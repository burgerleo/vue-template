import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import Layout from "./views/Layout.vue";
import Helper from "./views/admin/Helper.vue";
import TableExample from "./views/TableExample.vue";
import NxnExample from "./views/NxnExample.vue";
import TextBoxExample from "./views/TextBoxExample.vue";



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
                    name: "TableExample",
                    path: "table-example",
                    component: TableExample,
                    meta: {
                        title: 'Table Example'
                        
                    }
                },
                {
                    name: "NxnExample",
                    path: "nxn-example",
                    component: NxnExample,
                    meta: {
                        title: 'NXN Example'
                    }
                },
                {
                    name: "TextBoxExample",
                    path: "textbox-example",
                    component: TextBoxExample,
                    meta: {
                        title: 'TextBox Examplee'
                    }
                },


                
                
            ]
        }
        // ,
        // {
        //     name: "Origin Server Periodical Testing",
        //     path: "/new-periodical-curl/:path?",
        //     // component: PeriodicalCurl,
        //     meta: {
        //         title: 'Periodical Curl'
        //     }
        // }
    ]
});
