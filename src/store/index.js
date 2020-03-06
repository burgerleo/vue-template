import Vue from "vue";
import Vuex from "vuex";
import global from "./modules/global";
import curl from './modules/curl'

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        global,
        curl
    }
});
