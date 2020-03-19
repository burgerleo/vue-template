<template  lang="pug">
    v-container#sample-layout(grid-list-lg)
        v-layout(wrap)
            v-flex(xs12)
                v-card
                    v-card-text
                        v-form(ref="form" onsubmit="return false;")
                            v-layout.px-2
                                v-flex.py-6.pt-0.pb-0(xs12 sm12 md12)
                                    v-text-field(v-model="originIP" label="Destination IP" type="ip" name="ip" :rules="[rules.required, rules.ip]")
                                    v-text-field(v-model="sourceIP" label="Instance IP" type="ip" :rules="[rules.required, rules.ip]")
                            v-layout.px-2
                                v-flex(xs6 sm6 md6) In
                                    p.pt-0.pb-0.mb-0(v-for="(site,index) in siteList") {{index}}
                                        v-radio-group.mt-2(v-model="defaultIn" row @change="getOriginIP()")
                                            v-radio.pt-0.pb-0.mb-0.mr-1(v-for="(inLine,index) in site" :label="inLine" :value="index" :key="")
                                v-flex(xs6 sm6 md6) Out
                                    p.pt-0.pb-0.mb-0(v-for="(site,index) in siteList") {{index}}
                                        v-radio-group.mt-2(v-model="defaultOut" row @change="getOriginIP()")
                                            v-radio.pt-0.pb-0.mb-0.mr-1(v-for="(inLine,index) in site" :label="inLine" :value="index" :key="" )
                            v-text-field(v-model="packetCount" label="Count" type="number" min="1" max="100")
                            v-text-field(v-model="interval" label="Interval (0.2~) " type="number" min="0.2" step="0.1")
                            v-btn(color="primary" block @click="getPingInfo()") SEND
                            v-layout.px-2
                                v-flex.pt-0.pb-0(xs12 sm12 md12)
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
            selectMethod: ['HKR1', 'HKR2', 'TWR1', 'TWR2'],

            dummy: dummy,
            originIP: null,
            pingBody: null,
            packetCount: 10,
            interval: 0.5,

            defaultIn: '6',
            defaultOut: '6',
            sourceIP: null,

            site: '',
            siteList: {
                TW: {
                    0: 'PCCW_China',
                    1: 'TWGate_China',
                    2: 'SingTel_Global',
                    3: 'PCCW_Global',
                    4: 'NTT_Global',
                    5: 'Telstra_Global'
                },
                HK: {
                    6: 'CU_R1',
                    7: 'CU_R2',
                    8: 'CM',
                    9: 'SingTel_China',
                    10: 'TWGate_China',
                    11: 'TWGate_Global',
                    12: 'SingTel_Global',
                    13: 'PCCW_Global',
                    14: 'Equinix_IX',
                    15: 'HK_IX'
                }
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
        getOriginIP: function() {
            var inName = ''
            var outName = ''
            var outSite = ''

            this.site = this.defaultIn < 6 ? 'TW' : 'HK'
            outSite = this.defaultOut < 6 ? 'TW' : 'HK'

            inName = this.siteList[this.site][this.defaultIn]
            outName = this.siteList[outSite][this.defaultOut]

            if (this.dummy[this.site][inName]) {
                // [site][in][out]
                this.sourceIP = this.dummy[this.site][inName][outName]
            } else {
                this.sourceIP == null
            }

            // if (this.sourceIP == null) {
            //     this.$store.dispatch(
            //         'global/showSnackbarError',
            //         'No Mapping Ip'
            //     )

            //     return
            // }
        },
        getPingInfo: function() {
            if (this.validateForm()) {
                this.$store.dispatch('global/startLoading')
                this.$store
                    .dispatch('ping/getPingInfo', {
                        site: this.site,
                        origin: this.originIP,
                        interface: this.sourceIP,
                        interval: this.interval,
                        count: this.packetCount
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
        this.getOriginIP()
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