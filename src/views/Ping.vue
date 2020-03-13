<template  lang="pug">
    v-container#sample-layout(grid-list-lg)
        v-layout(wrap)
            v-flex(xs12)
                .title Ping Tool
            v-flex(xs12)
                v-card
                    v-card-text
                        v-form(ref="form" onsubmit="return false;")
                            v-layout(wrap)
                                v-flex.py-6.pt-0.pb-0(xs12 sm6 md6)
                                    v-text-field(v-model="pingURL" label="URL" type="" name="url" :rules="[rules.required, rules.url]")
                                v-flex.py-6.pt-0.pb-0(xs12 sm6 md6)
                                    v-select(v-model="sourceIP" :items="sourceIPList" label="Source IP" item-text="name" item-value="id" )
                                    //- v-text-field(v-model="sourceIP" label="Source IP" type="" name="ip" :rules="[rules.required, rules.ip]")
                                v-flex.pt-0.pb-0(xs12)
                                    v-btn(color="primary" block @click="getPingInfo()") SEND

                                v-flex.pt-0.pb-0(xs12)
                                    v-card-text.font-weight-bold.pb-0 Ping Body:
                                    pre(v-highlightjs="pingBody")
                                        code.bash
</template>

<script>
import textFieldRules from '../utils/textFieldRules'

export default {
    name: 'Test',
    mixins: [textFieldRules],
    data() {
        return {
            pingURL: '',
            sourceIP: '10.88.55.122',
            sourceIPList: [
                '10.88.55.122',
                '10.88.1.1',
                '127.0.0.1',
                '192.168.0.1'
            ],

            pingBody: ''
        }
    },
    watch: {
        pingURL: function() {
            this.checkoutForm()
        }
    },
    methods: {
        getPingInfo: function() {
            if (this.checkoutForm()) {
                // do things...
            }
        },
        checkoutForm: function() {
            return this.$refs.form.validate()
        }
    }
}
</script>

<style lang="sass" scoped>
.hljs
    display: block
    color: #abb2bf
    background: #282c34
</style>