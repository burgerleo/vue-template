<template lang="pug">
    #dataTable3
        div.v-data-table__wrapper
            table.v-nxn-table
                thead.v-data-table-header
                    tr
                        th(:colspan="(r1 + r2 + 2)") 
                            v-progress-linear(:active="loading" height="2px" indeterminate :color="colorList[4]")
                thead.v-data-table-header
                    tr
                        th(rowspan="2" colspan="2" :class="colorList[3]") 
                            h2 {{ site + "\nIn   \\   Out"}} 
                        th(:colspan="r1")
                            v-avatar(v-if="r1>0" tile width="100%" :height="columnHeight" :color="colorList[6]" dark) 
                                h2 {{"R1"}}
                        th(:colspan="r2") 
                            v-avatar(v-if="r2>0" tile width="100%" :height="columnHeight" :color="colorList[7]" dark) 
                                h2 {{"R2"}}
                    tr
                        th(v-for="outLine in columns")
                            v-avatar(tile width="100%" :height="columnHeight"  :color="getCorGColor(outLine)" dark) 
                                h2 {{linetext(outLine)}}
                tbody
                    tr(v-for="(inLine,key) in columns") 
                        th(v-if="(key == 0)" :rowspan="r1" :height="columnHeight*r1")
                            v-avatar(tile width="100%" height="100%" :color="colorList[6]" dark) 
                                h2 {{"R1"}}
                        th(v-if="(key == r1)" :rowspan="r2" :height="columnHeight*r2")
                            v-avatar(tile width="100%" height="100%" :color="colorList[7]" dark) 
                                h2 {{"R2"}}
                        th 
                            v-avatar(tile width="100%" :height="columnHeight" :color="getCorGColor(inLine)" dark)
                                h2 {{linetext(inLine)}}
                        
                        td(v-for="(outLine,key2) in columns" :height="columnHeight")
                            v-avatar(tile width="100%" height="100%" :color="getColor(getSource(inLine, outLine, typeList[0]))" dark)
                                v-tooltip(top)
                                    template(v-slot:activator="{on}")
                                        v-avatar(tile width="100%" :height="columnHeight"  color="transparent" dark v-on="on")
                                            v-avatar(:size="circleSize1" color="black")
                                                v-tooltip(top)
                                                    template(v-slot:activator="{ on }")
                                                        v-avatar(:size="circleSize1-4" :color="getColor(getSource(inLine, outLine, typeList[1]))" dark v-on="on")
                                                            v-avatar(:size="circleSize2" color="black")
                                                                v-tooltip(top)
                                                                    template(v-slot:activator="{ on }")
                                                                        v-avatar(:size="circleSize2-4" :color="getColor(getSource(inLine, outLine, typeList[2]))" dark v-on="on")
                                                                    span {{getSource(inLine, outLine, typeList[2])}}       
                                                    span {{getSource(inLine, outLine, typeList[1])}}
                                    span {{getSource(inLine, outLine, typeList[0])}} 
</template>
<script>
export default {
    props: {
        networkFlowType: {
            type: String,
            default: 'rtt'
        },
        site: {
            type: String,
            default: 'HK'
        },
        bgpList: {
            type: Array
        },
        tableData: {
            type: Object
        },
        range: {
            type: Array,
            default: () => [130, 200]
        },
        typeList: {
            type: Array,
            default: () => ['outside', 'intermediate', 'inside']
        },
        loading: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            columnHeight: 50,
            circleSize1: 34,
            circleSize2: 14,
            r1: 0,
            r2: 0,
            columns: [],
            colorList: [
                'green lighten-2',
                'yellow lighten-2',
                'red lighten-2',
                'grey lighten-2',
                'blue lighten-2', // Global
                'pink lighten-4', // China
                'brown lighten-3', // R1
                'blue-grey lighten-3' // R2
            ]
        }
    },
    watch: {
        bgpList() {
            this.sortColums()
        }
    },
    methods: {
        // 計算 r1 r2 分別的數量
        // 以及排序 欄位的順序 R1 > R2
        sortColums() {
            var r1 = []
            var r2 = []

            this.bgpList.map(function(bgp) {
                if (bgp.indexOf('R1') >= 0) {
                    r1.push(bgp)
                } else {
                    r2.push(bgp)
                }
            })

            this.r1 = r1.length
            this.r2 = r2.length
            this.columns = r1.concat(r2)
        },
        // BGP Name 文字處理
        linetext(line) {
            return line.substring(0, line.indexOf('-'))
        },
        // 取得 Range 最大最小值
        getMaxAndMin() {
            var range = this.range

            const max = range[0] >= range[1] ? range[0] : range[1]
            const min = range[0] <= range[1] ? range[0] : range[1]

            return {
                max: max,
                min: min
            }
        },
        // 利用 bgp sort name 最後一個字元，判斷 China or global
        getCorGColor(string) {
            return string.substr(-1) == 'C'
                ? this.colorList[5]
                : this.colorList[4]
        },
        // 根據 inLine, OutLine, Type 輸出對應的數值
        getSource(inLine, outLine, type) {
            if (!this.tableData[inLine]) {
                return null
            }

            if (!this.tableData[inLine][outLine]) {
                return null
            }

            if (!this.tableData[inLine][outLine][type]) {
                return null
            }

            return this.tableData[inLine][outLine][type][this.networkFlowType]
        },
        // 根據 flow ，輸出對應的顏色
        getColor(flow) {
            const range = this.getMaxAndMin()

            // null 或是 不存在 都是灰色
            if (flow === null || flow === undefined) {
                return this.colorList[3]
            }

            switch (this.networkFlowType) {
                // 越高越好
                case 'availability':
                    if (flow >= range['max']) {
                        return this.colorList[0]
                    } else if (flow > range['min']) {
                        return this.colorList[1]
                    }
                    break

                // 越低越好
                case 'rtt':
                case 'packetloss':
                case 'latency':
                    if (flow <= range['min']) {
                        return this.colorList[0]
                    } else if (flow < range['max']) {
                        return this.colorList[1]
                    }
                    break
            }

            // 中間值，黃色
            return this.colorList[2]
        }
    },
    created() {
        this.sortColums()
    },
    mounted() {
        // this.sortColums()
    }
}
</script>

<style lang="scss" scoped>
.table_border {
    border-width: 3px;
    border-style: dashed;
    border-color: grey;
}
.v-nxn-table {
    th {
        user-select: auto;
        text-align: center !important;
        width: 70px;
        min-width: 70px;
        white-space: pre; //辨認換行符
    }
    td {
        text-align: center !important;
        width: 70px;
        min-width: 70px;
    }
}
</style>
