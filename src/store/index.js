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
import cert from './modules/cert'
import traffic from './modules/traffic'
import periodicalCurl from './modules/periodicalCurl'
import domain from './modules/domain'

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
        cert,
        traffic,
        periodicalCurl,
        domain
    }
});
