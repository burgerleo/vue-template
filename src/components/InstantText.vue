<template lang="pug">
    #InstantText        
        div
            //- v-btn.mb-2.mr-2(color="primary" dark @click="addString") Add String
            v-subheader Buffer Size
                v-slider.align-center(v-model="maxSize" :max="bufferSize[1]" :min="bufferSize[0]" hide-details thumb-label="always" thumb-size="36" step='1')
        div.area
            template(v-for="(string) in stringArray")
                div <b> {{">  "}} </b>
                    template(v-for="(key,index) in stringKey") 
                        template {{string[key]}}
                        template(v-if="index != keyLimit") &thinsp;
                            template(v-for="(a) in getColumnDiffLength(string[key],key)") &nbsp;
            //- div {{stringArray}}
</template>
<script>
import dateFormat from '../utils/dateFormat'

export default {
    mixins: [dateFormat],

    props: {
        maxSize: {
            type: Number,
            default: 14
        },
        bufferSize: {
            type: Array,
            default: () => [10, 100]
        }
        // loading: {
        //     type: Boolean,
        //     default: false
        // }
    },
    data() {
        return {
            keyLimit: 4,
            stringKey: [
                'created_at',
                'source',
                'domain',
                'changed_from_cname',
                // 'changed_from_provider_name',
                'changed_to_cname'
                // 'changed_to_provider_name'
            ],
            stringArray: [],
            columnLengthArray: []
        }
    },
    watch: {},
    methods: {
        addString(newSrting) {
            this.columnLength(newSrting)
        },
        // 計算各欄位文字長度
        // 塞入新的文字 Array
        columnLength(newStringArray = []) {
            var list = this.columnLengthArray

            var stringArray = this.stringArray

            newStringArray.map(function(item) {
                var keys = Object.keys(item)

                keys.map(function(key) {
                    if (!list[key]) {
                        list[key] = 0
                    }

                    list[key] =
                        item[key].length >= list[key]
                            ? item[key].toString().length
                            : list[key]
                })
                stringArray.unshift(item)
            })

            this.stringArray = stringArray
            this.columnLengthArray = list
        },
        // 計算每一個欄位後面需要追加多少個空白
        // 回傳數量的 Array
        getColumnDiffLength(string, key) {
            var len = string.toString().length

            var diffLen = this.columnLengthArray[key] - len

            return [...Array(diffLen).keys()]
        }
    },
    created() {
        this.columnLength([
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
        ])
    },
    mounted() {
        this.$on('addString', function(stringArray = []) {
            this.addString(stringArray)
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
