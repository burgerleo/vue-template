<template lang="pug">
    v-container(grid-list-lg)
        v-layout
            v-flex(xs12 sm12 md12)
                v-row.px-1.py-1
                    v-col(cols="12")
                        div
                            v-btn.mb-2.mr-2(color="primary" dark @click="addString") Add String
                            v-btn.mb-2.mr-2(color="primary" dark @click="hideLineCountBar = !hideLineCountBar") Switch LineCountBar
                            v-btn.mb-2.mr-2(color="primary" dark @click="hideTextSizeBar = !hideTextSizeBar") Switch TextSizeBar
                            
                        InstantText(ref="textbox" :defaultLineCount="defaultLineCount1" :defaultTextSize="14" :hideLineCountBar="hideLineCountBar" :hideTextSizeBar="hideTextSizeBar" :stringKeys="stringKey1" :lineCountRange="lineCountRange1")
                
                v-row.px-1.py-1
                    v-col(cols="12")
                        div
                            v-btn.mb-2.mr-2(color="primary" dark @click="addString2") Add String2
                            v-btn.mb-2.mr-2(color="primary" dark @click="stringDisplayModule = !stringDisplayModule") Switch Display Module
                        InstantText(ref="textbox2" :hideLineCountBar="hideLineCountBar" :hideTextSizeBar="hideTextSizeBar" :stringKeys="stringKeys2" :startString="startString2" :stringDisplayModule="stringDisplayModule")
</template>

<script>
import InstantText from '../components/InstantText'
import dateFormat from '../utils/dateFormat'

export default {
    name: 'tableExample',
    mixins: [dateFormat],

    components: {
        InstantText
    },
    data() {
        return {
            hideLineCountBar: false,
            hideTextSizeBar: false,
            stringDisplayModule: false,
            lineCountRange1: [1, 200],
            defaultLineCount1: 8,

            stringKey1: [
                {
                    value: 'created_at', // 要顯示的 Key
                    color: '', // 顏色 可接受 vuetify cass name or 色碼(開頭要有# 號)
                    space: true, //是否要保留文字後面的空白
                    default: '' //在文字的最後補上的字元
                },
                {
                    value: 'source',
                    color: '#fff59d'
                },
                {
                    value: 'domain',
                    color: 'red--text text--lighten-1',
                    space: true
                },
                {
                    value: 'changed_from_cname',
                    space: false
                },
                {
                    value: '(',
                    default: '(',
                    space: false
                },
                {
                    value: 'changed_from_provider_name',
                    color: 'red--text text--lighten-1',
                    space: false
                },
                {
                    value: ')',
                    default: ')',
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
                },
                {
                    value: '(',
                    default: '(',
                    space: false
                },
                {
                    value: 'changed_to_provider_name',
                    color: 'red--text text--lighten-1',
                    space: false
                },
                {
                    value: ')',
                    default: ')',
                    space: true
                }
            ],

            startString2: {
                value: '●', // 起始符號 or 文字
                color: 'blue--text text--lighten-2', // 顏色 可接受 vuetify cass name or 色碼(開頭要有# 號)
                display: true // 是否需要顯示
            },
            stringKeys2: [
                {
                    value: 'string'
                }
            ]
        }
    },
    watch: {},
    methods: {
        // string Module
        addString() {
            this.$refs.textbox.$emit('addString', [
                {
                    domain:
                        this.makerandomletter(this.getRandomByMinMax(3, 10)) +
                        '.' +
                        this.makerandomletter(this.getRandomByMinMax(3, 10)) +
                        '.com',
                    source: this.getRandomByMinMax(0, 1) ? 'iRouteCDN' : 'uCDN',
                    changed_from_cname:
                        this.makerandomletter(this.getRandomByMinMax(3, 10)) +
                        '.' +
                        this.makerandomletter(this.getRandomByMinMax(3, 10)) +
                        '.cdn.com',
                    changed_from_provider_name:
                        this.makerandomletter(1) +
                        this.getRandomByMinMax(10, 99) +
                        '-' +
                        this.getRandomByMinMax(1, 9),
                    changed_to_cname:
                        this.makerandomletter(this.getRandomByMinMax(3, 10)) +
                        '.' +
                        this.makerandomletter(this.getRandomByMinMax(3, 10)) +
                        '.cdn.com',
                    changed_to_provider_name:
                        this.makerandomletter(1) +
                        this.getRandomByMinMax(10, 99) +
                        '-' +
                        this.getRandomByMinMax(1, 9),

                    created_at: this.dateFormat2(new Date())
                }
            ])
        },

        addString2() {
            this.$refs.textbox2.$emit('addString', [
                {
                    string:
                        '64 bytes from 114.114.114.114: icmp_req=1 ttl=' +
                        this.getRandomByMinMax(50, 100) +
                        ' time=' +
                        this.getRandomByMinMax(100, 300) +
                        ' ms'
                }
            ])
        }

        // string Module
    },
    mounted() {
        // string Module
        for (let index = 0; index < 10; index++) {
            this.addString()
            this.addString2()
        }

        // string Module
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
