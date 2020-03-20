import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import Layout from "./views/Layout.vue";
import Helper from "./views/admin/Helper.vue";
import Curl from "./views/Curl.vue";
import Ping from"./views/Ping.vue";
import Dummy from"./views/Dummy.vue";
import BGP from"./views/BGP.vue";

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
                    path: "Ping",
                    component: Ping
                },
                {
                    path: "bgp",
                    component: BGP
                },
                {
                    path: "dummy-ip",
                    component: Dummy
                }
            ]
        }
    ]
});
