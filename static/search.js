'use strict';

const INDEX_PATH = '/index.json';

const CLASS_BUTTON_OPEN_SEARCH = 'js-button-open-search';
const CLASS_DIV_SEARCH_BOX = 'js-search-box';
const CLASS_DIV_SEARCH_RESULTS = 'js-results-list';
const ID_FORM_SEARCH 	 = 'search-form';
const CLASS_INPUT_SEARCH = 'js-search-field';

const SEARCH_KEYS = ['title', 'details'];

let search = null;
let domSearchField = null;
let domSearchBox = null;
let domResultsList = null;

(async function() {
	search = await createSearch();
	domSearchField = initializeDomSearchBar();
	domSearchBox = initializeDomSearchBox();
	domResultsList = initializeDomResultsList();
})();

document.querySelector(`.${CLASS_BUTTON_OPEN_SEARCH}`).addEventListener('click', event => {
	if(!domSearchBox) return;

	domSearchBox.classList.remove('js-search-box--hidden');
	domSearchField.focus();
});

document.querySelector(`.${CLASS_DIV_SEARCH_BOX}`).addEventListener('click', event => {
	const notClickedInShadow = event.target !== event.currentTarget;
	if(notClickedInShadow) return;

	domSearchBox.classList.add('js-search-box--hidden');
	domSearchField.value = '';
	displayResults([]);
});

document.addEventListener('keyup', event => {
	if(event.key === 'Escape' && !domSearchBox.classList.contains('js-search-box--hidden')) {
		domSearchBox.classList.add('js-search-box--hidden')
	}
});

document.querySelector(`.${CLASS_INPUT_SEARCH}`).addEventListener('keyup', event => {
	const fieldSearch = event.target;
	const resultsList = query(fieldSearch.value);
	displayResults(resultsList);
});

document.getElementById(ID_FORM_SEARCH).addEventListener('submit', event => {
	event.preventDefault();
});

async function createSearch() {
	const fuseOptions = {
		keys: SEARCH_KEYS, 
		includeMatches: true 
	};

	const indexData = await (await fetch(INDEX_PATH)).json();
	return new Fuse(indexData, fuseOptions);
}

function query(input) {
	if(!search) throw Error('Search object not initialized');

	return search.search(input);
}

function initializeDomSearchBar() {
	return document.querySelector(".js-search-field");
}

function initializeDomResultsList() {
	return document.querySelector(".js-results-list");
}

function initializeDomSearchBox() {
	return document.querySelector(`.${CLASS_DIV_SEARCH_BOX}`);
}

function displayResults(resultsList) {
	if(!domResultsList) throw Error('Results list not initialized');

	while(domResultsList.firstChild) {
		domResultsList.firstChild.remove();
	}

	const noResults = resultsList.length === 0;
	if(noResults) {
		domResultsList.innerHTML = `
			<p class="results-list__no-results">No results</p>
		`;
		return;
	}

	for(const result of resultsList) {
		const domResultItemOuter = document.createElement('LI');
		const domResultItem = document.createElement('A');
		domResultItem.classList.add('results-item');
		domResultItem.href = result.item.url;

		const domResultTitle = document.createElement('P');
		domResultTitle.classList.add('results-item__title');
		domResultTitle.innerHTML = result.item.title;

		domResultItem.appendChild(domResultTitle);
		for(const match of result.matches) {
			if(match.key === 'title') {
				domResultTitle.innerHTML = addHighlightSpans(domResultTitle.innerHTML, match.indices);
			} else {
				const domResultDetails = document.createElement('P');
				domResultDetails.innerHTML = addHighlightSpans(result.item.details, match.indices);

				domResultItem.appendChild(domResultDetails);
			}
		}

		domResultItemOuter.appendChild(domResultItem);
		domResultsList.appendChild(domResultItemOuter);
	}
}

function addHighlightSpans(string, indices) {
	if(!indices || indices.length === 0) return string;

	let highlightedString = [];

	let indexCouple = 0;
	for(let i = 0; i < string.length; i++) {
		if(i === indices[indexCouple][0]) {
			highlightedString.push('<span class="highlight">');
		}

		highlightedString.push(string.charAt(i));

		if(i === indices[indexCouple][1]) {
			highlightedString.push('</span>');

			if(indexCouple < indices.length - 1) indexCouple++;
		}
	}

	return highlightedString.join('');
}
