<template  lang="pug">
    v-container#sample-layout(grid-list-lg)
        v-layout(wrap style='margin-top: -2%;')
            v-flex(xs12)
                v-card
                    v-card-text
                        v-form(ref="form" onsubmit="return false;")
                            v-layout.px-2
                                v-flex.py-6.pt-0.pb-0(xs12 sm12 md12)
                                    v-text-field(v-model="destinationIP" label="Destination IP" type="ip" name="ip" :rules="[rules.required, rules.ip]")
                                    v-text-field(v-model="sourceIP" label="Select Source IP as Below" type="ip" readonly :rules="[rules.required, rules.ip]")
                            v-layout.px-2(style='margin-top: -1%;')
                                v-flex.py-6.pt-0.pb-0(xs12 sm12 md12)
                                    //- /* HEAD */
                                    v-row.flex-child
                                        v-col.d-flex(md='6' style='padding-left:20%;')
                                            | Inbound Circuit
                                        v-col.d-flex(md='6' style='padding-left:12%;')
                                            | Outbound Circuit
                                    //- /* R1 R2 */
                                    v-row.flex-child(style='margin-top: -1%;')
                                        v-col(cols='1' md='1' dense)
                                        v-col.d-flex(md='2' style='padding-left:7%;')
                                            | R1
                                        v-col.d-flex(md='2' style='padding-left:7%;')
                                            | R2
                                        v-col(cols='1' md='1' dense)
                                        v-col.d-flex(md='2' style='padding-left:7%;')
                                            | R1
                                        v-col.d-flex(md='2' style='padding-left:7%;')
                                            | R2
                                    v-flex(v-for="s in sort")
                                        //- /* China */
                                        v-row.flex-child(dense style='margin-bottom: -1.3%; margin-top: -0.5%;')
                                            //- /* IN R1 China */
                                            v-col(cols='1' md='1' dense)
                                            v-col(cols='2' md='2')
                                                v-sheet.d-flex(color='red lighten-3')
                                                    v-radio-group.mt-0.mb-0(v-model='inboundID' row)
                                                        v-radio(v-if="s == 'HK'" v-for="bgp in hkr1c" :label="bgp.isp" :value="bgp.id" :key="bgp.id")
                                                        v-radio(v-if="s == 'TW'" v-for="bgp in twr1c" :label="bgp.isp" :value="bgp.id" :key="bgp.id")
                                                        v-radio(v-if="s == 'PH'" v-for="bgp in phr1c" :label="bgp.isp" :value="bgp.id" :key="bgp.id")
                                            //- /* IN R2 China */
                                            v-col(cols='2' md='2')
                                                v-sheet.d-flex(color='red lighten-3')
                                                    v-radio-group.mt-0.mb-0(v-model='inboundID' row)
                                                        v-radio(v-if="s == 'HK'" v-for="bgp in hkr2c" :label="bgp.isp" :value="bgp.id" :key="bgp.id")
                                                        v-radio(v-if="s == 'TW'" v-for="bgp in twr2c" :label="bgp.isp" :value="bgp.id" :key="bgp.id")
                                                        v-radio(v-if="s == 'PH'" v-for="bgp in phr2c" :label="bgp.isp" :value="bgp.id" :key="bgp.id")
                                            //- /* OUT R1 China */
                                            v-col(cols='1' md='1' dense)
                                            v-col(cols='2' md='2')
                                                v-sheet.d-flex(color='red lighten-3')
                                                    v-radio-group.mt-0.mb-0(v-model='outboundID' row)
                                                        v-radio(v-if="s == 'HK'" v-for="bgp in hkr1c" :label="bgp.isp" :value="bgp.id" :key="bgp.id")
                                                        v-radio(v-if="s == 'TW'" v-for="bgp in twr1c" :label="bgp.isp" :value="bgp.id" :key="bgp.id")
                                                        v-radio(v-if="s == 'PH'" v-for="bgp in phr1c" :label="bgp.isp" :value="bgp.id" :key="bgp.id")
                                            //- /* OUT R2 China */
                                            v-col(cols='2' md='2')
                                                v-sheet.d-flex(color='red lighten-3')
                                                    v-radio-group.mt-0.mb-0(v-model='outboundID' row)
                                                        v-radio(v-if="s == 'HK'" v-for="bgp in hkr2c" :label="bgp.isp" :value="bgp.id" :key="bgp.id")
                                                        v-radio(v-if="s == 'TW'" v-for="bgp in twr2c" :label="bgp.isp" :value="bgp.id" :key="bgp.id")
                                                        v-radio(v-if="s == 'PH'" v-for="bgp in phr2c" :label="bgp.isp" :value="bgp.id" :key="bgp.id")
                                        //- /* */
                                        v-row.flex-child(dense)
                                            v-col(cols='1' md='1')
                                                v-sheet.d-flex(style='padding-left: 35%;') {{s}}
                                        //- /* Global */
                                        v-row.flex-child(dense style='margin-top: -1.3%;')
                                            //- /* IN R1 Global */
                                            v-col(cols='1' md='1' dense)
                                            v-col(cols='2' md='2')
                                                v-sheet.d-flex(color='blue lighten-3')
                                                    v-radio-group.mt-0.mb-0(v-model='inboundID' row)
                                                        v-radio(v-if="s == 'HK'" v-for="bgp in hkr1g" :label="bgp.isp" :value="bgp.id" :key="bgp.id")
                                                        v-radio(v-if="s == 'TW'" v-for="bgp in twr1g" :label="bgp.isp" :value="bgp.id" :key="bgp.id")
                                                        v-radio(v-if="s == 'PH'" v-for="bgp in phr1g" :label="bgp.isp" :value="bgp.id" :key="bgp.id")
                                            //- /* IN R2 Global */
                                            v-col(cols='2' md='2')
                                                v-sheet.d-flex(color='blue lighten-3')
                                                    v-radio-group.mt-0.mb-0(v-model='inboundID' row)
                                                        v-radio(v-if="s == 'HK'" v-for="bgp in hkr2g" :label="bgp.isp" :value="bgp.id" :key="bgp.id")
                                                        v-radio(v-if="s == 'TW'" v-for="bgp in twr2g" :label="bgp.isp" :value="bgp.id" :key="bgp.id")
                                                        v-radio(v-if="s == 'PH'" v-for="bgp in phr2g" :label="bgp.isp" :value="bgp.id" :key="bgp.id")
                                            //- /* OUT R1 Global */
                                            v-col(cols='1' md='1' dense)
                                            v-col(cols='2' md='2')
                                                v-sheet.d-flex(color='blue lighten-3')
                                                    v-radio-group.mt-0.mb-0(v-model='outboundID' row)
                                                        v-radio(v-if="s == 'HK'" v-for="bgp in hkr1g" :label="bgp.isp" :value="bgp.id" :key="bgp.id")
                                                        v-radio(v-if="s == 'TW'" v-for="bgp in twr1g" :label="bgp.isp" :value="bgp.id" :key="bgp.id")
                                                        v-radio(v-if="s == 'PH'" v-for="bgp in phr1g" :label="bgp.isp" :value="bgp.id" :key="bgp.id")
                                            //- /* OUT R2 Global */
                                            v-col(cols='2' md='2')
                                                v-sheet.d-flex(color='blue lighten-3')
                                                    v-radio-group.mt-0.mb-0(v-model='outboundID' row)
                                                        v-radio(v-if="s == 'HK'" v-for="bgp in hkr2g" :label="bgp.isp" :value="bgp.id" :key="bgp.id")
                                                        v-radio(v-if="s == 'TW'" v-for="bgp in twr2g" :label="bgp.isp" :value="bgp.id" :key="bgp.id")
                                                        v-radio(v-if="s == 'PH'" v-for="bgp in phr2g" :label="bgp.isp" :value="bgp.id" :key="bgp.id")
                                            v-col(cols='1' md='1' dense)
                                        //- /* divider */
                                        v-divider(dark)
                            v-layout(style='margin-top: -0.5%;')
                                v-checkbox.mx-6(v-model='I' label='-I: Use ICMP.')
                                v-checkbox.mx-6(v-model='n' label='-n: Print hop addresses numerically.')
                            v-btn(color="primary" block @click="getTracerouteInfo()") SEND
                            v-layout.px-2(style='margin-top: -0.5%; margin-bottom: -0.5%;')
                                v-flex.pt-0.pb-0.pl-0.pr-0(xs12 sm12 md12)
                                    v-card-text.font-weight-bold.pb-0.pl-1 Terminal:
                                    pre(v-highlightjs="pingBody")
                                        code.java.display-0.font-weight-black
</template>

<script>
import textFieldRules from '../utils/textFieldRules'

export default {
    name: 'Traceroute',
    mixins: [textFieldRules],
    data() {
        return {
            // from apis
            bgpList: [],
            dummyList: [],

            // Sort Inbound / Outbound Circuit
            sort: ['HK', 'TW', 'PH'],

            // v-model: Inbound / Outbound Circuit
            inboundID: 0,
            outboundID: 0,

            // v-model: other input
            site: '',
            destinationIP: null,
            I: true,
            n: true,

            // output result
            pingBody: '',
        }
    },
    computed: {
        // v-model: from Inbound / Outbound Circuit mapping
        sourceIP: function () {
            let dummy = this.dummyList.find(function (dm) { 
                if (dm.in == this.inboundID && dm.out == this.outboundID) {
                    this.site = dm.site
                    // console.log({dm}, this.site)
                    return dm.source_ip
                }
            }.bind(this));

            return dummy ? dummy.source_ip : ""
        },

        // Inbound / Outbound Circuit data
        hkr1c: function () {
            return this.bgpList.filter(bgp => bgp.site == 'HK' && bgp.br == 'R1' && bgp.routes == 'C');
        },
        hkr1g: function () {
            return this.bgpList.filter(bgp => bgp.site == 'HK' && bgp.br == 'R1' && bgp.routes == 'G');
        },
        hkr2c: function () {
            return this.bgpList.filter(bgp => bgp.site == 'HK' && bgp.br == 'R2' && bgp.routes == 'C');
        },
        hkr2g: function () {
            return this.bgpList.filter(bgp => bgp.site == 'HK' && bgp.br == 'R2' && bgp.routes == 'G');
        },

        twr1c: function () {
            return this.bgpList.filter(bgp => bgp.site == 'TW' && bgp.br == 'R1' && bgp.routes == 'C');
        },
        twr1g: function () {
            return this.bgpList.filter(bgp => bgp.site == 'TW' && bgp.br == 'R1' && bgp.routes == 'G');
        },
        twr2c: function () {
            return this.bgpList.filter(bgp => bgp.site == 'TW' && bgp.br == 'R2' && bgp.routes == 'C');
        },
        twr2g: function () {
            return this.bgpList.filter(bgp => bgp.site == 'TW' && bgp.br == 'R2' && bgp.routes == 'G');
        },

        phr1c: function () {
            return this.bgpList.filter(bgp => bgp.site == 'PH' && bgp.br == 'R1' && bgp.routes == 'C');
        },
        phr1g: function () {
            return this.bgpList.filter(bgp => bgp.site == 'PH' && bgp.br == 'R1' && bgp.routes == 'G');
        },
        phr2c: function () {
            return this.bgpList.filter(bgp => bgp.site == 'PH' && bgp.br == 'R2' && bgp.routes == 'C');
        },
        phr2g: function () {
            return this.bgpList.filter(bgp => bgp.site == 'PH' && bgp.br == 'R2' && bgp.routes == 'G');
        },
    },
    methods: {
        getBGP: function() {
            this.$store.dispatch('global/startLoading')
            this.$store
                .dispatch('bgp/getInfo')
                .then(
                    function(result) {
                        this.$store.dispatch('global/finishLoading')

                        this.bgpList = result.data.map(function(item, index) {
                            delete item.wan_ip
                            delete item.wan_prefix
                            delete item.name
                            delete item.wan
                            return item
                        })
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
        },
        getDummy() {
            this.$store.dispatch('global/startLoading')
            this.$store
                .dispatch('dummy/getInfo')
                .then(
                    function(result) {
                        this.$store.dispatch('global/finishLoading')

                        this.dummyList = result.data.map(function(item, index) {
                            item.site = item.in_bgp.site
                            delete item.id
                            delete item.jkb_task_id
                            delete item.in_bgp
                            delete item.out_bgp
                            return item
                        })
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
        },
        getTracerouteInfo: function() {
            if (! this.validateForm()) {
                return
            }
            this.$store.dispatch('global/startLoading')
            this.$store
                .dispatch('traceroute/getTracerouteInfo', {
                    site: this.site,
                    destination_ip: this.destinationIP,
                    s: this.sourceIP,
                    n: this.n == true ? 1 : 0,
                    I: this.I == true ? 1 : 0
                })
                .then(
                    function(result) {
                        this.pingBody = result.data.result
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
        },
        validateForm: function() {
            return this.$refs.form.validate()
        }
    },
    mounted() {
        document.title = 'Traceroute';

        this.getBGP()
        this.getDummy()

        // 刪除 Inbound / Outbound Circuit 紅藍框下巴多餘 html
        document.querySelectorAll(".v-messages").forEach(e => e.parentNode.removeChild(e))
    }
}
</script>

<style lang="sass" scoped>
.hljs
    display: block
    color: #abb2bf
    background: #282c34
    word-break: break-all

.d-flex
    font-size: 1.5em

</style>
