<template lang="pug">
    v-container.ma-0.pa-0.fill-height.fluid
        v-row
            v-col.pb-1.pt-1(cols="12")
                v-toolbar(flat white dense)
                    v-toolbar-title.pl-1 JKB Availability
                    v-divider.mx-1(inset vertical)

                    v-radio-group.mx-0(v-model='isp' row hide-details)
                        v-radio.mx-0.mr-1(v-for="site,index in ispList" :label="site" :value="index" :key="index")

                    v-spacer

                    v-toolbar-title.my-0.mx-0(:class="!jkbAPIStatus ? 'blink' : 'black--text'") Latest form JKB:{{lastDataTime}}
                    v-divider.mb-0.mx-1(inset vertical)
                    v-toolbar-title.my-0.mr-2 {{totalTime}}s
                    v-btn.mb-2.mr-2(v-if="timer" color="red darken-1" dark @click="stopTimer") Stop
                    v-btn.mb-2.mr-2(v-if="!timer" color="primary" dark @click="getAllPacketLoss") Start
                    v-btn.mb-2.mr-2(color="primary" dark @click="editDialog") Setting
                    v-btn.mb-2.mr-2(color="primary" dark @click="getConfig")
                        v-icon mdi-refresh
                v-toolbar(flat white dense)
                    v-toolbar-title.pl-1.pr-1(:class="colorList[0]") {{getMaxAndMin()['max'] + "%≥"}}
                    v-toolbar-title.pl-1.pr-1(:class="colorList[1]") {{parseFloat((getMaxAndMin()['max'] - 0.01).toFixed(10)) + "%~" + parseFloat((getMaxAndMin()['min'] + 0.01).toFixed(10)) + "%"}}
                    v-toolbar-title.pl-1.pr-1(:class="colorList[2]") {{"≥" + getMaxAndMin()['min']+"%"}}
                    v-divider.mx-1(inset vertical)
                    v-toolbar-title.pl-1(:class="colorList[3]") {{"No Data"}}
        //- v-row
            v-col.ml-0.pa-0.pl-6(cols="6")
                NxnCirclesTable(class="table_border" title="HK" :headers="headers['HK']" :items="bgpList2['HK']['C']" :nxn="tableData['HK']" :range="range" :loading="loading" :typeList="typeList")
                NxnCirclesTable.mt-3(class="table_border" title="TW" :headers="headers['TW']" :items="bgpList2['TW']['C']" :nxn="tableData['TW']" :range="range" :loading="loading" :typeList="typeList")
            v-col.ml-0.pa-0.pl-2(cols="6")
                NxnCirclesTable(class="table_border" title="HK" :headers="headers['HK']" :items="bgpList2['HK']['G']" :nxn="tableData['HK']" :range="range" :loading="loading" :typeList="typeList")
                NxnCirclesTable.mt-3(class="table_border" title="TW" :headers="headers['TW']" :items="bgpList2['TW']['G']" :nxn="tableData['TW']" :range="range" :loading="loading" :typeList="typeList")
                NxnCirclesTable.mt-3(class="table_border" title="PH" :headers="headers['PH']" :items="bgpList['PH']" :nxn="tableData['PH']" :range="range" :loading="loading" :typeList="typeList")

        v-row
            v-col.ml-0.pa-0.pl-6(cols="6")
                DataTable3.table_border(site='HK' networkFlowType="availability" :bgpList="bgpList2['HK']['C']" :tableData="tableData['HK']" :range="range" :loading="loading")
                DataTable3.mt-3.table_border(site="TW" networkFlowType="availability" :bgpList="bgpList2['TW']['C']" :tableData="tableData['TW']" :range="range" :loading="loading")
            v-col.ml-0.pa-0.pl-2(cols="6")
                DataTable3.table_border(site='HK' networkFlowType="availability" :bgpList="bgpList2['HK']['G']" :tableData="tableData['HK']" :range="range" :loading="loading")
                DataTable3.mt-3.table_border(site='TW' networkFlowType="availability" :bgpList="bgpList2['TW']['G']" :tableData="tableData['TW']" :range="range" :loading="loading")
                DataTable3.mt-3.table_border(site='PH' networkFlowType="availability" :bgpList="bgpList2['PH']['G']" :tableData="tableData['PH']" :range="range" :loading="loading")

        v-dialog(v-model="dialog" max-width="600" scrollable persistent)
            v-card
                v-card-title.title Setting
                v-card-text.pt-6 Color Range
                    v-form(ref="form" onsubmit="return false;")
                        v-range-slider.align-center(v-model="range" :max="max" :min="min" hide-details thumb-label="always" thumb-size="36" step='0.01')
                        v-text-field(v-model="configs.timeinterval.outside" label="Outside (latest Minutes)" type="number" name="minute" max="60" min="1" :rules="[rules.required, rules.minutes]" readonly)
                        v-text-field(v-model="configs.timeinterval.intermediate" label="Intermediate (latest Minutes)" type="number" name="minute" max="14" min="1" :rules="[rules.required, rules.minutes]" readonly)
                        v-text-field(v-model="configs.timeinterval.inside" label="Inside (latest Hours)" type="number" name="hour" max="30" min="1" :rules="[rules.required, rules.hours]")
                        v-text-field(v-model="configs.countdownMinute.countdownMinute" label="Countdown Mintes" type="number" name="minute" max="60" min="1" :rules="[rules.required, rules.minutes]")
                v-card-actions
                    v-spacer
                    v-btn(color="grey" @click="closeDialog") Cancel
                    v-btn(color="primary" @click="save") Save
</template>

<script>
import textFieldRules from '../utils/textFieldRules'
import dateFormat from '../utils/dateFormat'
import checkPage from '../utils/checkPage'
import DataTable3 from '../components/NxnH7CirlesTable'
import NxnCirclesTable from '../components/NxnCirclesTable'

export default {
    name: 'jkb_availability',
    mixins: [textFieldRules, dateFormat, checkPage],

    components: {
        NxnCirclesTable,
        DataTable3
    },
    data() {
        return {
            headers: {
                HK: [],
                TW: [],
                PH: []
            },
            bgpList: {
                HK: [],
                TW: [],
                PH: []
            },
            bgpList2: {
                HK: {
                    C: [],
                    G: []
                },
                TW: {
                    C: [],
                    G: []
                },
                PH: {
                    C: [],
                    G: []
                }
            },
            tableData: {
                HK: {},
                TW: {},
                PH: {}
            },
            ispList: this.$store.getters['isp/ispList'](),
            isp: 0,
            loading: true,
            min: 95,
            max: 100,
            range: [97, 99.5],
            dialog: false,
            pageName: this.$route.name,
            typeList: ['outside', 'intermediate', 'inside'],
            colorList: [
                'green lighten-2',
                'yellow lighten-2',
                'red lighten-2',
                'grey lighten-2',
                'blue lighten-2',
                'pink lighten-4'
            ],
            timer: null,
            totalTime: 60,
            configs: {
                rankbar: {
                    max: 99.5,
                    min: 97
                },
                timeinterval: {
                    outside: 5, //最外圈 分鐘
                    intermediate: 10, //中間 分鐘
                    inside: 1 //最內圈 小時
                },
                countdownMinute: {
                    countdownMinute: 1
                }
            },
            copyConfigs: {},
            jkbAPIStatus: true, // true 表示正常
            lastDataTime: null
        }
    },
    watch: {
        isp() {
            this.getConfig()
        }
    },
    methods: {
        getIsp() {
            this.$store
                .dispatch('isp/getISPList')
                .then(
                    function(result) {
                        this.ispList = this.$store.getters['isp/ispList']()
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
        },
        getDummy() {
            this.$store
                .dispatch('dummy/getInfo')
                .then(
                    function(result) {
                        var tableData = Object.assign({}, this.tableData)

                        var bgpList = Object.assign({}, this.bgpList)

                        // 第一步 將資料稍微整理一次
                        var dummy = result.data
                            .map(function(item, index) {
                                if (item.jkb_task_id) {
                                    item.site = item.in_bgp.site
                                    item.inBgpName = item.in_bgp.name
                                    item.outBgpName = item.out_bgp.name

                                    delete item.in_bgp
                                    delete item.out_bgp
                                    return item
                                }
                            })
                            .filter(item => item)

                        // 第二步 將資料排序，按照 Site
                        // bgpList[site][]
                        dummy.forEach(function(item) {
                            var site = item.site
                            var inLine = item.inBgpName
                            var outLine = item.outBgpName

                            bgpList[site].push(inLine)
                            bgpList[site].push(outLine)

                            // 移除重複 Line Name
                            bgpList[site] = bgpList[site].filter(
                                (line, index) =>
                                    bgpList[site].indexOf(line) === index
                            )

                            if (!tableData[site][inLine]) {
                                tableData[site][inLine] = {}
                            }

                            if (!tableData[site][inLine][outLine]) {
                                tableData[site][inLine][outLine] = {}
                            }
                        })

                        // 送進排序中心
                        this.$store
                            .dispatch('dummy/bgpListReorder', bgpList)
                            .then(
                                function(result) {
                                    this.bgpList = result.bgpList
                                    this.bgpList2 = result.bgpListPartition
                                }.bind(this)
                            )
                        this.getConfig()
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
        },
        getConfig() {
            this.stopTimer()
            this.$store
                .dispatch('jkb/getConfig', { page: this.pageName })
                .then(
                    function(result) {
                        for (var config of result.data) {
                            if (config.attributes) {
                                this.configs[config.attributes] = config.actions
                            }
                        }
                        this.setMaxAndMin()
                        this.getAllPacketLoss()
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
        },
        editDialog() {
            this.dialog = true

            this.copyConfigs = {}

            // Deep copy
            this.copyConfigs = JSON.parse(JSON.stringify(this.configs))
        },
        closeDialog() {
            this.configs = Object.assign({}, this.copyConfigs)

            this.copyConfigs = {}

            this.setMaxAndMin()

            this.dialog = false
        },
        validateForm() {
            // 驗證表單資料
            return this.$refs.form.validate()
        },
        save() {
            if (!this.validateForm()) {
                return
            }

            this.setConfigByRankbar()

            this.batchSaveConfig()

            this.copyConfigs = Object.assign({}, this.configs)

            this.closeDialog()
        },
        batchSaveConfig() {
            var configs = {}
            var data = {}

            configs = this.configs

            const configList = Object.keys(configs)

            data = configList.map(function(item) {
                return {
                    attributes: item,
                    actions: configs[item]
                }
            })

            data.page = this.pageName

            this.$store
                .dispatch('jkb/batchSetConfig', data)
                .then(
                    function() {
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
        },
        setMaxAndMin() {
            var rankbar = this.configs.rankbar

            this.range = []

            this.range[0] = rankbar.min
            this.range[1] = rankbar.max
        },
        setConfigByRankbar() {
            var rankbar = this.getMaxAndMin()
            this.configs.rankbar = rankbar
        },
        getMaxAndMin() {
            var range = this.range

            const max = range[0] >= range[1] ? range[0] : range[1]
            const min = range[0] <= range[1] ? range[0] : range[1]

            return {
                max: max,
                min: min
            }
        },
        getAllPacketLoss() {
            this.resetTimer()
            this.startTimer()
            this.getNetworkFlowByTypeId()
        },
        getNetworkFlowByTypeId(typeId = 0) {
            var type = this.typeList[typeId]
            var minute = this.configs.timeinterval[type]
            var startTime = new Date()

            switch (type) {
                case this.typeList[0]:
                    startTime.setMinutes(startTime.getMinutes() - minute)
                    break
                case this.typeList[1]:
                    startTime.setMinutes(startTime.getMinutes() - minute)
                    break
                case this.typeList[2]:
                    startTime.setHours(startTime.getHours() - minute)
                    break
            }

            this.loading = true
            this.$store
                .dispatch('traffic/getTrafficFlow', {
                    start_time: this.dateFormat(startTime),
                    end_time: this.dateFormat(new Date())
                })
                .then(
                    function(result) {
                        this.jkbAPIStatus = result.data.jkb_api_status

                        var lastDataTime = new Date(result.data.lastDataTime)
                        var bgpIoMapping = result.data.bgpIoMapping
                        var tableData = Object.assign({}, this.tableData)

                        this.lastDataTime =
                            this.getDateHour(lastDataTime) +
                            ':' +
                            this.getDateMinute(lastDataTime)

                        bgpIoMapping.forEach(function(item) {
                            var site = item.site
                            var inLine = item.inBgpName
                            var outLine = item.outBgpName

                            tableData[site][inLine][outLine][type] = {
                                availability: item.availability,
                                latency: item.latency
                            }
                        })

                        this.tableData = tableData

                        typeId++

                        if (typeId < 3) {
                            this.getNetworkFlowByTypeId(typeId)
                        }

                        this.loading = false

                        this.bgpList2 = JSON.parse(
                            JSON.stringify(this.bgpList2)
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
        },
        getSource(inLine, outLine, type) {
            if (!this.tableData[inLine][outLine]) {
                return null
            }

            if (this.tableData[inLine][outLine][type]) {
                return this.tableData[inLine][outLine][type]['availability']
            }

            return null
        },
        getColor(packetloss) {
            const range = this.getMaxAndMin()
            if (packetloss == null || packetloss == 0) {
                return this.colorList[3]
            } else if (packetloss >= range['max']) {
                return this.colorList[0]
            } else if (packetloss > range['min']) {
                return this.colorList[1]
            }
            return this.colorList[2]
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
                this.getAllPacketLoss()
            }
        },
        resetTimer() {
            this.totalTime = this.configs.countdownMinute.countdownMinute * 60
        },
        stopTimer() {
            clearInterval(this.timer)
            this.timer = false
            this.resetTimer()
        }
    },
    created() {},
    mounted() {
        this.getIsp()
        this.getDummy()
    }
}
</script>


<style lang="scss" scoped>
.v-data-table {
    th {
        user-select: auto;
    }
}
.container {
    min-width: 100%;
}
.table_border {
    border-width: 3px;
    border-style: dashed;
    border-color: grey;
}
@keyframes blink {
    0% {
        opacity: 1;
    }
    100% {
        opacity: 0.2;
    }
}
/* 添加兼容性前綴 */
@-webkit-keyframes blink {
    0% {
        opacity: 1;
    }
    100% {
        opacity: 0.2;
    }
}
@-moz-keyframes blink {
    0% {
        opacity: 1;
    }
    100% {
        opacity: 0.2;
    }
}
.blink {
    animation: blink 1.5s linear infinite;
    background-color: #e53935 !important;
    // font-weight: bold;
    /* 其它瀏覽器兼容性前綴 */
    -webkit-animation: blink 1.5s linear infinite;
    -moz-animation: blink 1.5s linear infinite;
}
</style>
