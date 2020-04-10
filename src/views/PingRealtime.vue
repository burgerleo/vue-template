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
                                    v-text-field(v-model="interfaceIP" label="Mapped Dummy IP" type="ip" readonly :rules="[rules.required, rules.ip]")
                            v-layout.px-2
                                v-flex(xs6 sm6 md6) In
                                    p.pt-0.pb-0.mb-0(v-for="(site,index) in siteList") {{site}}
                                        v-radio-group.mt-2(v-model="defaultIn" row @change="getDestinationIP()")
                                            v-radio.pt-0.pb-0.mb-0.mr-1(v-for="(inLine,index) in bgpList[site]" :label="inLine.name" :value="inLine.id" :key="inLine.id")
                                v-flex(xs6 sm6 md6) Out
                                    p.pt-0.pb-0.mb-0(v-for="(site,index) in siteList") {{site}}
                                        v-radio-group.mt-2(v-model="defaultOut" row @change="getDestinationIP()")
                                            v-radio.pt-0.pb-0.mb-0.mr-1(v-for="(inLine,index) in bgpList[site]" :label="inLine.name" :value="inLine.id" :key="inLine.id")
                            //- v-text-field(v-model="count" label="Count" type="number" min="1" max="300")
                            //- v-text-field(v-model="interval" label="Interval (1+) " type="number")
                            v-divider
                            br
                            v-layout.px-2
                                v-flex(xs8 sm8 md8)
                                    v-text-field(v-model="mapCli" label="CLI" readonly)
                                v-flex(xs4 sm4 md4)
                                    v-text-field(v-model="siteComputed" label="From" readonly)
                            v-layout.px-2
                                v-flex(xs6 sm6 md6)
                                    v-btn(color="light-blue" block @click="websocketsend()" :disabled="isBtnDisabled") SEND
                                v-flex(xs6 sm6 md6)
                                    v-btn(color="grey lighten-1" block @click="websocketstop()") STOP
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
            site: '',
            destinationIP: "",
            interfaceIP: "",
            // count: 10,
            // interval: 1,
            pingBody: [],

            defaultIn: null,
            defaultOut: null,

            siteList: {},
            dummy: {},
            originBGPList: {},
            bgpList: {},

            ws_uri: "ws://172.31.251.103:8888/octopus-ping", // process.env.WS_URL,
            websock: null,

            isBtnDisabled: false
        }
    },
    computed: {
        pingBodyFormatted: function () {
            return this.pingBody.join('\n');
        },
        mapCli: function () {
            let tmpDestinationIP = this.destinationIP ? this.destinationIP : "x.x.x.x";
            let tmpInterfaceIP = this.interfaceIP ? this.interfaceIP : "x.x.x.x";
            return "ping  " + tmpDestinationIP + "  -I  " + tmpInterfaceIP + "  -i  1";
        },
        siteComputed () {
            return this.interfaceIP ? this.site : "";
        },
    },
    watch: {
        pingURL: function() {
            this.validateForm()
        }
    },
    methods: {
        getBGP: function() {
            this.$store.dispatch('global/startLoading')
            this.$store
                .dispatch('bgp/getInfo')
                .then(
                    function(result) {
                        var bgpList = []
                        var siteList = []
                        var originBGPList = {}

                        result.data.forEach(function(item, index) {
                            if (!bgpList[item.site]) {
                                bgpList[item.site] = []
                                siteList.push(item.site)
                            }
                            bgpList[item.site].push(item)

                            originBGPList[item.id] = item
                        })

                        this.siteList = siteList
                        this.bgpList = bgpList
                        this.originBGPList = originBGPList

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
        getDummy() {
            this.$store.dispatch('global/startLoading')
            this.$store
                .dispatch('dummy/getInfo')
                .then(
                    function(result) {
                        var dummyList = {}

                        result.data.map(function(item, index) {
                            var site = item.in_bgp.site
                            var inLine = item.in_bgp.id
                            var outLine = item.out_bgp.id
                            var ip = item.source_ip

                            if (!dummyList[site]) {
                                dummyList[site] = {}
                            }

                            if (!dummyList[site][inLine]) {
                                dummyList[site][inLine] = {}
                            }
                            dummyList[site][inLine][outLine] = ip
                        })

                        this.dummy = dummyList

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
        getDestinationIP: function() {
            this.site = this.originBGPList[this.defaultIn].site

            if (this.dummy[this.site][this.defaultIn]) {
                // [site][in][out]
                this.interfaceIP = this.dummy[this.site][this.defaultIn][
                    this.defaultOut
                ]
            }

            if (!this.interfaceIP) {
                this.interfaceIP = ''
            }
        },
        // getPingInfo: function() {
        //     if (this.validateForm()) {
        //         this.$store.dispatch('global/startLoading')
        //         this.$store
        //             .dispatch('ping/getPingInfo', {
        //                 site: this.site,
        //                 destination_ip: this.destinationIP,
        //                 interface_ip: this.interfaceIP,
        //                 interval: this.interval,
        //                 count: this.count
        //             })
        //             .then(
        //                 function(result) {
        //                     this.pingBody = result.data
        //                     this.$store.dispatch(
        //                         'global/showSnackbarSuccess',
        //                         'Success!'
        //                     )
        //                     this.$store.dispatch('global/finishLoading')
        //                 }.bind(this)
        //             )
        //             .catch(
        //                 function(error) {
        //                     this.$store.dispatch(
        //                         'global/showSnackbarError',
        //                         error.message
        //                     )
        //                     this.$store.dispatch('global/finishLoading')
        //                 }.bind(this)
        //             )
        //     }
        // },
        validateForm: function() {
            return this.$refs.form.validate()
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
            if ( !this.destinationIP || !this.interfaceIP || !this.site) {
                this.$store.dispatch(
                    'global/showSnackbarError',
                    'Oops. Some required fields were left ..'
                )
                return
            }
            this.websocketstop();
            this.isBtnDisabled = true;
            setTimeout(()=>{
                this.pingBody = [];
                
                let actions = {
                    country: this.site,
                    destination_ip: this.destinationIP,
                    interface_ip: this.interfaceIP,
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
            let str = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +  date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

            return str;
        },
    },
    mounted() {
        // this.init()
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
</style>