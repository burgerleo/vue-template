<template lang="pug">
    v-layout
        v-flex(xs12 sm12 md12)
            v-card
                v-data-table.elevation-1(:headers="headers" :items="bgpList" dense hide-default-header hide-default-footer :items-per-page="1000" @page-count="1000")
                    template(v-slot:top)
                        v-toolbar(flat white)
                            v-toolbar-title.pl-1.pr-1(:class="colorList[0]") {{getMaxAndMin()['max'] + "≥"}}
                            v-toolbar-title.pl-1.pr-1(:class="colorList[1]") {{parseFloat((getMaxAndMin()['max'] - 0.1).toFixed(10)) + "~" + parseFloat((getMaxAndMin()['min'] + 0.1).toFixed(10))}}
                            v-toolbar-title.pl-1.pr-1(:class="colorList[2]") {{"≥" + getMaxAndMin()['min']}}
                            v-divider.mx-1(inset vertical)
                            v-toolbar-title.pl-1(:class="colorList[3]") {{"No Data"}}
                            v-divider.mx-1(inset vertical)

                            v-spacer
                            v-toolbar-title.mb-2.mr-2 Countdown Refresh Time: {{totalTime}}
                            v-btn.mb-2.mr-2(color="primary" dark @click="editDialog") Setting
                            v-btn.mb-2.mr-2(color="primary" dark @click="getAllPacketLoss")
                                v-icon mdi-refresh
                    
                    template(v-slot:header="{item,index}")
                        tr
                            th.pr-2.pl-2 {{"In/Out"}}
                            th.pr-2.pl-2(v-for="(outLine, value) in bgpList") {{outLine}}
                    template(v-slot:item="{item,index}")
                        tr
                            th.pr-2.pl-2 {{bgpList[index]}}
                            td.pr-1.pl-1.text-center(v-for="(outLine, value) in bgpList") 
                                div.text-center(:class="getColor(getSource(item, outLine, typeList[0]))")
                                    v-tooltip(top)
                                        template(v-slot:activator="{on}")
                                            v-avatar(tile width="100%" height="54" color="transparent" dark v-on="on")
                                                v-avatar(size="54" color="black")
                                                    v-tooltip(top)
                                                        template(v-slot:activator="{ on }")
                                                            v-avatar(size="50" :color="getColor(getSource(item, outLine, typeList[1]))" dark v-on="on")
                                                                v-avatar(size="34" color="black")
                                                                    v-tooltip(top)
                                                                        template(v-slot:activator="{ on }")
                                                                            v-avatar(size="30" :color="getColor(getSource(item, outLine, typeList[2]))" dark v-on="on")
                                                                        span {{getSource(item, outLine, typeList[2]) + "%" }}       
                                                        span {{getSource(item, outLine, typeList[1]) + "%"}}
                                        span {{getSource(item, outLine, typeList[0]) + "%"}}
            v-dialog(v-model="dialog" max-width="600" scrollable persistent)
                v-card
                    v-card-title.title Setting
                    v-card-text.pt-4 Color Range
                        v-range-slider.align-center(v-model="range" :max="max" :min="min" hide-details thumb-label="always" step='0.1')
                        v-text-field(v-model="dataTimeInterval.outside" label="Outside (latest Minutes)" type="number" name="minute")
                        v-text-field(v-model="dataTimeInterval.intermediate" label="Intermediate (latest Hours)" type="number" name="minute")
                        v-text-field(v-model="dataTimeInterval.inside" label="iInside (latest Days)" type="number" name="minute")
                        v-text-field(v-model="countdownMinute" label="Count Down Mintes" type="number" name="minute")
                    v-card-actions
                        v-spacer
                        v-btn(color="grey" @click="closeDialog") Cancel
                        v-btn(color="primary" @click="save") Save
</template>

<script>
import textFieldRules from '../utils/textFieldRules'

export default {
    name: 'JKB-Packet-Loss',
    mixins: [textFieldRules],

    components: {},
    data() {
        return {
            headers: [],
            bgpList: [],
            tableData: {},
            min: 95,
            max: 100,
            slider: 40,
            range: [97, 99.5],
            copyRange: [],
            dialog: false,
            pageName: 'packet-loss',
            typeList: ['outside', 'intermediate', 'inside'],
            dataTimeInterval: {
                outside: 5,
                intermediate: 60,
                inside: 0
            },
            colorList: [
                'green lighten-1',
                'yellow lighten-1',
                'red lighten-1',
                'grey lighten-1'
            ],
            attributes: ['rankbar', 'timeinterval'],
            timer: null,
            countdownMinute: 1,
            totalTime: 0,

            outsidehover:false,
            config: {
                rankbar: {
                    max: 99.8,
                    min: 99.3
                },
                timeinterval: {
                    inside: 1,
                    outside: 5,
                    intermediate: 1
                }
            },
            dd:0,
            picker: new Date().toISOString().substr(0, 10)
        }
    },
    watch: {
        // tableData() {}
    },
    methods: {
        editDialog() {
            this.dialog = true
            this.copyRange = [...this.range]
        },
        closeDialog() {
            this.dialog = false
            this.range = [...this.copyRange]
            this.copyRange = []
        },
        getConfig() {
            this.$store.dispatch('global/startLoading')
            this.$store
                .dispatch('jkb/getConfig', { page: this.pageName })
                .then(
                    function(result) {
                        for (var configs of result.data) {
                            if (configs.attributes == this.attributes[0]) {
                                var range = []
                                range = [
                                    configs.actions.min,
                                    configs.actions.max
                                ]
                                this.range =
                                    range.length > 0 ? range : this.range
                            } else if (
                                configs.attributes == this.attributes[1]
                            ) {
                                this.dataTimeInterval = configs.actions
                            }
                        }
                        this.getAllPacketLoss()

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
        save() {
            var data
            for (var attribute of this.attributes) {
                switch (attribute) {
                    case this.attributes[0]:
                        data = {
                            page: this.pageName,
                            attributes: attribute,
                            actions: this.getMaxAndMin()
                        }
                        break
                    case this.attributes[1]:
                        data = {
                            page: this.pageName,
                            attributes: attribute,
                            actions: this.dataTimeInterval
                        }
                        break
                    default:
                        return
                        break
                }
                this.saveConfig(data)
            }

            this.copyRange = [...this.range]
            this.closeDialog()
        },
        saveConfig(data) {
            this.$store.dispatch('global/startLoading')

            this.$store
                .dispatch('jkb/setConfig', data)
                .then(
                    function(result) {
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
        getMaxAndMin() {
            var range = this.range

            const max = range[0] >= range[1] ? range[0] : range[1]
            const min = range[0] <= range[1] ? range[0] : range[1]
            return {
                max: max,
                min: min
            };
        },
        getAllPacketLoss() {
            for (var type of this.typeList) {
                this.getPacketLoss(type)
            }
            this.resetTimer();
            this.startTimer()
            console.log("Test")
            this.dd ++
            console.log(this.dd)
        },

        getPacketLoss(type) {
            this.$store.dispatch('global/startLoading')

            var minute = this.dataTimeInterval[type]

            switch (type) {
                case this.typeList[1]:
                    minute = minute * 60
                    break
                case this.typeList[2]:
                    minute = minute * 60 * 24
                    break
            }

            this.$store
                .dispatch('jkb/getPacketLoss', {
                    minutes: minute
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
            var packetloss =
                data.length > 0 ? data : this.packetloss.data.bgpIoMapping

            var type = this.typeList[typeId]

            var bgpList = [...this.bgpList]
            var headerList = [...this.headers]
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

            if (headerList.length <= 0) {
                headerList.push(header1)
            }

            packetloss.forEach(function(item, index, array) {
                var inLine = item.inBgpName
                var outLine = item.outBgpName

                if (!tableData[inLine]) {
                    tableData[inLine] = {}
                    headerList.push(header2)
                }

                bgpList.push(inLine)
                bgpList.push(outLine)

                // 移除重複 Value
                bgpList = bgpList.filter(
                    (item, index) => bgpList.indexOf(item) === index
                )

                if (!tableData[inLine][outLine]) {
                    tableData[inLine][outLine] = {}
                }

                tableData[inLine][outLine][type] = {
                    avail_rate_avg: item.avail_rate_avg,
                    resp_time_avg: item.resp_time_avg
                }
            })

            // console.log(bgpList)
            // console.log(headerList)
            // console.log(tableData)
            this.tableData = tableData
            this.bgpList = bgpList
            this.headers = headerList
        },
        getSource(inLine, outLine, type) {
            // console.log(inLine, outLine, type)

            if (!this.tableData[inLine][outLine]) {
                return null
            }
            if (this.tableData[inLine][outLine][type]) {
                return this.tableData[inLine][outLine][type]['avail_rate_avg']
            }

            return null
        },
        getColor(packetloss) {
            const range = this.getMaxAndMin()

            if (packetloss == null) {
                return this.colorList[3]
            } else if (packetloss >= range['max']) {
                return this.colorList[0]
            } else if (packetloss > range['min']) {
                return this.colorList[1]
            }
            return this.colorList[2]
        },
        startTimer() {
            this.stopTimer()
            this.timer = setInterval(() => this.countdown(), 1000)
        },
        countdown() {
            if (this.totalTime >= 1) {
                this.totalTime--
            } else {
                this.totalTime = 0
                this.resetTimer()
                this.getAllPacketLoss()
            }
        },
        resetTimer() {
            this.totalTime = this.countdownMinute * 60
        },
        stopTimer() {
            clearInterval(this.timer)
            this.timer = null
        },
        getRndInteger(min, max) {
            // 隨機產生數值
            return Math.floor(Math.random() * (max - min)) + min
        }
    },
    created() {},
    mounted() {
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
</style>
