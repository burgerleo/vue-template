<template  lang="pug">
    v-container#sample-layout(grid-list-lg)
        v-layout(wrap)
            v-flex(xs12)
                v-card
                    v-card-text
                        v-form(ref="form" onsubmit="return false;")
                            v-layout.px-2
                                v-flex.py-6.pt-0.pb-0(xs12 sm12 md12)
                                    v-text-field(v-model="destinationIP" label="Destination IP" type="ip" name="ip" :rules="[rules.required, rules.ip]")
                                    v-text-field(v-model="sourceIP" label="Select Source IP as Below" readonly type="ip" :rules="[rules.required, rules.ip]")
                            v-layout.px-2
                                v-flex.py-6.pt-0.pb-0(xs12 sm12 md12)
                                    //- /* HEAD */
                                    v-row.flex-child
                                        v-col.d-flex(md='6' style='padding-left:20%;')
                                            | Inbound Circuit
                                        v-col.d-flex(md='6' style='padding-left:12%;')
                                            | Outbound Circuit
                                    //- /* R1 R2 */
                                    v-row.flex-child
                                        v-col(cols='1' md='1' dense='')
                                        v-col.d-flex(md='2' style='padding-left:7%;')
                                            | R1
                                        v-col.d-flex(md='2' style='padding-left:7%;')
                                            | R2
                                        v-col(cols='1' md='1' dense='')
                                        v-col.d-flex(md='2' style='padding-left:7%;')
                                            | R1
                                        v-col.d-flex(md='2' style='padding-left:7%;')
                                            | R2
                                    //- /* HK China */
                                    v-row.flex-child(dense='' style='margin-bottom: -1.2%;')
                                        //- /* HK IN R1 China */
                                        v-col(cols='1' md='1' dense='')
                                        v-col(cols='2' md='2')
                                            v-sheet.d-flex(color='red lighten-3' height='auto')
                                                v-radio-group(v-model='inboundID' row='')
                                                    v-radio(v-for="bgp in hkr1c" :label="bgp.isp" :value="bgp.id" :key="bgp.id")
                                        //- /* HK IN R2 China */
                                        v-col(cols='2' md='2')
                                            v-sheet.d-flex(color='red lighten-3' height='auto')
                                                v-radio-group(v-model='inboundID' row='')
                                                    v-radio(v-for="bgp in hkr2c" :label="bgp.isp" :value="bgp.id" :key="bgp.id")
                                        //- /* HK OUT R1 China */
                                        v-col(cols='1' md='1' dense='')
                                        v-col(cols='2' md='2')
                                            v-sheet.d-flex(color='red lighten-3' height='auto')
                                                v-radio-group(v-model='outboundID' row='')
                                                    v-radio(v-for="bgp in hkr1c" :label="bgp.isp" :value="bgp.id" :key="bgp.id")
                                        //- /* HK OUT R2 China */
                                        v-col(cols='2' md='2')
                                            v-sheet.d-flex(color='red lighten-3' height='auto')
                                                v-radio-group(v-model='outboundID' row='')
                                                    v-radio(v-for="bgp in hkr2c" :label="bgp.isp" :value="bgp.id" :key="bgp.id")
                                    //- /* HK */
                                    v-row.flex-child(dense='')
                                        v-col(cols='1' md='1')
                                            v-sheet.d-flex(style='padding-left: 35%;') HK
                                    //- /* HK Global */
                                    v-row.flex-child(dense='' style='margin-top: -1.2%;')
                                        //- /* HK IN R1 Global */
                                        v-col(cols='1' md='1' dense='')
                                        v-col(cols='2' md='2')
                                            v-sheet.d-flex(color='blue lighten-3' height='auto')
                                                v-radio-group(v-model='inboundID' row='')
                                                    v-radio(v-for="bgp in hkr1g" :label="bgp.isp" :value="bgp.id" :key="bgp.id")
                                        //- /* HK IN R2 Global */
                                        v-col(cols='2' md='2')
                                            v-sheet.d-flex(color='blue lighten-3' height='auto')
                                                v-radio-group(v-model='inboundID' row='')
                                                    v-radio(v-for="bgp in hkr2g" :label="bgp.isp" :value="bgp.id" :key="bgp.id")
                                        //- /* HK OUT R1 Global */
                                        v-col(cols='1' md='1' dense='')
                                        v-col(cols='2' md='2')
                                            v-sheet.d-flex(color='blue lighten-3' height='auto')
                                                v-radio-group(v-model='outboundID' row='')
                                                    v-radio(v-for="bgp in hkr1g" :label="bgp.isp" :value="bgp.id" :key="bgp.id")
                                        //- /* HK OUT R2 Global */
                                        v-col(cols='2' md='2')
                                            v-sheet.d-flex(color='blue lighten-3' height='auto')
                                                v-radio-group(v-model='outboundID' row='')
                                                    v-radio(v-for="bgp in hkr2g" :label="bgp.isp" :value="bgp.id" :key="bgp.id")
                                        v-col(cols='1' md='1' dense='')
                                    //- /* HK divider */
                                    v-divider(dark)
                                    //- /* TW China */
                                    v-row.flex-child(dense='' style='margin-bottom: -1.2%;')
                                        //- /* TW IN R1 China */
                                        v-col(cols='1' md='1' dense='')
                                        v-col(cols='2' md='2')
                                            v-sheet.d-flex(color='red lighten-3' height='auto')
                                                v-radio-group(v-model='inboundID' row='')
                                                    v-radio(v-for="bgp in twr1c" :label="bgp.isp" :value="bgp.id" :key="bgp.id")
                                        //- /* TW IN R2 China */
                                        v-col(cols='2' md='2')
                                            v-sheet.d-flex(color='red lighten-3' height='auto')
                                                v-radio-group(v-model='inboundID' row='')
                                                    v-radio(v-for="bgp in twr2c" :label="bgp.isp" :value="bgp.id" :key="bgp.id")
                                        //- /* TW OUT R1 China */
                                        v-col(cols='1' md='1' dense='')
                                        v-col(cols='2' md='2')
                                            v-sheet.d-flex(color='red lighten-3' height='auto')
                                                v-radio-group(v-model='outboundID' row='')
                                                    v-radio(v-for="bgp in twr1c" :label="bgp.isp" :value="bgp.id" :key="bgp.id")
                                        //- /* TW OUT R2 China */
                                        v-col(cols='2' md='2')
                                            v-sheet.d-flex(color='red lighten-3' height='auto')
                                                v-radio-group(v-model='outboundID' row='')
                                                    v-radio(v-for="bgp in twr2c" :label="bgp.isp" :value="bgp.id" :key="bgp.id")
                                    //- /* TW */
                                    v-row.flex-child(dense='')
                                        v-col(cols='1' md='1')
                                            v-sheet.d-flex(style='padding-left: 35%;') TW
                                    //- /* TW Global */
                                    v-row.flex-child(dense='' style='margin-top: -1.2%;')
                                        //- /* TW IN R1 Global
                                        v-col(cols='1' md='1' dense='')
                                        v-col(cols='2' md='2')
                                            v-sheet.d-flex(color='blue lighten-3' height='auto')
                                                v-radio-group(v-model='inboundID' row='')
                                                    v-radio(v-for="bgp in twr1g" :label="bgp.isp" :value="bgp.id" :key="bgp.id")
                                        //- /* TW IN R2 Global */
                                        v-col(cols='2' md='2')
                                            v-sheet.d-flex(color='blue lighten-3' height='auto')
                                                v-radio-group(v-model='inboundID' row='')
                                                    v-radio(v-for="bgp in twr2g" :label="bgp.isp" :value="bgp.id" :key="bgp.id")
                                        //- /* TW OUT R1 Global */
                                        v-col(cols='1' md='1' dense='')
                                        v-col(cols='2' md='2')
                                            v-sheet.d-flex(color='blue lighten-3' height='auto')
                                                v-radio-group(v-model='outboundID' row='')
                                                    v-radio(v-for="bgp in twr1g" :label="bgp.isp" :value="bgp.id" :key="bgp.id")
                                        //- /* TW OUT R2 Global */
                                        v-col(cols='2' md='2')
                                            v-sheet.d-flex(color='blue lighten-3' height='auto')
                                                v-radio-group(v-model='outboundID' row='')
                                                    v-radio(v-for="bgp in twr2g" :label="bgp.isp" :value="bgp.id" :key="bgp.id")
                                    //- /* TW divider */
                                    v-divider(dark)
                                    //- /* PH China */
                                    v-row.flex-child(dense='' style='margin-bottom: -1.2%;')
                                        //- /* PH IN R1 China */
                                        v-col(cols='1' md='1' dense='')
                                        v-col(cols='2' md='2')
                                            v-sheet.d-flex(color='red lighten-3' height='auto')
                                                v-radio-group(v-model='inboundID' row='')
                                                    v-radio(v-for="bgp in phr1c" :label="bgp.isp" :value="bgp.id" :key="bgp.id")
                                        //- /* PH IN R2 China */
                                        v-col(cols='2' md='2')
                                            v-sheet.d-flex(color='red lighten-3' height='auto')
                                                v-radio-group(v-model='inboundID' row='')
                                                    v-radio(v-for="bgp in phr2c" :label="bgp.isp" :value="bgp.id" :key="bgp.id")
                                        v-col(cols='1' md='1' dense='')
                                        //- /* PH OUT R1 China */
                                        v-col(cols='2' md='2')
                                            v-sheet.d-flex(color='red lighten-3' height='auto')
                                                v-radio-group(v-model='outboundID' row='')
                                                    v-radio(v-for="bgp in phr1c" :label="bgp.isp" :value="bgp.id" :key="bgp.id")
                                        //- /* PH OUT R2 China */
                                        v-col(cols='2' md='2')
                                            v-sheet.d-flex(color='red lighten-3' height='auto')
                                                v-radio-group(v-model='outboundID' row='')
                                                    v-radio(v-for="bgp in phr2c" :label="bgp.isp" :value="bgp.id" :key="bgp.id")
                                        v-col(cols='1' md='1' dense='')
                                    //- /* PH */
                                    v-row.flex-child(dense='')
                                        v-col(cols='1' md='1')
                                            v-sheet.d-flex(style='padding-left: 35%;') PH
                                    //- /* PH Global */
                                    v-row.flex-child(dense='' style='margin-top: -1.2%;')
                                        //- /* PH IN R1 Global */
                                        v-col(cols='1' md='1' dense='')
                                        v-col(cols='2' md='2')
                                            v-sheet.d-flex(color='blue lighten-3' height='auto')
                                                v-radio-group(v-model='inboundID' row='')
                                                    v-radio(v-for="bgp in phr1g" :label="bgp.isp" :value="bgp.id" :key="bgp.id")
                                        //- /* PH IN R2 Global */
                                        v-col(cols='2' md='2')
                                            v-sheet.d-flex(color='blue lighten-3' height='auto')
                                                v-radio-group(v-model='inboundID' row='')
                                                    v-radio(v-for="bgp in phr2g" :label="bgp.isp" :value="bgp.id" :key="bgp.id")
                                        //- /* PH OUT R1 Global */
                                        v-col(cols='1' md='1' dense='')
                                        v-col(cols='2' md='2')
                                            v-sheet.d-flex(color='blue lighten-3' height='auto')
                                                v-radio-group(v-model='outboundID' row='')
                                                    v-radio(v-for="bgp in phr1g" :label="bgp.isp" :value="bgp.id" :key="bgp.id")
                                        //- /* PH OUT R2 Global */
                                        v-col(cols='2' md='2')
                                            v-sheet.d-flex(color='blue lighten-3' height='auto')
                                                v-radio-group(v-model='outboundID' row='')
                                                    v-radio(v-for="bgp in phr2g" :label="bgp.isp" :value="bgp.id" :key="bgp.id")
                            v-divider
                            br
                            //- v-layout.px-2
                                v-flex(xs8 sm8 md8)
                                    v-text-field(v-model="mapCli" label="CLI" readonly)
                                v-flex(xs4 sm4 md4)
                                    v-text-field(v-model="siteComputed" label="From" readonly)
                            v-layout.px-2
                                v-flex(xs4 sm4 md4)
                                    v-btn(color="light-blue" block @click="websocketsend()" :disabled="isBtnDisabled") SEND
                                v-flex(xs4 sm4 md4)
                                    v-btn(color="red lighten-1" block @click="websocketstop()") STOP
                                v-flex(xs4 sm4 md4)
                                    v-btn(color="grey lighten-1" block @click="clearTerminal()") Clear
                            v-layout.px-2
                                v-flex.pt-0.pb-0.pl-0.pr-0(xs12 sm12 md12 fill-height)
                                    v-card-text.font-weight-bold.pb-0.pl-1 Terminal:
                                    pre.formatted(v-highlightjs="pingBodyFormatted" height="100")
                                        code.java.display-0.font-weight-black
</template>

<script>
import textFieldRules from '../utils/textFieldRules'

export default {
    name: 'Ping',
    mixins: [textFieldRules],
    data() {
        return {
            // from apis
            bgpList: [],
            dummyList: [],

            // v-model: Inbound / Outbound Circuit
            inboundID: 0,
            outboundID: 0,

            site: '',
            destinationIP: null,
            // count: 10,
            // interval: 1,

            pingBody: [],

            // websocket
            ws_uri: "ws://172.31.251.103:8888/octopus-ping", // process.env.WS_URL,
            websock: null,

            // websocket send - cool down
            isBtnDisabled: false,
        }
    },
    // data() {
    //     return {
    //         site: '',
    //         destinationIP: "",
    //         interfaceIP: "",
    //         // count: 10,
    //         // interval: 1,
    //         pingBody: [],

    //         defaultIn: null,
    //         defaultOut: null,

    //         siteList: {},
    //         dummy: {},
    //         originBGPList: {},
    //         bgpList: {},

    //         ws_uri: "ws://172.31.251.103:8888/octopus-ping", // process.env.WS_URL,
    //         websock: null,

    //         isBtnDisabled: false
    //     }
    // },
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
        
        // output logic
        pingBodyFormatted: function () {
            return this.pingBody.join('\n');
        },

        // exam before SEND "Cli" <input>
        mapCli: function () {
            let tmpDestinationIP = this.destinationIP ? this.destinationIP : "x.x.x.x";
            let tmpSourceIP = this.sourceIP ? this.sourceIP : "x.x.x.x";
            return "ping  " + tmpDestinationIP + "  -I  " + tmpSourceIP + "  -i  1";
        },

        // exam before SEND "From" <input>
        siteComputed () {
            return this.sourceIP ? this.site : "";
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

        // WebSocket ++
        initWebSocket(){ //初始化 websocket
            // console.log(this.ws_uri);
            this.websock = new WebSocket(this.ws_uri);
            this.websock.onmessage = this.websocketonmessage;
            this.websock.onerror = this.websocketonerror;
            this.websock.onclose = this.websocketclose;
        },
        websocketonerror(){ //連接失敗重新連線
            this.initWebSocket();
        },
        websocketonmessage(msg){ //接收數據
            // console.log(msg.data);
            let lines = msg.data.split("\\n");
            let tmp = this.pingBody;

            lines.forEach( line => {
                if (line.length >0 ) 
                    tmp.push(this.getFormattedDate() + " " +line);
            });
            
            if (tmp.length > 10) {
                tmp.splice(1, 1);
            }
            this.pingBody = tmp;
        },
        websocketsend(){ //發送數據
            if (! this.validateForm()) {
                return
            }
            this.websocketstop();
            this.isBtnDisabled = true;
            setTimeout(()=>{
                this.pingBody = [];
                
                let actions = {
                    country: this.site,
                    destination_ip: this.destinationIP,
                    interface_ip: this.sourceIP,
                    interval: 1,
                };
                // console.log(JSON.stringify(actions));
                this.websock.send(JSON.stringify(actions));
            }, 1300);

            // 避免大量點擊
            setTimeout(()=>{
                this.isBtnDisabled = false; // 開放再次 SEND
            }, 3000);
        },
        websocketstop(){ //暫停發送數據
            let actions = {
                interval: 0,
            };
            // console.log(JSON.stringify(actions));
            this.websock.send(JSON.stringify(actions));
        },
        websocketclose(e){ //關閉
            // console.log('關閉連接',e);
        },
        getFormattedDate() {
            let date = new Date();

            let str = date.getFullYear() + "-" +
            this.padLeft((date.getMonth() + 1), 2) + "-" +
            this.padLeft(date.getDate(), 2) + " " +
            this.padLeft(date.getHours(), 2) + ":" +
            this.padLeft(date.getMinutes(), 2) + ":" +
            this.padLeft(date.getSeconds(), 2);

            return str;
        },
        padLeft(str, len) {
            str = '' + str;
            return str.length >= len ? str : new Array(len - str.length + 1).join("0") + str;
        },
        clearTerminal() {
            this.pingBody = this.pingBody.slice(0, 1);
        },
        validateForm: function() {
            return this.$refs.form.validate()
        }
    },
    mounted() {
        document.title = 'Ping Realtime';
        
        this.getBGP()
        this.getDummy()

        this.initWebSocket(); // 連線 websocket
    },
    destroyed() {
        this.websock.close() // 關閉時斷開 websocket
    },
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