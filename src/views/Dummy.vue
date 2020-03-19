<template lang="pug">
    v-container(grid-list-lg)
        v-layout
            v-flex(xs12 sm12 md12)
                v-data-table.elevation-1(:headers="headers" :items="desserts" :search="searchText" :dense="true" hide-default-footer :items-per-page="itemsPerPage" :page.sync="page" @page-count="pageCount = $event")
                    template(v-slot:top)
                        v-toolbar(flat white)
                            v-toolbar-title Dummy
                            v-divider.mx-4(inset vertical)
                            v-text-field(v-model="searchText" append-icon="mdi-magnify" label="Search" single-line hide-details)
                            v-divider.mx-4(inset vertical)
                            v-spacer
                            v-dialog(v-model="dialog.add")
                                template(v-slot:activator="{ on }")
                                    v-btn.mb-2(color="primary" dark @click="newDialog") New Dummy
                    template(v-slot:header="{item,index}")
                        tr
                            td 
                            td 
                                v-text-field.mt-0.pt-0(:value="null" width="10px" label="Search" single-line hide-details @input="filterOnlyColumn($event,'site')")
                            td 
                                v-text-field.mt-0.pt-0(:value="null" width="10px" label="Search" single-line hide-details @input="filterOnlyColumn($event,'in')")
                            td 
                                v-text-field.mt-0.pt-0(width="10px" label="Search" single-line hide-details @input="filterOnlyColumn($event,'out')")
                            td 
                                v-text-field.mt-0.pt-0(width="10px"  label="Search" single-line hide-details @input="filterOnlyColumn($event,'ip')")

                    template(v-slot:item="{item,index}")
                        tr
                            td {{rowIndex(index)}}
                            td {{item.site}}
                            td {{item.in}}
                            td {{item.out}}
                            td {{item.ip}}
                            td 
                                v-icon.mr-2(small @click="editDialog(item)") mdi-pencil
                                v-icon.mr-2(small @click="deleteDialog(item)") mdi-delete

                v-row.align-center
                    v-col.pa-5.pd-0(cols="12" sm="4")
                        v-select(:value="itemsPerPage" :items="itemsPerPageList" label="Items per page"  @change="itemsPerPage = parseInt($event, 10)")
                    v-col.pa-5.pd-0(cols="12" sm="3")
                    v-col.pa-5.pd-0(cols="12" sm="4")
                        v-pagination(v-model="page" :length="pageCount")
                    v-col.pa-5.pd-0(cols="12" sm="1")

            v-dialog(v-model="dialog.add" max-width="460" scrollable persistent)
                v-card
                    v-card-title.title {{formTitle}}
                    v-card-text
                        v-form(ref="form" onsubmit="return false;")
                            v-text-field(v-model="dummy.site" label="Site" type="" name="name" :rules="[rules.required]")
                            v-text-field(v-model="dummy.in" label="In" type="text" name="in" :rules="[rules.required]")
                            v-text-field(v-model="dummy.out" label="Out" type="text" name="out" :rules="[rules.required]")
                            v-text-field(v-model="dummy.ip" label="IP" type="text" name="ip" :rules="[rules.required,rules.ip]")
                    v-card-actions  
                        v-spacer
                        v-btn(color="grey" @click="closeDialog") Cancel
                        v-btn(color="primary" @click="updateDummy") Save

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
import dummy from '../assets/dummy2.json'

export default {
    name: 'Dummy',
    mixins: [textFieldRules],

    components: {},
    data() {
        return {
            searchText: '',
            page: 1,
            pageCount: 0,
            itemsPerPage: 15,
            itemsPerPageList: [15, 25, 50, 100],
            editedIndex: -1,
            dummy: {},
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
                    text: 'Site',
                    align: 'left',
                    sortable: true,
                    value: 'site'
                },
                {
                    text: 'In',
                    align: 'left',
                    sortable: true,
                    value: 'in'
                },
                {
                    text: 'Out',
                    align: 'left',
                    sortable: true,
                    value: 'out'
                },
                {
                    text: 'IP',
                    align: 'left',
                    sortable: true,
                    value: 'ip'
                },
                {
                    text: 'Actions',
                    align: 'left',
                    sortable: false,
                    width: '100px',
                    value: 'actions'
                }
            ],
            desserts: dummy,
            searchList: [],
            copyDesserts: null
        }
    },
    methods: {
        newDialog: function() {
            this.formTitle = 'Add Dummy'
            this.dialog.add = true
            this.dummy = {}
            this.dummy.id = -1
        },
        editDialog: function(item) {
            this.formTitle = 'Edit Dummy'
            this.dialog.add = true
            this.editedIndex = this.desserts.indexOf(item)
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
        addDummy: function() {
            // do someting
            this.save()
        },
        updateDummy: function() {
            if (!this.validateForm()) {
                return
            }

            if (this.editedIndex == -1) {
                this.addDummy()
            } else {
                this.save()

                // do someting
            }

            this.closeDialog()
        },
        deleteDummy: function() {
            // do someting
            this.desserts.splice(this.editedIndex, 1)
            this.$store.dispatch('global/showSnackbarSuccess', 'Success!')
            this.closeDialog()
        },
        save() {
            if (this.editedIndex > -1) {
                Object.assign(this.desserts[this.editedIndex], this.dummy)
            } else {
                this.desserts.push(this.dummy)
            }
        },
        rowIndex: function(index) {
            return (this.page - 1) * this.itemsPerPage + index + 1
        },
        validateForm: function() {
            // 驗證表單資料
            return this.$refs.form.validate()
        },
        filterOnlyCapsText(value, search, item) {
            return (
                value != null &&
                search != null &&
                typeof value === 'string' &&
                value
                    .toString()
                    .toLocaleUpperCase()
                    .indexOf(search) !== -1
            )
        },
        filterOnlyColumn(value, column) {
            var searchString = value.toString().toLocaleUpperCase()
            var searchResult

            this.searchList[column] = searchString

            // 備份資料
            if (this.copyDesserts == null) {
                this.backupData()
            } else {
                this.recoveryData()
            }

            // 刪除 SerachList[Key]
            if (value == '') {
                delete this.searchList[column]
            }

            for (var searchKey in this.searchList) {
                searchResult = this.desserts.filter(
                    item =>
                        item[searchKey]
                            .toLocaleUpperCase()
                            .indexOf(this.searchList[searchKey]) !== -1
                )
                this.desserts = searchResult
            }
        },
        backupData() {
            // 備份資料
            var list = this.desserts
            this.copyDesserts = list
        },
        recoveryData() {
            // 還原資料
            var list = this.copyDesserts
            this.desserts = list
        }
    }
}
</script>
