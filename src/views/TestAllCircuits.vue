<template  lang="pug">
    v-container#sample-layout(grid-list-lg)
        v-layout.mt-n5(wrap)
            v-flex(xs12)
                v-card
                    v-card-text
                        v-form(ref="form" onsubmit="return false;")
                            v-layout.mt-n4.px-2
                                v-flex(xs5 sm5 md5)
                                    v-text-field(v-model="destinationIP" label="Destination IP" type="ip" name="ip" :rules="[rules.required, rules.ip]")
                                v-flex(xs1 sm1 md1)
                                v-flex(xs2 sm2 md2)
                                    v-text-field(v-model="count" label="Count" type="number" min="1" max="100")
                                v-flex(xs2 sm2 md2)
                                    v-text-field(v-model="interval" label="Interval (0.2+) " type="number" min="0.2" step="0.1")
                            v-layout.mt-n5.px-2
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
                                                    v-radio-group.mt-0.mb-0(v-model='boundInfo' row)
                                                        v-radio(v-if="s == 'HK'" v-for="bgp in hkr1c" :label="bgp.isp" :value="bgp.id+',in,R1,C'" :key="bgp.id")
                                                        v-radio(v-if="s == 'TW'" v-for="bgp in twr1c" :label="bgp.isp" :value="bgp.id+',in,R1,C'" :key="bgp.id")
                                                        v-radio(v-if="s == 'PH'" v-for="bgp in phr1c" :label="bgp.isp" :value="bgp.id+',in,R1,C'" :key="bgp.id")
                                            //- /* IN R2 China */
                                            v-col(cols='2' md='2')
                                                v-sheet.d-flex(color='red lighten-3')
                                                    v-radio-group.mt-0.mb-0(v-model='boundInfo' row)
                                                        v-radio(v-if="s == 'HK'" v-for="bgp in hkr2c" :label="bgp.isp" :value="bgp.id+',in,R2,C'" :key="bgp.id")
                                                        v-radio(v-if="s == 'TW'" v-for="bgp in twr2c" :label="bgp.isp" :value="bgp.id+',in,R2,C'" :key="bgp.id")
                                                        v-radio(v-if="s == 'PH'" v-for="bgp in phr2c" :label="bgp.isp" :value="bgp.id+',in,R2,C'" :key="bgp.id")
                                            //- /* OUT R1 China */
                                            v-col(cols='1' md='1' dense)
                                            v-col(cols='2' md='2')
                                                v-sheet.d-flex(color='red lighten-3')
                                                    v-radio-group.mt-0.mb-0(v-model='boundInfo' row)
                                                        v-radio(v-if="s == 'HK'" v-for="bgp in hkr1c" :label="bgp.isp" :value="bgp.id+',out,R1,C'" :key="bgp.id")
                                                        v-radio(v-if="s == 'TW'" v-for="bgp in twr1c" :label="bgp.isp" :value="bgp.id+',out,R1,C'" :key="bgp.id")
                                                        v-radio(v-if="s == 'PH'" v-for="bgp in phr1c" :label="bgp.isp" :value="bgp.id+',out,R1,C'" :key="bgp.id")
                                            //- /* OUT R2 China */
                                            v-col(cols='2' md='2')
                                                v-sheet.d-flex(color='red lighten-3')
                                                    v-radio-group.mt-0.mb-0(v-model='boundInfo' row)
                                                        v-radio(v-if="s == 'HK'" v-for="bgp in hkr2c" :label="bgp.isp" :value="bgp.id+',out,R2,C'" :key="bgp.id")
                                                        v-radio(v-if="s == 'TW'" v-for="bgp in twr2c" :label="bgp.isp" :value="bgp.id+',out,R2,C'" :key="bgp.id")
                                                        v-radio(v-if="s == 'PH'" v-for="bgp in phr2c" :label="bgp.isp" :value="bgp.id+',out,R2,C'" :key="bgp.id")
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
                                                    v-radio-group.mt-0.mb-0(v-model='boundInfo' row)
                                                        v-radio(v-if="s == 'HK'" v-for="bgp in hkr1g" :label="bgp.isp" :value="bgp.id+',in,R1,G'" :key="bgp.id")
                                                        v-radio(v-if="s == 'TW'" v-for="bgp in twr1g" :label="bgp.isp" :value="bgp.id+',in,R1,G'" :key="bgp.id")
                                                        v-radio(v-if="s == 'PH'" v-for="bgp in phr1g" :label="bgp.isp" :value="bgp.id+',in,R1,G'" :key="bgp.id")
                                            //- /* IN R2 Global */
                                            v-col(cols='2' md='2')
                                                v-sheet.d-flex(color='blue lighten-3')
                                                    v-radio-group.mt-0.mb-0(v-model='boundInfo' row)
                                                        v-radio(v-if="s == 'HK'" v-for="bgp in hkr2g" :label="bgp.isp" :value="bgp.id+',in,R2,G'" :key="bgp.id")
                                                        v-radio(v-if="s == 'TW'" v-for="bgp in twr2g" :label="bgp.isp" :value="bgp.id+',in,R2,G'" :key="bgp.id")
                                                        v-radio(v-if="s == 'PH'" v-for="bgp in phr2g" :label="bgp.isp" :value="bgp.id+',in,R2,G'" :key="bgp.id")
                                            //- /* OUT R1 Global */
                                            v-col(cols='1' md='1' dense)
                                            v-col(cols='2' md='2')
                                                v-sheet.d-flex(color='blue lighten-3')
                                                    v-radio-group.mt-0.mb-0(v-model='boundInfo' row)
                                                        v-radio(v-if="s == 'HK'" v-for="bgp in hkr1g" :label="bgp.isp" :value="bgp.id+',out,R1,G'" :key="bgp.id")
                                                        v-radio(v-if="s == 'TW'" v-for="bgp in twr1g" :label="bgp.isp" :value="bgp.id+',out,R1,G'" :key="bgp.id")
                                                        v-radio(v-if="s == 'PH'" v-for="bgp in phr1g" :label="bgp.isp" :value="bgp.id+',out,R1,G'" :key="bgp.id")
                                            //- /* OUT R2 Global */
                                            v-col(cols='2' md='2')
                                                v-sheet.d-flex(color='blue lighten-3')
                                                    v-radio-group.mt-0.mb-0(v-model='boundInfo' row)
                                                        v-radio(v-if="s == 'HK'" v-for="bgp in hkr2g" :label="bgp.isp" :value="bgp.id+',out,R2,G'" :key="bgp.id")
                                                        v-radio(v-if="s == 'TW'" v-for="bgp in twr2g" :label="bgp.isp" :value="bgp.id+',out,R2,G'" :key="bgp.id")
                                                        v-radio(v-if="s == 'PH'" v-for="bgp in phr2g" :label="bgp.isp" :value="bgp.id+',out,R2,G'" :key="bgp.id")
                                            v-col(cols='1' md='1' dense)
                                        //- /* divider */
                                        v-divider(dark)
                            v-layout.mt-n1
                                v-flex(xs8 sm8 md8)
                                    v-text-field(v-model="cliExam" label="Exam CLI Before Sending" readonly)
                                v-flex(xs2 sm2 md2)
                                    v-text-field(v-model="site" label="From" readonly)
                            v-layout.mt-n1
                                v-flex(xs6 sm6 md6)
                                    v-btn.mt-n3(color="primary" block @click="syncPing()") SEQUENTIAL ({{selectSourceIPs.length * count * interval}} s)
                                v-flex(xs6 sm6 md6)
                                    v-btn.mt-n3(color="primary" block @click="asyncPing()") PARALLEL ({{ selectSourceIPs.length ? count * interval : 0}} s)
                            v-layout.mt-1
                                v-flex.mt-n4(xs8 sm8 md8)
                                    v-textarea(v-model="cpips" solo="" label="Critical Pblic IPs: 1.1.1.1,2.2.2.2, ..." height="")
                                v-flex(xs2 sm2 md2)
                                    v-btn.mt-n3(color="purple lighten-2" block @click="makeReportPing()") REPORT
                                v-flex(xs2 sm2 md2)
                                    v-btn.mt-n3(color="purple lighten-2" block @click="downloadTwoReportsPing()") DOWNLOAD
                            v-layout.pt-2(v-show="cliExecuted != false")
                                v-flex(xs8 sm8 md8)
                                    v-text-field(v-model="cliExecuted" label="CLI Executed" readonly)
                                v-flex(xs2 sm2 md2)
                                    v-text-field(v-model="siteExecuted" label="From" readonly)
                            v-layout.mt-n5(v-show='pingResult.length > 0')
                                v-flex(xs12 sm12 md12)
                                    v-card-text.font-weight-bold.pb-0.pl-1 Results:
                                    DataTable2(ref="table2" :headers="headers" :items="pingResult" :itemsPerPage="itemsPerPage" :itemsPerPageList="itemsPerPageList" :searchList="searchList")
                            v-layout.mt-n5(v-show='pingReport.length > 0')
                                v-flex(xs12 sm12 md12)
                                    v-card-text.font-weight-bold.pb-0.pl-1 Report:
                                    DataTable2(ref="table2" :headers="headersReport" :items="pingReport" :itemsPerPage="itemsPerPage" :itemsPerPageList="itemsPerPageList" :searchList="searchList")
</template>

<script>
import textFieldRules from '../utils/textFieldRules'
import DataTable2 from '../components/DataTable2'

export default {
    name: 'Ping',
    mixins: [textFieldRules],
    components: {
        DataTable2
    },
    data() {
        return {
            // from apis
            bgpList: [],
            dummyList: [],

            // Critical Pblic IPs
            cpips: '',

            // Sort Inbound / Outbound Circuit
            sort: ['HK', 'TW', 'PH'],

            // v-model: Inbound / Outbound Circuit
            boundInfo: '',

            // v-model: other input
            site: '',
            destinationIP: null,
            count: 10,
            interval: 1,

            // regex
            regexPingResult: /(\d+)% packet loss, time (\d+)ms\nrtt min\/avg\/max\/mdev = ([0-9.]+)\/([0-9.]+)\/([0-9.]+)\/([0-9.]+) ms/g,

            // output result
            siteExecuted: '',
            cliExecuted: false,
            pingResult: [],
            pingReport: [],

            // datatable2
            itemsPerPage: 15,
            itemsPerPageList: [15, 50],
            searchList: {},
            headers: [
                {
                    text: '#',
                    align: 'center',
                    sortable: false,
                    value: 'index'
                },
                {
                    text: 'Site',
                    align: 'center',
                    sortable: false,
                    value: 'site'
                },
                {
                    text: 'In',
                    align: 'center',
                    sortable: true,
                    value: 'in_name'
                },
                {
                    text: 'Out',
                    align: 'center',
                    sortable: true,
                    value: 'out_name'
                },
                {
                    text: 'Source IP',
                    align: 'center',
                    sortable: true,
                    value: 'source_ip'
                },
                {
                    text: 'Packet Loss(%)',
                    align: 'center',
                    sortable: true,
                    value: 'packet_loss',
                },
                {
                    text: 'Min(ms)',
                    align: 'center',
                    sortable: true,
                    value: 'min'
                },
                {
                    text: 'Avg(ms)',
                    align: 'center',
                    sortable: true,
                    value: 'avg'
                },
                {
                    text: 'Max(ms)',
                    align: 'center',
                    sortable: true,
                    value: 'max'
                }
            ],

            headersReport: [
                {
                    text: '#',
                    align: 'center',
                    sortable: false,
                    value: 'index'
                },
                {
                    text: 'CPIP',
                    align: 'center',
                    sortable: true,
                    value: 'origin'
                },
                {
                    text: 'Packet Loss(%)',
                    align: 'center',
                    sortable: true,
                    value: 'packet_loss',
                },
                {
                    text: 'Avg(ms)',
                    align: 'center',
                    sortable: true,
                    value: 'rtt'
                }
            ],
        }
    },
    computed: {
        // radio 選擇 BGP in/outbound
        selectSourceIPs: function () {
            let info = this.boundInfo.split(','),
                id = info[0],
                io = info[1], // in / out
                r = info[2],  // R1 / R2
                cg = info[3], // china / global
                targetSourceIPs = []
            // console.log(id, io, r, cg)
            
            if (io == 'in') {
                targetSourceIPs = this.dummyList.filter(function(item, index) {
                    return item.in == id && item.out_bgp.routes == cg
                })
            }
            
            if (io == 'out') {
                targetSourceIPs = this.dummyList.filter(function(item, index) {
                    return item.out == id && item.in_bgp.routes == cg
                })
            }
            // console.table(targetSourceIPs)

            // map需要資訊
            targetSourceIPs = targetSourceIPs.map(function(item, index) {
                            return {
                                in_name: item.in_bgp.name,
                                out_name: item.out_bgp.name,
                                source_ip: item.source_ip,
                                site: item.site,
                                packet_loss: "",
                                time: "",
                                min: "",
                                avg: "",
                                max: "",
                                mdev: ""
                            }
                        })
            // console.table(targetSourceIPs)
            this.site = targetSourceIPs.length == 0 ? "" : targetSourceIPs[0].site
            return targetSourceIPs
        },

        // exam CLI before SEND
        cliExam: function () {
            let cli = 'ping '
            cli += this.destinationIP ? this.destinationIP : 'x.x.x.x'
            cli += ' -I <rounding Source IPs>'
            cli += this.count ? ' -c ' + this.count : ''
            cli += this.interval ? ' -i ' + this.interval : ''
        
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
        syncPing: async function() {
            if (! this.validateForm()) {
                return
            }

            let sourceIPs = this.selectSourceIPs
            this.pingResult = sourceIPs
            
            // 證明按 Button 有做事 XD
            this.$store.dispatch('global/startLoading')
            setTimeout(function(){ this.$store.dispatch('global/finishLoading') }.bind(this), 500)
            
            // 同步開打～
            for(let i=0; i<sourceIPs.length; i++){
                await this.getPingInfo(sourceIPs[i].site, sourceIPs[i].source_ip)
            }
        },
        asyncPing: function() {
            if (! this.validateForm()) {
                return
            }

            let sourceIPs = this.selectSourceIPs
            this.pingResult = sourceIPs
            
            // 證明按 Button 有做事 XD
            this.$store.dispatch('global/startLoading')
            setTimeout(function(){ this.$store.dispatch('global/finishLoading') }.bind(this), 500)

            // 異步開打～
            sourceIPs.forEach(async function (item, i) {
                this.getPingInfo(item.site, item.source_ip)
            }.bind(this))
        },
        getPingInfo: function(site, sourceIP) {
            if (! this.validateForm()) {
                this.$store.dispatch(
                    'global/showSnackbarError',
                    'inputs error'
                )
                return
            }
            return this.$store
                .dispatch('ping/getPingInfo', {
                    redirect_by: site,
                    machine_ip: "", // 因全使用 Dummy 後端有 .env，不用指定
                    origin: this.destinationIP,
                    interface: sourceIP,
                    interval: this.interval,
                    count: this.count
                })
                .then(
                    function(result) {
                        let matchedArr = result.data.result.split(this.regexPingResult)

                        this.pingResult.forEach(function (item, i) {
                            if (item.source_ip == sourceIP) {
                                let tmp = this.pingResult[i]
                                
                                tmp.packet_loss = matchedArr[1] ? matchedArr[1] : '100'
                                tmp.time = matchedArr[2]
                                tmp.min = matchedArr[3]
                                tmp.avg = matchedArr[4]
                                tmp.max = matchedArr[5]
                                tmp.mdev = matchedArr[6]
                            }
                        }.bind(this))

                        // this.$store.dispatch(
                        //     'global/showSnackbarSuccess',
                        //     'Success!'
                        // )
                        // this.$store.dispatch('global/finishLoading')
                        return
                    }.bind(this)
                )
                .catch(
                    function(error) {
                        this.$store.dispatch(
                            'global/showSnackbarError',
                            error.message
                        )
                        // this.$store.dispatch('global/finishLoading')
                    }.bind(this)
                )
        },
        makeReportPing: function() {
            if (! this.cpips.length) {
                this.$store.dispatch(
                    'global/showSnackbarError',
                    'inputs cpips error'
                )
                return
            }

            this.$store.dispatch('global/startLoading')
            this.$store
                .dispatch('ping/makeReportPing', {
                    "cpips" : this.cpips
                })
                .then(
                    function(result) {
                        this.$store.dispatch(
                            'global/showSnackbarSuccess',
                            'Success!'
                        )
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
        },
        downloadTwoReportsPing: function() {
            this.downloadReportPing('packetloss')
            this.downloadReportPing('rtt')
        },
        downloadReportPing: function(type) {
            this.$store.dispatch('global/startLoading')
            this.$store
                .dispatch('ping/downloadReportPing', {
                    type: type
                })
                .then(
                    function(result) {
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
                            error
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
        this.getBGP()
        this.getDummy()

        // 刪除 Inbound / Outbound Circuit 紅藍框下巴多餘 html
        document.querySelectorAll(".v-messages").forEach(e => e.parentNode.removeChild(e));
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
