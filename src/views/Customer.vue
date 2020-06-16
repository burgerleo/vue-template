<template lang="pug">
    v-container(grid-list-lg)
        v-layout
            v-flex(xs12 sm12 md12)
                v-card
                    v-data-table.elevation-1(:headers="headers" :items="desserts" :search="searchText" :dense="true" hide-default-footer :items-per-page="itemsPerPage" :page.sync="page" @page-count="pageCount = $event")
                        template(v-slot:top)
                            v-toolbar(flat white)
                                v-toolbar-title Customer Information
                                v-divider.mx-4(inset vertical)
                                v-text-field(v-model="searchText" append-icon="mdi-magnify" label="Search" single-line hide-details)
                                v-divider.mx-4(inset vertical)
                                v-spacer
                                v-btn.mb-2.mr-2(color="primary" dark @click="clearFilter") clear Filter

                                v-dialog(v-model="dialog.add")
                                    template(v-slot:activator="{ on }")
                                        v-btn.mb-2(color="primary" dark @click="newDialog") New Customer
                        template(v-slot:header="{item,index}")
                            tr
                                td
                                td
                                    v-text-field.mt-0.pt-0(v-model="searchList.customer_id" width="10px" label="Search" single-line hide-details @input="filterOnlyColumn($event,'customer_id')")
                                td
                                    v-text-field.mt-0.pt-0(v-model="searchList.customer_property" width="10px" label="Search" single-line hide-details @input="filterOnlyColumn($event,'customer_property')")
                                td
                                    v-text-field.mt-0.pt-0(v-model="searchList.am" width="10px" label="Search" single-line hide-details @input="filterOnlyColumn($event,'am')")
                                td
                                    v-text-field.mt-0.pt-0(v-model="searchList.authorization" width="10px" label="Search" single-line hide-details @input="filterOnlyColumn($event,'authorization')")
                                td
                                    v-text-field.mt-0.pt-0(v-model="searchList.skype_account" width="10px" label="Search" single-line hide-details @input="filterOnlyColumn($event,'skype_account')")
                                td
                                    v-text-field.mt-0.pt-0(v-model="searchList.login_account" width="10px" label="Search" single-line hide-details @input="filterOnlyColumn($event,'login_account')")
                                td
                                    v-text-field.mt-0.pt-0(v-model="searchList.subscription_service_list" width="10px" label="Search" single-line hide-details @input="filterOnlyColumn($event,'subscription_service_list')")
                        template(v-slot:item="{item,index}")
                            tr
                                td {{rowIndex(index)}}
                                td {{item.customer_id}}
                                td {{item.customer_property}}
                                td {{item.am}}
                                td(v-html='(item.authorization)?item.authorization.join().replace(/,/g,"<br>"):""')
                                td(v-html='(item.skype_account)?item.skype_account.join().replace(/,/g,"<br>"):""')
                                td(v-html='(item.login_account)?item.login_account.join().replace(/,/g,"<br>"):""')
                                td
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
                            v-text-field(v-model="customer.customer_id" label="Customer Id" type="text" name="customer_id" :rules="[rules.required, rules.number, rules.length, rules.customerType]")
                            v-select(v-model="customer.customer_property" :items="customerPropertyList" label="Customer Property" name="customer_property" :rules="[rules.required]")
                            v-combobox(multiple v-model="customer.authorization"
                                name="authorization"
                                label="Authorization"
                                append-icon
                                chips
                                deletable-chips
                                class="tag-input"
                                :search-input.sync="authorizationSearch"
                                :delimiters="[',', ';', ' ']"
                                @change="pasted('authorization')"
                                :rules="[rules.emailCountLimit, rules.emailList, rules.max]")
                            v-combobox(multiple v-model="customer.skype_account"
                                name="skype_account"
                                label="Skype Account"
                                append-icon
                                chips
                                deletable-chips
                                class="tag-input"
                                :search-input.sync="skype_accountSearch"
                                :delimiters="[',', ';', ' ']"
                                @change="pasted('skype_account')"
                                :rules="[rules.emailCountLimit, rules.max]")
                            v-combobox(multiple v-model="customer.login_account"
                                name="login_account"
                                label="H7CDN Login Account"
                                append-icon
                                chips
                                deletable-chips
                                class="tag-input"
                                :search-input.sync="login_accountSearch"
                                :delimiters="[',', ';', ' ']"
                                @change="pasted('login_account')"
                                :rules="[rules.emailCountLimit, rules.emailList, rules.max]")
                    v-card-actions
                        v-spacer
                        v-btn(color="grey" @click="closeDialog") Cancel
                        v-btn(color="primary" @click="save") Save

            v-dialog.delete-dialog(v-model="dialog.delete" max-width="600" persistent)
                v-card
                    v-card-title.title {{formTitle}}
                    v-card-text Are you sure want to delete
                        b.red--text {{customer.name}} ?
                    v-card-actions
                        v-spacer
                        v-btn(color="grey" @click="closeDialog") Cancel
                        v-btn(color="primary" @click="destroy") Yes
</template>

<script>
  import textFieldRules from '../utils/textFieldRules'

  export default {
    name: 'Customer',
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
        customer: {
          authorization:[],
          skype_account:[],
          login_account:[]
        },
        customerPropertyList: ['Presales', 'Existing', 'Terminated'],
        editedIndex: -1,
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
            text: 'Customer Id',
            align: 'left',
            sortable: true,
            value: 'customer_id'
          },
          {
            text: 'Customer Property',
            align: 'left',
            sortable: true,
            value: 'customer_property'
          },
          {
            text: 'AM',
            align: 'left',
            sortable: true,
            value: 'am'
          },
          {
            text: 'Authorization List',
            align: 'left',
            sortable: true,
            value: 'authorization'
          },
          {
            text: 'Skype Account',
            align: 'left',
            sortable: true,
            value: 'skype_account'
          },
          {
            text: 'H7CDN Login Account',
            align: 'left',
            sortable: true,
            value: 'login_account'
          },
          {
            text: 'Subscription Service List',
            align: 'left',
            sortable: true,
            value: ''
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
        customerList:[],
        authorizationSearch: "",
        select:[],
        skype_accountSearch:"",
        login_accountSearch:""
      }
    },
    methods: {
      init: function() {
        this.$store.dispatch('global/startLoading')
        this.$store
          .dispatch('customer/getInfo')
          .then(
            function(result) {
              var arr = []


              result.data.forEach((item) =>
              {
                item.authorization = (item.authorization)?JSON.parse(item.authorization).data:''
                item['login_account'] = (item['login_account'])?JSON.parse(item['login_account']).data:''
                item['skype_account'] = (item['skype_account'])?JSON.parse(item['skype_account']).data:''
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
      newDialog: function() {
        this.formTitle = 'Add Customer'
        this.dialog.add = true

        this.customer = {
          id: -1,
          customer_property: 'Presales',
          authorization:[],
        }
      },
      editDialog: function(item) {
        this.formTitle = 'Edit Customer'
        this.dialog.add = true
        this.editedIndex = this.desserts.indexOf(item)
        this.customer = Object.assign({}, item)

      },
      deleteDialog: function(item) {
        this.formTitle = 'Delete Customer'
        this.dialog.delete = true
        this.editedIndex = this.desserts.indexOf(item)
        this.customer = item
      },
      closeDialog: function() {
        this.dialog.add = false
        this.dialog.delete = false
        this.customer = {}
        this.editedIndex = -1
      },
      store: function() {
        // 新增 API
        const authorization = new Object();
        authorization.data = this.customer.authorization
        this.customer.authorization = JSON.stringify(authorization)

        const skype_account = new Object();
        skype_account.data = this.customer.skype_account
        this.customer.skype_account = JSON.stringify(skype_account)

        const login_account = new Object();
        login_account.data = this.customer.login_account
        this.customer.login_account = JSON.stringify(login_account)

        this.$store.dispatch('global/startLoading')
        this.$store
          .dispatch('customer/createCustomer', this.customer)
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
        const authorization = new Object();
        authorization.data = this.customer.authorization
        this.customer.authorization = JSON.stringify(authorization)

        const skype_account = new Object();
        skype_account.data = this.customer.skype_account
        this.customer.skype_account = JSON.stringify(skype_account)

        const login_account = new Object();
        login_account.data = this.customer.login_account
        this.customer.login_account = JSON.stringify(login_account)

        this.$store.dispatch('global/startLoading')
        this.$store
          .dispatch('customer/updateCustomer', this.customer)
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
          .dispatch('customer/destroyCustomer', this.customer)
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
              const itemList = (typeof item[searchKey] =="object")?item[searchKey].join():item[searchKey]
              return (
                itemList
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
      },
      pasted(type) {
        const searchType = type+'Search';
        if (this[searchType]){
          const search = this[searchType].split(",");
          const field = this.customer[type]

          if (field[field.length - 1]== this[searchType]){
            field.splice(field.length - 1, 1);
          }

          if (search.length>1) {
            this[searchType] = ''
          }

          search.forEach(element => {
            if(field.indexOf(element)==-1){
              field.push(element.replace(/\s+/g, ""));
            }
          });
        }
      }
    },
    mounted() {
      this.init()
    },
    created() {
    }
  }
</script>
<style lang="sass" scoped>
    td
        word-break: break-all
</style>
