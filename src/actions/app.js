/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

export const UPDATE_PAGE = 'UPDATE_PAGE';
export const MODUWARE_API_READY = 'MODUWARE_API_READY';
export const LOAD_LANGUAGE_TRANSLATION = 'LOAD_LANGUAGE_TRANSLATION';
export const GET_PLATFORM = 'GET_PLATFORM';

// This is a fix to iOS not auto connecting and not finding any devices
export const initializeModuwareApiAsync = () => async dispatch => {
	let promise = new Promise((resolve, reject) => {
		if (typeof Moduware === 'undefined') {
			document.addEventListener('WebViewApiReady', resolve);
		} else {
			resolve();
		}
	});

	await promise;
	dispatch(moduwareApiReady());
}

export const moduwareApiReady = () => async dispatch => {

	dispatch({ type: MODUWARE_API_READY });
	dispatch(loadLanguageTranslation());

	Moduware.API.addEventListener('HardwareBackButtonPressed', () => {
		dispatch(hardwareBackButtonPressed());
	});

	// Moduware.v1.Bluetooth.addEventListener('ConnectionLost', () => {
	// 	dispatch(connectionLost());
	// });
}

export const navigate = (path) => (dispatch) => {
	const page = path === '/' ? 'home-page' : path.slice(1);
	dispatch(loadPage(page));
};

export const loadLanguageTranslation = () => async dispatch => {
	let language = Moduware.Arguments.language || 'en';
	console.log(Moduware.Arguments);
	dispatch({ type: LOAD_LANGUAGE_TRANSLATION, language });
}

const loadPage = (page) => (dispatch) => {
	switch (page) {
		case 'home-page':
			import('../components/home-page.js').then((module) => {
				// Put code in here that you want to run every time when
				// navigating to view1 after my-view1.js is loaded.
			});
			break;
		case 'settings-page':
			import('../components/settings-page.js');
			break;
		case 'page-two':
			import('../components/page-two.js');
			break;
		default:
			page = 'error-page';
			import('../components/error-page.js');
	}

	dispatch(updatePage(page));
};

const updatePage = (page) => {
	return {
		type: UPDATE_PAGE,
		page
	};
};

export const headerBackButtonClicked = () => (dispatch) => {
	if (typeof Moduware !== 'undefined') Moduware.API.Exit();
};

export const hardwareBackButtonPressed = () => (dispatch) => {
	if (typeof Moduware !== 'undefined') Moduware.API.Exit();
}

/**
 * function that gets the platform/OS of the device using userAgent
 */
export const getPlatform = () => (dispatch) => {
	let userAgent = navigator.userAgent || navigator.vendor || window.opera;
	let platform = 'unknown';

	// Windows Phone must come first because its UA also contains "Android"
	if (/windows phone/i.test(userAgent)) {
		platform = 'windows-phone';
	}

	if (/android/i.test(userAgent)) {
		platform = 'android';
	}

	// iOS detection from: http://stackoverflow.com/a/9039885/177710
	if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
		platform = 'ios';
	}
	dispatch({ type: GET_PLATFORM, platform });
};

