<template lang="pug">
    v-container(grid-list-lg)
        v-layout
            v-flex(xs12 sm12 md12)
                v-card
                    v-data-table.elevation-1(:headers="headers" :items="desserts" :search="searchText" :dense="true" hide-default-footer :items-per-page="itemsPerPage" :page.sync="page" @page-count="pageCount = $event")
                        template(v-slot:top)
                            v-toolbar(flat white)
                                v-toolbar-title Edge
                                v-divider.mx-4(inset vertical)
                                v-text-field(v-model="searchText" append-icon="mdi-magnify" label="Search" single-line hide-details)
                                v-divider.mx-4(inset vertical)
                                v-spacer
                                v-btn.mb-2.mr-2(color="primary" dark @click="clearFilter") clear Filter

                                v-dialog(v-model="dialog.add")
                                    template(v-slot:activator="{ on }")
                                        v-btn.mb-2(color="primary" dark @click="newDialog") New Edge
                        template(v-slot:header="{item,index}")
                            tr
                                td
                                td
                                    v-text-field.mt-0.pt-0(v-model="searchList.customer" width="10px" label="Search" single-line hide-details @input="filterOnlyColumn($event,'customer')")
                                td
                                    v-text-field.mt-0.pt-0(v-model="searchList.name" width="10px" label="Search" single-line hide-details @input="filterOnlyColumn($event,'name')")
                                td
                                    v-text-field.mt-0.pt-0(v-model="searchList.area"  width="10px" label="Search" single-line hide-details @input="filterOnlyColumn($event,'area')")
                                td
                                    v-text-field.mt-0.pt-0(v-model="searchList.edge" width="10px" label="Search" single-line hide-details @input="filterOnlyColumn($event,'edge')")

                        template(v-slot:item="{item,index}")
                            tr
                                td {{rowIndex(index)}}
                                td {{item.customer}}
                                td {{item.name}}
                                td {{item.area}}
                                td {{item.edge}}
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
                            v-select(v-model="edge.customer_id" :items="customerList" label="Customer" name="customer" item-text="name" item-value="id")
                            v-text-field(v-model="edge.name" label="Edge Name" type="text" name="name" :rules="[rules.required]")
                            v-select(v-model="edge.area" :items="areaList" label="Edge Area"  :rules="[rules.required]")
                            v-text-field(v-model="edge.edge" label="Edge OOB" type="text" name="edge" :rules="[rules.required]")
                    v-card-actions
                        v-spacer
                        v-btn(color="grey" @click="closeDialog") Cancel
                        v-btn(color="primary" @click="save") Save

            v-dialog.delete-dialog(v-model="dialog.delete" max-width="600" persistent)
                v-card
                    v-card-title.title {{formTitle}}
                    v-card-text Are you sure want to delete
                        b.red--text {{edge.name}} ?
                    v-card-actions
                        v-spacer
                        v-btn(color="grey" @click="closeDialog") Cancel
                        v-btn(color="primary" @click="destroy") Yes
</template>

<script>
  import textFieldRules from '../utils/textFieldRules'

  export default {
    name: 'Edge',
    mixins: [textFieldRules],
    components: {},
    data() {
      return {
        page: 1,
        pageCount: 0,
        itemsPerPage: 50,
        itemsPerPageList: [10, 25, 50, 100],
        searchText: '',
        formTitle: '',
        edge: {},
        editedIndex: -1,
        dialog: {
          add: false,
          delete: false
        },
        areaList: ['TW', 'HK'],
        headers: [
          {
            text: '#',
            align: 'center',
            sortable: false,
            width: '50px',
            value: 'index'
          },
          {
            text: 'Customer',
            align: 'left',
            sortable: true,
            value: 'customer'
          },
          {
            text: 'Edge',
            align: 'left',
            sortable: true,
            value: 'name'
          },
          {
            text: 'Area',
            align: 'left',
            sortable: true,
            value: 'area'
          },
          {
            text: 'Edge OOB',
            align: 'left',
            sortable: true,
            // width: '10px',
            value: 'edge'
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
        copyDesserts: null,
        customerList:[]
      }
    },
    methods: {
      init: function() {
        this.$store.dispatch('global/startLoading')
        this.$store
          .dispatch('edge/getInfo')
          .then(
            function(result) {
              var arr = []
              this.customerList.forEach((item) => {
                arr[item.id] = item.name
              })

              result.data.forEach((item) =>
              {
                item.customer = arr[item.customer_id]
              })

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
      getCustomerInfo: function () {
        this.$store
          .dispatch('edge/getCustomerInfo')
          .then(
            function(result) {
              // console.log(result)
              this.customerList = result.data
            }.bind(this)
          )
          .catch(
            function(error) {
              this.$store.dispatch(
                'global/showSnackbarError',
                error.message
              )
            }.bind(this)
          )
      },
      newDialog: function() {
        this.formTitle = 'Add Edge'
        this.dialog.add = true

        // this.bgp = {
        //   id: -1,
        //   site: 'HK',
        //   isp: 'TWG',
        //   routes: 'G',
        //   br: 'R1'
        // }
        //
        // this.shortName()
      },
      editDialog: function(item) {
        this.formTitle = 'Edit Edge'
        this.dialog.add = true
        this.editedIndex = this.desserts.indexOf(item)
        this.edge = Object.assign({}, item)
        // this.bgp.wan = this.buildWAN(this.bgp)
      },
      deleteDialog: function(item) {
        this.formTitle = 'Delete Edge'
        this.dialog.delete = true
        this.editedIndex = this.desserts.indexOf(item)
        this.edge = item
      },
      closeDialog: function() {
        this.dialog.add = false
        this.dialog.delete = false
        this.edge = {}
        this.editedIndex = -1
      },
      store: function() {
        // 新增 API
        this.$store.dispatch('global/startLoading')
        this.$store
          .dispatch('edge/createEdge', this.edge)
          .then(
            function(result) {
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
        // this.desserts.push(this.bgp)
        // Object.assign(this.desserts[this.editedIndex], this.bgp)
      },
      update: function() {
        // Update API
        this.$store.dispatch('global/startLoading')
        this.$store
          .dispatch('edge/updateEdge', this.edge)
          .then(
            function(result) {
              this.$store.dispatch(
                'global/showSnackbarSuccess',
                'Success!'
              )
              this.init()

              // this.$store.dispatch('global/finishLoading')
            }.bind(this)
          )
          .catch(
            function(error) {
              this.$store.dispatch(
                'global/showSnackbarError',
                error.message
              )
              this.init()

              // this.$store.dispatch('global/finishLoading')
            }.bind(this)
          )
        // this.desserts.push(this.bgp)
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

        this.closeDialog()
      },
      destroy: function() {
        // 刪除 API
        this.$store.dispatch('global/startLoading')
        this.$store
          .dispatch('edge/destroyEdge', this.edge)
          .then(
            function(result) {
              this.$store.dispatch(
                'global/showSnackbarSuccess',
                'Success!'
              )
              this.init()

              // this.$store.dispatch('global/finishLoading')
            }.bind(this)
          )
          .catch(
            function(error) {
              this.$store.dispatch(
                'global/showSnackbarError',
                error.message
              )
              this.init()

              // this.$store.dispatch('global/finishLoading')
            }.bind(this)
          )

        // this.desserts.splice(this.editedIndex, 1)
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
      clearFilter(value, search, item) {
        // 清空 Filter 條件
        this.searchList = {}
        this.searchText = ''
        this.backupAndRcoverData()
      },
      filterOnlyColumn(value, column) {
        // 根據 [欄位] 輸入的 [文字]，進行 Filter

        var searchResult

        if (!value) {
          delete this.searchList[column]
        }

        // 備份 and 還原資料
        this.backupAndRcoverData()

        // 先將要搜尋的文字轉成大寫
        for (var searchKey in this.searchList) {
          var searchString = this.searchList[searchKey]
            .toString()
            .toLocaleUpperCase()

          searchResult = this.desserts.filter(function(item) {
            if (item[searchKey]) {
              return (
                item[searchKey]
                  .toLocaleUpperCase()
                  .indexOf(searchString) !== -1
              )
            }
            return false
          })

          this.desserts = searchResult
        }
      },
      backupAndRcoverData() {
        // 備份與還原
        // 當備份無資料時會進行第一次備份
        // 之後都是使用還原
        if (this.copyDesserts == null) {
          // 備份資料
          var list = this.desserts
          this.copyDesserts = list
        } else {
          // 還原資料
          var list = this.copyDesserts
          this.desserts = list
        }
      }
    },
    mounted() {
      this.init()
    },
    created() {
      this.getCustomerInfo()
    }
  }
</script>
