<template lang="pug">
    #layout
        Loading
        NavigationDrawer(ref="drawer" :tabId="tabId")
        v-app-bar(fixed :clipped-left="clipped" app color="primary" dark)
            v-app-bar-nav-icon(@click.stop="$refs.drawer.drawer = !$refs.drawer.drawer")
            v-toolbar-title Portal
            v-spacer
            v-btn(icon)
                v-icon mdi-help-circle
            Setting
            v-btn(icon)
                v-icon mdi-dots-vertical
        v-content
            router-view   
        v-footer(fixed :inset="inset" app color="primary")
            span.white--text COPYRIGHT © {{year}} Hiero7. ALL RIGHTS RESERVED.
            v-spacer
            span.white--text v {{version}}
            span.white--text ({{env}}) 
                     
</template>
<script>
import NavigationDrawer from "../components/NavigationDrawer";
import Setting from "../components/Setting";
import Loading from "../components/Loading";
export default {
    components: {
      NavigationDrawer,
      Setting,
      Loading
    },
    data() {
        return {
            drawer: true,
            clipped: true,
            year: 2019,
            version: process.env.VUE_APP_VERSION,
            env: process.env.NODE_ENV,
            inset: false,
            tabs: [
                { id: 1, name: "CST" },
                { id: 2, name: "OPS" },
                { id: 3, name: "RD" }
            ],
            selectedTabId: 1,
            selectedTab: 1,
            tabId: 1,
            dialog: {
                setting: false
            }
        };
    },
    watch: {
        selectedTab: function() {
            this.selectedTabId = this.selectedTab - 1;
        }
    },
    methods: {
        navigationControl(value) {
            this.selectedTab = value;
            this.selectedTabId = this.selectedTab - 1;
        }
    },
    mounted() {
        var d = new Date();
        this.year = d.getFullYear();
        // console.log(this.year);
    }
};
</script>
<style>
/* .version {
    position: absolute;
    bottom: 0;
    right: 0;
}
.company {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
} */
</style>



