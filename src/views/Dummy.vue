<template lang="pug">
    v-container(grid-list-lg)
        v-layout
            v-flex(xs12 sm12 md12)
                v-tabs(v-model="tab" background-color="primary" dark)
                    v-tab(v-for="tab in tabs" :key="tab.name") {{ tab.name }}
                v-tabs-items(v-model="tab")
                    v-tab-item(v-for="tab in tabs" :key="tab.name")
                        v-data-table.elevation-1(v-if="tabOn.NXN" v-for="(site) in siteList" :headers="headers2[site]" :items="desserts2[site]" dense hide-default-header hide-default-footer :items-per-page="1000" @page-count="1000")
                            template(v-slot:top)
                                    v-toolbar(flat white)
                                        v-toolbar-title {{site}}
                            template(v-slot:header="{item,index}")
                                tr
                                    th.pr-2.pl-2 {{"In/Out"}}
                                    th.pr-2.pl-2(v-for="(outLine,value) in desserts2[site]") {{outLine}}
                            template(v-slot:item="{item,index}")
                                tr
                                    th.pr-2.pl-2 {{desserts2[site][index]}}
                                    td.pr-1.pl-1(v-for="(outLine,value) in desserts2[site]") {{getNameIp(site,item,outLine)}}
                        v-toolbar(v-show="tabOn.table" flat white)
                            v-toolbar-title Dummy
                            v-divider.mx-4(inset vertical)
                            v-text-field(v-model="searchText" append-icon="mdi-magnify" label="Search" single-line hide-details)
                            v-divider.mx-4(inset vertical)
                            v-spacer
                            v-btn.mb-2.mr-2(color="primary" dark @click="clearFilter") clear Filter
                            v-btn.mb-2.mr-2(color="primary" dark @click="newDialog") New Dummy
                            v-btn.mb-2.mr-2(color="primary" dark @click="getDummy")
                                v-icon mdi-refresh
                        
                    DataTable2(ref="table2" v-show="tabOn.table" :headers="headers" :items="desserts" :searchText="searchText" :searchList="searchList" :defaultItemsPerPage="itemsPerPage" :itemsPerPageList="itemsPerPageList" :setUripath="jkbURI" @showDialog="dialogSwitch")
            v-dialog(v-model="dialog.add" max-width="460" scrollable persistent)
                v-card
                    v-card-title.title {{formTitle}}
                    v-card-text
                        v-form(ref="form" onsubmit="return false;")
                            v-select(v-model="site" :items="siteList" label="Site" @change="siteChange")
                            v-select(v-model="dummy.in" :items="bgpList[site]" label="In" item-text="name" item-value="id" :rules="[rules.required]")
                            v-select(v-model="dummy.out" :items="bgpList[site]" label="Out" item-text="name" item-value="id" :rules="[rules.required]")
                            v-text-field(v-model="dummy.source_ip" label="IP" type="text" name="ip" :rules="[rules.required, rules.ip]")
                            v-text-field(v-model="dummy.jkb_task_id" label="JKB Task Id" type="number" name="task_id")
                    v-card-actions  
                        v-spacer
                        v-btn(color="grey" @click="closeDialog") Cancel
                        v-btn(color="primary" @click="save") Save

            v-dialog.delete-dialog(v-model="dialog.delete" max-width="460" persistent)
                v-card
                    v-card-title.title {{formTitle}}
                    v-card-text Are you sure want to delete {{dummy.name}}?
                    v-card-actions  
                        v-spacer
                        v-btn(color="grey" @click="closeDialog") Cancel
                        v-btn(color="primary" @click="deleteDummy") Yes
</template>

<script>
import textFieldRules from '../utils/textFieldRules'
import DataTable2 from '../components/DataTable2'

export default {
    name: 'Dummy',
    mixins: [textFieldRules],

    components: {
        DataTable2
    },
    data() {
        return {
            searchText: '',
            page: 1,
            pageCount: 0,
            itemsPerPage: 15,
            itemsPerPageList: [15, 25, 50, 100, 500],
            editedIndex: -1,
            dummy: {},
            formTitle: '',
            dialog: {
                add: false,
                delete: false
            },
            headers2: [],
            desserts2: [],
            siteList: [],
            site: 'TW',
            desserts3: {},
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
                    text: 'In',
                    align: 'left',
                    sortable: true,
                    value: 'inName'
                },
                {
                    text: 'Out',
                    align: 'left',
                    sortable: true,
                    value: 'outName'
                },
                {
                    text: 'IP',
                    align: 'left',
                    sortable: true,
                    value: 'source_ip'
                },
                {
                    text: 'Task ID',
                    align: 'left',
                    sortable: true,
                    value: 'jkb_task_id',
                    href: true
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
            searchList: {},
            copyDesserts: [],
            tab: null,
            tabs: [{ name: 'Table' }, { name: 'NxN' }],
            tabOn: {
                table: true,
                NXN: false
            },
            lineList: [],
            bgpList: {},
            jkbURI:
                'https://monitoring.cloudwise.com/monitoring/#/taskdata/overview/base?task_id='
        }
    },
    watch: {
        tab: function(value) {
            if (value) {
                this.tabOn.NXN = true
                this.tabOn.table = false
            } else {
                this.tabOn.NXN = false
                this.tabOn.table = true
            }
        },
        site() {}
    },
    methods: {
        dialogSwitch(bool, item) {
            bool ? this.editDialog(item) : this.deleteDialog(item)
        },
        newDialog: function() {
            this.formTitle = 'Add Dummy'
            this.dialog.add = true
            this.dummy = {}
            this.dummy.id = -1
            // this.site = 'TW'
            this.dummy.site = this.site
        },
        editDialog: function(item) {
            this.formTitle = 'Edit Dummy'
            this.dialog.add = true
            this.editedIndex = this.desserts.indexOf(item)
            this.dummy = {}
            this.site = item.site
            this.dummy = Object.assign({}, item)
        },
        deleteDialog: function(item) {
            this.formTitle = 'Delete Dummy'
            this.dialog.delete = true
            this.dummy = item
        },
        closeDialog: function() {
            this.dialog.add = false
            this.dialog.delete = false
            this.dummy = {}
        },
        getBGP: function() {
            this.$store.dispatch('global/startLoading')
            this.$store
                .dispatch('bgp/getInfo')
                .then(
                    function(result) {
                        var bgpList = []
                        var siteList = []
                        this.bgp = result.data
                        result.data.forEach(function(item, index) {
                            if (!bgpList[item.site]) {
                                bgpList[item.site] = []
                                siteList.push(item.site)
                            }
                            bgpList[item.site].push(item)
                        })

                        this.bgpList = bgpList
                        this.siteList = siteList
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
        siteChange() {
            this.dummy.in = null
            this.dummy.out = null
            delete this.dummy.in
            delete this.dummy.out
        },
        getDummy() {
            this.$store.dispatch('global/startLoading')
            this.$store
                .dispatch('dummy/getInfo')
                .then(
                    function(result) {
                        var dummy = result.data
                        this.desserts = dummy.map(function(item, index) {
                            item.site = item.in_bgp.site
                            item.inName = item.in_bgp.name
                            item.outName = item.out_bgp.name
                            return item
                        })

                        this.copyDesserts = this.desserts

                        this.transformNXN()

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
        addDummy: function() {
            this.$store.dispatch('global/startLoading')
            this.$store
                .dispatch('dummy/createDummy', this.dummy)
                .then(
                    function(result) {
                        this.getDummy()
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
                        this.getDummy()

                        this.$store.dispatch('global/finishLoading')
                    }.bind(this)
                )
        },
        updateDummy: function() {
            this.$store.dispatch('global/startLoading')
            this.$store
                .dispatch('dummy/updateDummy', this.dummy)
                .then(
                    function(result) {
                        this.getDummy()
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
                        this.getDummy()

                        this.$store.dispatch('global/finishLoading')
                    }.bind(this)
                )
        },
        deleteDummy: function() {
            this.$store.dispatch('global/startLoading')
            this.$store
                .dispatch('dummy/destroyDummy', this.dummy)
                .then(
                    function(result) {
                        this.getDummy()
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
                        this.getDummy()
                        this.$store.dispatch('global/finishLoading')
                    }.bind(this)
                )
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
                this.updateDummy()
            } else {
                this.addDummy()
            }
            this.closeDialog()
        },
        rowIndex: function(index) {
            return (this.page - 1) * this.itemsPerPage + index + 1
        },
        validateForm: function() {
            // 驗證表單資料
            return this.$refs.form.validate()
        },
        clearFilter() {
            this.searchList = {}
            this.searchText = ''
            this.$refs.table2.$emit('clearAllFilter')
        },
        transformNXN() {
            var desserts2 = []
            var headerList = []
            var desserts3 = []

            var header1 = {
                text: 'in/out',
                width: '30px',
                sortable: false,
                align: 'center'
            }

            var header2 = {
                width: '30px',
                sortable: false,
                align: 'center'
            }

            this.desserts.forEach(function(item, index, array) {
                var site = item.in_bgp.site
                var inLine = item.in_bgp.name
                var outLine = item.out_bgp.name

                if (!desserts3[site]) {
                    desserts3[site] = {}
                    desserts2[site] = []
                    headerList[site] = []
                    headerList[site].push(header1)
                }

                if (!desserts3[site][inLine]) {
                    desserts3[site][inLine] = {}
                    headerList[site].push(header2)
                }

                desserts2[site].push(inLine)
                desserts2[site].push(outLine)

                // 移除重複 Value
                desserts2[site] = desserts2[site].filter(
                    (item, index) => desserts2[site].indexOf(item) === index
                )

                desserts3[site][inLine][outLine] = item.source_ip
            })

            this.headers2 = headerList
            this.desserts2 = desserts2
            this.desserts3 = desserts3
        },
        getNameIp(site, inName, outName) {
            // 取得對應的 IP
            // 根據 站點 In Out => IP
            if (this.desserts3[site][inName]) {
                return this.desserts3[site][inName][outName]
            }

            return null
        }
    },
    mounted() {
        this.getDummy()
        this.getBGP()
    }
}
</script>

<style lang="scss" scoped>
.v-data-table {
    th {
        user-select: auto;
    }
}
</style>
