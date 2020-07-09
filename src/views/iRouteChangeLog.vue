<template lang="pug">
    v-container
        v-row
            v-tabs.pt-0(v-model="tab" background-color="primary" dark dense )
                v-tab(v-for="tab in tabs" :key="tab.name") {{ tab.name }}

            v-toolbar(flat white dense)
                v-radio-group(v-show="tab==0" v-model="pageCount" row hide-details dense) {{"&nbsp"}} Maximum items displayed: {{"&nbsp"}}
                    v-radio(v-for="count in countList" :label="count + ' items' " :value="count")

                v-radio-group(v-show="tab==1" v-model="day" row hide-details dense) {{"&nbsp"}} History Day: {{"&nbsp"}}
                    v-radio(v-for="day in dayList" :label="day +' Days' " :value="day")

                v-spacer

                div.pr-4 Reflash: {{totalTime}}s
                v-btn.mb-2.mr-2(color="primary" dark @click="init")
                    v-icon mdi-refresh
        v-row
            v-col(cols="12")
                h3.pd-0 Logs : 
                div(v-show="tab == 0")
                    InstantText(ref="textbox" hideLineCountBar hideTextSizeBar :stringKeys="stringKeys" :defaultLineCount="pageCount")
                div(v-show="tab == 1")
                    InstantText(ref="textbox2" hideLineCountBar hideTextSizeBar :stringKeys="stringKeys" :defaultLineCount="pageCount2" :lineCountRange="lineCountRange2" :bufferSize="0" )
</template>

<script>
import textFieldRules from '../utils/textFieldRules'
import dateFormat from '../utils/dateFormat'
import checkPage from '../utils/checkPage'
import InstantText from '../components/InstantText'

export default {
    name: 'fqdnChange',
    mixins: [textFieldRules, dateFormat, checkPage],

    components: { InstantText },
    data() {
        return {
            tab: 0,
            tabs: [{ name: 'Latest' }, { name: 'History' }],
            
            // Latest page
            pageCount: 20,
            countList: [20, 50],
            // Latest page

            // History page
            pageCount2: 10000,
            day: 1,
            dayList: [1, 2],
            lineCountRange2: [10000, 10000],
            // History page

            timer: null,
            totalTime: 60,

            stringKeys: [
                {
                    value: 'created_at', // 要顯示的 Key
                    color: '', // 顏色 可接受 vuetify cass name or 色碼(開頭要有# 號)
                    space: true, //是否要保留文字後面的空白
                    default: '' //在文字的最後補上的字元
                },
                {
                    value: 'source',
                    color: '#fff59d',
                    space: true
                },
                {
                    value: 'domain',
                    color: 'red--text text--lighten-2',
                    space: true
                },
                {
                    value: 'changed_from_cname',
                    space: true
                },
                {
                    value: 'changeIcon',
                    default: '⇨',
                    space: true
                },
                {
                    value: 'changed_to_cname',
                    space: false
                }
            ]
        }
    },
    watch: {
        tab(value) {
            this.resetTimer()
            value == 0 ? this.getLogByLatest() : this.getLogByDay()
        },
        day() {
            this.getLogByDay()
        }
    },
    methods: {
        setTime() {
            var startTime = new Date()
            startTime.setDate(startTime.getDate() - this.day)
            var endTime = new Date()

            return {
                start_time: this.dateFormat2(startTime),
                end_time: this.dateFormat2(endTime)
            }
        },
        getLogByDay() {
            var time = this.setTime()
            this.getLog(time, 1)
        },
        getLogByLatest() {
            this.getLog({ lastCount: 50 }, 0)
        },
        getLog(data, type = 0) {
            this.$store.dispatch('global/startLoading')
            this.$store
                .dispatch('changeLog/getLog', data)
                .then(
                    function(result) {
                        this.transformLog(result.data, type)
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
        transformLog(changeLogs, type = 0) {
            var logList = []

            // 轉換資料數量
            changeLogs.map(function(logs) {
                logs.domains.map(function(item, index) {
                    logList.push({
                        domain: logs.domains[index],
                        source: 'iRouteCDN',
                        changed_from_cname: logs.changed_from.cdns[index],
                        changed_from_provider_name:
                            logs.changed_from.cdn_provider_name,
                        changed_to_cname: logs.changed_to.cdns[index],
                        changed_to_provider_name:
                            logs.changed_to.cdn_provider_name,
                        created_at: logs.created_at
                    })
                })
            })

            // 資料排序，按照時間大 在前面
            logList = logList.sort(function(a, b) {
                return a.created_at < b.created_at ? 1 : -1
            })

            switch (type) {
                case 0:
                    this.$refs.textbox.$emit('clearnOrigin')

                    this.$refs.textbox.$emit('addString', logList.reverse())
                    break
                default:
                    this.$refs.textbox2.$emit('clearnOrigin')

                    this.pageCount2 = logList.length
                    this.lineCountRange2 = [this.pageCount2, this.pageCount2]

                    this.$refs.textbox2.$emit('addString', logList.reverse())
                    break
            }
        },
        startTimer() {
            // 計時器開始
            this.stopTimer()
            this.timer = setInterval(() => this.countdown(), 1000)
        },
        countdown() {
            if (!this.checkCurrentPage()) {
                this.stopTimer()
                return
            }

            // 計時器觸發的 function
            // 每次觸發會檢查 totaltime
            if (this.totalTime >= 1) {
                this.totalTime--
            } else {
                this.totalTime = 0
                this.resetTimer()
                this.getLogByLatest()
            }
        },
        resetTimer() {
            this.totalTime = 60
        },
        stopTimer() {
            clearInterval(this.timer)
            this.timer = false
            this.resetTimer()
        },
        init() {
            this.getLogByLatest()
            this.getLogByDay()
            this.resetTimer()
        }
    },
    created() {},
    mounted() {
        this.startTimer()
        this.getLogByLatest()
    }
}
</script>


<style lang="scss" scoped>
.container {
    min-width: 98%;
}
.hljs {
    display: block;
    color: #abb2bf;
    background: #282c34;
    word-break: break-all;
}
.highLight {
    color: #e57373 !important;
}
.source {
    color: #fff59d !important;
    caret-color: #fff59d !important;
}
.table_area {
    background-color: #282c34;
}
table {
    display: block;
    color: #abb2bf;
    background-color: #282c34;
    word-break: break-all;
    font-weight: 900;
    font-size: 14px;
    white-space: nowrap;
}
</style>
