const mimeTypeExt: Record<string, string> = {
  'text/plain': 'txt',
  'text/html': 'html',
}
export function fauxLink(contents: string, type = 'text/plain') {
	const linkContent = URL.createObjectURL(new Blob([
		new TextEncoder().encode(contents).buffer as any
	], { type }));
	const fauxLink = document.createElement('a');
  const ext = mimeTypeExt[type] ?? 'bin'
	fauxLink.download = `terminal_content_${new Date().getTime()}.${ext}`;
	fauxLink.href = linkContent;

	return fauxLink;
}
