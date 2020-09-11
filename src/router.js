import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import Layout from "./views/Layout.vue";
import Helper from "./views/admin/Helper.vue";
import TableExample from "./views/TableExample.vue";
import Table2Example from "./views/Table2Example.vue";
import NxnExample from "./views/NxnExample.vue";
import TextBoxExample from "./views/TextBoxExample.vue";
import TwoList from "./views/TwoList.vue";
import TableColumn from "./views/TableColumn.vue";
import Component1 from "./views/Component1.vue";
import AlexDay12 from "./views/AlexDay12.vue";

Vue.use(Router);

const router = new Router({
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
                    name: "Table2Example",
                    path: "table2-example",
                    component: Table2Example,
                    meta: {
                        title: 'Table2 Example'
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
                {
                    name: "TwoList",
                    path: "two-list",
                    component: TwoList,
                    meta: {
                        title: 'Two Lists'
                    }
                },
                {
                    name: "TableColumn",
                    path: "table-column",
                    component: TableColumn,
                    meta: {
                        title: 'Table Column'
                    }
                },
                {
                    name: "Component1",
                    path: "component1",
                    component: Component1,
                    meta: {
                        title: 'Component1'
                    }
                },
                {
                    name: "AlexDay12",
                    path: "alexday12",
                    component: AlexDay12,
                    meta: {
                        title: 'AlexDay12'
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

router.beforeEach((to, from, next) => {
    if (
        to.fullPath == "/aaa"
    ) {
        return next({
            name: 'home',
        });
    }

    // console.log(router)

    // return next({
    //     name: 'home',
    // });

    return next();
});

export default router;