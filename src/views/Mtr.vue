<template  lang="pug">
    v-container#sample-layout(grid-list-lg)
        v-layout.mt-n5(wrap)
            v-flex(xs12)
                v-card
                    v-card-text
                        v-form(ref="form" onsubmit="return false;")
                            v-layout.mt-n4.px-2
                                v-flex(xs3 sm3 md3)
                                    v-text-field(v-model="destinationIP" label="Destination IP" type="ip" name="ip" :rules="[rules.required, rules.ip]")
                                v-flex(xs1 sm1 md1)
                                    v-text-field(v-model="count" label="Count" type="number" min="1" max="100")
                                v-flex.mt-n2(xs1 sm1 md1)
                                    v-checkbox(v-model='aslookup' label='-z')
                                    //- v-checkbox(v-model='aslookup' label='-z: display AS number')
                                    v-checkbox(v-model='noDNS' label='-n')
                                    //- v-checkbox(v-model='noDNS' label='-n: do not resove host names')
                                v-flex.mt-n2(xs3 sm3 md3)
                                    v-radio-group(v-model='protocal' row)
                                        v-radio(label='ICMP.' value='icmp')
                                        v-radio(label='TCP.' value='tcp')
                                        v-radio(label='UDP.' value='udp')
                                    v-text-field(v-show="protocal!='icmp'" v-model="port" label="Port" type="number" min="1" max="65535")
                                v-flex.mt-n2(xs4 sm4 md4)
                                    v-radio-group(v-model='siteSelected' row)
                                        v-radio(label='Dummy' value='dummy')
                                        v-radio(v-for="e in edgeList" :label="e.area + ':' + e.name" :value="e.area + ':' + e.name")
                                    v-text-field(v-show="isInOutBoundShow" v-model="sourceIP" label="Select Source IP as Below" readonly)
                            v-layout.mt-n5.px-2(v-show="isInOutBoundShow")
                                v-flex.py-6.pt-0.pb-0(xs12 sm12 md12)
                                    //- /* HEAD */
                                    v-row.flex-child
                                        v-col.d-flex(md='6' style='padding-left:20%;')
                                            | Inbound Circuit
                                        v-col.d-flex(md='6' style='padding-left:12%;')
                                            | Outbound Circuit
                                    //- /* R1 R2 */
                                    v-row.mt-n7.mb-n2.flex-child
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
                                        v-row.mt-n3.mb-n2.flex-child(dense)
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
                                        v-row.mt-n7.mb-n2.flex-child(dense)
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
                            v-layout.mt-n1
                                v-flex.py-6.pt-0.pb-0(xs8 sm8 md8)
                                    v-text-field(v-model="cliExam" label="Exam CLI Before Sending" readonly)
                                v-flex.py-6.pt-0.pb-0(xs2 sm2 md2)
                                    v-text-field(v-model="site" label="From" readonly)
                            v-btn.mt-n3(color="primary" block @click="getMtrInfo()") SEND
                            v-layout.pt-2(v-show="cliExecuted")
                                v-flex.py-6.pt-0.pb-0(xs8 sm8 md8)
                                    v-text-field(v-model="cliExecuted" label="CLI Executed" readonly)
                                v-flex.py-6.pt-0.pb-0(xs2 sm2 md2)
                                    v-text-field(v-model="siteExecuted" label="From" readonly)
                            v-layout.mt-n8.px-2(v-show="mtrResult")
                                v-flex.pt-0.pb-0.pl-0.pr-0(xs12 sm12 md12)
                                    v-card-text.font-weight-bold.pb-0.pl-1 Terminal:
                                    pre(v-highlightjs="mtrResult")
                                        code.java.display-0.font-weight-black
</template>

<script>
import textFieldRules from '../utils/textFieldRules'

export default {
    name: 'MTR',
    mixins: [textFieldRules],
    data() {
        return {
            // from apis
            bgpList: [],
            dummyList: [],
            edgeList: [],

            // Sort Inbound / Outbound Circuit
            sort: ['HK', 'TW', 'PH'],

            // Selecte Dummy / Edge
            siteSelected: 'dummy',

            // v-model: Inbound / Outbound Circuit
            inboundID: 0,
            outboundID: 0,

            // v-model: other input
            site: '',
            destinationIP: null,
            protocal: 'icmp',
            aslookup: true,
            noDNS: true,
            count: 30,
            port: null,

            // output result
            siteExecuted: '',
            cliExecuted: false,
            mtrResult: false,
        }
    },
    computed: {
        // v-model: from Inbound / Outbound Circuit mapping
        sourceIP: function () {
            let dummy = this.dummyList.find(function (dm) { 
                if (dm.in == this.inboundID && dm.out == this.outboundID) {
                    this.site = dm.site + ':DUMMY'

                    return dm.source_ip
                }
            }.bind(this));

            return dummy ? dummy.source_ip : "No Source IP Mapped"
        },

        // isInOutBoundShow ？
        isInOutBoundShow: function () {
            if (this.siteSelected !== 'dummy') {
                this.inboundID = 0
                this.outboundID = 0
                this.site = this.siteSelected
                return false
            }
            this.site = ''
            return true
        },

        // redirectBy: HK / TW / PH Appliaction
        redirectBy: function () {
            return this.site.substring(0,2)
        },

        // exam CLI before SEND
        cliExam: function () {
            let cli = 'mtr '
            // cli += this.site,
            cli += this.destinationIP ? this.destinationIP : 'x.x.x.x'
            cli += ' -r'
            cli += this.count ? ' -c ' + this.count : ''
            cli += this.sourceIP != 'No Source IP Mapped' ? ' -a ' + this.sourceIP : ''
            cli += this.protocal == 'tcp' ? ' -T' : ''
            cli += this.protocal == 'udp' ? ' -u' : ''
            cli += this.aslookup == true ? ' -z' : ''
            cli += this.noDNS == true ? ' -n' : ''
            cli += (this.protocal != 'icmp' && this.port >0 && this.port <65536) ? ' -P ' + this.port : ''
        
            return cli
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
        getEdges: function() {
            this.$store.dispatch('global/startLoading')
            this.$store
            .dispatch('edge/getInfo')
            .then(
                function(result) {
                    this.edgeList = result.data.map((item) => {
                        return {
                            name: item.name,
                            edge: item.edge,
                            area: item.area
                        }
                    })

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
        getMtrInfo: function() {
            if (! this.validateForm()) {
                return
            }
            this.$store.dispatch('global/startLoading')
            this.$store
                .dispatch('mtr/getMtrInfo', {
                    redirect_by: this.redirectBy,
                    machine_ip: this.getMachineIp(),
                    destination_ip: this.destinationIP,
                    address: this.sourceIP == "No Source IP Mapped" ? "" : this.sourceIP,
                    protocal: this.protocal,
                    aslookup: this.aslookup == true ? 1 : 0,
                    no_dns: this.noDNS == true ? 1 : 0,
                    count: this.count,
                    port: (this.protocal != 'icmp' && this.port >0 && this.port <65536) ? this.port : 0,
                })
                .then(
                    function(result) {
                        this.siteExecuted = this.site
                        this.mtrResult = result.data.result
                        this.cliExecuted = result.data.command
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
        getMachineIp: function() {
            let targetEdge = this.edgeList.find(function (v) {
                // ex: HK:hk-ubuntu-test
                return v.area +':'+ v.name == this.site
            }.bind(this))
            return targetEdge ? targetEdge.edge : ''
        },
        validateForm: function() {
            return this.$refs.form.validate()
        }
    },
    mounted() {
        document.title = 'MTR';

        this.getBGP()
        this.getDummy()
        this.getEdges()

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

// .d-flex
//     font-size: 1.5em

</style>
