<template lang="pug">
    #layout
        Loading
        NavigationDrawer(ref="drawer")
        v-app-bar(fixed :clipped-left="clipped" app color="primary" dark)
            v-app-bar-nav-icon(@click.stop="$refs.drawer.drawer = !$refs.drawer.drawer")
            v-toolbar-title H7 Vue Template
            v-spacer
            v-btn(icon :to="'/helper'+ path" v-if="!displayHelper()" target="_blank")
                v-icon mdi-help-circle
            Setting
            v-btn(icon)
                v-icon mdi-dots-vertical
        v-snackbar(v-model="$store.state.global.snackbar.status" :color="$store.state.global.snackbar.color" :timeout="$store.state.global.snackbar.timeout" top ) {{$store.state.global.snackbar.text}}
            v-btn(dark text @click="$store.dispatch('global/closeSnackbar')") CLOSE
        v-content
            router-view
        v-footer(fixed :inset="inset" app color="primary")
            span.white--text COPYRIGHT © {{year}} Hiero7. ALL RIGHTS RESERVED.
            v-spacer
            span.white--text v {{version}}
            span.white--text ({{env}})
</template>
<script>
import NavigationDrawer from '../components/NavigationDrawer'
import Setting from '../components/Setting'
import Loading from '../components/Loading'
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
            year: 2020,
            version: process.env.VUE_APP_VERSION,
            env: process.env.NODE_ENV,
            inset: false,
            dialog: {
                setting: false
            },
            path: ''
        }
    },
    watch: {
        $route(to, from) {
            this.setPath()
        }
    },
    methods: {
        setPath() {
            this.path = this.$router.currentRoute.path
        },
        displayHelper() {
            return this.path.includes('helper')
        }
    },
    mounted() {
        var d = new Date()
        this.year = d.getFullYear()
    },
    created() {
        this.setPath()
    }
}
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



