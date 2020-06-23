<template lang="pug">
    v-container(grid-list-lg)
        v-layout
            v-flex(xs12 sm12 md12)
                v-card
                    v-data-table.elevation-1(:headers="headers" :items="desserts" :search="searchText" dense :items-per-page="itemsPerPage" :page.sync="page" @page-count="pageCount = $event" hide-default-footer)
                        template(v-slot:top)
                            v-toolbar(flat white)
                                v-toolbar-title Critical Public IP
                                v-divider.mx-4(inset vertical)
                                v-text-field(v-model="searchText" append-icon="mdi-magnify" label="Search" single-line hide-details)
                                v-divider.mx-4(inset vertical)
                                v-spacer
                                v-btn.mb-2.mr-2(color="primary" dark @click="clearFilter") clear Filter
                                v-btn.mb-2.mr-2(color="primary" dark @click="newDialog") New CPIP
                                v-btn.mb-2.mr-2(color="primary" dark @click="init")
                                    v-icon mdi-refresh
                        template(v-slot:header="{item,index}")
                            tr
                                td 
                                td 
                                    v-text-field.mt-0.pt-0(v-model="searchList.cpip" width="10px" label="Search" single-line hide-details @input="filterOnlyColumn($event,'cpip')")
                                td 
                                    v-text-field.mt-0.pt-0(v-model="searchList.routes" width="10px" label="Search" single-line hide-details @input="filterOnlyColumn($event,'routes')")
                                td 
                                    v-text-field.mt-0.pt-0(v-model="searchList.country"  width="10px" label="Search" single-line hide-details @input="filterOnlyColumn($event,'country')")
                                td 
                                    v-text-field.mt-0.pt-0(v-model="searchList.province" width="10px" label="Search" single-line hide-details @input="filterOnlyColumn($event,'province')")
                                td 
                                    v-text-field.mt-0.pt-0(v-model="searchList.city"  width="10px" label="Search" single-line hide-details @input="filterOnlyColumn($event,'city')")
                                td 
                                    v-text-field.mt-0.pt-0(v-model="searchList.company"  width="10px" label="Search" single-line hide-details @input="filterOnlyColumn($event,'company')")
                                td 
                                    v-text-field.mt-0.pt-0(v-model="searchList.as_number"  width="10px" label="Search" single-line hide-details @input="filterOnlyColumn($event,'as_number')")
                                td 
                                    v-text-field.mt-0.pt-0(v-model="searchList.remark"  width="10px" label="Search" single-line hide-details @input="filterOnlyColumn($event,'remark')")
                                td 
                                    v-text-field.mt-0.pt-0(v-model="searchList.is_origin"  width="10px" label="Search" single-line hide-details @input="filterOnlyColumn($event,'is_origin')")
                                td 
                                    v-text-field.mt-0.pt-0(v-model="searchList.is_reachable"  width="10px" label="Search" single-line hide-details @input="filterOnlyColumn($event,'is_reachable')")

                        template(v-slot:item="{item,index}")
                            tr
                                td {{rowIndex(index)}}
                                td {{item.cpip}}
                                td {{item.routes}}
                                td {{item.country}}
                                td {{item.province}}
                                td {{item.city}}
                                td {{item.company}}
                                td {{item.as_number}}
                                td {{item.remark}}
                                td {{item.is_origin?'yes':'no'}}
                                td {{item.is_reachable?'yes':'no'}}
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
                            v-text-field(v-model="cpip.cpip" label="Critical Public IP" type="text" name="cpip" :rules="[rules.required]")
                            v-select(v-model="cpip.routes" :items="routesList" label="routes" :rules="[rules.required]")
                            v-text-field(v-model="cpip.remark" label="Remark" type="text" name="remark")
                            v-switch(v-model="cpip.is_origin" label="Is Origin" name="is_origin")
                            v-switch(v-if="editedIndex > -1" v-model="cpip.is_reachable" label="Is Reachable" name="is_reachable")
                    v-card-actions  
                        v-spacer
                        v-btn(color="grey" @click="closeDialog") Cancel
                        v-btn(color="primary" @click="save") Save

            v-dialog.delete-dialog(v-model="dialog.delete" max-width="600" persistent)
                v-card
                    v-card-title.title {{formTitle}}
                    v-card-text Are you sure want to delete 
                        b.red--text {{cpip.cpip}} ?
                    v-card-actions  
                        v-spacer
                        v-btn(color="grey" @click="closeDialog") Cancel
                        v-btn(color="primary" @click="destroy") Yes
</template>

<script>
import textFieldRules from '../utils/textFieldRules'

export default {
    name: 'CPIP',
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
            cpip: {},
            editedIndex: -1,
            dialog: {
                add: false,
                delete: false
            },
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
                    text: 'CPIP',
                    align: 'left',
                    sortable: true,
                    value: 'cpip'
                },
                {
                    text: 'Routes',
                    align: 'left',
                    sortable: true,
                    value: 'routes'
                },
                {
                    text: 'Country',
                    align: 'left',
                    sortable: true,
                    value: 'country'
                },
                {
                    text: 'Province',
                    align: 'left',
                    sortable: true,
                    value: 'province'
                },
                {
                    text: 'City',
                    align: 'left',
                    sortable: true,
                    value: 'city'
                },
                {
                    text: 'Company',
                    align: 'left',
                    sortable: true,
                    value: 'company'
                },
                {
                    text: 'AS Number',
                    align: 'left',
                    sortable: true,
                    value: 'as_number'
                },
                {
                    text: 'Remark',
                    align: 'left',
                    sortable: true,
                    value: 'remark'
                },
                {
                    text: 'Is Origin',
                    align: 'left',
                    sortable: true,
                    value: 'is_origin'
                },
                {
                    text: 'Is Reachable',
                    align: 'left',
                    sortable: true,
                    value: 'is_reachable'
                }
            ],
            desserts: [],
            searchList: {},
            copyDesserts: null
        }
    },
    watch:{

    },
    methods: {
        init: function() {
            this.$store.dispatch('global/startLoading')
            this.$store
                .dispatch('cpip/getInfo')
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
            this.formTitle = 'Add CPIP'
            this.dialog.add = true

            this.cpip = {
                cpip: '',
                routes: 'C',
                remark: '',
                is_origin: 0,
            }
        },
        editDialog: function(item) {
            this.formTitle = 'Edit CPIP'
            this.dialog.add = true
            this.editedIndex = this.desserts.indexOf(item)
            this.cpip = Object.assign({}, item)
        },
        deleteDialog: function(item) {
            this.formTitle = 'Delete CPIP'
            this.dialog.delete = true
            this.editedIndex = this.desserts.indexOf(item)
            this.cpip = item
        },
        closeDialog: function() {
            this.dialog.add = false
            this.dialog.delete = false
            this.cpip = {}
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
        store: function() {
            // 新增 API
            this.$store.dispatch('global/startLoading')
            this.$store
                .dispatch('cpip/createCPIP', this.cpip)
                .then(
                    function() {
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
        },
        update: function() {
            // Update API
            this.$store.dispatch('global/startLoading')
            this.$store
                .dispatch('cpip/updateCPIP', this.cpip)
                .then(
                    function() {
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
                        this.$store.dispatch('global/finishLoading')
                    }.bind(this)
                )
        },
        save() {
            // 判斷是否執行哪一種 API
            // Create / Update
            if (!this.validateForm()) {
                return
            }

            if (this.editedIndex > -1) {
                this.update()
            } else {
                this.store()
            }
            this.filterOnlyColumn()
            this.closeDialog()
        },
        destroy: function() {
            // 刪除 API
            this.$store.dispatch('global/startLoading')
            this.$store
                .dispatch('cpip/destroyCPIP', this.cpip)
                .then(
                    function() {
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
                        this.$store.dispatch('global/finishLoading')
                    }.bind(this)
                )

            this.filterOnlyColumn()
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
        clearFilter() {
            // 清空 Filter 條件
            this.searchList = {}
            this.searchText = ''
            this.backupAndRcoverData()
        },
        filterOnlyColumn(value, column) {
            // 根據 [欄位] 輸入的 [文字]，進行 Filter

            var searchResult

            if (! value) {
                delete this.searchList[column]
            } else {
                if ((column == 'is_origin' || column == 'is_reachable') && (value == 'no' || value == 'yes')) {
                    let tmpValue = value == 'yes' ? '1' : '0'
                    this.searchList[column] = tmpValue
                } else {
                    this.searchList[column] = value.trim()
                }
            }

            // 備份 and 還原資料
            this.backupAndRcoverData()

            // 先將要搜尋的文字轉成大寫
            for (var searchKey in this.searchList) {
                var searchString = this.searchList[searchKey]

                searchString = searchString.toString().toLocaleUpperCase()

                searchResult = this.desserts.filter(function(item) {
                    var searchData = item[searchKey]

                    if (searchData === null) {
                        return false
                    }

                    return (
                        searchData
                            .toString()
                            .toLocaleUpperCase()
                            .indexOf(searchString) !== -1
                    )
                })

                this.desserts = searchResult
            }
        },
        backupAndRcoverData() {
            // 備份與還原
            // 當備份無資料時會進行第一次備份
            // 之後都是使用還原
            var list
            if (this.copyDesserts == null) {
                // 備份資料
                list = this.desserts
                this.copyDesserts = list
            } else {
                // 還原資料
                list = this.copyDesserts
                this.desserts = list
            }
        }
    },
    mounted() {
        this.init()
    }
}
</script>
