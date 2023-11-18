const NOTE_ROOT = 'note';
const NOTE_HEADINGS_LEVEL = 'H2';
const NOTE_NAVIGATION_LIST_ROOT_ID = 'note-nav-list';

const noteNavListRoot = document.getElementById('note-nav-list');
const noteWalker = document.createTreeWalker(document.getElementById(NOTE_ROOT), NodeFilter.SHOW_ELEMENT);

fillNoteNavigation(noteNavListRoot, noteWalker);

function fillNoteNavigation(noteNavigationRoot, noteWalker) {
	if(!noteNavigationRoot || !noteWalker) return;

	while(noteWalker.nextNode()) {
		if(noteWalker.currentNode.tagName != NOTE_HEADINGS_LEVEL) continue;

		const navigationListItem = document.createElement('LI');
		const navigationAnchor = document.createElement('A');
		navigationAnchor.href = `#${noteWalker.currentNode.id}`;
		navigationAnchor.textContent = noteWalker.currentNode.textContent;

		noteNavigationRoot.append(navigationListItem);
		navigationListItem.append(navigationAnchor);
		console.log(noteWalker.currentNode);
	}
}
