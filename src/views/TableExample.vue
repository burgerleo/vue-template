<template lang="pug">
    v-container(grid-list-lg)
        v-layout
            v-flex(xs12 sm12 md12)
                v-card
                    v-toolbar(flat white)
                        v-toolbar-title Table Example
                        v-divider.mx-4(inset vertical)
                        v-text-field(v-model="searchText" append-icon="mdi-magnify" label='Search' single-line hide-details )
                        v-divider.mx-4(inset vertical)
                        v-spacer
                        v-btn.mb-2.mr-2(color="primary" dark @click="loading = !loading") Loading Switch
                        v-btn.mb-2.mr-2(color="primary" dark @click="clearFilter") clear Filter
                        v-btn.mb-2.mr-2(color="primary" dark @click="newDialog") Add
                        v-btn.mb-2.mr-2(color="primary" dark @click="init")
                            v-icon mdi-refresh
                        v-menu.mx-0.px-0(offset-y left) 
                            template(v-slot:activator="{on}")
                                v-btn.mx-0.px-0.mb-2(icon v-on="on")
                                    v-icon mdi-dots-vertical
                            v-list
                                v-list-item(@click="init")
                                    v-list-item-title Test List 1
                                v-list-item(@click="init")
                                    v-list-item-title Test List 2
                                v-list-item(@click="init")
                                    v-list-item-title Test List 3

                    DataTable2(ref="table2" :headers="headers" :items="desserts" :searchText="searchText" :searchList="searchList" :defaultItemsPerPage="itemsPerPage" :itemsPerPageList="itemsPerPageList" :loading="loading" @showDialog="dialogSwitch" :setUripath="jkbURI" :setLinkMethod="setLinkMethod")

                v-row.px-3.py-3
                    v-btn.mb-2.mr-2(color="primary" dark @click="stopIcon") Icon  
                        v-icon mdi-play-pause
                    v-btn.mb-2.mr-2(color="primary" dark @click="playIcon") Icon 
                        v-icon mdi-play
                    v-btn.mb-2.mr-2(color="primary" dark @mouseover="stopIcon" @mouseleave="playIcon") hover 
                    lottie(:options="defaultOptions" :width="60" :height="60" v-on:animCreated="handleAnimation")
                    lottie(:options="defaultOptions2" :width="60" :height="60" v-on:animCreated="handleAnimation")
                v-row.px-1.py-1
                    v-col(cols="6")
                        DataTable3(:bgpList="bgpList" :tableData="tableData" :loading="loading2")
                    v-col(cols="6")
                        v-btn.mb-2.mr-2(color="primary" dark @click="setTableData") Reset Data  

                        v-btn.mb-2.mr-2(color="primary" dark @click="addBgplist") Add BGP List
                        v-btn.mb-2.mr-2(color="primary" dark @click="loading2 = !loading2") Loading Switch

                        div bgpList({{bgpList.length}}):
                        pre {{bgpList}}

                v-row.px-1.py-1
                    v-col(cols="12")
                        div
                            v-btn.mb-2.mr-2(color="primary" dark @click="addString") Add String
                            v-btn.mb-2.mr-2(color="primary" dark @click="hideBufferSizeBar = !hideBufferSizeBar") Switch BufferSizeBar
                            v-btn.mb-2.mr-2(color="primary" dark @click="hideTextSizeBar = !hideTextSizeBar") Switch TextSizeBar
                            
                        InstantText(ref="textbox" :defaultBufferSize="defaultBufferSize1" :defaultTextSize="14" :hideBufferSizeBar="hideBufferSizeBar" :hideTextSizeBar="hideTextSizeBar" :stringKeys="stringKey1" :bufferSizeRange="bufferSizeRange1")
                
                v-row.px-1.py-1
                    v-col(cols="6")
                        div
                            v-btn.mb-2.mr-2(color="primary" dark @click="addString2") Add String2
                            v-btn.mb-2.mr-2(color="primary" dark @click="stringDisplayModule = !stringDisplayModule") Switch Display Module
                        InstantText(ref="textbox2" :hideBufferSizeBar="hideBufferSizeBar" :hideTextSizeBar="hideTextSizeBar" :stringKeys="stringKeys2" :startString="startString2" :stringDisplayModule="stringDisplayModule")

            v-dialog(v-model="dialog.add" max-width="460" scrollable persistent)
                v-card
                    v-card-title.title {{formTitle}}
                    v-card-text
                        v-form(ref="form" onsubmit="return false;")
                            v-text-field(v-if="editedIndex !== -1" v-model="formData.number" label="Number" type="text" name="name" readonly)
                            
                            v-text-field(v-model="formData.name" label="Name" type="text" name="name" :rules="[rules.required]")
                            
                            v-select(v-model="formData.good" :items="['Yes','No']" label="Good")
                            
                            v-combobox(v-model="formData.tag" :items="['A','B','C','D']" label="Tag" hide-selected dense hide-details)
                                template(v-slot:no-data)
                                    v-card-text No results matching 
                            v-text-field(v-model="formData.url" label="URL Search" type="search" name="path")

                            v-text-field(v-model="formData.remark" label="Remark" type="text" name="remark")
                    v-card-actions  
                        v-spacer
                        v-btn(color="grey" @click="closeDialog") Cancel
                        v-btn(color="primary" @click="save") Save

            v-dialog.delete-dialog(v-model="dialog.delete" max-width="460" persistent)
                v-card
                    v-card-title.title {{formTitle}}
                    v-card-text Are you sure want to delete {{formData.name}}?
                    v-card-actions  
                        v-spacer
                        v-btn(color="grey" @click="closeDialog") Cancel
                        v-btn(color="primary" @click="deleteFormData") Yes
</template>

<script>
import textFieldRules from '../utils/textFieldRules'
import DataTable2 from '../components/DataTable2'
import DataTable3 from '../components/NxnH7CirlesTable'
import InstantText from '../components/InstantText'
import addJson from '../assets/icon/add/add.json'
import toggleJson from '../assets/icon/toggle/toggle.json'
import dateFormat from '../utils/dateFormat'

export default {
    name: 'tableExample',
    mixins: [textFieldRules, dateFormat],

    components: {
        DataTable2,
        DataTable3,
        InstantText
    },
    data() {
        return {
            // DataTable2 使用的參數 start
            searchText: '',
            searchList: {},
            page: 1,
            pageCount: 0,
            itemsPerPage: 5,
            itemsPerPageList: [5, 15, 25, 50, 100, 500],
            editedIndex: -1,
            formTitle: '',
            dialog: {
                add: false,
                delete: false
            },
            formData: {},
            headers: [
                {
                    text: '#',
                    align: 'center',
                    sortable: false,
                    width: '50px',
                    value: 'index'
                },
                {
                    text: 'Number',
                    align: 'left',
                    sortable: true,
                    value: 'number'
                },
                {
                    text: 'Name',
                    align: 'left',
                    sortable: true,
                    value: 'name'
                },
                {
                    text: 'Good',
                    align: 'left',
                    sortable: true,
                    value: 'good'
                },
                {
                    text: 'Tag',
                    align: 'left',
                    sortable: true,
                    search: false,
                    value: 'tag',
                    combobox: ['A', 'B', 'C', 'D']
                },
                {
                    text: 'Link',
                    align: 'left',
                    sortable: true,
                    value: 'url',
                    href: true
                },
                {
                    text: 'Remark',
                    align: 'left',
                    sortable: true,
                    width: '200px',
                    value: 'remark',
                    search: false
                },
                {
                    text: 'Actions',
                    align: 'left',
                    sortable: false,
                    width: '100px',
                    value: 'actions',
                    edit: true,
                    delete: true
                }
            ],
            desserts: [],
            loading: true,
            jkbURI: 'https://www.google.com.tw/',
            setLinkMethod: (uri, value = null) => {
                return uri + 'search?q=' + value
            },
            // DataTable2 使用的參數 end

            // 動態 icon 1 預設值
            defaultOptions: {
                animationData: addJson,
                loop: true,
                autoplay: true
            },
            // 動態 icon 2 預設值
            defaultOptions2: {
                animationData: toggleJson,
                loop: true,
                autoplay: true
            },
            // 動態 icon 建立後存放
            defaultAnim: [],

            bgpList: [
                'CUG-HKR2C',
                'CUG-HKR1C',
                'CMI-HKR2C',
                'CMI-HKR1C',
                'TWG-HKR1C',
                'TWG-HKR2C'
            ],
            tableData: {},
            loading2: false,

            // string Module

            hideBufferSizeBar: false,
            hideTextSizeBar: false,
            stringDisplayModule: false,
            bufferSizeRange1: [1, 200],
            defaultBufferSize1: 4,

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

            // string Module
        }
    },
    watch: {},
    methods: {
        handleAnimation(anim) {
            this.defaultAnim.push(anim)
        },
        dialogSwitch(bool, item) {
            bool ? this.editDialog(item) : this.deleteDialog(item)
        },
        newDialog() {
            this.formTitle = 'Add ...'
            this.dialog.add = true
            this.formData = {}
            this.formData.id = -1

            this.defaultAnim.pause()
        },
        editDialog(item) {
            this.formTitle = 'Edit ...'
            this.dialog.add = true
            this.editedIndex = this.desserts.indexOf(item)
            this.formData = {}
            this.formData = Object.assign({}, item)
        },
        deleteDialog(item) {
            this.formTitle = 'Delete ...'
            this.dialog.delete = true
            this.formData = item
        },
        closeDialog() {
            this.dialog.add = false
            this.dialog.delete = false
            this.formData = {}
        },
        init() {
            // this.$store.dispatch('global/startLoading')

            this.desserts = [
                {
                    number: 'F001',
                    name: 'ooopopo',
                    remark: 'is very good',
                    good: 'Yes',
                    tag: 'A',
                    url: 'hiero7'
                },
                {
                    number: 'F007',
                    name: 'Elaine',
                    remark: 'is very good',
                    good: 'Yes',
                    tag: 'A',
                    url: 'Elaine'
                },
                {
                    number: 'F009',
                    name: 'leo',
                    remark: 'is very bad',
                    good: 'No',
                    tag: 'B',
                    url: 'Leo'
                },
                {
                    number: 'F022',
                    name: 'leo',
                    remark: 'is very good',
                    good: 'Yes',
                    tag: 'A',
                    url: 'Leo'
                }
            ]
            this.loading = false
            // do something ...
        },
        addFormData() {
            // do something ...
            this.formData.number =
                'F' + Math.floor(Math.random() * (100 - 1)) + 1
            this.desserts.push(this.formData)
        },
        updateFormData() {
            // do someting ...
            this.desserts.splice(this.editedIndex, 1, this.formData)
        },
        deleteFormData() {
            // do someting ...
            this.desserts.splice(this.editedIndex, 1)
            this.closeDialog()
        },
        save() {
            // 表單驗證
            if (!this.validateForm()) {
                return
            }

            // 判斷是否執行哪一種 API
            // Create / Update
            if (this.editedIndex > -1) {
                this.updateFormData()
            } else {
                this.addFormData()
            }
            this.closeDialog()
        },
        validateForm() {
            // 驗證表單資料
            return this.$refs.form.validate()
        },
        clearFilter(value, search, item) {
            this.searchList = {}
            this.searchText = ''
            this.$refs.table2.$emit('clearAllFilter')
        },
        stopIcon() {
            this.defaultAnim.map(function(anim) {
                anim.pause()
            })
        },
        playIcon() {
            this.defaultAnim.map(function(anim) {
                anim.play()
            })
        },

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
        },

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
        document.title = 'Table Example'
        this.init()
        this.setTableData()

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
