<template  lang="pug">
    v-container#sample-layout(grid-list-lg)
        v-layout(wrap)
            v-flex(xs12)
                .title Ping Tool
            v-flex(xs12)
                v-card
                    v-card-text
                        v-form(ref="form" onsubmit="return false;")
                            v-layout(wrap)
                                v-flex.py-6.pt-0.pb-0(xs12 sm12 md12)
                                    v-text-field(v-model="originIP" label="Origin IP" type="" name="ip" :rules="[rules.required, rules.ip]")
                                v-flex.pt-0.pb-0(xs12 sm12 md12)
                                    p In
                                    v-radio-group(row v-model="defaultIn") 
                                        v-radio(v-for="(inLine,index) in lineList" :label="inLine" :value="index")
                                    p Out
                                    v-radio-group(row v-model="defaultOut") 
                                        v-radio(v-for="(inLine,index) in lineList" :label="inLine" :value="index")
                                v-flex.pt-0.pb-0(xs12)
                                    v-btn(color="primary" block @click="getPingInfo()") SEND
                                v-flex.pt-0.pb-0(xs12)
                                    v-card-text.font-weight-bold.pb-0 Ping Body:
                                    pre(v-highlightjs="pingBody")
                                        code.java.display-1.font-weight-black
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
            ip: null,

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
        init: function() {
            // this.sourceIP = this.sourceIPList[1]
        },

        getPingInfo: function() {
            console.log(this.defaultIn)
            console.log(this.defaultOut)

            this.ip = this.dummy[this.defaultIn][this.defaultOut]

            if (this.ip == null) {
                console.log(this.ip)
                this.$store.dispatch(
                    'global/showSnackbarError',
                    'No Mapping Ip'
                )

                return
            }

            if (this.validateForm()) {
                this.$store.dispatch('global/startLoading')
                this.$store.dispatch('global/finishLoading')

                this.pingBody = 'AAA'

                this.$store
                    .dispatch('ping/getPingInfo', {
                        originIP: this.originIP,
                        sourceIp: this.ip
                    })
                    .then(
                        function(result) {
                            this.pingBody = result.data.body
                        }.bind(this)
                    )
                    .catch(
                        function(error) {
                            this.$store.dispatch(
                                'global/showSnackbarError',
                                error.message
                            )
                        }.bind(this)
                    )

                this.$store.dispatch('global/finishLoading')
            }
        },
        validateForm: function() {
            return this.$refs.form.validate()
        }
    },
    mounted() {
        this.init()
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