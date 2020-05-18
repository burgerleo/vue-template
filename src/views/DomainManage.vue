<template lang="pug">
    v-container(grid-list-lg)
        v-layout
            v-flex(xs12 sm12 md12)
                v-card
                    v-data-table.elevation-1(:headers="headers" :items="desserts" :search="searchText" dense :items-per-page="itemsPerPage" :page.sync="page" @page-count="pageCount = $event" hide-default-footer)
                        template(v-slot:top)
                            v-toolbar(flat white)
                                v-toolbar-title FQDN Management
                                v-divider.mx-4(inset vertical)
                                v-text-field(v-model="searchText" append-icon="mdi-magnify" label="Search" single-line hide-details @keydown.enter="onSearch" @click:append="onSearch")
                                v-divider.mx-4(inset vertical)
                                v-spacer
                                v-btn.mb-2.mr-2(color="primary" dark @click="clearFilter") clear Filter
                                v-btn.mb-2.mr-2(color="primary" dark @click="init")
                                    v-icon mdi-refresh
                                //- v-menu(offset-y)
                                    template(v-slot:activator="{on}")
                                        v-btn(icon small color="primary" v-on="on")
                                            v-icon mdi-dots-vertical
                                    v-list(width="250px")
                                        v-list-item-group
                                            v-list-item
                                                v-list-item-content(@click="clearFilter") Download Origin IP/FQDN

                        template(v-slot:header="{item,index}")
                            tr
                                td #
                                td 
                                    v-text-field.mt-0.pt-0(v-model="searchList.domain" width="10px" label="Search" single-line hide-details @input="filterOnlyColumn($event,'domain')")
                                td 
                                    v-text-field.mt-0.pt-0(v-model="searchList.ip" width="10px" label="Search" single-line hide-details @input="filterOnlyColumn($event,'ip')")
                                td 
                                    v-text-field.mt-0.pt-0(v-model="searchList.attacked"  width="10px" label="Search" single-line hide-details @input="filterOnlyColumn($event,'attacked')")
                                td 
                                    v-text-field.mt-0.pt-0(v-model="searchList.quality" width="10px" label="Search" single-line hide-details @input="filterOnlyColumn($event,'quality')")
                                td 
                                    v-text-field.mt-0.pt-0(v-model="searchList.incdn"  width="10px" label="Search" single-line hide-details @input="filterOnlyColumn($event,'incdn')")                                    
                                td 
                                    v-text-field.mt-0.pt-0(v-model="searchList.update"  width="10px" label="Search" single-line hide-details @input="filterOnlyColumn($event,'update')")                                    

                        template(v-slot:item="{item,index}")
                            tr
                                td {{rowIndex(index)}}
                                td {{item.domain}}
                                td {{item.ip}}
                                //- td {{item.originIp}}
                                td {{item.attacked}}
                                td {{item.quality}}
                                td {{item.incdn}}
                                //- td {{item.who}}
                                td {{item.update}}
                                td 
                                    v-icon.mr-2(small @click="editDialog(item)") mdi-pencil
                                    //- v-icon.mr-2(small @click="deleteDialog(item)") mdi-delete
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
                            v-text-field(v-model="formData.domain" label="Customer FQDN" type="text" name="domain" readonly)
                            v-text-field(v-model="formData.ip" label="Origin IP/FQDN" type="text" name="origin" readonly)
                            b Frequently Attacked
                            v-radio-group.pt-0(v-model='formData.attacked' row) 
                                v-radio(v-for="bool,index in yesOrNo" :label="bool" :value="bool" :key="index")
                            b Quality Issue
                            v-radio-group.pt-0(v-model='formData.quality' row)
                                v-radio(v-for="bool,index in yesOrNo" :label="bool" :value="bool" :key="index")
                            //- b inCDNBest
                            //- v-radio-group(v-model='formData.quality' row readonly) 
                                v-radio(v-for="bool,index in ['No', 'Yes']" :label="bool" :value="index" :key="index")
                    v-card-actions  
                        v-spacer
                        v-btn(color="grey" @click="closeDialog") Cancel
                        v-btn(color="primary" @click="save") Save

            //- v-dialog.delete-dialog(v-model="dialog.delete" max-width="460" persistent)
                v-card
                    v-card-title.title {{formTitle}}
                    v-card-text Are you sure want to delete {{formTitle.domain}}?
                    v-card-actions  
                        v-spacer
                        v-btn(color="grey" @click="closeDialog") Cancel
                        v-btn(color="primary" @click="deleteDummy") Yes
</template>

<script>
import textFieldRules from '../utils/textFieldRules'

export default {
    name: 'DomainManage',
    mixins: [textFieldRules],

    components: {},
    data() {
        return {
            doSearchText: '',
            searchText: '',
            page: 1,
            pageCount: 0,
            itemsPerPage: 50,
            itemsPerPageList: [25, 50, 100, 500],
            editedIndex: -1,
            formTitle: '',
            dialog: {
                add: false,
                delete: false
            },
            yesOrNo: ['No', 'Yes'],
            headers: [
                {
                    text: '#',
                    align: 'center',
                    sortable: false,
                    width: '50px',
                    value: 'index'
                },
                {
                    text: 'Customer FQDN',
                    align: 'left',
                    sortable: true,
                    value: 'domain'
                },
                {
                    text: 'Origin IP/FQDN',
                    align: 'left',
                    sortable: true,
                    value: 'ip'
                },
                // 等待 Tony 確認清楚機制再決定是否使用
                // {
                // text: 'Origin IP',
                // align: 'left',
                // sortable: true,
                // value: 'ip'
                // },
                {
                    text: 'FrequentlyAttacked',
                    align: 'left',
                    sortable: true,
                    width: '165px',
                    value: 'attacked'
                },
                {
                    text: 'QualityIssue',
                    align: 'left',
                    sortable: true,
                    width: '130px',
                    value: 'quality'
                },
                {
                    text: 'inCDNBest',
                    align: 'left',
                    sortable: true,
                    width: '130px',
                    value: 'incdn'
                },
                // 未來 RBAC 有做出來在使用
                // {
                //     text: 'UpdatedBy',
                //     align: 'left',
                //     sortable: true,
                //     value: 'who'
                // },
                {
                    text: 'update',
                    align: 'left',
                    sortable: true,
                    value: 'update'
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
            copyDesserts: [],
            dialogData: {},
            formData: {},
            totalPage: 1,
            perPageCount: 500,
            total: 0
        }
    },
    watch: {},
    methods: {
        newDialog() {
            this.formTitle = 'Add ...'
            this.dialog.add = true
            this.formData = {}
            this.formData.id = -1
        },
        editDialog(item) {
            this.formTitle = 'Edit FQDN'
            this.dialog.add = true
            this.editedIndex = this.desserts.indexOf(item)
            this.formData = {}
            this.formData = Object.assign({}, item)
        },
        deleteDialog(item) {
            this.formTitle = 'Delete FQDN'
            this.dialog.delete = true
            this.formData = item
        },
        closeDialog() {
            this.dialog.add = false
            this.dialog.delete = false
            this.formData = {}
        },
        init() {
            this.$store.dispatch('global/startLoading')

            var page = 1
            var needLoop = 1
            this.desserts = []

            // Get 第一頁，內有詳細分頁資訊
            this.getDomains(page, this.perPageCount, needLoop)
        },
        getFormSecondPageToLastPage() {
            // 取得從第二頁至最後一頁的資料
            var page = 2

            for (page; page < this.totalPage; page++) {
                this.getDomains(page, this.perPageCount)
            }
        },
        getDomains(page, per_page, loop = 0) {
            var domains = []
            this.$store
                .dispatch('domain/getDomains', {
                    page: page,
                    per_page: per_page
                })
                .then(
                    function(result) {
                        result.data.data.map(function(item) {
                            var deleted_at = !!item.deleted_at

                            item.ip.map(function(ip) {
                                // 檢查是否不存在，只要一個 deleted_at 有時間戳
                                // 就表示不存在了
                                deleted_at =
                                    deleted_at ||
                                    !!ip.deleted_at ||
                                    !!ip.domain_ip_mapping.deleted_at

                                var data = {
                                    domain: item.name,
                                    ip: ip.name,
                                    attacked: ip.domain_ip_mapping.attacked
                                        ? 'Yes'
                                        : 'No',
                                    quality: ip.domain_ip_mapping.quality
                                        ? 'Yes'
                                        : 'No',
                                    update: ip.domain_ip_mapping.updated_at,
                                    incdn: deleted_at ? 'No' : 'Yes',
                                    domain_id: item.id,
                                    ip_id: ip.id
                                }
                                domains.push(data)
                            })
                        })

                        // 組合資料
                        this.desserts = this.desserts.concat(domains)

                        // 重新 copy data
                        this.copyDesserts = []
                        this.backupAndRcoverData()
                        this.filterOnlyColumn()

                        // 取得總量
                        this.totalPage = result.data.last_page
                        this.total = result.data.total

                        if (loop) {
                            this.getFormSecondPageToLastPage()
                        }

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
        getYesOrNoColor(string) {
            return this.transformYesOrNoToBool(string) ? 'primary' : 'red'
        },
        transformYesOrNoToBool(string) {
            return string.toLocaleUpperCase() == 'YES' ? 1 : 0
        },
        transformBoolToYesOrNo(bool = true) {
            return bool ? this.yesOrNo[1] : this.yesOrNo[0]
        },
        addFormData() {},
        updateFormData() {
            this.$store.dispatch('global/startLoading')

            this.formData.attacked = this.transformYesOrNoToBool(
                this.formData.attacked
            )
            this.formData.quality = this.transformYesOrNoToBool(
                this.formData.quality
            )

            this.$store
                .dispatch('domain/updateDomainIpMapping', this.formData)
                .then(
                    function(result) {
                        this.init()
                        this.$store.dispatch('global/finishLoading')
                        this.$store.dispatch(
                            'global/showSnackbarSuccess',
                            'Success!'
                        )
                    }.bind(this)
                )
                .catch(
                    function(error) {
                        this.$store.dispatch(
                            'global/showSnackbarError',
                            error.message
                        )
                        this.init()

                        this.$store.dispatch('global/finishLoading')
                    }.bind(this)
                )
        },
        deleteFormData() {
            // do someting ...
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
        rowIndex(index) {
            return (this.page - 1) * this.itemsPerPage + index + 1
        },
        validateForm() {
            // 驗證表單資料
            return this.$refs.form.validate()
        },
        onSearch() {
            // 改成 enter 後搜尋
            this.searchText = this.doSearchText
        },
        clearFilter(value, search, item) {
            this.searchList = {}
            this.searchText = ''
            this.backupAndRcoverData()
        },
        filterOnlyColumn(value = null, column = null) {
            var searchResult

            if (!value) {
                delete this.searchList[column]
            } else {
                this.searchList[column] = value.trim()
            }

            // 備份 and 還原資料
            this.backupAndRcoverData()

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
            var list
            if (!this.copyDesserts.length) {
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
        document.title = 'Domain Manage'
        this.init()
    }
}
</script>

<style lang="scss" scoped>
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
