'use strict';
const PAGEVIEW_TOGGLE_TIME_MS = 1000;
const LINKVIEWER_ID = 'linkviewer';
const LINKVIEWER_HIDDEN_CSS = 'js-linkviewer--hidden';

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
	for(const link of document.links) {
		const linkViewer = document.getElementById(LINKVIEWER_ID);

		let displayReference = null;
		let hideReference = null;

		link.addEventListener('mouseenter', event => {
			const debugString = `LINK: Attempting to SHOW with ${link} (displayReference: ${displayReference}, hideReference: ${hideReference})`;
			console.info(debugString);
			onPrepareToToggleLinkViewerFrame(true, event.target.href, event.clientX, event.clientY);
		});
		link.addEventListener('mouseleave', event => {
			const debugString = `LINK: Attempting to HIDE with ${link} (displayReference: ${displayReference}, hideReference: ${hideReference})`;
			console.info(debugString);
			onPrepareToToggleLinkViewerFrame(false, event.target.href, event.clientX, event.clientY);
		});

		linkViewer.addEventListener('mouseenter', event => {
			const debugString = `LINKVIEWER: Attempting to SHOW with ${link} (displayReference: ${displayReference}, hideReference: ${hideReference})`;
			console.info(debugString);
			onPrepareToToggleLinkViewerFrame(true, event.target.src, event.clientX, event.clientY);
		});
		linkViewer.addEventListener('mouseleave', event => {
			const debugString = `LINKVIEWER: Attempting to HIDE with ${link} (displayReference: ${displayReference}, hideReference: ${hideReference})`;
			console.info(debugString);
			onPrepareToToggleLinkViewerFrame(false, event.target.src, event.clientX, event.clientY);
		});

		function onPrepareToToggleLinkViewerFrame(shouldShow, link, mouseX, mouseY) {
			const oppositeReference = shouldShow ? hideReference : displayReference;
			clearTimeout(oppositeReference);

			const linkViewer = document.getElementById(LINKVIEWER_ID);
			const isCurrentlyShown = !linkViewer.classList.contains(LINKVIEWER_HIDDEN_CSS);
			const noNeedToToggle = shouldShow ? isCurrentlyShown : !isCurrentlyShown;

			if(noNeedToToggle) return;

			const toggleReference = setTimeout(_ => {
					toggleLinkViewerFrame(shouldShow, link, mouseX, mouseY);
				},
				PAGEVIEW_TOGGLE_TIME_MS
			);

			if(shouldShow) {
				displayReference = toggleReference;
			} else {
				hideReference = toggleReference;
			}
		}
	}
}

function toggleLinkViewerFrame(isEnabled, link, mouseX, mouseY) {
	const linkViewer = document.getElementById(LINKVIEWER_ID);
	

	console.info(`${isEnabled ? 'SHOW' : 'HIDE'}: ${link}`);
	if(isEnabled) {
		linkViewer.classList.remove(LINKVIEWER_HIDDEN_CSS);
		linkViewer.src = link;
	} else {
		linkViewer.classList.add(LINKVIEWER_HIDDEN_CSS);
		return;
	}
}
