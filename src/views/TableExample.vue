<template lang="pug">
    v-container(grid-list-lg)
        v-layout
            v-flex(xs12 sm12 md12)
                v-card
                    v-toolbar(flat white)
                        v-toolbar-title Table Example
                        v-divider.mx-4(inset vertical)
                        v-text-field(v-model="searchText" append-icon="mdi-magnify" label='Search' single-line hide-details )
                        v-divider.mx-4(inset vertical)
                        v-spacer
                        v-btn.mb-2.mr-2(color="primary" dark @click="clearFilter") clear Filter
                        v-btn.mb-2.mr-2(color="primary" dark @click="newDialog") Add
                        v-btn.mb-2.mr-2(color="primary" dark @click="init")
                            v-icon mdi-refresh
                        v-menu.mx-0.px-0(offset-y left) 
                            template(v-slot:activator="{on}")
                                v-btn.mx-0.px-0.mb-2(icon v-on="on")
                                    v-icon mdi-dots-vertical
                            v-list
                                v-list-item(@click="init")
                                    v-list-item-title Test List 1
                                v-list-item(@click="init")
                                    v-list-item-title Test List 2
                                v-list-item(@click="init")
                                    v-list-item-title Test List 3

                    DataTable2(ref="table2" :headers="headers" :items="desserts" :searchText="searchText" :searchList="searchList" :defaultItemsPerPage="itemsPerPage" :itemsPerPageList="itemsPerPageList" :loading="loading" @showDialog="dialogSwitch" :setUripath="jkbURI" :setLinkMethod="setLinkMethod")

                v-row.px-3.py-3
                    v-btn.mb-2.mr-2(color="primary" dark @click="stopIcon") Icon  
                        v-icon mdi-play-pause
                    v-btn.mb-2.mr-2(color="primary" dark @click="playIcon") Icon 
                        v-icon mdi-play
                    v-btn.mb-2.mr-2(color="primary" dark @mouseover="stopIcon" @mouseleave="playIcon") hover 

                v-row.px-3.py-3
                    lottie(:options="defaultOptions" :width="60" :height="60" v-on:animCreated="handleAnimation")
                    lottie(:options="defaultOptions2" :width="60" :height="60" v-on:animCreated="handleAnimation")

            v-dialog(v-model="dialog.add" max-width="460" scrollable persistent)
                v-card
                    v-card-title.title {{formTitle}}
                    v-card-text
                        v-form(ref="form" onsubmit="return false;")
                            v-text-field(v-if="editedIndex !== -1" v-model="formData.number" label="Number" type="text" name="name" readonly)
                            
                            v-text-field(v-model="formData.name" label="Name" type="text" name="name" :rules="[rules.required]")
                            
                            v-select(v-model="formData.good" :items="['Yes','No']" label="Good")
                            
                            v-combobox(v-model="formData.tag" :items="['A','B','C','D']" label="Tag" hide-selected dense hide-details)
                                template(v-slot:no-data)
                                    v-card-text No results matching 
                            v-text-field(v-model="formData.url" label="URL Search" type="search" name="path")

                            v-text-field(v-model="formData.remark" label="Remark" type="text" name="remark")
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
import addJson from '../assets/icon/add/add.json'
import toggleJson from '../assets/icon/toggle/toggle.json'

export default {
    name: 'DomainManage',
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
            itemsPerPage: 5,
            itemsPerPageList: [5, 15, 25, 50, 100, 500],
            editedIndex: -1,
            formTitle: '',
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
                    text: 'Number',
                    align: 'left',
                    sortable: true,
                    value: 'number'
                },
                {
                    text: 'Name',
                    align: 'left',
                    sortable: true,
                    value: 'name'
                },
                {
                    text: 'Good',
                    align: 'left',
                    sortable: true,
                    value: 'good'
                },
                {
                    text: 'Tag',
                    align: 'left',
                    sortable: true,
                    search: false,
                    value: 'tag',
                    combobox: ['A', 'B', 'C', 'D']
                },
                {
                    text: 'Link',
                    align: 'left',
                    sortable: true,
                    value: 'url',
                    href: true
                },
                {
                    text: 'Remark',
                    align: 'left',
                    sortable: true,
                    width: '200px',
                    value: 'remark',
                    search: false
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
            loading: true,
            jkbURI: 'https://www.google.com.tw/',
            setLinkMethod: (uri, value = null) => {
                return uri + 'search?q=' + value
            },
            defaultOptions: {
                animationData: addJson,
                loop: true,
                autoplay: true
            },
            defaultOptions2: {
                animationData: toggleJson,
                loop: true,
                autoplay: true
            },
            defaultAnim: []
        }
    },
    watch: {},
    methods: {
        handleAnimation(anim) {
            this.defaultAnim.push(anim)
        },
        dialogSwitch(bool, item) {
            bool ? this.editDialog(item) : this.deleteDialog(item)
        },
        newDialog() {
            this.formTitle = 'Add ...'
            this.dialog.add = true
            this.formData = {}
            this.formData.id = -1

            this.defaultAnim.pause()
        },
        editDialog(item) {
            this.formTitle = 'Edit ...'
            this.dialog.add = true
            this.editedIndex = this.desserts.indexOf(item)
            this.formData = {}
            this.formData = Object.assign({}, item)
        },
        deleteDialog(item) {
            this.formTitle = 'Delete ...'
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

            this.desserts = [
                {
                    number: 'F001',
                    name: 'ooopopo',
                    remark: 'is very good',
                    good: 'Yes',
                    tag: 'A',
                    url: 'hiero7'
                },
                {
                    number: 'F007',
                    name: 'Elaine',
                    remark: 'is very good',
                    good: 'Yes',
                    tag: 'A',
                    url: 'Elaine'
                },
                {
                    number: 'F009',
                    name: 'leo',
                    remark: 'is very bad',
                    good: 'No',
                    tag: 'B',
                    url: 'Leo'
                },
                {
                    number: 'F022',
                    name: 'leo',
                    remark: 'is very good',
                    good: 'Yes',
                    tag: 'A',
                    url: 'Leo'
                }
            ]
            this.loading = false
            // do something ...
        },
        addFormData() {
            // do something ...
            this.formData.number =
                'F' + Math.floor(Math.random() * (100 - 1)) + 1
            this.desserts.push(this.formData)
        },
        updateFormData() {
            // do someting ...
            this.desserts.splice(this.editedIndex, 1, this.formData)
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
        stopIcon() {
            this.defaultAnim.map(function(anim) {
                anim.pause()
            })
        },
        playIcon() {
            this.defaultAnim.map(function(anim) {
                anim.play()
            })
        }
    },
    mounted() {
        document.title = 'Table Example'
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
