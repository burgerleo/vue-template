<template  lang="pug">
    v-container#sample-layout(grid-list-lg)
        v-layout.mt-n5(wrap)
            v-flex(xs12)
                v-card
                    v-card-text
                        v-form(ref="form" onsubmit="return false;")
                            v-radio-group.mt-n2(v-model='tab' row)
                                v-radio(label="Ping CSV" value="ping_csv")
                        //- v-form(ref="form" onsubmit="return false;" v-show="tab == 'ping_csv'")
                        //-     v-card-text.font-weight-bold.pl-1 Download Analysis:
                        //-     v-layout.mt-1
                        //-         v-flex(xs3 sm3 md3)
                        //-             v-select(:items='pingCsvListGlobal' label='Global CSV' solo='')
                        //-         v-flex(xs3 sm3 md3)
                        //-             v-select(:items='pingCsvListChina' label='China CSV' solo='')
                        //-     v-layout.mt-1
                        
                        v-form(ref="form" onsubmit="return false;" v-show="tab == 'ping_csv'")
                            v-layout
                                v-flex(xs12 sm12 md12)
                                    v-flex
                                        //- /* Global */
                                        v-row(dense)
                                            //- /* OUT R2 Global */
                                            v-col(cols='4' md='4')
                                                v-sheet.d-flex(color='blue lighten-3')
                                                    v-radio-group.mt-0.mb-0(v-model='csvSelected' row)
                                                        v-radio(v-for="g in pingCsvListGlobal" :label="g.label" :value="g.unix + ',G'" :key="g.unix + ',G'")
                                            v-col(cols='1' md='1')
                                            v-col(cols='4' md='4')
                                                v-sheet.d-flex(color='red lighten-3')
                                                    v-radio-group.mt-0.mb-0(v-model='csvSelected' row)
                                                        v-radio(v-for="c in pingCsvListChina" :label="c.label" :value="c.unix + ',C'" :key="c.unix + ',C'")
                                            v-col(cols='1' md='1')
                                            v-col(cols='2' md='2')
                                                v-btn.mt-n3(color="grey lighten-3" block @click="downloadPingTwoAnalysis()") Download

                        
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
            pingCsvListGlobal: [],
            pingCsvListChina: [],

            csvSelected: '',

            // 分頁
            tab: 'ping_csv',
        }
    },
    computed: {
    },
    methods: {
        getPingCsvList: function() {
            this.$store.dispatch('global/startLoading')
            this.$store
                .dispatch('ping/getPingCsvList')
                .then(
                    function(result) {
                        this.$store.dispatch('global/finishLoading')

                        let globals = result.data.global
                        let chinas = result.data.china
                        let globalsKeys = Object.keys(globals)
                        let chinasKeys = Object.keys(chinas)
                        // console.log(globalsKeys, globals)
                        for(let i=0; i<globalsKeys.length; i++){
                            let g = globals[globalsKeys[i]][0]
                            if (g['start_time'] === undefined) {
                                continue
                            }
                            globals[globalsKeys[i]]['unix'] = globalsKeys[i]
                            globals[globalsKeys[i]]['label'] = (g['start_time']+'').slice(5, -3).replace(/-/g, "/") + ' ~ ' + (g['end_time']+'').slice(0, -3) + ' (CPIPs:' + g['cpip_rows'] + ')'
                            this.pingCsvListGlobal.unshift(globals[globalsKeys[i]])
                        }
                        for(let i=0; i<chinasKeys.length; i++){
                            let c = chinas[chinasKeys[i]][0];
                            if (c['start_time'] === undefined) {
                                continue
                            }
                            chinas[chinasKeys[i]]['unix'] = chinasKeys[i]
                            chinas[chinasKeys[i]]['label'] = (c['start_time']+'').slice(5, -3).replace(/-/g, "/") + ' ~ ' + (c['end_time']+'').slice(0, -3) + ' (CPIPs:' + c['cpip_rows'] + ')'
                            this.pingCsvListChina.unshift(chinas[chinasKeys[i]])
                        }
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
        downloadPingTwoAnalysis: function() {
            this.csvSelected
            let info = this.csvSelected.split(','),
                unix = info[0],
                route = info[1]

            this.downloadPingAnalysis(route, 'packetloss', unix)
            this.downloadPingAnalysis(route, 'rtt', unix)
        },
        downloadPingAnalysis: function(route, type, unix) {
            this.$store.dispatch('global/startLoading')
            this.$store
                .dispatch('ping/downloadPingAnalysis', {
                    route: route,
                    type: type,
                    unix: unix,
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
        getFormattedDate(unix) {
            let date = new Date(unix * 1000);

            let str = (date.getMonth() + 1) + "/" + date.getDate() + " " + this.padLeft(date.getHours(), 2) + ":" + this.padLeft(date.getMinutes(), 2)

            return str;
        },
        padLeft(str, len) {
            str = '' + str;
            return str.length >= len ? str : new Array(len - str.length + 1).join("0") + str;
        },
        validateForm: function() {
            return this.$refs.form.validate()
        }
    },
    mounted() {
        this.getPingCsvList()
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
