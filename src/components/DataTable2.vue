<template lang="pug">
    #dataTable2
        v-data-table.elevation-1(:headers="headers" :items="newItems" :search="searchText" :dense="dense" :loading="loading" hide-default-footer :items-per-page="itemsPerPage" :page.sync="page" @page-count="pageCount = $event" )
            template(v-slot:top)
            template(v-slot:header="{item,index}")
                tr
                    td 
                    td(v-for="header in headerList")
                        v-text-field.mt-0.pt-0(v-if="header.search === undefined ? true : header.search" v-model="searchList[header. value]" width="10px" label="Search" single-line hide-details @input="filterOnlyColumn($event, header.value)" dense)
                        v-combobox.mt-0.pt-0(v-if="header.combobox" :items="header.combobox" :label="header.text" hide-selected  v-model="searchList[header. value]" dense single-line hide-details)
                            template(v-slot:no-data)
                                v-card-text No results matching 
            template(v-slot:item="{item,index}")
                tr
                    td {{rowIndex(index)}}
                    td(v-for="header in headerList") {{ !header.href ? getColumn(header.value, item, index) : null}}
                        a(v-if="header.href" :href="getLink(getColumn(header.value, item, index))" target="_blank") {{getColumn(header.value, item, index) }}
                    td 
                        v-icon.mr-2(v-if="actions.edit" small @click="editDialog(item)") mdi-pencil
                        v-icon.mr-2(v-if="actions.delete" small @click="deleteDialog(item)") mdi-delete
            template(v-slot:footer) 
                v-footer(v-if="!hideFooter")
                    v-col.text-right.pt-0.pl-0.pb-0(cols="12" sm="2")
                        div Items per page
                    v-col.text-center.pt-0.pl-0.pb-0(cols="12" sm="2")
                        v-select.mt-0.pt-0(:value="itemsPerPage" :items="itemsPerPageList" menu-props="auto" label="Items per page" hide-details single-line  @change="itemsPerPage = parseInt($event, 10)")
                    v-col.text-right.pt-0.pl-0.pb-0 {{getFooterText()}}
                    v-col.text-right.pt-0.pl-0.pb-0 
                        v-pagination(v-model="page" :length="pageCount")
</template>
<script>
export default {
    props: {
        searchList: {
            type: Object,
            default: {}
        },
        searchText: {
            type: String,
            default: ''
        },
        headers: {
            type: Array,
            default: []
        },
        hideFooter: {
            type: Boolean,
            default: false
        },
        items: {
            type: Array,
            default: []
        },
        loading: {
            type: Boolean,
            default: false
        },
        dense: {
            type: Boolean,
            default: true
        },
        itemsPerPageList: {
            type: Array,
            default: () => [5, 15, 25, 50, 100]
        },
        defaultItemsPerPage: {
            type: Number,
            default: 5
        },
        setUripath: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            // searchList: {},
            page: 1,
            pageCount: 0,
            itemsPerPage: 15,
            headerList: [],
            newItems: [],
            copyItem: null,

            actions: { edit: false, delete: false }
        }
    },
    watch: {
        items() {
            this.newItems = this.items
            this.copyItem = null
            this.filterOnlyColumn()
        },
        defaultItemsPerPage() {
            this.itemsPerPage = this.defaultItemsPerPage
        }
    },
    methods: {
        editDialog(value) {
            this.$emit('showDialog', 1, value)
        },
        deleteDialog(value) {
            this.$emit('showDialog', 0, value)
        },
        getLink(id) {
            let jkb = this.setUripath
            return jkb + id
        },
        getColumn(name, item, index) {
            return item[name] ? item[name] : null
        },
        getHeaderList() {
            var actions = this.actions
            var headerList = this.headers.map(function(item) {
                if (item.value == 'actions') {
                    actions.edit = item.edit
                    actions.delete = item.delete
                    return
                }
                if (item.value != 'index') {
                    return item
                }
            })

            // 移除空資料
            this.headerList = headerList.filter(item => item)
        },
        getFooterText() {
            var max = this.newItems.length
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
            // 計算每一列開頭 "流水號"
            return (this.page - 1) * this.itemsPerPage + index + 1
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
                if (searchString) {
                    searchString = searchString.toString().toLocaleUpperCase()

                    searchResult = this.newItems.filter(function(item) {
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

                    this.newItems = searchResult
                }
            }
        },
        backupAndRcoverData() {
            if (this.copyItem == null) {
                // 備份資料
                var list = this.newItems
                this.copyItem = list
            } else {
                // 還原資料
                var list = this.copyItem
                this.newItems = list
            }
        }
    },
    created() {
        this.getHeaderList()
    },

    mounted() {
        this.$on('clearAllFilter', function() {
            // 清除全部的 Filter 欄位
            this.backupAndRcoverData()
        })

        this.$on('filter', function() {
            this.filterOnlyColumn()
        })
    }
}
</script>
<style lang="sass" scoped>
</style>

