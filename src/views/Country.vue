<template lang="pug">
    v-container(grid-list-lg)
        v-layout
            v-flex(xs12 sm12 md12)
                v-card
                    v-toolbar(flat white)
                        v-toolbar-title Country
                        v-divider.mx-4(inset vertical)
                        v-text-field(v-model="searchText" append-icon="mdi-magnify" label='Search' single-line hide-details)
                        v-divider.mx-4(inset vertical)
                        v-spacer
                        v-btn.mb-2.mr-2(color="primary" dark @click="clearFilter") clear Filter
                        //- v-btn.mb-2.mr-2(color="primary" dark @click="newDialog") Add
                        v-btn.mb-2.mr-2(color="primary" dark @click="init")
                            v-icon mdi-refresh

                    DataTable2(ref="table2" :headers="headers" :items="desserts" :searchText="searchText" :searchList="searchList" :defaultItemsPerPage="itemsPerPage" :itemsPerPageList="itemsPerPageList" :loading="loading" @showDialog="dialogSwitch")

            v-dialog(v-model="dialog.add" max-width="460" scrollable persistent)
                v-card
                    v-card-title.title {{formTitle}}
                    v-card-text
                        v-form(ref="form" onsubmit="return false;")
                            v-text-field(v-model="formData.gec" label="GEC" readonly)
                            v-text-field(v-model="formData.name_en" label="Name EN" readonly)
                            v-text-field(v-model="formData.name_tw" label="Name TW" shaped readonly)
                            
                            v-text-field(v-model="formData.percentage" label="Percentage" type="number" name="percentage" max=100 min=0 :rules="[rules.percentage(formData.percentage, true)]")
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
import addJson from '../assets/icon/add/add.json'
import toggleJson from '../assets/icon/toggle/toggle.json'

export default {
    name: 'Country',
    mixins: [textFieldRules],

    components: {
        DataTable2,
        DataTable3
    },
    data() {
        return {
            searchText: '',
            searchList: {},
            itemsPerPage: 15,
            itemsPerPageList: [5, 15, 25, 50, 100, 500],
            editedIndex: -1,
            formTitle: 'Country ',
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
                    text: 'GEC',
                    align: 'left',
                    sortable: true,
                    value: 'gec'
                },
                {
                    text: 'Name EN',
                    align: 'left',
                    sortable: true,
                    value: 'name_en'
                },
                {
                    text: 'Name TW',
                    align: 'left',
                    sortable: true,
                    value: 'name_tw'
                },
                {
                    text: 'Traffic Percentage (%)',
                    align: 'left',
                    sortable: true,
                    value: 'percentage'
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
            desserts: [],
            loading: true
        }
    },
    watch: {},
    methods: {
        dialogSwitch(bool, item) {
            bool ? this.editDialog(item) : this.deleteDialog(item)
        },
        newDialog() {
            this.formTitle = 'Add Country'
            this.dialog.add = true
            this.formData = {}
            this.formData.id = -1
        },
        editDialog(item) {
            this.formTitle = 'Edit Country'
            this.dialog.add = true
            this.editedIndex = this.desserts.indexOf(item)
            this.formData = {}
            this.formData = Object.assign({}, item)
        },
        deleteDialog(item) {
            this.formTitle = 'Delete Country'
            this.dialog.delete = true
            this.formData = item
        },
        closeDialog() {
            this.dialog.add = false
            this.dialog.delete = false
            this.formData = {}
        },
        init() {
            this.loading = true
            this.getCountry()
        },
        addFormData() {
            // do something ...
            // this.desserts.push(this.formData)
        },
        updateFormData() {
            this.updateCountry()

            // this.desserts.splice(this.editedIndex, 1, this.formData)
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
        getCountry() {
            this.$store.dispatch('global/startLoading')

            this.$store
                .dispatch('ip2LocationRawData/getCountry')
                .then(
                    function(result) {
                        this.desserts = result.data
                        this.loading = false

                        this.$store.dispatch('global/finishLoading')
                    }.bind(this)
                )
                .catch(
                    function(error) {
                        this.$store.dispatch(
                            'global/showSnackbarError',
                            error.message
                        )
                        this.loading = false
                        this.$store.dispatch('global/finishLoading')
                    }.bind(this)
                )
        },
        updateCountry() {
            this.$store
                .dispatch('ip2LocationRawData/updateCountry', this.formData)
                .then(
                    function(result) {
                        this.init()
                        this.$store.dispatch('global/finishLoading')
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
        }
    },
    mounted() {
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
