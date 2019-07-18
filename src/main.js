import './styles/styles.scss'
import './styles/animations.scss'
import './styles/popins.scss'
import './styles/confirm.scss'
import './styles/blockchain-lists.scss'

// MUST BE LOADED FIRST
import ElectronHelpers, {ipcAsync, ipcFaF} from './util/ElectronHelpers';

import ScatterCore from 'scatter-core';

import VueInitializer from './vue/VueInitializer';
import {Routing} from './vue/Routing';
import {RouteNames} from './vue/Routing'
import { QrcodeReader } from 'vue-qrcode-reader'
ElectronHelpers.bindContextMenu();

import MenuBar from './components/MenuBar.vue'
import ViewBase from './components/ViewBase.vue'
import Button from './components/reusable/Button.vue'
import Input from './components/reusable/Input.vue'
import Select from './components/reusable/Select.vue'
import SearchBar from './components/reusable/SearchBar.vue'
import Slider from './components/reusable/Slider.vue'
import PopInHead from './components/reusable/PopInHead.vue'
import Switcher from './components/reusable/Switcher.vue'
import SearchAndFilter from './components/reusable/SearchAndFilter.vue'
import AnimatedNumber from './components/reusable/AnimatedNumber.vue'
import ActionBar from './components/reusable/ActionBar.vue'
import PopOutHead from './components/popouts/PopOutHead.vue'
import WindowService from './services/WindowService';
import SocketService from "./services/SocketService";
import StorageService from "./services/StorageService";
import {store} from "./store/store";

// f12 to open console from anywhere.
document.addEventListener("keydown", e => {
	if (e.which === 123) WindowService.openTools();
});

document.onmousedown= e => {
	if( e.which === 2 ) e.preventDefault();
	// TODO: Add CMD click logic prevention
}

class Main {

	constructor(){

		const hash = location.hash.replace("#/", '');

		const shared = [
			{tag:'Button', vue:Button},
			{tag:'Input', vue:Input},
			{tag:'Select', vue:Select},
			{tag:'Slider', vue:Slider},
			{tag:'Switcher', vue:Switcher},
			{tag:'SearchBar', vue:SearchBar},
			{tag:'SearchAndFilter', vue:SearchAndFilter},
			{tag:'ActionBar', vue:ActionBar},
			{tag:'view-base', vue:ViewBase},
			{tag:'PopInHead', vue:PopInHead},
			{tag:'AnimatedNumber', vue:AnimatedNumber},
		];

		let fragments;
		if(hash === 'popout') fragments = [
			{tag:'PopOutHead', vue:PopOutHead},
		]
		else {
			fragments = [
				// {tag:'slider', vue:SliderComponent},
				{tag:'qr-reader', vue:QrcodeReader},
			]
		}

		const components = shared.concat(fragments);
		const middleware = (to, next, store) => {
			if(hash === 'popout') return next();
			if(Routing.isRestricted(to.name)) store.getters.unlocked ? next() : next({name:RouteNames.LOGIN});
			else next();
		};

		ScatterCore.initialize(
			store,
			StorageService,
			{
				get:() => ipcAsync('seed'),
				set:(seed) => ipcFaF('seeding', seed),
				clear:() => ipcFaF('key', null),
			},
			{
				getVersion:ElectronHelpers.getVersion,
				pushNotification:ElectronHelpers.pushNotificationMethod(),
			},
			WindowService.openPopOut,
			// TODO:
			ElectronHelpers.getLedgerTransport(),
			SocketService
		)

		new VueInitializer(Routing.routes(), components, middleware, async (router, _store) => {

		});
	}

}

new Main();
