export function fauxLink(contents: string) {
	const linkContent = URL.createObjectURL(new Blob([
		new TextEncoder().encode(contents).buffer
	], { type: 'text/plain' }));
	const fauxLink = document.createElement('a');
	fauxLink.download = `terminal_content_${new Date().getTime()}.txt`;
	fauxLink.href = linkContent;

	return fauxLink;
}
