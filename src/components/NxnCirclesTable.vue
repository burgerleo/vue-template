<template lang="pug">
    #nxntable
        v-data-table.elevation-1(:headers="headers" :items="items" :dense="dense" :loading="loading" hide-default-header hide-default-footer :items-per-page="1000" @page-count="1000" )
            template(v-slot:header="{item,index}")
                tr
                    th.pl-0.pr-1.pb-1
                        v-avatar(tile width="100%" :height="columnHeight" color="transparent" dark ) 
                            h2 {{title + " In/Out"}}
                    th.pr-1.pl-0.pb-1(v-for="(outLine, value) in items") 
                        v-avatar(tile width="100%" :height="columnHeight"  :color="getCorGColor(outLine)" dark ) 
                            h2 {{linetext(outLine)}}
            template(v-slot:item="{item,index}")
                tr
                    th.pl-0.pr-1
                        v-avatar(tile width="100%" :height="columnHeight"  :color="getCorGColor(items[index])" dark )
                            h2 {{linetext(items[index])}}
                    th.pr-1.pl-0(v-for="(outLine, value) in items") 
                        div.text-center(:class="getColor(getSource(item, outLine, typeList[0]))")
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
        headers: {
            type: Array
        },
        items: {
            type: Array
        },
        nxn: {
            type: Object
        },
        dense: {
            type: Boolean,
            default: true
        },
        title: {
            type: String,
            default: 'HK'
        },
        range: {
            type: Array,
            default: [130, 200]
        },
        loading: {
            type: Boolean,
            default: true
        },
        typeList: {
            type: Array,
            default: ['outside', 'intermediate', 'inside']
        },
        networkFlowType: {
            type: String,
            default: 'availability'
        }
    },

    data() {
        return {
            columnHeight: 45,
            circleSize1: 34,
            circleSize2: 14,
            colorList: [
                'green lighten-2',
                'yellow lighten-2',
                'red lighten-2',
                'grey lighten-2',
                'blue lighten-2', // Global
                'pink lighten-4' // China
            ]
        }
    },
    methods: {
        linetext(line) {
            return line
                .substring(0, line.length - 1) // 移除最後一個字
                .replace('-' + this.title, '\n') // 移除 Site
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
        getCorGColor(string) {
            return string.substr(-1) == 'C'
                ? this.colorList[5]
                : this.colorList[4]
        },
        getColor(flow) {
            const range = this.getMaxAndMin()
            if (flow === null || flow === undefined ) {
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

            return this.colorList[2]
        },
        getSource(inLine, outLine, type) {
            if (!this.nxn[inLine]) {
                return null
            }

            if (!this.nxn[inLine][outLine]) {
                return null
            }

            if (!this.nxn[inLine][outLine][type]) {
                return null
            }

            return this.nxn[inLine][outLine][type][this.networkFlowType]
        }
    },
    created() {}
}
</script>
<style lang="scss" scoped>
.v-data-table {
    th {
        user-select: auto;
        min-width: 100px;
        max-width: 100px;
        width: 100px;
        white-space: pre; //辨認換行符
    }
}
</style>


