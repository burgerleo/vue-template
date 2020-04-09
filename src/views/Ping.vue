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
                                    v-text-field(v-model="sourceIP" label="Mapped Dummy IP" type="ip" readonly :rules="[rules.required, rules.ip]")
                            v-layout.px-2
                                v-flex(xs6 sm6 md6) In
                                    p.pt-0.pb-0.mb-0(v-for="(site,index) in siteList") {{site}}
                                        v-radio-group.mt-2(v-model="defaultIn" row @change="getOriginIP()")
                                            v-radio.pt-0.pb-0.mb-0.mr-1(v-for="(inLine,index) in bgpList[site]" :label="inLine.name" :value="inLine.id" :key="inLine.id")
                                v-flex(xs6 sm6 md6) Out
                                    p.pt-0.pb-0.mb-0(v-for="(site,index) in siteList") {{site}}
                                        v-radio-group.mt-2(v-model="defaultOut" row @change="getOriginIP()")
                                            v-radio.pt-0.pb-0.mb-0.mr-1(v-for="(inLine,index) in bgpList[site]" :label="inLine.name" :value="inLine.id" :key="inLine.id")
                            v-text-field(v-model="packetCount" label="Count" type="number" min="1" max="100")
                            v-text-field(v-model="interval" label="Interval (0.2~) " type="number" min="0.2" step="0.1")
                            v-btn(color="primary" block @click="getPingInfo()") SEND
                            v-layout.px-2
                                v-flex.pt-0.pb-0.pl-0.pr-0(xs12 sm12 md12)
                                    v-card-text.font-weight-bold.pb-0.pl-1 Body:
                                    pre(v-highlightjs="pingBody")
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
            originIP: null,
            sourceIP: null,
            packetCount: 10,
            interval: 0.5,
            pingBody: null,

            defaultIn: null,
            defaultOut: null,

            siteList: {},
            dummy: {},
            originBGPList: {},
            bgpList: {}
        }
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
        getOriginIP: function() {
            this.site = this.originBGPList[this.defaultIn].site

            if (this.dummy[this.site][this.defaultIn]) {
                // [site][in][out]
                this.sourceIP = this.dummy[this.site][this.defaultIn][
                    this.defaultOut
                ]
            }

            if (!this.sourceIP) {
                this.sourceIP = 'No Mapping IP'
            }
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
        this.getBGP()
        this.getDummy()
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
