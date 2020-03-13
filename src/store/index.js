import Vue from "vue";
import Vuex from "vuex";
import global from "./modules/global";
import curl from './modules/curl'
import helper from './modules/helper'
import test from './modules/test'
Vue.use(Vuex);


export default new Vuex.Store({
    modules: {
        global,
        curl,
        helper,
        test
    }
});
