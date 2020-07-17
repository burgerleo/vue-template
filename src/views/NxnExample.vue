<template lang="pug">
    v-container(grid-list-lg)
        v-layout
            v-flex(xs12 sm12 md12)
                v-row.px-1.py-1
                    v-col(cols="7")
                        DataTable3(:bgpList="bgpList" :tableData="tableData" :loading="loading2")
                    v-col(cols="5")
                        v-btn.mb-2.mr-2(color="primary" dark @click="setTableData") Reset Data  

                        v-btn.mb-2.mr-2(color="primary" dark @click="addBgplist") Add BGP List
                        v-btn.mb-2.mr-2(color="primary" dark @click="loading2 = !loading2") Loading Switch

                        div bgpList({{bgpList.length}}):
                        pre {{bgpList}}
</template>

<script>
import dateFormat from '../utils/dateFormat'

import DataTable3 from '../components/NxnH7CirlesTable'

export default {
    name: 'tableExample',
    mixins: [dateFormat],

    components: {
        DataTable3
    },
    data() {
        return {
            bgpList: [
                'CUG-HKR2C',
                'CUG-HKR1C',
                'CMI-HKR2C',
                'CMI-HKR1C',
                'TWG-HKR1C',
                'TWG-HKR2C'
            ],
            tableData: {},
            loading2: false
        }
    },
    watch: {},
    methods: {
        addBgplist() {
            var bgpList = [...this.bgpList]
            var bgp =
                this.makerandomletter(3).toLocaleUpperCase() +
                '-HKR' +
                this.getRandomByMinMax(1, 2) +
                'C'

            bgpList.push(bgp)

            this.bgpList = [...new Set(bgpList)]
            this.setTableData()
        },
        setTableData() {
            var tableData = {}
            var bgpList = [...this.bgpList]
            var getRandomByMinMax = function(min = 0, max = 100) {
                // max - 期望的最大值
                // min - 期望的最小值
                parseInt(Math.random() * (max - min + 1) + min, 10)
                return Math.floor(Math.random() * (max - min + 1) + min)
            }

            bgpList.map(function(inLine) {
                if (!tableData[inLine]) {
                    tableData[inLine] = {}
                }

                bgpList.map(function(outLine) {
                    if (!tableData[inLine][outLine]) {
                        tableData[inLine][outLine] = {}
                    }

                    tableData[inLine][outLine] = {
                        outside: {
                            rtt: getRandomByMinMax(10, 250)
                        },
                        intermediate: {
                            rtt: getRandomByMinMax(80, 220)
                        },
                        inside: {
                            rtt: getRandomByMinMax(50, 250)
                        }
                    }
                })
            })

            this.tableData = tableData

            this.bgpList = JSON.parse(JSON.stringify(bgpList))
        }
    },
    mounted() {
        this.setTableData()

        for (let index = 0; index < 10; index++) {
            this.addString()
            this.addString2()
        }
    }
}
</script>

<style lang="scss" scoped>
.container {
    max-width: 100%;
}
.v-data-table {
    tr {
        user-select: auto;
    }
    .v-toolbar {
        .v-text-field {
            width: 0%;
        }
    }
}
</style>
