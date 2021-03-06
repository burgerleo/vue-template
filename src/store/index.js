import Vue from "vue";
import Vuex from "vuex";
import global from "./modules/global";
import curl from './modules/curl'
import helper from './modules/helper'
import ping from './modules/ping'
import traceroute from './modules/traceroute'
import mtr from './modules/mtr'
import dig from './modules/dig'
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
import isp from './modules/isp'
import ip2LocationRawData from './modules/ip2LocationRawData'
import h7Ip from './modules/h7Ip'
import changeLog from './modules/changeLog'
import cpip from './modules/cpip'

Vue.use(Vuex);

export default new Vuex.Store({
        modules: {
                global,
                curl,
                helper,
                ping,
                traceroute,
                mtr,
                dig,
                bgp,
                dummy,
                edge,
                customer,
                dnsRecord,
                jkb,
                cert,
                traffic,
                periodicalCurl,
                domain,
                isp,
                ip2LocationRawData,
                h7Ip,
                changeLog,
                cpip
        }
});
