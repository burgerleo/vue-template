<template  lang="pug">
    v-container#sample-layout(grid-list-lg)
        v-layout(wrap style='margin-top: -2%;')
            v-flex(xs12)
                v-card
                    v-card-text
                        v-form(ref="form" onsubmit="return false;")
                            v-layout.px-2
                                v-flex.py-6.pt-0.pb-0(xs12 sm12 md12)
                                    v-text-field(v-model="destinationIP" label="Destination FQDN")
                            v-layout(style='margin-top: -0.5%;')
                                v-flex.py-6.pt-0.pb-0(xs8 sm8 md8)
                                    v-text-field(v-model="cliExam" label="Exam CLI Before Sending" readonly)
                                v-flex.py-6.pt-0.pb-0(xs2 sm2 md2)
                                    v-text-field(v-model="site" label="From" readonly)
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
            site: 'TW',

            destinationIP: '',

            // output result
            siteExecuted: 'TW',
            cliExecuted: false,
            digResult: '',
        }
    },
    computed: {
        // exam CLI before SEND
        cliExam: function () {
            let cli = 'dig '

            cli += this.destinationIP ? this.destinationIP : 'x.x.x.x'

            return cli
        },
    },
    methods: {
        getDigInfo: function() {
            this.$store.dispatch('global/startLoading')
            this.$store
                .dispatch('dig/getDigInfo', {
                    // site: this.site,
                    destination_ip: this.destinationIP,
                })
                .then(
                    function(result) {
                        this.digResult = result.data.result
                        this.cliExecuted = this.cliExam
                        // this.siteExecuted = this.site
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
