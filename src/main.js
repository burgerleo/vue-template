import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store/index";
import vuetify from "./plugins/vuetify";
import "roboto-fontface/css/roboto/roboto-fontface.css";
import "@mdi/font/css/materialdesignicons.css";
import VueHighlightJS from "vue-highlightjs";
import 'highlight.js/styles/atom-one-dark.css'
import VueQuillEditor from 'vue-quill-editor'

import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

import lottie from 'vue-lottie'; // lottie
import helper from './utils/helper.js'; // helper

import VueColumnsResizableVuetify from 'vue-columns-resizable-vuetify';
Vue.use(VueColumnsResizableVuetify);
Vue.mixin(helper);

Vue.use(VueHighlightJS);
Vue.config.productionTip = false;
import dataTable from "./components/DataTable.vue";

Vue.component("h7-data-table", dataTable);
Vue.component("lottie", lottie);

Vue.use(VueQuillEditor, /* { default global options } */)

router.beforeEach((to, from, next) => {
    if (to.meta.title) {
        document.title = to.meta.title
    }
    next()
})

new Vue({
    router,
    store,
    vuetify,
    render: h => h(App)
}).$mount("#app");
