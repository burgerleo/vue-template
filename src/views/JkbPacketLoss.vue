<template lang="pug">
    v-layout
        v-flex(xs12 sm12 md12)
            v-card
                v-data-table.elevation-1(:headers="headers" :items="bgpList" dense hide-default-header hide-default-footer :items-per-page="1000" @page-count="1000")
                    template(v-slot:top)
                        v-toolbar(flat white)
                            v-toolbar-title HK
                            v-divider.mx-4(inset vertical)
                            v-spacer
                            v-btn.mb-2(color="primary" dark @click="editDialog") Setting Color
                    
                    template(v-slot:header="{item,index}")
                        tr
                            th.pr-2.pl-2 {{"In/Out"}}
                            th.pr-2.pl-2(v-for="(outLine, value) in bgpList") {{outLine}}
                    template(v-slot:item="{item,index}")
                        tr
                            th.pr-2.pl-2 {{bgpList[index]}}
                            td.pr-1.pl-1.text-center(v-for="(outLine, value) in bgpList") 
                                //- div.text-center(:class="getColor(getSource(item, outLine, typeList[0]))")
                                    //- v-tooltip(left)
                                        template(v-slot:activator="{ on }")
                                            div.text-center(:class="getColor(getSource(item, outLine, typeList[0]))" dark v-on="on")
                                        span {{getSource(item, outLine, typeList[0])}}
                                    v-avatar(size="54" color="black")
                                        v-tooltip(top)
                                            template(v-slot:activator="{ on }")
                                                v-avatar(size="50" :color="getColor(getSource(item, outLine, typeList[1]))" v-on="on") 
                                            span {{getSource(item, outLine, typeList[1])}}
                                    
                                        v-avatar(size="34" color="black")
                                            v-tooltip(top)
                                                template(v-slot:activator="{ on }")
                                                    v-avatar(size="30" :color="getColor(getSource(item, outLine, typeList[1]))" dark v-on="on") 
                                                span {{getSource(item, outLine, typeList[1])}}
                                    
                                div.text-center(:class="getColor(getSource(item, outLine, typeList[0]))" dark)
                                    v-avatar(size="54" color="black")
                                        v-avatar(size="50" :color="getColor(getSource(item, outLine, typeList[1]))" dark) 
                                            v-avatar(size="34" color="black")
                                                v-avatar(size="30" :color="getColor(getSource(item, outLine, typeList[2]))" dark ) 

            v-dialog(v-model="dialog" max-width="600" scrollable persistent)
                v-card
                    v-card-title.title Setting Color Range
                    v-card-text.pt-4 Color Range
                        v-range-slider.align-center(v-model="range" :max="max" :min="min" hide-details thumb-label="always" step='0.1')
                            //- template(v-slot:prepend)
                                v-text-field.mt-0.pt-0(v-if="true" :value="range[0]" hide-details single-line type="number" style="width: 60px" @change="$set(range, 0, $event)")
                            //- template(v-slot:append)
                                v-text-field.mt-0.pt-0(v-if="true" :value="range[1]" hide-details single-line type="number" style="width: 60px" @change="$set(range, 1, $event)")

                    v-card-actions
                        v-spacer
                        v-btn(color="grey" @click="closeDialog") Cancel
                        v-btn(color="primary" @click="save") Save

            v-btn(color="primary" @click="transformNXN(typeList[0])") nxn
            v-btn(color="primary" @click="transformNXN(typeList[1])") nxn1
            v-btn(color="primary" @click="transformNXN(typeList[2])") nxn2
            

            //- v-card
                v-subheader Default range slider
                v-card-text Color Range
                    v-range-slider.align-center(v-model="range" :max="max" :min="min" tick-size="2" hide-details thumb-label="always" step='0.1' color="yellow darken-3" track-color="red darken-1"  track-fill-color="green darken-3")
</template>

<script>
import textFieldRules from '../utils/textFieldRules'
import packetloss from '../assets/packetloss.json'
import packetloss1 from '../assets/packetloss1.json'
import packetloss2 from '../assets/packetloss2.json'

export default {
    name: 'JKB-Packet-Loss',
    mixins: [textFieldRules],

    components: {},
    data() {
        return {
            headers: [],
            bgpList: [],
            tableData: {},
            // siteList: [],
            min: 90,
            max: 100,
            slider: 40,
            range: [97, 99.5],
            copyRange: [],
            dialog: false,
            pageName: 'packet-loss',
            packetloss: packetloss,
            packetloss1: packetloss1,
            packetloss2: packetloss2,
            typeList: ['outside', 'intermediate', 'inside']
        }
    },
    watch: {},
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
                        var range = []

                        result.data.map(function(item) {
                            range = [item.actions.min, item.actions.max]
                        })

                        this.range = range.length > 0 ? range : this.range

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
            var range = this.getMaxAndMin()

            this.$store.dispatch('global/startLoading')
            var data = {
                page: this.pageName,
                actions: range
            }
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

            this.copyRange = [...this.range]
            this.closeDialog()
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
        transformNXN(type) {
            var packetloss = this.packetloss.data.bgpIoMapping
            if (type == 'intermediate') {
                packetloss = this.packetloss1.data.bgpIoMapping
            } else if (type == 'inside') {
                packetloss = this.packetloss2.data.bgpIoMapping
            }
            var bgpList = [...this.bgpList]
            var headerList = [...this.headers]
            var tableData = Object.assign({}, this.tableData)

            // console.log(bgpList)
            // console.log(headerList)
            // console.log(tableData)

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

            console.log(bgpList)
            console.log(headerList)
            console.log(tableData)
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
            var color = [
                'green lighten-1',
                'yellow lighten-1',
                'orange lighten-1',
                'deep-purple lighten-1',
                'blue lighten-1',
                'indigo lighten-1',
                'pink lighten-1',
                'red lighten-1',
                'teal lighten-1'
            ]
            // const packetloss = this.getRndInteger(90, 100)

            if (packetloss == null) {
                return 'grey lighten-1'
            }

            const range = this.getMaxAndMin()

            if (packetloss >= range['max']) {
                return 'green lighten-1'
            } else if (packetloss > range['min']) {
                return 'yellow lighten-1'
            }

            return 'red lighten-1'
        },
        getRndInteger(min, max) {
            return Math.floor(Math.random() * (max - min)) + min
        }
    },
    created() {},
    mounted() {
        this.getConfig()
    }
}
</script>


<style lang="sass" scoped>
</style>
