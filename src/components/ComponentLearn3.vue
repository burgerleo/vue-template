
<template lang="pug">
v-card
    v-card-title Component 3
    div Hello : 
        slot(name="header")
            h2 Header
    br
    div Body : 
        slot(name="body")
            h2 body
    footer
        slot(name="footer")
            h4 footer
</template>
<script>
export default {
    props: {
        // active: {
        //     type: Boolean,
        // },
        // 'is-active': {
        //     type: Boolean,
        // },
    },
    computed: {},
    data() {
        return {
            msg: 'Leo!!',
            msg2: 'Leo!!',
            msg3: 'Leo!!',
        }
    },
    methods: {},
    created() {},
}
</script>
<style lang="sass" scoped>
</style>


