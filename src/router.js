import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import Layout from "./views/Layout.vue";
import Helper from "./views/admin/Helper.vue";
import Curl from "./views/Curl.vue";
import Ping from"./views/Ping.vue";
import PingRealtime from"./views/PingRealtime.vue";
import Dummy from"./views/Dummy.vue";
import BGP from"./views/BGP.vue";
import Edge from"./views/Edge.vue";
import Customer from"./views/Customer.vue";
import JkbPacketLoss from"./views/JkbPacketLoss.vue";



Vue.use(Router);

export default new Router({
    mode: "history",
    base: process.env.BASE_URL,
    routes: [
        {
            path: "/",
            component: Layout,
            children: [
                {
                    path: "",
                    redirect: "curl"
                },
                {
                    path: "home",
                    name: "home",
                    component: Home
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
                    component: Helper
                },
                {
                    name:"Origin Server Testing",
                    path: "curl",
                    component: Curl
                },
                {
                    name:"Ping",
                    path: "ping",
                    component: Ping
                },
                {
                    name:"Ping Realtime",
                    path: "ping-realtime",
                    component: PingRealtime
                },
                {
                    name:"Bgp",
                    path: "bgp",
                    component: BGP
                },
                {
                    name:"Dummy Ip",
                    path: "dummy-ip",
                    component: Dummy
                },
                {
                    name:"Edge",
                    path: "edge",
                    component: Edge
                },
                {
                    name:"Customer",
                    path: "customer",
                    component: Customer
                },
                {
                    name:"JKB-PacketLoss",
                    path: "jkb-packetloss",
                    component: JkbPacketLoss
                },
            ]
        }
    ]
});
