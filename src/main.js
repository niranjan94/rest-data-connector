// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import BootstrapVue from 'bootstrap-vue';
import VueResource from 'vue-resource';
import UUID from 'vue-uuid';
import Notifications from 'vue-notification';
import TreeView from 'vue-json-tree-view';
import { initTableau } from './utils/tableau/init';
import { sync } from 'vuex-router-sync';
import store from './store';
import fontawesome from '@fortawesome/fontawesome';
import { faSpinner, faGlobe } from '@fortawesome/fontawesome-free-solid';
import { faGithub } from '@fortawesome/fontawesome-free-brands';

fontawesome.library.add(faGithub, faSpinner, faGlobe);

Vue.config.productionTip = false;

sync(store, router);

Vue.use(Notifications);
Vue.use(UUID);
Vue.use(VueResource);
Vue.use(BootstrapVue);
Vue.use(TreeView);

/* eslint-disable no-new */
new Vue({
  el         : '#app',
  router,
  store,
  template   : '<App/>',
  components : { App }
});

initTableau();
