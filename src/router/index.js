import Vue from 'vue';
import Router from 'vue-router';
import ApiExplorer from '../components/ApiExplorer';
import NotFound from '../components/NotFound';
import Dashboard from '../components/Dashboard';
import RestExplorer from '../components/rest/RestExplorer';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path      : '/',
            name      : 'Dashboard',
            component : Dashboard
        },
        {
            path      : '/rest-explorer',
            name      : 'RestExplorer',
            component : RestExplorer
        },
        {
            path      : '/api-explorer/:type',
            name      : 'ApiExplorer',
            component : ApiExplorer
        },
        {
            path      : '*',
            name      : 'NotFound',
            component : NotFound
        }
    ]
});
