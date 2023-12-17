'use strict';

const NOTE_ROOT = 'note';
const NOTE_NAVIGATION_LIST_ROOT_ID = 'toc';
const NOTE_NAVIGATION_LIST_ITEM_CLASS = 'toc-item';
const NOTE_NAVIGATION_LIST_LINK_CLASS = 'toc-link';

const NOTE_HEADING = 'H2';
let previousHighlightID = '';

const observer = new IntersectionObserver(highlightNavigation, {
	root: null,
	rootMargin: '-50px 0px -60% 0px',
	threshold: 1.0
});
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
				setupCodeBlocks(noteWalker.currentNode);
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

function setupHeadingNavigation(domNoteNavigationRoot, domNode) {
	const domNavigationListItem = document.createElement('LI');
	domNavigationListItem.id = 'toc-' + domNode.id;
	domNavigationListItem.classList.add(NOTE_NAVIGATION_LIST_ITEM_CLASS);

	const domNavigationAnchor = document.createElement('BUTTON');
	domNavigationAnchor.classList.add(NOTE_NAVIGATION_LIST_LINK_CLASS);
	domNavigationAnchor.addEventListener('click', event => {
		const domHeading = document.getElementById(domNode.id);
		const absoluteElementPositionWithoutPadding = domHeading.getBoundingClientRect().top - domHeading.getBoundingClientRect().height - 16;
		window.scrollTo({top: absoluteElementPositionWithoutPadding + window.pageYOffset});
	});
	domNavigationAnchor.textContent = domNode.textContent;

	domNoteNavigationRoot.append(domNavigationListItem);
	domNavigationListItem.append(domNavigationAnchor);
	
	if(observer !== null) observer.observe(domNode);
}

function highlightNavigation(entries) {
	for(const entry of entries) {
		if(!entry.isIntersecting) continue;
		const domTarget = entry.target;
		const domTocNav = document.getElementById(`toc-${domTarget.id}`);
		const domPrevTocNav = document.getElementById(`toc-${previousHighlightID}`);

		if(domPrevTocNav) domPrevTocNav.classList.remove('js-toc-link--highlight');
		domTocNav.classList.add('js-toc-link--highlight');
		previousHighlightID = domTarget.id;
		return;
	}

}
