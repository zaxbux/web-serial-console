import { IBuffer, IBufferCell, IBufferRange, type Terminal } from '@xterm/xterm';

export interface IHTMLSerializeOptions {
  /**
   * The number of rows in the scrollback buffer to serialize, starting from the bottom of the
   * scrollback buffer. When not specified, all available rows in the scrollback buffer will be
   * serialized. This setting is ignored if {@link IHTMLSerializeOptions.onlySelection} is true.
   */
  scrollback: number;

  /**
   * Whether to only serialize the selection. If false, the whole active buffer is serialized.
   * False by default.
   */
  onlySelection: boolean;
}

function constrain(value: number, low: number, high: number): number {
  return Math.max(low, Math.min(value, high));
}

export function serializeBufferAsPlain(terminal: Terminal, options: Partial<IHTMLSerializeOptions> = {}): string {
  const buffer = terminal.buffer.active;
  const handler = new PlainSerializeHandler(buffer);
  const onlySelection = options.onlySelection ?? false;
  if (!onlySelection) {
    const maxRows = buffer.length;
    const scrollback = options.scrollback;
    const correctRows = (scrollback === undefined) ? maxRows : constrain(scrollback + terminal.rows, 0, maxRows);
    return handler.serialize({
      start: { x: 0,             y: maxRows - correctRows },
      end:   { x: terminal.cols, y: maxRows - 1           }
    });
  }

  const selection = terminal?.getSelectionPosition();
  if (selection !== undefined) {
    return handler.serialize({
      start: { x: selection.start.x, y: selection.start.y },
      end:   { x: selection.end.x,   y: selection.end.y   }
    });
  }

  return '';
}

export class PlainSerializeHandler {
  private _currentRow: string = '';

  private _htmlContent = '';

  constructor(protected readonly _buffer: IBuffer) {
  }

  public serialize(range: IBufferRange, excludeFinalCursorPosition?: boolean): string {
    // we need two of them to flip between old and new cell
    const cell1 = this._buffer.getNullCell();
    const cell2 = this._buffer.getNullCell();
    let oldCell = cell1;

    const startRow = range.start.y;
    const endRow = range.end.y;
    const startColumn = range.start.x;
    const endColumn = range.end.x;

    this._beforeSerialize(endRow - startRow, startRow, endRow);

    for (let row = startRow; row <= endRow; row++) {
      const line = this._buffer.getLine(row);
      if (line) {
        const startLineColumn = row === range.start.y ? startColumn : 0;
        const endLineColumn = row === range.end.y ? endColumn: line.length;
        for (let col = startLineColumn; col < endLineColumn; col++) {
          const c = line.getCell(col, oldCell === cell1 ? cell2 : cell1);
          if (!c) {
            console.warn(`Can't get cell at row=${row}, col=${col}`);
            continue;
          }
          this._nextCell(c, oldCell, row, col);
          oldCell = c;
        }
      }
      this._rowEnd(row, row === endRow);
    }

    this._afterSerialize();

    return this._serializeString(excludeFinalCursorPosition);
  }

  protected _beforeSerialize(rows: number, start: number, end: number): void {}

  protected _afterSerialize(): void {}

  protected _rowEnd(row: number, isLastRow: boolean): void {
    this._htmlContent += '' + this._currentRow + (isLastRow ? '' : '\n');
    this._currentRow = '';
  }

  protected _nextCell(cell: IBufferCell, oldCell: IBufferCell, row: number, col: number): void {
    // a width 0 cell don't need to be count because it is just a placeholder after a CJK character;
    const isPlaceHolderCell = cell.getWidth() === 0;
    if (isPlaceHolderCell) {
      return;
    }

    // this cell don't have content
    const isEmptyCell = cell.getChars() === '';

    // handles actual content
    if (isEmptyCell) {
      this._currentRow += ' ';
    } else {
      this._currentRow += cell.getChars();
    }
  }

  protected _serializeString(excludeFinalCursorPosition?: boolean): string {
    return this._htmlContent;
  }
}
