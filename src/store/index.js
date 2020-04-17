import Vue from "vue";
import Vuex from "vuex";
import global from "./modules/global";
import curl from './modules/curl'
import helper from './modules/helper'
import ping from './modules/ping'
import traceroute from './modules/traceroute'
import bgp from './modules/bgp'
import dummy from './modules/dummy'
import edge from './modules/edge'
import customer from './modules/customer'
import dnsRecord from './modules/dnsRecord'
import jkb from './modules/jkb'
import traffic from './modules/traffic'

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        global,
        curl,
        helper,
        ping,
        traceroute,
        bgp,
        dummy,
        edge,
        customer,
        dnsRecord,
        jkb,
        traffic
    }
});
