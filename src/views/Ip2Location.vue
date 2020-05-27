<template lang="pug">
    v-container(grid-list-lg)
        v-layout
            v-flex(xs12 sm12 md12)
                v-toolbar(flat white)
                    v-toolbar-title IP Location
                    v-divider.mx-4(inset vertical)
                    v-text-field(v-model="searchIP" append-icon="mdi-magnify" label='Search IP (press key "enter")' single-line hide-details @keydown.enter="toSearchCIDR")
                    v-divider.mx-4(inset vertical)
                    v-spacer
                    v-btn.mb-2.mr-2(color="primary" dark @click="toSearch") Search
                    v-btn.mb-2.mr-2(color="primary" dark @click="clearFilter") clear Filter
                    v-btn.mb-2.mr-2(color="primary" dark @click="init")
                        v-icon mdi-refresh

                DataTable2(ref="table2" :headers="headers" :items="items" :loading="loading" :searchText="searchText" :searchList="searchList" :itemsPerPage="itemsPerPage" :itemsPerPageList="itemsPerPageList" @showDialog="dialogSwitch")

            v-dialog(v-model="dialog.add" max-width="460" scrollable persistent)
                v-card
                    v-card-title.title {{formTitle}}
                    v-card-text
                        v-form(ref="form" onsubmit="return false;")
                            v-text-field(v-model="item.cidr" label="CIDR" type="text" name="cidr" readonly)

                            v-text-field(v-model="item.remark" label="Remark" type="text" name="remark")
                    v-card-actions  
                        v-spacer
                        v-btn(color="grey" @click="closeDialog") Cancel
                        v-btn(color="primary" @click="save") Save

            //- v-dialog.delete-dialog(v-model="dialog.delete" max-width="460" persistent)
                v-card
                    v-card-title.title {{formTitle}}
                    v-card-text Are you sure want to delete {{item.name}}?
                    v-card-actions  
                        v-spacer
                        v-btn(color="grey" @click="closeDialog") Cancel
                        v-btn(color="primary" @click="deleteItemAction") Yes
</template>

<script>
import textFieldRules from '../utils/textFieldRules'
import DataTable2 from '../components/DataTable2'

export default {
    name: 'IP2Location',
    mixins: [textFieldRules],

    components: {
        DataTable2
    },
    data() {
        return {
            searchText: '',
            searchList: {},
            page: 1,
            pageCount: 0,
            itemsPerPage: 15,
            itemsPerPageList: [15, 25, 50, 100, 500],
            editedIndex: -1,
            item: {},
            formTitle: '',
            dialog: {
                add: false,
                delete: false
            },
            headers: [
                {
                    text: '#',
                    align: 'center',
                    sortable: false,
                    width: '50px',
                    value: 'index'
                },
                {
                    text: 'CIDR',
                    align: 'left',
                    sortable: true,
                    width: '100px',
                    value: 'cidr',
                    search: true
                },
                {
                    text: 'GEC',
                    align: 'left',
                    sortable: true,
                    width: '100px',
                    value: 'gec',
                    search: false,
                    combobox: []
                },
                {
                    text: 'Province',
                    align: 'left',
                    sortable: true,
                    // width: '200px',
                    value: 'province',
                    search: false,
                    combobox: []
                },
                {
                    text: 'City',
                    align: 'left',
                    sortable: true,
                    // width: '200px',
                    value: 'city',
                    search: false,
                    combobox: []
                },
                {
                    text: 'Company',
                    align: 'left',
                    sortable: true,
                    // width: '200px',
                    value: 'company'
                },
                {
                    text: 'Remark',
                    align: 'left',
                    sortable: true,
                    value: 'remark'
                },
                {
                    text: 'Actions',
                    align: 'left',
                    sortable: false,
                    width: '100px',
                    value: 'actions',
                    edit: true,
                    delete: false
                }
            ],
            items: [],
            loading: false,
            totalPage: 1,
            perPageCount: 1000,
            limitMaxPage: 50,
            query: {},
            searchIP: '',
            timer: null
        }
    },
    watch: {},
    methods: {
        clearFilter() {
            this.searchList = {}
            this.searchText = ''
            this.searchIP = ''
            this.query = {}
            // this.init()
            this.$refs.table2.$emit('clearAllFilter')
        },
        dialogSwitch(bool, item) {
            bool ? this.editDialog(item) : this.deleteDialog(item)
        },
        newDialog() {
            this.formTitle = 'Add Dummy'
            this.dialog.add = true
            this.item = {}
            this.item.id = -1
        },
        searchDialog() {
            this.formTitle = 'Search Query'
            this.dialog.search = true
        },
        editDialog(item) {
            this.formTitle = 'Edit IP Location'
            this.dialog.add = true
            this.editedIndex = this.items.indexOf(item)
            this.item = {}
            this.item = Object.assign({}, item)
        },
        deleteDialog(item) {
            this.formTitle = 'Delete Dummy'
            this.dialog.delete = true
            this.item = item
        },
        closeDialog() {
            this.dialog.add = false
            this.dialog.delete = false
            this.dialog.search = false
            this.item = {}
        },
        toSearchCIDR() {
            const pattern = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])(\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])){3}$/

            if (!this.searchIP) {
                this.query.cidr = null
            } else if (pattern.test(this.searchIP)) {
                this.query = {}
                this.searchList = {}

                this.query.cidr = this.searchIP + '/32'
            } else {
                alert('IP Error !')
                return
            }

            this.init()
        },
        toSearch() {
            this.query = Object.assign(this.searchList, {})
            this.query.cidr = null
            this.searchIP = null

            this.init()
        },
        initColumn() {
            this.getCountry()
            this.getProvince()
            this.getCity()
        },
        getCountry() {
            this.$store
                .dispatch('ip2LocationRawData/getCountry')
                .then(
                    function(result) {
                        this.gec = result.data
                        this.headers[2].combobox = result.data
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
        getProvince() {
            this.$store
                .dispatch('ip2LocationRawData/getProvince')
                .then(
                    function(result) {
                        this.gec = result.data
                        this.headers[3].combobox = result.data
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
        getCity() {
            this.$store
                .dispatch('ip2LocationRawData/getCity')
                .then(
                    function(result) {
                        this.gec = result.data
                        this.headers[4].combobox = result.data
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
        init() {
            this.$store.dispatch('global/startLoading')

            clearInterval(this.timer)

            var page = 1
            var needLoop = 1
            this.items = []
            this.loading = true
            // Get 第一頁，內有詳細分頁資訊
            this.getItemsAction(page, this.perPageCount, needLoop)
        },
        getFormSecondPageToLastPage() {
            // 取得從第二頁至最後一頁的資料
            var page = 2
            let totalPage =
                this.totalPage > this.limitMaxPage
                    ? this.limitMaxPage
                    : this.totalPage

            this.timer = setInterval(() => {
                if (page > totalPage) {
                    clearInterval(this.timer)
                } else {
                    this.getItemsAction(page, this.perPageCount)
                }
                page++
            }, 5000)
        },
        getItemsAction(page, per_page, loop = 0) {
            var data = Object.assign(
                {
                    page: page,
                    per_page: per_page
                },
                this.query
            )

            this.$store
                .dispatch('ip2LocationRawData/getIpLocation', data)
                .then(
                    function(result) {
                        // 組合資料
                        this.items = this.items.concat(result.data.data)

                        // 取得總量
                        this.totalPage = result.data.last_page
                        // this.total = result.data.total

                        if (loop) {
                            this.getFormSecondPageToLastPage()
                        }

                        let totalPage =
                            this.totalPage > this.limitMaxPage
                                ? this.limitMaxPage
                                : this.totalPage

                        // console.log('page: ' + page)
                        // console.log('totalPage: ' + totalPage)
                        if (page >= totalPage) {
                            this.loading = false
                        }

                        this.$refs.table2.$emit('filter')
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
        addItemAction() {
            // do something ...
        },
        updateItemAction() {
            this.$store.dispatch('global/startLoading')
            this.$store
                .dispatch('ip2LocationRawData/updateIpLocation', this.item)
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
        deleteItemAction() {
            // do something ...
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
                this.updateItemAction()
            } else {
                // this.addItemAction()
            }
            this.closeDialog()
        },
        validateForm() {
            // 驗證表單資料
            return this.$refs.form.validate()
        }
    },
    mounted() {
        document.title = 'IP2Location'
        this.initColumn()
        // this.init()
    }
}
</script>

<style lang="scss" scoped>
.container {
    max-width: 100%;
}
.v-data-table {
    th {
        user-select: auto;
    }
}
</style>
