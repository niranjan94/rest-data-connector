import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const state = {
    inTableau: true
};

const mutations = {
    SET_IN_TABLEAU(state) {
        state.inTableau = true;
    },
    SET_NOT_IN_TABLEAU(state) {
        state.inTableau = false;
    }
};

const actions = {

};

const store = new Vuex.Store({
    state,
    mutations,
    actions
});

export default store;
