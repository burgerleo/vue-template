<template lang="pug">
    v-container.ma-0.pa-0.fill-height.fluid
        v-row
            v-col(cols="12")
                v-toolbar(flat white)
                    v-toolbar-title.pl-1.pr-1(:class="colorList[0]") {{getMaxAndMin()['min'] + "≤"}}
                    v-toolbar-title.pl-1.pr-1(:class="colorList[1]") {{parseFloat((getMaxAndMin()['min'] + 1).toFixed(10)) + "~" + parseFloat((getMaxAndMin()['max'] - 1).toFixed(10))}}
                    v-toolbar-title.pl-1.pr-1(:class="colorList[2]") {{"≤" + getMaxAndMin()['max']}}
                    v-divider.mx-1(inset vertical)
                    v-toolbar-title.pl-1(:class="colorList[3]") {{"No Data"}}
                    v-divider.mx-1(inset vertical)

                    v-spacer
                    v-toolbar-title.mb-2.mr-2 {{totalTime}} s
                    v-btn.mb-2.mr-2(v-if="timer" color="red darken-1" dark @click="stopTimer") Stop
                    v-btn.mb-2.mr-2(v-if="!timer" color="primary" dark @click="getAllLatency") Start
                    v-btn.mb-2.mr-2(color="primary" dark @click="editDialog") Setting
                    v-btn.mb-2.mr-2(color="primary" dark @click="getConfig")
                        v-icon mdi-refresh
                NxnCirclesTable(title="HK" networkFlowType="latency" :headers="headers['HK']" :items="bgpList['HK']" :nxn="tableData['HK']" :range="range" :loading="loading" :typeList="typeList")
        v-row
            v-col.ml-0(cols="8")
                NxnCirclesTable(title="TW" networkFlowType="latency" :headers="headers['TW']" :items="bgpList['TW']" :nxn="tableData['TW']" :range="range" :loading="loading" :typeList="typeList")
            v-col.ml-0.pl-0(cols="4")
                NxnCirclesTable(title="PH" networkFlowType="latency" :headers="headers['PH']" :items="bgpList['PH']" :nxn="tableData['PH']" :range="range" :loading="loading" :typeList="typeList")
        v-dialog(v-model="dialog" max-width="600" scrollable persistent)
            v-card
                v-card-title.title Setting
                v-card-text.pt-6 Color Range
                    v-form(ref="form" onsubmit="return false;")
                        v-range-slider.align-center(v-model="range" :max="max" :min="min" hide-details thumb-label="always" thumb-size="36" step='1')
                        v-text-field(v-model="configs.timeinterval.outside" label="Outside (latest Minutes)" type="number" name="minute" max="60" min="1" :rules="[rules.required, rules.minutes]")
                        v-text-field(v-model="configs.timeinterval.intermediate" label="Intermediate (latest Hours)" type="number" name="hour" max="14" min="1" :rules="[rules.required, rules.hours]")
                        v-text-field(v-model="configs.timeinterval.inside" label="Inside (latest Days)" type="number" name="day" max="30" min="1" :rules="[rules.required, rules.days]")
                        v-text-field(v-model="configs.countdownMinute.countdownMinute" label="Countdown Mintes" type="number" name="minute" max="60" min="1" :rules="[rules.required, rules.minutes]")
                v-card-actions
                    v-spacer
                    v-btn(color="grey" @click="closeDialog") Cancel
                    v-btn(color="primary" @click="save") Save
</template>

<script>
import textFieldRules from '../utils/textFieldRules'
import NxnCirclesTable from '../components/NxnCirclesTable'

export default {
    name: 'JKB-Packet-Loss',
    mixins: [textFieldRules],

    components: {
        NxnCirclesTable
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
            tableData: {
                HK: {},
                TW: {},
                PH: {}
            },
            loading: true,
            min: 0,
            max: 300,
            range: [130, 200],
            dialog: false,
            pageName: 'latency',
            typeList: ['outside', 'intermediate', 'inside'],
            colorList: [
                'green lighten-2',
                'yellow lighten-2',
                'red lighten-2',
                'grey lighten-2',
                'blue lighten-2'
            ],
            timer: false,
            totalTime: 60,
            configs: {
                rankbar: {
                    max: 150,
                    min: 200
                },
                timeinterval: {
                    inside: 1,
                    outside: 5,
                    intermediate: 1
                },
                countdownMinute: {
                    countdownMinute: 1
                }
            },
            copyConfigs: {},
            picker: new Date().toISOString().substr(0, 10)
        }
    },
    watch: {},
    methods: {
        getConfig() {
            this.resetTimer()
            this.$store.dispatch('global/startLoading')
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

                        this.getAllLatency()

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
        validateForm: function() {
            // 驗證表單資料
            return this.$refs.form.validate()
        },
        save() {
            if (!this.validateForm()) {
                return
            }
            this.setConfigByRankbar()

            this.saveBatchSetConfig()

            this.copyConfigs = Object.assign({}, this.configs)

            this.closeDialog()
        },
        saveBatchSetConfig() {
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

            this.$store.dispatch('global/startLoading')
            this.$store
                .dispatch('jkb/batchSetConfig', data)
                .then(
                    function() {
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
        getAllLatency() {
            this.stopTimer()
            this.startTimer()

            for (var type of this.typeList) {
                // console.log(type)
                this.getLatency(type)
            }
        },
        checkIsRightPath() {
            const path = this.$route

            return path.name === this.pageName
        },
        getLatency(type) {
            var minute = this.configs.timeinterval[type]
            var startTime = new Date()

            switch (type) {
                case this.typeList[0]:
                    startTime.setMinutes(startTime.getMinutes() - minute)
                    break
                case this.typeList[1]:
                    startTime.setHours(startTime.getHours() - minute)
                    break
                case this.typeList[2]:
                    startTime.setDate(startTime.getDate() - minute)
                    break
            }

            this.loading = true
            this.$store.dispatch('global/startLoading')
            var endTime = new Date()

            this.$store
                .dispatch('traffic/getTrafficFlow', {
                    start_time: this.dateFormat(startTime),
                    end_time: this.dateFormat(endTime)
                })
                .then(
                    function(result) {
                        this.transforToTableData(
                            this.typeList.indexOf(type),
                            result.data.bgpIoMapping
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
        transforToTableData(typeId, data) {
            var latency = data.length > 0 ? data : []

            var type = this.typeList[typeId]

            var bgpList = Object.assign({}, this.bgpList)
            var headerList = Object.assign({}, this.headers)
            var tableData = Object.assign({}, this.tableData)

            var header1 = {
                text: 'in/out',
                width: '30px',
                sortable: false,
                align: 'center'
            }

            var header2 = {
                width: '30px',
                sortable: false,
                align: 'center'
            }

            latency.forEach(function(item) {
                var site = item.site
                var inLine = item.inBgpName
                var outLine = item.outBgpName

                if (headerList[site].length <= 0) {
                    headerList[site].push(header1)
                }

                if (!tableData[site][inLine]) {
                    tableData[site][inLine] = {}

                    headerList[site].push(header2)
                }

                bgpList[site].push(inLine)
                bgpList[site].push(outLine)

                // 移除重複 Line Name
                bgpList[site] = bgpList[site].filter(
                    (line, index) => bgpList[site].indexOf(line) === index
                )

                if (!tableData[site][inLine][outLine]) {
                    tableData[site][inLine][outLine] = {}
                }

                tableData[site][inLine][outLine][type] = {
                    packet_loss: item.packet_loss,
                    latency: item.latency
                }
            })

            this.tableData = tableData
            this.bgpList = bgpList
            this.headers = headerList
            this.loading = false
            this.itemTransform()
        },
        itemTransform() {
            var items = this.bgpList

            var newItems = {}

            const itemsKeyList = Object.keys(items)

            itemsKeyList.map(function(sites) {
                items[sites].map(function(bgp) {
                    var type = bgp.substr(-1)

                    if (!newItems[sites]) {
                        newItems[sites] = {}
                    }

                    if (!newItems[sites][type]) {
                        newItems[sites][type] = []
                    }

                    newItems[sites][type].push(bgp)
                })
            })

            itemsKeyList.map(function(sites) {
                if (!newItems[sites]) {
                    return
                }
                if (newItems[sites]['C'] && newItems[sites]['G']) {
                    items[sites] = [].concat(
                        newItems[sites]['C'],
                        newItems[sites]['G']
                    )
                }
            })

            this.bgpList = items
        },
        getSource(site, inLine, outLine, type) {
            if (!this.tableData[site][inLine]) {
                return null
            }

            if (!this.tableData[site][inLine][outLine]) {
                return null
            }

            if (this.tableData[site][inLine][outLine][type]) {
                return this.tableData[site][inLine][outLine][type]['latency']
            }

            return null
        },
        getColor(Latency) {
            const range = this.getMaxAndMin()

            if (Latency == null || Latency == 0) {
                return this.colorList[3]
            } else if (Latency <= range['min']) {
                return this.colorList[0]
            } else if (Latency < range['max']) {
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
            // 檢查 網址路徑是否正確
            if (!this.checkIsRightPath()) {
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
                this.getAllLatency()
            }
        },
        resetTimer() {
            this.totalTime = this.configs.countdownMinute.countdownMinute * 60
        },
        stopTimer() {
            clearInterval(this.timer)
            this.timer = false
            this.resetTimer()
        },
        setPageName() {
            const path = this.$route
            this.pageName = path.name
        },
        dateFormat(date) {
            var year = date.getFullYear()
            /*
             *  在日期格式中，月份是從 0 開始的，因此要加 0
             *  使用三元表達式在小於 10 的前面加 0，以達到格式統一 如 09:11:05
             */
            var month =
                date.getMonth() + 1 < 10
                    ? '0' + (date.getMonth() + 1)
                    : date.getMonth() + 1
            var day =
                date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
            var hours =
                date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
            var minutes =
                date.getMinutes() < 10
                    ? '0' + date.getMinutes()
                    : date.getMinutes()
            var seconds =
                date.getSeconds() < 10
                    ? '0' + date.getSeconds()
                    : date.getSeconds()
            // 拼接
            return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes
        }
    },
    created() {},
    mounted() {
        document.title = 'JKB Latency'
        this.setPageName()
        this.getConfig()
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
</style>
