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
                                v-flex(xs12 sm12 md12)
                                    v-btn.mt-n3(color="primary" block @click="syncPing()") SYNC ({{selectSourceIPs.length * count * interval}} s)
                                //- v-flex(xs6 sm6 md6)
                                //-     v-btn.mt-n3(color="primary" block @click="asyncPing()") ASYNC
                            v-layout.pt-2(v-show="cliExecuted != false")
                                v-flex(xs8 sm8 md8)
                                    v-text-field(v-model="cliExecuted" label="CLI Executed" readonly)
                                v-flex(xs2 sm2 md2)
                                    v-text-field(v-model="siteExecuted" label="From" readonly)
                            v-layout.mt-n5(v-show='pingResult.length > 0')
                                v-flex(xs12 sm12 md12)
                                    v-card-text.font-weight-bold.pb-0.pl-1 Results:
                                    DataTable2(ref="table2" :headers="headers" :items="pingResult" :itemsPerPage="itemsPerPage" :itemsPerPageList="itemsPerPageList" :searchList="searchList")
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

            // Sort Inbound / Outbound Circuit
            sort: ['HK', 'TW', 'PH'],

            // v-model: Inbound / Outbound Circuit
            boundInfo: '',

            // v-model: other input
            site: '',
            destinationIP: null,
            count: 10,
            interval: 0.5,

            // regex
            regex: /(\d+)% packet loss, time (\d+)ms\nrtt min\/avg\/max\/mdev = ([0-9.]+)\/([0-9.]+)\/([0-9.]+)\/([0-9.]+) ms/g,

            // output result
            siteExecuted: '',
            cliExecuted: false,
            pingResult: [],

            // datatable2
            itemsPerPage: 15,
            itemsPerPageList: [15, 50],
            searchList: {},
            headers: [
                {
                    text: '#',
                    align: 'center',
                    sortable: false,
                    width: '50px',
                    value: 'index'
                },
                {
                    text: 'Site',
                    align: 'center',
                    sortable: false,
                    width: '70px',
                    value: 'site'
                },
                {
                    text: 'In',
                    align: 'center',
                    sortable: true,
                    width: '130px',
                    value: 'in_name'
                },
                {
                    text: 'Out',
                    align: 'center',
                    sortable: true,
                    width: '130px',
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
                    width: '150px',
                    value: 'packet_loss',
                },
                {
                    text: 'Time(ms)',
                    align: 'center',
                    sortable: true,
                    width: '120px',
                    value: 'time'
                },
                {
                    text: 'Min(ms)',
                    align: 'center',
                    sortable: true,
                    width: '120px',
                    value: 'min'
                },
                {
                    text: 'Avg(ms)',
                    align: 'center',
                    sortable: true,
                    width: '120px',
                    value: 'avg'
                },
                {
                    text: 'Max(ms)',
                    align: 'center',
                    sortable: true,
                    width: '120px',
                    value: 'max'
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
                                site: item.site
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
                            // delete item.id
                            // delete item.jkb_task_id
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
            this.$store.dispatch('global/startLoading')
            for(let i=0; i<sourceIPs.length; i++){
                let result = await this.getPingInfo(sourceIPs[i].site, sourceIPs[i].source_ip)
                // console.log(result)

                // 正規表達式擷取資訊
                let arr = result.split(this.regex)
                sourceIPs[i].packet_loss = arr[1] ? arr[1] : '100'
                sourceIPs[i].time = arr[2]
                sourceIPs[i].min = arr[3]
                sourceIPs[i].avg = arr[4]
                sourceIPs[i].max = arr[5]
                sourceIPs[i].mdev = arr[6]
            }
            this.$store.dispatch('global/finishLoading')
            console.table(sourceIPs)
            this.pingResult = sourceIPs
        },
        asyncPing: function() {
            if (! this.validateForm()) {
                return
            }

            let sourceIPs = this.selectSourceIPs
            sourceIPs.forEach(async function (item, i) {
                let result = await this.getPingInfo(item.site, item.source_ip)

                // 正規表達式擷取資訊
                let arr = await result.split(this.regex)
                sourceIPs[i].packet_loss = await arr[1]
                sourceIPs[i].time = await arr[2]
                sourceIPs[i].min = await arr[3]
                sourceIPs[i].avg = await arr[4]
                sourceIPs[i].max = await arr[5]
                sourceIPs[i].mdev = await arr[6]
            }.bind(this))
            // console.table(sourceIPs)
            this.pingResult = JSON.stringify(sourceIPs)
        },
        getPingInfo: async function(site, sourceIP) {
            if (! this.validateForm()) {
                return 'inputs error'
            }
            // this.$store.dispatch('global/startLoading')
            return await this.$store
                .dispatch('ping/getPingInfo', {
                    redirect_by: site,
                    machine_ip: "", // 因全使用 Dummy 後端有 .env，不用指定
                    origin: this.destinationIP,
                    interface: sourceIP,
                    interval: this.interval,
                    count: this.count
                })
                .then(
                    async function(result) {
                        return await result.data.result
                        this.$store.dispatch(
                            'global/showSnackbarSuccess',
                            'Success!'
                        )
                        // this.$store.dispatch('global/finishLoading')
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
        validateForm: function() {
            return this.$refs.form.validate()
        }
    },
    mounted() {
        document.title = 'Ping Multiple';

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
