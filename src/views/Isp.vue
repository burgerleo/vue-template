<template lang="pug">
    v-container(grid-list-lg)
        v-layout
            v-flex(xs12 sm12 md12)
                v-card
                    //- v-card-text
                        v-layout(wrap)
                            v-flex(xs12 sm6 md4)
                                v-text-field(v-model="searchText" append-icon="mdi-magnify" label="Search" single-line hide-details)
                            v-flex(xs12 sm6 md6)
                            v-flex(xs12 sm6 md2)
                                v-btn(color="primary" block @click="newDialog") ADD ISP
                    //- v-data-table.elevation-1(:headers="headers" :items="desserts" :search="searchText" :dense="true" hide-default-footer :items-per-page="itemsPerPage" :page.sync="page" @page-count="pageCount = $event" :custom-filter="filterOnlyCapsText")
                        template(v-slot:item="{item,index}")
                            tr
                                td {{index}}
                                td {{item.name}}
                                td {{item.calories}}
                                td {{item.fat}}
                                td {{item.carbs}}
                                td {{item.protein}}
                                td {{item.iron}}
                                td 
                                    v-icon.mr-2(small @click="editDialog(item)") mdi-pencil
                                    v-icon.mr-2(small @click="deleteDialog(item)") mdi-delete


                    v-data-table.elevation-1(:headers="headers" :items="desserts" :search="searchText" :dense="true" hide-default-footer :items-per-page="itemsPerPage" :page.sync="page" @page-count="pageCount = $event")
                        template(v-slot:top)
                            v-toolbar(flat white)
                                v-toolbar-title ISP
                                v-divider.mx-4(inset vertical)
                                v-text-field(v-model="searchText" append-icon="mdi-magnify" label="Search" single-line hide-details)
                                v-divider.mx-4(inset vertical)
                                v-spacer
                                v-dialog(v-model="dialog.add")
                                    template(v-slot:activator="{ on }")
                                        v-btn.mb-2(color="primary" dark @click="newDialog") New ISP
                        template(v-slot:item="{item,index}")
                            tr
                                td {{index}}
                                td {{item.name}}
                                td {{item.calories}}
                                td {{item.fat}}
                                td {{item.carbs}}
                                td {{item.protein}}
                                td {{item.iron}}
                                td 
                                    v-icon.mr-2(small @click="editDialog(item)") mdi-pencil
                                    v-icon.mr-2(small @click="deleteDialog(item)") mdi-delete

                        //- template(v-slot:item.index="{item,index }")
                            td {{index}}
                        //- template(v-slot:item.actions="{ item }")
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
                            v-text-field(v-model="isp.name" label="ISP" type="" name="name" :rules="[rules.required]")
                            v-text-field(v-model="isp.name" label="ISP" type="text" name="ip")
                    v-card-actions  
                        v-spacer
                        v-btn(color="grey" @click="closeDialog") Cancel
                        v-btn(color="primary" @click="updateISP") Save

            v-dialog.delete-dialog(v-model="dialog.delete" max-width="460" persistent)
                v-card
                    v-card-title.title Delete ISP
                    v-card-text Are you sure want to delete {{isp.name}}?
                    v-card-actions  
                        v-spacer
                        v-btn(color="grey" flat="flat" @click="closeDialog") Cancel
                        v-btn(color="primary" flat="flat" @click="deleteISP") Yes
</template>

<script>
import DataTableAction from '../components/DataTableAction'
import textFieldRules from '../utils/textFieldRules'

export default {
    name: 'Home',
    mixins: [textFieldRules],
    components: {
        DataTableAction
    },
    data() {
        return {
            page: 1,
            pageCount: 0,
            itemsPerPage: 5,
            itemsPerPageList:[1,2,5,10,25,50,100],
            options: {
                itemsPerPage: 12
            },
            searchText: '',
            formTitle: 'Add IS',
            new_ISP: '',
            isp: {},
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
                    text: 'Dessert (100g serving)',
                    align: 'left',
                    // sortable: false,
                    value: 'name'
                },
                { text: 'Calories', value: 'calories' },
                { text: 'Fat (g)', value: 'fat' },
                { text: 'Carbs (g)', value: 'carbs' },
                { text: 'Protein (g)', value: 'protein' },
                { text: 'Iron (%)', value: 'iron' },
                { text: 'Actions', value: 'actions', sortable: false }
            ],
            items: [
                {
                    name: 'Karen',
                    email: 'karen.chen@hiero7.com',
                    role: 'Admin',
                    index: 1
                },
                {
                    name: 'Yuan',
                    email: 'yuan.kao@hiero7.com',
                    role: 'Admin',
                    index: 2
                }
            ],
            desserts: [
                {
                    name: 'Frozen Yogurt',
                    calories: 159,
                    fat: 6.0,
                    carbs: 24,
                    protein: 4.0,
                    iron: '1%'
                },
                {
                    name: 'Ice cream sandwich',
                    calories: 237,
                    fat: 9.0,
                    carbs: 37,
                    protein: 4.3,
                    iron: '1%'
                },
                {
                    name: 'Eclair',
                    calories: 262,
                    fat: 16.0,
                    carbs: 23,
                    protein: 6.0,
                    iron: '7%'
                },
                {
                    name: 'Pancake',
                    calories: 305,
                    fat: 3.7,
                    carbs: 67,
                    protein: 4.3,
                    iron: '8%'
                },
                {
                    name: 'Gingerbread',
                    calories: 356,
                    fat: 16.0,
                    carbs: 49,
                    protein: 3.9,
                    iron: '16%'
                },
                {
                    name: 'Jelly bean',
                    calories: 375,
                    fat: 0.0,
                    carbs: 94,
                    protein: 0.0,
                    iron: '0%'
                },
                {
                    name: 'Lollipop',
                    calories: 392,
                    fat: 0.2,
                    carbs: 98,
                    protein: 0,
                    iron: '2%'
                },
                {
                    name: 'Lollipop',
                    calories: 392,
                    fat: 0.2,
                    carbs: 98,
                    protein: 0,
                    iron: '2%'
                },
                {
                    name: 'Lollipop',
                    calories: 392,
                    fat: 0.2,
                    carbs: 98,
                    protein: 0,
                    iron: '2%'
                },
                {
                    name: 'Lollipop',
                    calories: 392,
                    fat: 0.2,
                    carbs: 98,
                    protein: 0,
                    iron: '2%'
                }
            ]
        }
    },
    methods: {
        newDialog: function() {
            this.formTitle = 'Add ISP'
            this.dialog.add = true
            this.isp = {}
            this.isp.id = -1
        },
        editDialog: function(item) {
            this.formTitle = 'Edit ISP'
            this.dialog.add = true
            this.isp = item
        },
        deleteDialog: function(item) {
            this.dialog.delete = true
            this.isp = item
        },
        closeDialog: function() {
            this.dialog.add = false
            this.dialog.delete = false
            this.isp = {}
        },
        addISP: function() {
            // do someting
        },
        updateISP: function() {
            this.isp

            if (!this.validateForm()) {
                return
            }

            if ((this.isp.id = -1)) {
                this.addISP()
            } else {
                // do someting
            }

            this.closeDialog()
        },
        deleteISP: function() {
            // do someting

            this.closeDialog()
        },
        validateForm: function() {
            // 驗證表單資料
            return this.$refs.form.validate()
        },
        filterOnlyCapsText(value, search, item) {
            console.log(value)
            console.log(search)
            console.log(item)
            return (
                value != null &&
                search != null &&
                typeof value === 'string' &&
                value
                    .toString()
                    .toLocaleUpperCase()
                    .indexOf(search) !== -1
            )
        }
    }
}
</script>
