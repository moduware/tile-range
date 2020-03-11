/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { html, css } from 'lit-element';
import { PageViewElement } from './page-view-element.js';
import { navigate } from '../actions/app.js';
import { store } from '../store.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { SharedStyles } from './shared-styles.js';
import app from '../reducers/app.js';
import '@moduware/morph-button';
import './icons.js';
import { registerTranslateConfig, use, translate, get } from "@appnest/lit-translate";
import * as translation from '../translations/language.js';
import { startButton, stopButton } from '../actions/app';

class HomePage extends connect(store)(PageViewElement) {

	static get properties() {
		return {
			_page: { type: String },
			_language: { type: String },
			_powerOn: { type: Boolean },
			distance: { type: String }
		};
	}

	static get styles() {
		return [
			SharedStyles,
			css`
				:host {
					/* height: 100vh; */
				}

				/* remove section */
				.wrapper {
					height: 100%;
				
				}

			

        h2 {
					color: red;
				}

				.main-content {
					
				}
				
				morph-button.start,
				morph-button.stop {
					
				}
				morph-button.stop {
					--color: red;
				}
      `
		];
	}

	updated(changedProperties) {
		if (changedProperties.has('_language')) {
			use(this._language);
		}
	}

	async connectedCallback() {
		registerTranslateConfig({
			loader: (lang) => Promise.resolve(translation[lang])
		});

		super.connectedCallback();
	}

	render() {
		return html`
      <div id="wrapper" class="wrapper">
				<h2>${get('home-page.title')}</h2>
				<div class="main-content">
					<h3>Distance: ${this.distance}</h3>
					<button @click="${() => store.dispatch(navigate('/settings-page'))}">${get('settings-page.title')}</button>
					<button @click="${() => store.dispatch(navigate('/saved-measurements-page'))}">${translate('saved-measurements-page.title')}</button>
				</div>
				${this._powerOn ? html`<morph-button class="stop" filled big @click="${this.stopButtonClick}">Stop</morph-button>`
				: html`<morph-button class="start" filled big @click="${this.startButtonClick}">Start</morph-button>`
				}
				
				
			</div>
    `;
	}

	startButtonClick() {
		store.dispatch(startButton());
		if (typeof Moduware !== 'undefined') {
			Moduware.v1.Module.ExecuteCommand(Moduware.Arguments.uuid, 'StartContinuousMeasurement', []);
		}
	}
	stopButtonClick() {
		store.dispatch(stopButton());
		if (typeof Moduware !== 'undefined') {
			Moduware.v1.Module.ExecuteCommand(Moduware.Arguments.uuid, 'TurnOffLaser', []);       
		}
	}

	stateChanged(state) {
		this._page = state.app.page;
		this._language = state.app.language;
		this._powerOn = state.app.powerOn;
		this.distance = state.app.distance;
	}

}

window.customElements.define('home-page', HomePage);
