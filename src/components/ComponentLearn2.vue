
<template lang="pug">
v-card
    v-card-title Component 2
    label Checkbox 
    
    //- 使用 $attrs 讓外部可傳入參數
    input(type="checkbox" v-bind="$attrs")
</template>
<script>
export default {
    // 預設不繼承非 Props 的參數
    inheritAttrs: false,
    props: {
        active: {
            type: Boolean,
        },
        'is-active': {
            type: Boolean,
        },
    },
    computed: {},
    data() {
        return {}
    },
    methods: {},
    created() {},
}
</script>
<style lang="sass" scoped>
</style>


