import Vue from 'vue';
import Router from 'vue-router';
import ApiExplorer from '@/components/ApiExplorer';
import Dashboard from '@/components/Dashboard';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Dashboard',
      component: Dashboard
    },
    {
      path: '/api-explorer',
      name: 'ApiExplorer',
      component: ApiExplorer
    }
  ]
});
