<template lang="pug">
    #InstantText        
        div
            v-subheader(v-if="!hideBufferSizeBar") Buffer Size
                v-slider.align-center(v-model="bufferSize" :min="bufferSizeRange[0]" :max="bufferSizeRange[1]" hide-details thumb-label="always" thumb-size="36" step='1')
            v-subheader(v-if="!hideTextSizeBar") Text Size
                v-slider.align-center(v-model="textSize" :min="textSizeRange[0]" :max="textSizeRange[1]" hide-details thumb-label="always" thumb-size="36" step='1')

        div.area(:style="`font-size: ${textSize}px;`")
            template(v-for="(string, line) in stringArray")
                div
                    b(:class="startString.color" :style="`color: ${startString.color} !important`" v-if="startString.display") {{startString.value}}&thinsp;
                    template(v-for="(key, index) in stringKeys") 
                        div.d-inline(:class="key.color" :style="`color: ${key.color} !important`") {{string[key.value]}}
                            template(v-if="key.default") {{key.default}}
                        template(v-if="index != (stringKeyCount - 1) && key.space !== false") &thinsp;
                        template(v-if="index != (stringKeyCount - 1)")
                            template(v-for="(a) in getColumnDiffLength(string, index)") &nbsp;

</template>
<script>
import dateFormat from '../utils/dateFormat'

export default {
    mixins: [dateFormat],

    props: {
        // 每一行的起始文字 or 符號
        startString: {
            type: Object,
            default: function() {
                return {
                    value: '>', // 起始符號 or 文字
                    color: 'red--text text--lighten-2', // 顏色 可接受 vuetify cass name or 色碼(開頭要有# 號)
                    display: true // 是否需要顯示
                }
            }
        },
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
        textSizeRange: {
            type: Array,
            default: () => [10, 24]
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
                {
                    value: 'example', // 要顯示的 Key
                    color: '', // 顏色 可接受 vuetify cass name or 色碼(開頭要有# 號)
                    space: true, //是否要保留文字後面的空白
                    default: '' ///在文字的最後補上的字元
                }
            ]
        }
    },
    data() {
        return {
            textSize: this.defaultTextSize,
            bufferSize: this.defaultBufferSize,

            stringKeyCount: 0,
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
                if (origin[key.value]) {
                    list[key.value] = origin[key.value].slice(0, bufferSize)
                }
            })

            this.columnLengthArray = list
        },

        // 計算每一個欄位後面需要追加多少個空白
        // 回傳數量的 Array
        getColumnDiffLength(string, keyIndex) {
            var stringKeys = this.stringKeys
            var keyLen = this.stringKeyCount
            var diffLen = 0

            for (let index = keyIndex; index >= 0; index--) {
                var keys = stringKeys[index]
                var space = keys.space === false

                if (space && index == keyIndex) {
                    break
                }

                if (!space && index < keyIndex) {
                    break
                }

                if (string[keys.value] !== undefined) {
                    let len = string[keys.value].toString().length

                    diffLen +=
                        Math.max(...this.columnLengthArray[keys.value]) - len
                }
            }

            return [...Array(diffLen).keys()]
        },

        // 計算 Key 總數
        setStringKeyCount() {
            this.stringKeyCount = this.stringKeys.length
        }
    },
    created() {
        this.setStringKeyCount()
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
.d-inline {
    display: inline;
}
</style>
