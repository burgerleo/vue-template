import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store/index";
import vuetify from "./plugins/vuetify";
import "roboto-fontface/css/roboto/roboto-fontface.css";
import "@mdi/font/css/materialdesignicons.css";
import VueHighlightJS from "vue-highlightjs";
import 'highlight.js/styles/atom-one-dark.css'

Vue.use(VueHighlightJS);
Vue.config.productionTip = false;
import dataTable from "./components/DataTable.vue";
Vue.component("h7-data-table", dataTable);

new Vue({
    router,
    store,
    vuetify,
    render: h => h(App)
}).$mount("#app");
