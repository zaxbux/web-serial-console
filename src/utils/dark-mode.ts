if (window.localStorage.getItem('theme') === 'dark' || (!('theme' in window.localStorage) && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
	document.documentElement.classList.add('dark');
} else {
	document.documentElement.classList.remove('dark');
}

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
	document.documentElement.classList.toggle('dark', e.matches);
});