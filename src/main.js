import { addCollection } from 'iconify-icon';
import './assets/main.css'

import { createPinia } from 'pinia'
import { vueDefineCustomElement } from './createCustomElement'
import App from './App.ce.vue'

// Ícones embutidos no bundle (gerados por `yarn icons`) — sem isso o iconify-icon
// baixa cada ícone da API deles em runtime e a toolbar fica sem ícones offline
import iconCollections from './icons.json'

iconCollections.forEach(addCollection)

const pinia = createPinia()
const plugins = [pinia]
const AppElement = vueDefineCustomElement(App, { plugins })

customElements.define('image-annotator', AppElement)
