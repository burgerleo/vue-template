
<template lang="pug">
v-card
    v-card-title component 1
    v-text-field(v-model='synMsg', label='Componet Input', type='text')
    div leo: {{leo}}
    div leo2: {{leo2}}
</template>
<script>
export default {
    props: {
        parentMessage: {
            type: String,
            default: '',
        },
        leo: {
            type: String,
            default: '',
        },
        leo2: {
            type: String,
            default: '',
        },

    },
    computed: {
        synMsg: {
            get() {
                return this.parentMessage
            },
            set(val) {
                this.$emit('update:parentMessage', val)
            },
        },
    },
    data() {
        return {}
    },
    methods: {},
    created() {},
}
</script>
<style lang="sass" scoped>
</style>


