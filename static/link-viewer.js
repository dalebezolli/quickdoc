'use strict';
const PAGEVIEW_SHOW_TIME_MS = 250;
const PAGEVIEW_HIDE_TIME_MS = 150;
const LINKVIEWER_ID = 'linkviewer';
const LINKVIEWER_HIDDEN_CSS = 'js-linkviewer--hidden';

const linkViewer = document.getElementById(LINKVIEWER_ID);
let displayReference = null;
let hideReference = null;

if(isALinkViewer()) {
	document.body.style.backgroundColor = '#ff0bbb';
} else {
	setupLinkViewerHoverPopupEventHandlers();
	document.body.style.backgroundColor = '#000000';
}
document.body.style.color = '#ffffff';


function isALinkViewer() {
	return window.self !== window.top;
}

function setupLinkViewerHoverPopupEventHandlers() {
	for(const link of document.querySelectorAll("#note a")) {
		if(!link.href.startsWith(window.location.origin)) continue;
		link.addEventListener('mouseenter', event => {
			const debugString = `LINK: Attempting to SHOW with ${event.target.href} (displayReference: ${displayReference}, hideReference: ${hideReference})`;
			console.debug(debugString);

			const boundingBox = event.target.getBoundingClientRect();
			onPrepareToToggleLinkViewerFrame(true, event.target.href, boundingBox.bottom, boundingBox.right);
		});

		link.addEventListener('mouseleave', event => {
			const debugString = `LINK: Attempting to HIDE with ${event.target.href} (displayReference: ${displayReference}, hideReference: ${hideReference})`;
			console.debug(debugString);

			const boundingBox = event.target.getBoundingClientRect();
			onPrepareToToggleLinkViewerFrame(false, event.target.href, boundingBox.bottom, boundingBox.rigth);
		});

	}

	linkViewer.addEventListener('mouseenter', event => {
		const debugString = `LINKVIEWER: Attempting to SHOW with ${event.target.src} (displayReference: ${displayReference}, hideReference: ${hideReference})`;
		console.debug(debugString);

		const boundingBox = event.target.getBoundingClientRect();
		onPrepareToToggleLinkViewerFrame(true, event.target.src, boundingBox.bottom, boundingBox.right);
	});

	linkViewer.addEventListener('mouseleave', event => {
		const debugString = `LINKVIEWER: Attempting to HIDE with ${event.target.src} (displayReference: ${displayReference}, hideReference: ${hideReference})`;
		console.debug(debugString);

		const boundingBox = event.target.getBoundingClientRect();
		onPrepareToToggleLinkViewerFrame(false, event.target.src, boundingBox.bottom, boundingBox.right);
	});
}

/**
 * Handles timers for display & correctly positioning the link viewer
 */
function onPrepareToToggleLinkViewerFrame(shouldShow, link, mouseX, mouseY) {
	shouldShow &&  console.debug(`Setting the display position: (${mouseX},${mouseY})`);
	const oppositeReference = shouldShow ? hideReference : displayReference;
	clearTimeout(oppositeReference);

	const linkViewer = document.getElementById(LINKVIEWER_ID);
	const isCurrentlyShown = !linkViewer.classList.contains(LINKVIEWER_HIDDEN_CSS);
	const noNeedToToggle = shouldShow ? isCurrentlyShown : !isCurrentlyShown;

	if(noNeedToToggle) return;

	const [displayX, displayY] = calculateTopLeftDisplayPosition(mouseX, mouseY);
	const toggleReference = setTimeout(_ => {
			toggleLinkViewerFrame(shouldShow, link, displayX, displayY);
		},
		shouldShow ? PAGEVIEW_SHOW_TIME_MS : PAGEVIEW_HIDE_TIME_MS
	);

	if(shouldShow) {
		displayReference = toggleReference;
	} else {
		hideReference = toggleReference;
	}
}

function calculateTopLeftDisplayPosition(mouseX, mouseY) {
	return [mouseX, mouseY];
}


/**
 * Sets the data and toggles the link viewer
 */
function toggleLinkViewerFrame(isEnabled, link, mouseX, mouseY) {
	const linkViewer = document.getElementById(LINKVIEWER_ID);
	linkViewer.style = `--pos-x: ${mouseX}px; --pos-y: ${mouseY}px`;

	console.debug(`${isEnabled ? 'SHOW' : 'HIDE'}: ${link}`);
	if(isEnabled) {
		constructLinkViewerData(link).then(divLinkViewerData => {
			while(linkViewer.firstChild) {
				linkViewer.firstChild.remove();
			}
			linkViewer.appendChild(divLinkViewerData);

			linkViewer.classList.remove(LINKVIEWER_HIDDEN_CSS);
		});

	} else {
		linkViewer.classList.add(LINKVIEWER_HIDDEN_CSS);
		return;
	}
}

async function constructLinkViewerData(link) {
	const url = new URL(link);

	const htmlDataRequest = await fetch(url);
	const htmlData = await htmlDataRequest.text();
	const mimeType = htmlDataRequest.headers.get('content-type')
		.slice(0, htmlDataRequest.headers.get('content-type').search(';'));

	const htmlParser = new DOMParser();
	const noteDocument = htmlParser.parseFromString(htmlData, mimeType);

	const divLinkViewerData = document.createElement('DIV');
	divLinkViewerData.classList.add('linkviewer__data');

	if(!url.hash) {
		divLinkViewerData.innerHTML = noteDocument.getElementById('note').innerHTML;
	} else {
		const calculatedHeadingIDFromHash = decodeURIComponent(url.hash).toLowerCase().replaceAll(' ', '-').slice(1);
		const noteRoot = noteDocument.querySelector('#note');

		let childIndex = 0;
		let foundStartNode = false;
		while(childIndex < noteRoot.children.length && !foundStartNode) {
			if(noteRoot.children[childIndex].id === calculatedHeadingIDFromHash) {
				foundStartNode = true;
			} else {
				childIndex++;
			}
		}

		const startNodeTagName = noteRoot.children[childIndex].tagName;
		divLinkViewerData.append(noteRoot.children[childIndex++].cloneNode(true));
		while(
			childIndex < noteRoot.children.length && 
			noteRoot.children[childIndex] && 
			noteRoot.children[childIndex].tagName !== startNodeTagName
		) {

			divLinkViewerData.append(noteRoot.children[childIndex++].cloneNode(true));
		}

	}

	return divLinkViewerData;
}
