const NOTE_ROOT = 'note';
const NOTE_HEADINGS_LEVEL = 'H2';
const NOTE_NAVIGATION_LIST_ROOT_ID = 'toc';
const NOTE_NAVIGATION_LIST_ITEM_CLASS = 'toc-item';
const NOTE_NAVIGATION_LIST_LINK_CLASS = 'toc-link';

const noteNavListRoot = document.getElementById(NOTE_NAVIGATION_LIST_ROOT_ID);
const noteWalker = document.createTreeWalker(document.getElementById(NOTE_ROOT), NodeFilter.SHOW_ELEMENT);

fillNoteNavigation(noteNavListRoot, noteWalker);

function fillNoteNavigation(noteNavigationRoot, noteWalker) {
	if(!noteNavigationRoot || !noteWalker) return;

	while(noteWalker.nextNode()) {
		if(noteWalker.currentNode.tagName === 'PRE') {
			noteWalker.currentNode.parentNode.style.position = 'relative';

			const buttonCopy = document.createElement('BUTTON');
			buttonCopy.textContent = 'Copy';
			buttonCopy.classList.add('button-secondary');
			noteWalker.currentNode.parentNode.appendChild(buttonCopy);

			buttonCopy.addEventListener('click', event => {
				const code = event.currentTarget.parentNode.querySelector('pre').textContent;
				navigator.clipboard.writeText(code);
			});
		}

		if(noteWalker.currentNode.tagName != NOTE_HEADINGS_LEVEL) continue;

		const navigationListItem = document.createElement('LI');
		navigationListItem.classList.add(NOTE_NAVIGATION_LIST_ITEM_CLASS);

		const navigationAnchor = document.createElement('A');
		navigationAnchor.classList.add(NOTE_NAVIGATION_LIST_LINK_CLASS);
		navigationAnchor.href = `#${noteWalker.currentNode.id}`;
		navigationAnchor.textContent = noteWalker.currentNode.textContent;

		noteNavigationRoot.append(navigationListItem);
		navigationListItem.append(navigationAnchor);
		console.log(noteWalker.currentNode);
	}
}
