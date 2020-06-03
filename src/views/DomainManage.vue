<template lang="pug">
    v-container(grid-list-lg)
        v-layout
            v-flex(xs12 sm12 md12)
                v-card
                    v-toolbar(flat white)
                        v-toolbar-title FQDN Management
                        v-divider.mx-4(inset vertical)
                        v-text-field(v-model="doSearchText" append-icon="mdi-magnify" label='Search (press key "enter")' single-line hide-details @keydown.enter="onSearch" )
                        v-divider.mx-4(inset vertical)
                        v-spacer
                        v-btn.mb-2.mr-2(color="primary" dark @click="clearFilter") clear Filter
                        v-btn.mb-2.mr-2(color="primary" dark @click="init")
                            v-icon mdi-refresh
                    DataTable2(ref="table2" :headers="headers" :items="desserts" :searchText="searchText" :searchList="searchList" :defaultItemsPerPage="itemsPerPage" :itemsPerPageList="itemsPerPageList" :loading="loading" @showDialog="dialogSwitch")
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
import DataTable2 from '../components/DataTable2'

export default {
    name: 'DomainManage',
    mixins: [textFieldRules],

    components: {
        DataTable2
    },
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
                    value: 'actions',
                    edit: true
                }
            ],
            desserts: [],
            searchList: {},
            formData: {},
            totalPage: 1,
            perPageCount: 500,
            total: 0,
            loading: true,
            loop: []
        }
    },
    watch: {},
    methods: {
        dialogSwitch(bool, item) {
            bool ? this.editDialog(item) : this.deleteDialog(item)
        },
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
            // this.$store.dispatch('global/startLoading')

            var page = 1
            this.desserts = []
            this.loading = true

            if (this.loop.length >= 1) {
                this.loop[this.loop.length - 1] = false
            }
            this.loop.push(true)

            // Get All Domain 詳細資訊
            this.getDomains(page, this.perPageCount, this.loop.length)
        },
        getDomains(page, per_page, loop = 0) {
            var domains = []
            if (this.loop.length > 1 && !this.loop[loop - 1]) {
                return
            }
            this.$store
                .dispatch('domain/getDomains', {
                    page: page,
                    per_page: per_page
                })
                .then(
                    function(result) {
                        if (this.loop.length > 1 && !this.loop[loop - 1]) {
                            return
                        }
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
                        this.$refs.table2.$emit('filter')

                        // 取得總量
                        this.totalPage = result.data.last_page
                        this.total = result.data.total

                        this.$store.dispatch('global/finishLoading')

                        // console.log('第 ' + this.loop.length + ' 次 Loop 的 ' + page + ' 頁')

                        if (this.totalPage > page) {
                            page++
                            this.getDomains(page, per_page, loop)
                        } else {
                            this.loading = false
                        }
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
        addFormData() {
            // do something ...
        },
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
                        this.$store.dispatch('global/finishLoading')
                        this.init()
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
                        this.$store.dispatch('global/finishLoading')
                        this.init()
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
            this.doSearchText = ''
            this.$refs.table2.$emit('clearAllFilter')
        }
    },
    mounted() {
        document.title = 'Domain Manage'
        this.init()
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
