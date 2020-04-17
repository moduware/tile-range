/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { LitElement, html, css } from 'lit-element';
import { setPassiveTouchGestures } from '@polymer/polymer/lib/utils/settings.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { store } from '../store.js';
import { 
  navigate, 
  headerBackButtonClicked, 
  initializeModuwareApiAsync, 
  loadLanguageTranslation,
  getPlatform
} from '../actions/app.js';
import { settingsIcon } from './icons.js'
import '@polymer/app-layout/app-drawer/app-drawer.js';
import '@polymer/app-layout/app-header/app-header.js';
import '@polymer/app-layout/app-scroll-effects/effects/waterfall.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';
import './icons.js';
import 'webview-tile-header/webview-tile-header'
import '@moduware/morph-pages';
import { registerTranslateConfig, use, translate, get } from "@appnest/lit-translate";
import * as translation from '../translations/language.js';

class MyApp extends connect(store)(LitElement) {

	static get properties() {
		return {
			appTitle: { type: String },
			_page: { type: String },
      _language: { type: String },
      platform: {
        type: String,
        reflect: true
      },
		};
	}

	static get styles() {
		return [
			css`
        :host {
          display: flex; /* display: block; */
          flex-direction: column;

          background-color: #3a3a3a;
          height: 100vh;
          padding-top: 24px;
        }

        moduware-header {
          --style-background-color: rgb(49, 49, 49);
          --text-color: rgb(216, 216, 216);
          --back-button-color: rgb(216, 216, 216);

          position: relative;
          border-bottom-color: var(--style-background-color);
        }

        moduware-header span[slot="right-placeholder"] svg #settingsIcon {
          fill: rgb(216, 216, 216);
        }

        :host([platform="ios"]) morph-pages {
         /* padding-top: 60px;            */
        }

        :host([platform="android"]) morph-pages {
          /* padding-top: 70px;           */
        }

        morph-pages.main {
          display: block;
          height: 100%;
        }

        :host .page {
          display: none;
          position: relative;
        }

        :host .page[active] {
          display: block;
        }

    
      `
		];
	}

	render() {
		return html`
      <!-- Webview Header -->
      <moduware-header	
        @back-button-click="${() => store.dispatch(headerBackButtonClicked())}"
        title="${translate('header.title')}">
        <span slot="right-placeholder" @click="${() => store.dispatch(navigate('/settings-page'))}">${settingsIcon}</span>
			</moduware-header>
      <!-- Main content -->
      <morph-pages role="main" class="main">
        <home-page class="page" ?active="${this._page === 'home-page'}"></home-page>
        <!-- <settings-page class="page" ?active="${this._page === 'settings-page'}"></settings-page>
        <saved-measurements-page class="page" ?active="${this._page === 'saved-measurements-page'}"></saved-measurements-page>
        <error-page class="page" ?active="${this._page === 'error-page'}"></error-page> -->
      </morph-pages>
    `;
	}

	constructor() {
		super();
		// To force all event listeners for gestures to be passive.
		// See https://www.polymer-project.org/3.0/docs/devguide/settings#setting-passive-touch-gestures
		setPassiveTouchGestures(true);
	}

	// Load the initial language and mark that the strings has been loaded.
	async connectedCallback() {

		/** this is to register the language translation loader from lit-translate */
		registerTranslateConfig({
			loader: (lang) => Promise.resolve(translation[lang])
		});

		super.connectedCallback();
	}

	firstUpdated() {
		store.dispatch(loadLanguageTranslation());
		store.dispatch(navigate("/home-page"));
    store.dispatch(initializeModuwareApiAsync());
    store.dispatch(getPlatform());
	}

	updated(changedProperties) {
		if (changedProperties.has('_page')) {
		}

		if (changedProperties.has('_language')) {
			use(this._language);
    }
    
    console.log('platform is:', this.platform);
  }
  
  settingsClickHandler() {
    console.log('settings icon clicked!');
  }

	stateChanged(state) {
		this._page = state.app.page;
		this._language = state.app.language;
		this.platform = state.app.platform;
	}
}

window.customElements.define('my-app', MyApp);
