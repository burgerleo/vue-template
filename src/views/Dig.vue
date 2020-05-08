<template  lang="pug">
    v-container#sample-layout(grid-list-lg)
        v-layout(wrap style='margin-top: -2%;')
            v-flex(xs12)
                v-card
                    v-card-text
                        v-form(ref="form" onsubmit="return false;")
                            v-layout.px-2
                                v-flex.py-6.pt-0.pb-0(xs12 sm12 md12)
                                    v-text-field(v-model="destinationIP" label="Destination FQDN" type="domain" :rules="[rules.required, rules.domain]")
                                    v-text-field(v-model="dnsServerIP" label="DNS Server IP" type="ip" :rules="[rules.required, rules.ip]")
                            v-layout.px-2
                                v-flex.pl-2(xs1 sm1 md1) Options
                                v-flex(xs12 sm12 md12)
                                    v-radio-group(v-model='siteSelectedName' row)
                                        v-radio(v-for="s in site" :label='s.name + ": " + s.ip' :value='s.name' )
                            v-layout(style='margin-top: -0.5%;')
                                v-flex.py-6.pt-0.pb-0(xs8 sm8 md8)
                                    v-text-field(v-model="cliExam" label="Exam CLI Before Sending" readonly)
                                v-flex.py-6.pt-0.pb-0(xs2 sm2 md2)
                                    v-text-field(v-model="siteSelected" label="From" readonly)
                            v-btn(color="primary" block @click="getDigInfo()") SEND
                            v-layout.pt-2(v-show="cliExecuted != false")
                                v-flex.py-6.pt-0.pb-0(xs8 sm8 md8)
                                    v-text-field(v-model="cliExecuted" label="CLI Executed" readonly)
                                v-flex.py-6.pt-0.pb-0(xs2 sm2 md2)
                                    v-text-field(v-model="siteExecuted" label="From" readonly)
                            v-layout.px-2(style='margin-top: -0.5%; margin-bottom: -0.5%;' v-show="cliExecuted != false")
                                v-flex.pt-0.pb-0.pl-0.pr-0(xs12 sm12 md12)
                                    v-card-text.font-weight-bold.pb-0.pl-1 Terminal:
                                    pre(v-highlightjs="digResult")
                                        code.java.display-0.font-weight-black
</template>

<script>
import textFieldRules from '../utils/textFieldRules'

export default {
    name: 'Dig',
    mixins: [textFieldRules],
    data() {
        return {
            site: [{
                    name: 'HK',
                    ip: '172.29.249.103',
                },{
                    name: 'TW',
                    ip: '172.31.249.105',
                },{
                    name: 'PH',
                    ip: '172.30.249.103',
                }],
            siteSelectedName: 'HK',
            siteSelectedIP: '',

            destinationIP: '',
            dnsServerIP: '',

            // output result
            siteNameExecuted: '',
            siteIPExecuted: '',
            cliExecuted: false,
            digResult: '',
        }
    },
    computed: {
        // exam CLI before SEND
        cliExam: function () {
            let cli = 'dig '

            cli += this.dnsServerIP ? this.dnsServerIP : '<DNS Server IP>'
            cli += ' '
            cli += this.destinationIP ? this.destinationIP : '<Destination FQDN>'

            return cli
        },

        siteSelected: function () {
            if (this.siteSelectedName != "") {
                this.siteSelectedIP = this.site.find(function (v) {
                    return v.name == this.siteSelectedName
                }.bind(this)).ip
                
                return this.siteSelectedName + ': ' + this.siteSelectedIP
            }
            return ''
        },

        siteExecuted: function () {
            if (this.siteNameExecuted != "") {
                return this.siteNameExecuted + ': ' + this.siteIPExecuted
            }
            return ''
        },

        
    },
    methods: {
        getDigInfo: function() {
            if (! this.validateForm()) {
                this.$store.dispatch(
                    'global/showSnackbarError',
                    'Inputs Errors.'
                )

                return
            }
            this.$store.dispatch('global/startLoading')
            this.$store
                .dispatch('dig/getDigInfo', {
                    site: this.siteSelectedName,
                    destination_ip: this.destinationIP,
                    dns_server: this.dnsServerIP,
                })
                .then(
                    function(result) {
                        this.digResult = result.data.result
                        this.cliExecuted = this.cliExam
                        this.siteNameExecuted = this.siteSelectedName
                        this.siteIPExecuted = this.siteSelectedIP
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
        },
    },
    mounted() {
        document.title = 'Dig';

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
