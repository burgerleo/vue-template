<template  lang="pug">
    v-container#sample-layout(grid-list-lg)
        v-layout(wrap)
            v-flex(xs12)
                v-card
                    v-card-text
                        v-form(ref="form" onsubmit="return false;")
                            v-layout(wrap)
                                v-flex.py-6.pt-0.pb-0(xs12 sm12 md12)
                                    v-text-field(v-model="originIP" label="Destination IP" type="" name="ip" :rules="[rules.required, rules.ip]")
                                v-flex.pt-0.pb-0(xs12 sm12 md12)
                                    p In
                                    v-radio-group(row v-model="defaultIn") 
                                        v-radio(v-for="(inLine,index) in lineList" :label="inLine" :value="index")
                                    p Out
                                    v-radio-group(row v-model="defaultOut") 
                                        v-radio(v-for="(inLine,index) in lineList" :label="inLine" :value="index")
                                    v-btn(color="primary" block @click="getPingInfo()") SEND
                                v-flex.pt-0.pb-0(xs12)
                                    v-card-text.font-weight-bold.pb-0 Body:
                                    pre(v-highlightjs="pingBody")
                                        code.java.display-0.font-weight-black
</template>

<script>
import textFieldRules from '../utils/textFieldRules'
import dummy from '../assets/dummy.json'

export default {
    name: 'Test',
    mixins: [textFieldRules],
    data() {
        return {
            dummy: dummy,
            originIP: null,
            pingBody: null,

            defaultIn: 'CU_New',
            defaultOut: 'CU_New',
            sourceIP: null,

            lineList: {
                CU_New: 'CU_New',
                CU: 'CU',
                CM: 'CM',
                SingTel_China: 'SingTel',
                TWGate_China: 'TWGate'
            }
        }
    },
    watch: {
        pingURL: function() {
            this.validateForm()
        }
    },
    methods: {
        // init: function() {},
        getPingInfo: function() {
            this.sourceIP = this.dummy[this.defaultIn][this.defaultOut]

            if (this.sourceIP == null) {
                this.$store.dispatch(
                    'global/showSnackbarError',
                    'No Mapping Ip'
                )

                return
            }

            if (this.validateForm()) {
                this.$store.dispatch('global/startLoading')
                this.$store
                    .dispatch('ping/getPingInfo', {
                        origin: this.originIP,
                        interface: this.sourceIP,
                        interval: 0.5,
                        count: 10
                    })
                    .then(
                        function(result) {
                            this.pingBody = result.data
                            this.$store.dispatch(
                                'global/showSnackbarSuccess',
                                'Success!'
                            )
                            this.$store.dispatch('global/finishLoading')
                        }.bind(this)
                    )
                    .catch(
                        function(error) {
                            this.$store.dispatch(
                                'global/showSnackbarError',
                                error.message
                            )
                            this.$store.dispatch('global/finishLoading')
                        }.bind(this)
                    )
            }
        },
        validateForm: function() {
            return this.$refs.form.validate()
        }
    },
    mounted() {
        // this.init()
    }
}
</script>

<style lang="sass" scoped>
.hljs
    display: block
    color: #abb2bf
    background: #282c34
    word-break: break-all
</style>