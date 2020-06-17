<template lang="pug">
    #dataTable3
        div.v-data-table__wrapper
            table.v-nxn-table
                thead.v-data-table-header
                    tr
                        th(rowspan="2" colspan="2") {{site + " In/Out"}} 
                        th(colspan="3") R1
                        th(colspan="3") R2
                    tr
                        th A
                        th B
                        th C
                        th A
                        th B
                        th C
                tbody
                    tr
                        th(rowspan="3") R1
                        th() A
                        td() 1
                        td() 2
                        td() 3
                        td() 1
                        td() 2
                        td() 3
                    tr
                        th() B
                        td() 1
                        td() 2
                        td() 3
                        td() 1
                        td() 2
                        td


            //- div.text-center(:class="getColor(getSource(item, outLine, typeList[0]))")
                v-tooltip(top)
                    template(v-slot:activator="{on}")
                        v-avatar(tile width="100%" :height="columnHeight"  color="transparent" dark v-on="on")
                            v-avatar(:size="circleSize1" color="black")
                                v-tooltip(top)
                                    template(v-slot:activator="{ on }")
                                        v-avatar(:size="circleSize1-4" :color="getColor(getSource(item, outLine, typeList[1]))" dark v-on="on")
                                            v-avatar(:size="circleSize2" color="black")
                                                v-tooltip(top)
                                                    template(v-slot:activator="{ on }")
                                                        v-avatar(:size="circleSize2-4" :color="getColor(getSource(item, outLine, typeList[2]))" dark v-on="on")
                                                    span {{getSource(item, outLine, typeList[2])}}       
                                    span {{getSource(item, outLine, typeList[1])}}
                    span {{getSource(item, outLine, typeList[0])}}
</template>
<script>
export default {
    props: {
        // headers: {
        //     type: Array
        // },
        // items: {
        //     type: Array
        // },
        // dense: {
        //     type: Boolean,
        //     default: true
        // },
        // hideFooter: {
        //     type: Boolean,
        //     default: true
        // },
        // searchText: {
        //     type: String,
        //     default: ''
        // }
    },
    data() {
        return {
            page: 1,
            pageCount: 0,
            itemsPerPage: 10,
            site: 'HK',
            r1: 0,
            r2: 0,
            bgplist: [
                'CUG-HKR1C',
                'TWG-HKR1C',
                'CMI-HKR1C',
                'CUG-HKR2C',
                'CMI-HKR2C',
                'TWG-HKR2C'
            ],
            bgplist2: {
                HK: [
                    'CUG-HKR1C',
                    'TWG-HKR1C',
                    'CMI-HKR1C',
                    'CUG-HKR2C',
                    'CMI-HKR2C',
                    'TWG-HKR2C'
                    // 'SING-HKR1G',
                    // 'PCCW-HKR2G'
                ],
                TW: [
                    'PCCW-TWR1C',
                    'TWG-TWR1C',
                    'TWG-TWR2C',
                    'PCCW-TWR2C',
                    'NTT-TWR1G',
                    'SING-TWR2G',
                    'PCCW-TWR2G',
                    'TEL-TWR2G'
                ],
                PH: ['TWG-PHR1G', 'PCCW-PHR2G']
            }
        }
    },
    methods: {
        // 計算 r1 r2 分別的數量
        setRCount() {
            var r1 = 0
            var r2 = 0

            this.bgplist.map(function(bgp) {
                if (bgp.indexOf('R1') >= 0) {
                    r1++
                } else {
                    r2++
                }
            })
            this.r1 = r1
            this.r2 = r2
        }
    },
    created() {
        this.setRCount()
    }
}
</script>
<style lang="scss" scoped>
.v-nxn-table {
    th {
        user-select: auto;
        text-align: center !important;
        // min-width: 100px;
        // max-width: 100px;
        // width: 100px;
        width: 50px;
        min-width: 50px;
        white-space: pre; //辨認換行符
    }
    td {
        text-align: center !important;

        width: 50px;
        min-width: 50px;
    }
}
</style>
