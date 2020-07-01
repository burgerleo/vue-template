<template lang="pug">
    #InstantText        
        div
            v-subheader(v-if="!hideBufferSizeBar") Buffer Size
                v-slider.align-center(v-model="bufferSize" :max="bufferSizeRange[1]" :min="bufferSizeRange[0]" hide-details thumb-label="always" thumb-size="36" step='1')
            v-subheader(v-if="!hideTextSizeBar") Text Size
                v-slider.align-center(v-model="textSize" max="24" min="10" hide-details thumb-label="always" thumb-size="36" step='1')
        div.area(:style="`font-size: ${textSize}px;`")
            template(v-for="(string) in stringArray")
                div <b>{{">"}}&thinsp;</b>
                    template(v-for="(key,index) in stringKeys") 
                        template {{string[key]}}
                        template(v-if="index != (stringKeyCount - 1)") &thinsp;
                            template(v-for="(a) in getColumnDiffLength(string[key],key)") &nbsp;
        //- div
            div {{stringArray}}
</template>
<script>
import dateFormat from '../utils/dateFormat'

export default {
    mixins: [dateFormat],

    props: {
        defaultBufferSize: {
            type: Number,
            default: 14
        },
        defaultTextSize: {
            type: Number,
            default: 14
        },
        bufferSizeRange: {
            type: Array,
            default: () => [10, 100]
        },
        hideBufferSizeBar: {
            type: Boolean,
            default: false
        },
        hideTextSizeBar: {
            type: Boolean,
            default: false
        },
        stringKeys: {
            type: Array,
            default: () => [
                'created_at',
                'source',
                'domain',
                'changed_from_cname',
                // 'changed_from_provider_name',
                'changed_to_cname'
                // 'changed_to_provider_name'
            ]
        }
    },
    data() {
        return {
            textSize: this.defaultTextSize,
            bufferSize: this.defaultBufferSize,

            stringKeyCount: 5,
            originStringArray: [],
            origincolumnLengthArray: [],
            stringArray: [],
            columnLengthArray: []
        }
    },
    watch: {
        bufferSize(value) {
            this.setStringArray()
        }
    },
    methods: {
        // 計算各欄位文字長度
        // 塞入新的文字 Array
        addStringColumnLength(newStringArray = []) {
            var stringArray = this.originStringArray
            var list = this.origincolumnLengthArray

            newStringArray.map(function(item) {
                var keys = Object.keys(item)

                keys.map(function(key) {
                    if (!list[key]) {
                        list[key] = []
                    }

                    list[key].unshift(item[key].toString().length)
                })
                stringArray.unshift(item)
            })

            this.setStringArray()
        },
        // 設定真正要顯示的，文字量
        setStringArray() {
            var bufferSize = this.bufferSize
            var list = {}
            var origin = this.origincolumnLengthArray

            this.stringArray = this.originStringArray.slice(0, bufferSize)

            this.stringKeys.map(function(key) {
                list[key] = origin[key].slice(0, bufferSize)
            })

            this.columnLengthArray = list
        },

        // 計算每一個欄位後面需要追加多少個空白
        // 回傳數量的 Array
        getColumnDiffLength(string, key) {
            var len = string.toString().length

            var diffLen = Math.max(...this.columnLengthArray[key]) - len

            return [...Array(diffLen).keys()]
        },

        // 計算 Key 總數
        setStringKeyCount() {
            this.stringKeyCount = this.stringKeys.length
        }
    },
    created() {
        this.setStringKeyCount()
        var array = [
            {
                domain: 'acn.gbtABcd.com',
                source: 'iRouteCDN',
                changed_from_cname: 'cn.mxsjbjc.com.sspeeddns.com',
                changed_from_provider_name: '(SS_D11-CN)',
                changed_to_cname: 'cn.mxsjbjc.com.fastliii.com',
                changed_to_provider_name: '(H7_D11-CN)',
                created_at: '2020-06-30 16:26:24'
            },
            {
                domain: 'm.gbt0688.com',
                source: 'iRouteCDN',
                changed_from_cname: 'm.gbt0688.com.sspeeddns.com',
                changed_from_provider_name: '(SS_J32-2)',
                changed_to_cname: 's002-1050-j-0322.booster.dns.lejiashu.com',
                changed_to_provider_name: '(J32-2_Mother Domain)',
                created_at: '2020-06-30 16:19:23'
            },
            {
                domain: 'm.gbt0688.com',
                source: 'iRouteCDN',
                changed_from_cname: 's002-1050-j-0322.dns.com',
                changed_from_provider_name: '(J32-2_Mother Domain)',
                changed_to_cname: 'm.gbt0688.com.sspeeddns.com',
                changed_to_provider_name: '(SS_J32-2)',
                created_at: '2020-06-30 16:17:34'
            }
        ]

        for (let index = 0; index < 30; index++) {
            array.push({
                domain:
                    this.makerandomletter(this.getRandomByMinMax(3, 10)) +
                    '.' +
                    this.makerandomletter(this.getRandomByMinMax(3, 10)) +
                    '.com',
                source: 'iRouteCDN',
                changed_from_cname:
                    this.makerandomletter(this.getRandomByMinMax(3, 10)) +
                    '.' +
                    this.makerandomletter(this.getRandomByMinMax(3, 10)) +
                    '.' +
                    this.makerandomletter(this.getRandomByMinMax(3, 10)) +
                    '.cdn.com',
                changed_from_provider_name: '(J32-2_Mother Domain)',
                changed_to_cname:
                    this.makerandomletter(this.getRandomByMinMax(3, 10)) +
                    '.' +
                    this.makerandomletter(this.getRandomByMinMax(3, 10)) +
                    '.' +
                    this.makerandomletter(this.getRandomByMinMax(3, 10)) +
                    '.cdn.com',
                changed_to_provider_name: '(SS_J32-2)',
                created_at: this.dateFormat2(new Date())
            })
        }

        this.addStringColumnLength(array)
    },
    mounted() {
        this.$on('addString', function(stringArray = []) {
            this.addStringColumnLength(stringArray)
        })
    }
}
</script>

<style lang="scss" scoped>
.area {
    background-color: #282c34;
    font-family: monospace;
    width: 100%;
    color: #abb2bf;
    word-break: break-all;
    font-weight: 900;
    font-size: 14px;
}
</style>
