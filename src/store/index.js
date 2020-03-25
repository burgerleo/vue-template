import Vue from "vue";
import Vuex from "vuex";
import global from "./modules/global";
import curl from './modules/curl'
import helper from './modules/helper'
import ping from './modules/ping'
import bgp from './modules/bgp'
import dummy from './modules/dummy'



Vue.use(Vuex);


export default new Vuex.Store({
    modules: {
        global,
        curl,
        helper,
        ping,
        bgp,
        dummy
    }
});
