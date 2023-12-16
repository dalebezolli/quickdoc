const NOTE_ROOT = 'note';
const NOTE_NAVIGATION_LIST_ROOT_ID = 'toc';
const NOTE_NAVIGATION_LIST_ITEM_CLASS = 'toc-item';
const NOTE_NAVIGATION_LIST_LINK_CLASS = 'toc-link';

const NOTE_HEADING = 'H2';

noteSetup();

function noteSetup() {
	const noteNavListRoot = document.getElementById(NOTE_NAVIGATION_LIST_ROOT_ID);

	const noteWalker = document.createTreeWalker(document.getElementById(NOTE_ROOT), NodeFilter.SHOW_ELEMENT);
	while(noteWalker.nextNode()) {
		switch(noteWalker.currentNode.tagName) {
			case NOTE_HEADING:
				setupHeadingNavigation(noteNavListRoot, noteWalker.currentNode);
				break;
			case 'PRE':
				setupCodeBlocks(node);
				break;
		}
	}
}

function setupCodeBlocks(node) {
	node.parentNode.style.position = 'relative';

	const buttonCopy = document.createElement('BUTTON');
	buttonCopy.textContent = 'Copy';
	buttonCopy.classList.add('button-secondary');
	node.parentNode.appendChild(buttonCopy);

	buttonCopy.addEventListener('click', event => {
		const code = event.currentTarget.parentNode.querySelector('pre').textContent;
		navigator.clipboard.writeText(code);
	});
}

function setupHeadingNavigation(noteNavigationRoot, node) {
		const navigationListItem = document.createElement('LI');
		navigationListItem.classList.add(NOTE_NAVIGATION_LIST_ITEM_CLASS);

		const navigationAnchor = document.createElement('BUTTON');
		navigationAnchor.classList.add(NOTE_NAVIGATION_LIST_LINK_CLASS);
		navigationAnchor.addEventListener('click', event => {
			const domHeading = document.getElementById(node.id);
			const absoluteElementPositionWithoutPadding = domHeading.getBoundingClientRect().top - domHeading.getBoundingClientRect().height - 16;
			window.scrollTo({top: absoluteElementPositionWithoutPadding + window.pageYOffset});
		});
		navigationAnchor.textContent = node.textContent;

		noteNavigationRoot.append(navigationListItem);
		navigationListItem.append(navigationAnchor);
}
