import { Terminal } from '@xterm/xterm';

const printableColours = 256;

/**
 * Return a colour that contrasts with the given colour
 */
function contrastColour(terminal: Terminal, colour: number) {
	let r, g, b, luminance;

	// Initial 16 ANSI colours
	if (colour < 16) {
		if (colour == 0) {
			return 15;
		} else {
			return 0;
		}
	}

	// Greyscale # rgb_R = rgb_G = rgb_B = (number - 232) * 10 + 8
	// Greyscale ramp
	if (colour > 231) {
		if (colour < 244) {
			return 15;
		} else {
			return 0;
		}
	}

	// All other colours:
	// 6x6x6 colour cube = 16 + 36*R + 6*G + B  # Where RGB are [0..5]
	// See http://stackoverflow.com/a/27165165/5353461

	// r=(colour-16) / 36;
	g = ((colour - 16) % 36) / 6;
	// b=(colour-16) % 6;

	// If luminance is bright, print number in black, white otherwise.
	// Green contributes 587/1000 to human perceived luminance - ITU R-REC-BT.601
	if (g > 2) {
		return 0;
	} else {
		return 15;
	}

	// Uncomment the below for more precise luminance calculations
	/*
	// Calculate perceived brightness
	// See https://www.w3.org/TR/AERT#color-contrast
	// and http://www.itu.int/rec/R-REC-BT.601
	// Luminance is in range 0..5000 as each value is 0..5
	luminance=(r * 299) + (g * 587) + (b * 114);
	if ( luminance > 2500 ) { return 0 } else { return 15; }
	*/
}

/**
 * Print a coloured block with the number of that colour
 */
async function printColour(terminal: Terminal, colour: number) {
	const contrast = contrastColour(terminal, colour);
	const padded = colour.toString().padStart(3, ' ');

	terminal.write(`\x1b[48;5;${colour}m`);             // start block of colour
	terminal.write(`\x1b[38;5;${contrast}m${padded}`); // in contrast, print number
	terminal.write('\x1b[0m ');                         // reset colour
}

/**
 * Starting at `start`, print a run of `length` colours
 * 
 * @param start 
 * @param length 
 */
async function printRun(terminal: Terminal, start: number, length: number) {
	for (let i = start; i < start + length && i < printableColours; i++) {
		await printColour(terminal, i);
	}

	terminal.write('  ');
}

/**
 * Print blocks of colours
 */
async function printBlocks(terminal: Terminal, start: number, end: number, cols: number, rows: number, perLine: number) {
	const blockLength = cols * rows;

	// print sets of blocks
	for (let i = start; i <= end; i += (perLine - 1) * blockLength) {
		terminal.writeln(''); // Space before each set of blocks

		// for each block row
		for (let row = 0; row < rows; row ++) {
			// Print block columns for all blocks on the line
			for (let block = 0; block < perLine; block ++) {
				await printRun(terminal, i + (block * blockLength), cols);
			}

			i += cols;

			terminal.writeln('');
		}
	}
}

/**
 * @see https://gist.githubusercontent.com/HaleTom/89ffe32783f89f403bba96bd7bcd1263
 */
export default async function (terminal: Terminal) {

	await printRun(terminal, 0, 16);
	terminal.writeln('');
	await printBlocks(terminal, 16, 231, 6, 6, 3);
	await printBlocks(terminal, 232, 255, 12, 2, 1);
}