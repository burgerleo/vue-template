<template lang="pug">
    v-container(grid-list-lg)
        v-layout
            v-flex(xs12 sm12 md12)
                v-card
                    v-data-table.elevation-1(:headers="headers" :items="desserts" :search="searchText" dense :items-per-page="itemsPerPage" :page.sync="page" @page-count="pageCount = $event" hide-default-footer)
                        template(v-slot:top)
                            v-toolbar(flat white)
                                v-toolbar-title BGP Peer
                                v-divider.mx-4(inset vertical)
                                v-text-field(v-model="searchText" append-icon="mdi-magnify" label="Search" single-line hide-details)
                                v-divider.mx-4(inset vertical)
                                v-spacer
                                v-btn.mb-2.mr-2(color="primary" dark @click="clearFilter") clear Filter

                                v-dialog(v-model="dialog.add")
                                    template(v-slot:activator="{ on }")
                                        v-btn.mb-2(color="primary" dark @click="newDialog") New BGP
                        template(v-slot:header="{item,index}")
                            tr
                                td 
                                td 
                                    v-text-field.mt-0.pt-0(v-model="searchList.site" width="10px" label="Search" single-line hide-details @input="filterOnlyColumn($event,'site')")
                                td 
                                    v-text-field.mt-0.pt-0(v-model="searchList.isp" width="10px" label="Search" single-line hide-details @input="filterOnlyColumn($event,'isp')")
                                td 
                                    v-text-field.mt-0.pt-0(v-model="searchList.routes"  width="10px" label="Search" single-line hide-details @input="filterOnlyColumn($event,'routes')")
                                td 
                                    v-text-field.mt-0.pt-0(v-model="searchList.br" width="10px" label="Search" single-line hide-details @input="filterOnlyColumn($event,'br')")
                                td 
                                    v-text-field.mt-0.pt-0(v-model="searchList.wan"  width="10px" label="Search" single-line hide-details @input="filterOnlyColumn($event,'wan')")                                    
                                td 
                                    v-text-field.mt-0.pt-0(v-model="searchList.name"  width="10px" label="Search" single-line hide-details @input="filterOnlyColumn($event,'name')")                                    

                        template(v-slot:item="{item,index}")
                            tr
                                td {{rowIndex(index)}}
                                td {{item.site}}
                                td {{item.isp}}
                                td {{item.routes}}
                                td {{item.br}}
                                td {{getWAN(index)}}
                                td {{item.name}}
                                td 
                                    v-icon.mr-2(small @click="editDialog(item)") mdi-pencil
                                    v-icon.mr-2(small @click="deleteDialog(item)") mdi-delete
                        template(v-slot:footer) 
                            v-footer
                                v-col.text-right.pt-0.pl-0.pb-0(cols="12" sm="2")
                                    div Items per page
                                v-col.text-center.pt-0.pl-0.pb-0(cols="12" sm="2")
                                    v-select.mt-0.pt-0(:value="itemsPerPage" :items="itemsPerPageList" menu-props="auto" label="Items per page" hide-details single-line  @change="itemsPerPage = parseInt($event, 10)")
                                v-col.text-right.pt-0.pl-0.pb-0 {{getFooterText()}}
                                v-col.text-right.pt-0.pl-0.pb-0 
                                    v-pagination(v-model="page" :length="pageCount")

            v-dialog(v-model="dialog.add" max-width="460" scrollable persistent)
                v-card
                    v-card-title.title {{formTitle}}
                    v-card-text
                        v-form(ref="form" onsubmit="return false;")
                            v-select(v-model="bgp.site" :items="siteList" label="Site"  :rules="[rules.required]" @change="shortName")
                            v-select(v-model="bgp.isp" :items="ispList" label="Peer ISP" :rules="[rules.required]" @change="shortName")
                            v-select(v-model="bgp.routes" :items="routesList" label="Routes"  :rules="[rules.required]" @change="shortName")
                            v-select(v-model="bgp.br" :items="brList" label="BR" :rules="[rules.required]" @change="shortName")
                            v-text-field(v-model="bgp.wan" label="WAN Link" type="text" name="WAN")
                            v-text-field(v-model="bgp.name" label="Short Name" type="text" name="name" readonly :rules="[rules.required]")
                    v-card-actions  
                        v-spacer
                        v-btn(color="grey" @click="closeDialog") Cancel
                        v-btn(color="primary" @click="save") Save

            v-dialog.delete-dialog(v-model="dialog.delete" max-width="600" persistent)
                v-card
                    v-card-title.title {{formTitle}}
                    v-card-text Are you sure want to delete 
                        b.red--text {{bgp.name}} ?
                    v-card-actions  
                        v-spacer
                        v-btn(color="grey" @click="closeDialog") Cancel
                        v-btn(color="primary" @click="destroy") Yes
</template>

<script>
import textFieldRules from '../utils/textFieldRules'

export default {
    name: 'BGP',
    mixins: [textFieldRules],
    components: {},
    data() {
        return {
            page: 1,
            pageCount: 0,
            itemsPerPage: 50,
            itemsPerPageList: [15, 25, 50, 100],
            searchText: '',
            formTitle: '',
            bgp: {},
            editedIndex: -1,
            dialog: {
                add: false,
                delete: false
            },
            siteList: ['HK', 'TW', 'PH'],
            ispList: [
                'PCCW',
                'TWG',
                'CUG',
                'CMI',
                'SING',
                'NTT',
                'TEL',
                'HKIX',
                'EQIX'
            ],
            brList: ['R1', 'R2'],
            routesList: ['C', 'G'],
            headers: [
                {
                    text: '#',
                    align: 'center',
                    sortable: false,
                    width: '50px',
                    value: 'index'
                },
                {
                    text: 'Site',
                    align: 'left',
                    sortable: true,
                    value: 'site'
                },
                {
                    text: 'Peer ISP',
                    align: 'left',
                    sortable: true,
                    value: 'isp'
                },
                {
                    text: 'Routes',
                    align: 'left',
                    sortable: true,
                    value: 'routes'
                },
                {
                    text: 'BR',
                    align: 'left',
                    sortable: true,
                    // width: '10px',
                    value: 'br'
                },
                {
                    text: 'WAN Link',
                    align: 'left',
                    sortable: true,
                    value: 'wan'
                },
                {
                    text: 'Short Name',
                    align: 'left',
                    sortable: true,
                    // width: '150px',
                    value: 'name'
                },
                {
                    text: 'Actions',
                    align: 'left',
                    sortable: false,
                    width: '100px',
                    value: 'actions'
                }
            ],
            desserts: [],
            searchList: {},
            copyDesserts: null
        }
    },
    methods: {
        init: function() {
            this.$store.dispatch('global/startLoading')
            this.$store
                .dispatch('bgp/getInfo')
                .then(
                    function(result) {
                        this.desserts = result.data
                        this.copyDesserts = result.data

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
        newDialog: function() {
            this.formTitle = 'Add BGP Peer'
            this.dialog.add = true

            this.bgp = {
                id: -1,
                site: 'HK',
                isp: 'TWG',
                routes: 'G',
                br: 'R1'
            }

            this.shortName()
        },
        editDialog: function(item) {
            this.formTitle = 'Edit BGP Peer'
            this.dialog.add = true
            this.editedIndex = this.desserts.indexOf(item)
            this.bgp = Object.assign({}, item)
            this.bgp.wan = this.buildWAN(this.bgp)
        },
        deleteDialog: function(item) {
            this.formTitle = 'Delete BGP Peer'
            this.dialog.delete = true
            this.editedIndex = this.desserts.indexOf(item)
            this.bgp = item
        },
        closeDialog: function() {
            this.dialog.add = false
            this.dialog.delete = false
            this.bgp = {}
            this.editedIndex = -1
        },
        getFooterText() {
            var max = this.desserts.length
            var maxStr = this.itemsPerPage * this.page

            if (maxStr > max) {
                maxStr = max
            }

            return (
                'Displaying item ' +
                (this.itemsPerPage * (this.page - 1) + 1) +
                '-' +
                maxStr +
                ' from ' +
                max +
                ' items.'
            )
        },
        getWAN: function(index) {
            //取得 完整 WAN Link ip/mask
            this.desserts[index].wan = this.buildWAN(this.desserts[index])

            return this.desserts[index].wan
        },
        buildWAN: function(bgp) {
            // 組合 WAN Link ip/mask
            if (bgp.wan_ip) {
                return bgp.wan_ip + '/' + bgp.wan_prefix
            }

            return null
        },
        shortName: function() {
            // 組合 Form shortName
            var shortName
            var list = this.bgp
            shortName = list.isp + '-' + list.site + list.br + list.routes
            this.bgp.name = shortName
        },
        store: function() {
            // 新增 API
            this.$store.dispatch('global/startLoading')
            this.$store
                .dispatch('bgp/createBGP', this.bgp)
                .then(
                    function(result) {
                        this.$store.dispatch(
                            'global/showSnackbarSuccess',
                            'Success!'
                        )
                        this.init()
                    }.bind(this)
                )
                .catch(
                    function(error) {
                        this.$store.dispatch(
                            'global/showSnackbarError',
                            error.message
                        )
                        this.init()
                    }.bind(this)
                )
            // this.desserts.push(this.bgp)
            // Object.assign(this.desserts[this.editedIndex], this.bgp)
        },
        update: function() {
            // Update API
            this.$store.dispatch('global/startLoading')
            this.$store
                .dispatch('bgp/updateBGP', this.bgp)
                .then(
                    function(result) {
                        this.$store.dispatch(
                            'global/showSnackbarSuccess',
                            'Success!'
                        )
                        this.init()

                        // this.$store.dispatch('global/finishLoading')
                    }.bind(this)
                )
                .catch(
                    function(error) {
                        this.$store.dispatch(
                            'global/showSnackbarError',
                            error.message
                        )
                        this.init()

                        // this.$store.dispatch('global/finishLoading')
                    }.bind(this)
                )
            // this.desserts.push(this.bgp)
        },
        save() {
            // 判斷是否執行哪一種 API
            // Create / Update
            if (!this.validateForm()) {
                return
            }

            if (this.bgp.wan) {
                var ips = this.bgp.wan.split('/')
                this.bgp.wan_ip = ips[0]
                this.bgp.wan_prefix = ips[1]
            } else {
                this.bgp.wan_ip = null
                this.bgp.wan_prefix = null
            }

            if (this.editedIndex > -1) {
                this.update()
            } else {
                this.store()
            }

            this.closeDialog()
        },
        destroy: function() {
            // 刪除 API
            this.$store.dispatch('global/startLoading')
            this.$store
                .dispatch('bgp/destroyBGP', this.bgp)
                .then(
                    function(result) {
                        this.$store.dispatch(
                            'global/showSnackbarSuccess',
                            'Success!'
                        )
                        this.init()

                        // this.$store.dispatch('global/finishLoading')
                    }.bind(this)
                )
                .catch(
                    function(error) {
                        this.$store.dispatch(
                            'global/showSnackbarError',
                            error.message
                        )
                        this.init()

                        // this.$store.dispatch('global/finishLoading')
                    }.bind(this)
                )

            // this.desserts.splice(this.editedIndex, 1)
            this.closeDialog()
        },
        rowIndex: function(index) {
            // 計算 每一列 Index 顯示 id
            return (this.page - 1) * this.itemsPerPage + index + 1
        },
        validateForm: function() {
            // 驗證表單資料
            return this.$refs.form.validate()
        },
        clearFilter(value, search, item) {
            // 清空 Filter 條件
            this.searchList = {}
            this.searchText = ''
            this.backupAndRcoverData()
        },
        filterOnlyColumn(value, column) {
            // 根據 [欄位] 輸入的 [文字]，進行 Filter

            var searchResult

            if (!value) {
                delete this.searchList[column]
            }

            // 備份 and 還原資料
            this.backupAndRcoverData()

            // 先將要搜尋的文字轉成大寫
            for (var searchKey in this.searchList) {
                var searchString = this.searchList[searchKey]
                    .toString()
                    .toLocaleUpperCase()

                searchResult = this.desserts.filter(function(item) {
                    if (item[searchKey]) {
                        return (
                            item[searchKey]
                                .toLocaleUpperCase()
                                .indexOf(searchString) !== -1
                        )
                    }
                    return false
                })

                this.desserts = searchResult
            }
        },
        backupAndRcoverData() {
            // 備份與還原
            // 當備份無資料時會進行第一次備份
            // 之後都是使用還原
            if (this.copyDesserts == null) {
                // 備份資料
                var list = this.desserts
                this.copyDesserts = list
            } else {
                // 還原資料
                var list = this.copyDesserts
                this.desserts = list
            }
        }
    },
    mounted() {
        this.init()
    }
}
</script>
