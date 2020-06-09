import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import Layout from "./views/Layout.vue";
import Helper from "./views/admin/Helper.vue";
import Curl from "./views/Curl.vue";
import PeriodicalCurl from "./views/PeriodicalCurl.vue";
import Ping from "./views/Ping.vue";
import PingRealtime from "./views/PingRealtime.vue";
import TestAllCircuits from "./views/TestAllCircuits.vue";
import Traceroute from "./views/Traceroute.vue";
import Mtr from "./views/Mtr.vue";
import Dig from "./views/Dig.vue";
import Dummy from "./views/Dummy.vue";
import BGP from "./views/BGP.vue";
import Edge from "./views/Edge.vue";
import Customer from "./views/Customer.vue";
import DnsRecord from "./views/DnsRecord.vue";
import JkbPacketLoss from "./views/JkbPacketLoss.vue";
import JkbLatency from "./views/JkbLatency.vue";
import CrtKey from "./views/CrtKey.vue";
import DomainManage from "./views/DomainManage.vue";
import Ip2Location from "./views/Ip2Location.vue";
import TableExample from "./views/TableExample.vue";
import H7IP from "./views/H7IP.vue";
Vue.use(Router);

export default new Router({
    mode: "history",
    base: process.env.BASE_URL,
    routes: [
        {
            path: "/",
            component: Layout,
            children: [
                // {
                //     path: "",
                //     redirect: "curl"
                // },
                {
                    path: "home",
                    name: "home",
                    component: Home,
                    meta: {
                    }
                },
                {
                    path: "about",
                    name: "about",
                    // route level code-splitting
                    // this generates a separate chunk (about.[hash].js) for this route
                    // which is lazy-loaded when the route is visited.
                    component: () =>
                        import(
                            /* webpackChunkName: "about" */ "./views/About.vue"
                        )
                },
                {
                    path: "helper/:helper_id",
                    component: Helper,
                    meta: {
                        title: 'Helper'
                    }
                },
                {
                    name: "Origin Server Testing",
                    path: "curl",
                    component: Curl,
                    meta: {
                        title: 'Curl'
                    }
                },
                {
                    name: "Origin Server Periodical Testing",
                    path: "periodical-curl",
                    component: PeriodicalCurl,
                    meta: {
                        title: 'Periodical Curl'
                    }
                },
                {
                    name: "Ping",
                    path: "ping",
                    component: Ping,
                    meta: {
                        title: 'Ping'
                    }
                },
                {
                    name: "Ping Realtime",
                    path: "ping-realtime",
                    component: PingRealtime,
                    meta: {
                        title: 'Ping Realtime'
                    }
                },
                {
                    name: "Test All Circuits",
                    path: "test-all-circuits",
                    component: TestAllCircuits,
                    meta: {
                        title: 'Test All Circuits'
                    }
                },
                {
                    name: "SSL File",
                    path: "crt-key",
                    component: CrtKey,
                    meta: {
                        title: 'Domain Manage'
                    }
                },
                {
                    name: "Traceroute",
                    path: "traceroute",
                    component: Traceroute,
                    meta: {
                        title: 'Traceroute'
                    }
                },
                {
                    name: "MTR",
                    path: "mtr",
                    component: Mtr,
                    meta: {
                        title: 'MTR'
                    }
                },
                {
                    name: "Dig",
                    path: "dig",
                    component: Dig,
                    meta: {
                        title: 'Dig'
                    }
                },
                {
                    name: "DNS Records",
                    path: "dns-records",
                    component: DnsRecord,
                    meta: {
                        title: 'Package IP Mapping'
                    }
                },
                {
                    name: "Bgp",
                    path: "bgp",
                    component: BGP,
                    meta: {
                        title: 'BGP'
                    }
                },
                {
                    name: "Dummy Ip",
                    path: "dummy-ip",
                    component: Dummy,
                    meta: {
                        title: 'Dummy'
                    }
                },
                {
                    name: "Edge",
                    path: "edge",
                    component: Edge,
                    meta: {
                        title: 'Edge'
                    }
                },
                {
                    name: "Customer",
                    path: "customer",
                    component: Customer,
                    meta: {
                        title: 'Customer'
                    }
                },
                {
                    name: "JKB-PacketLoss",
                    path: "jkb-packetloss",
                    component: JkbPacketLoss,
                    meta: {
                        title: 'JKB Packet Loss'
                    }
                },
                {
                    name: "JKB-Latency",
                    path: "jkb-Latency",
                    component: JkbLatency,
                    meta: {
                        title: 'JKB Latency'
                    }
                },
                {
                    name: "DomainManage",
                    path: "domain-manage",
                    component: DomainManage,
                    meta: {
                        title: 'FQDN Management'
                    }
                },
                {
                    name: "Ip2Location",
                    path: "ip2location",
                    component: Ip2Location,
                    meta: {
                        title: 'IP2Location'
                    }
                },
                {
                    name: "TableExample",
                    path: "table-example",
                    component: TableExample,
                    meta: {
                    }
                },
                {
                    name: "H7IPPrefix",
                    path: "h7-ip",
                    component: H7IP,
                    meta: {
                        title: 'H7 IP Prefix'
                    }
                },
            ]
        },
        {
            name: "Origin Server Periodical Testing",
            path: "/new-periodical-curl/:path?",
            component: PeriodicalCurl,
            meta: {
                title: 'Periodical Curl'
            }
        }
    ]
});
