import Vue from 'vue';
import App from './App.vue';

import BootstrapVue from 'bootstrap-vue';
import Notifications from 'vue-notification';
import VueResource from 'vue-resource';
import TreeView from 'vue-json-tree-view';
import UUID from 'vue-uuid';
import Raven from 'raven-js';
import RavenVue from 'raven-js/plugins/vue';

import { initTableau } from './utils/tableau/init';

import router from './router';
import { sync } from 'vuex-router-sync';
import store from './store';

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faSpinner, faGlobe } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

if (process.env.VUE_APP_RAVEN_DSN) {
  Raven
    .config(process.env.VUE_APP_RAVEN_DSN)
    .addPlugin(RavenVue, Vue)
    .install();
}

library.add(faGithub, faSpinner, faGlobe);
Vue.component('font-awesome-icon', FontAwesomeIcon);

sync(store, router);

Vue.use(VueResource);
Vue.use(Notifications);
Vue.use(TreeView);
Vue.use(UUID);
Vue.use(BootstrapVue);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');

initTableau();
