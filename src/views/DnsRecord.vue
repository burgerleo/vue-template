<template lang="pug">
    v-container(grid-list-lg)
        v-layout
            v-flex(xs12 sm12 md12)
                v-card
                    v-data-table.elevation-1(:headers="headers" :items="desserts" :search="searchText" :dense="true" hide-default-footer :items-per-page="itemsPerPage" :page.sync="page" @page-count="pageCount = $event")
                        template(v-slot:top)
                            v-toolbar(flat white)
                                v-toolbar-title DNS Records
                                v-divider.mx-4(inset vertical)
                                v-text-field(v-model="searchText" append-icon="mdi-magnify" label="Search" single-line hide-details)
                                v-divider.mx-4(inset vertical)
                                v-spacer
                                v-card-text.pb-0.pl-0
                                    .subheading.text-right {{ time }}
                                v-btn.mb-2.mr-2(color="primary" dark @click="clearFilter") clear Filter
                        template(v-slot:header="{item,index}")
                            tr
                                td
                                td
                                    v-text-field.mt-0.pt-0(v-model="searchList.name" width="10px" label="Search" single-line hide-details @input="filterOnlyColumn($event,'name')")
                                td
                                    v-text-field.mt-0.pt-0(v-model="searchList.value" width="10px" label="Search" single-line hide-details @input="filterOnlyColumn($event,'value')")
                                //td
                                    v-text-field.mt-0.pt-0(v-model="searchList.true_enabled"  width="10px" label="Search" single-line hide-details @input="filterOnlyColumn($event,'true_enabled')")
                                //td
                                    v-text-field.mt-0.pt-0(v-model="searchList.backup" width="10px" label="Search" single-line hide-details @input="filterOnlyColumn($event,'backup')")
                                //td
                                    v-text-field.mt-0.pt-0(v-model="searchList.monitor_error" width="10px" label="Search" single-line hide-details @input="filterOnlyColumn($event,'monitor_error')")
                                //td
                                    v-text-field.mt-0.pt-0(v-model="searchList.status" width="10px" label="Search" single-line hide-details @input="filterOnlyColumn($event,'status')")
                        template(v-slot:item="{item,index}")
                            tr
                                td {{rowIndex(index)}}
                                td {{item.name}}
                                td {{item.value}}
                                td.text-xl-center
                                    v-icon(color="green darken-2" v-if="item.true_enabled==1") mdi-check
                                    v-icon(color="red darken-2" v-if="item.true_enabled==0") x
                                td.text-xl-center
                                    v-icon(color="green darken-2" v-if="item.backup==1") mdi-check
                                    v-icon(color="red darken-2" v-if="item.backup==0") x
                                td.text-lg-center
                                    span(:style="'background-color:red;color:white'" v-if="item.monitor_error=='yes'") error
                                td.text-lg-center
                                    span(:style="'background-color:green;color:white'" v-if="item.status=='active'") active
                    v-row.align-center
                        v-col.pa-5.pd-0(cols="12" sm="4")
                            v-select(:value="itemsPerPage" :items="itemsPerPageList" label="Items per page"  @change="itemsPerPage = parseInt($event, 10)")
                        v-col.pa-5.pd-0(cols="12" sm="3")
                        v-col.pa-5.pd-0(cols="12" sm="4")
                            v-pagination(v-model="page" :length="pageCount")
                        v-col.pa-5.pd-0(cols="12" sm="1")
</template>

<script>
  import textFieldRules from "../utils/textFieldRules";
  export default {
    mixins: [textFieldRules],
    name: "DnsRecord",
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
        headers: [
          {
            text: '#',
            align: 'center',
            sortable: false,
            width: '50px',
            value: 'index'
          },
          {
            text: 'CName',
            align: 'left',
            sortable: true,
            value: 'name'
          },
          {
            text: 'IP',
            align: 'left',
            sortable: true,
            value: 'value'
          },
          {
            text: 'enable',
            align: 'left',
            sortable: true,
            value: 'true_enabled'
          },
          {
            text: 'backup',
            align: 'left',
            sortable: true,
            // width: '10px',
            value: 'backup'
          },
          {
            text: 'monitor',
            align: 'left',
            sortable: true,
            width: '100px',
            value: 'monitor_error'
          },
          {
            text: 'status',
            align: 'left',
            sortable: true,
            width: '100px',
            value: 'status'
          }
        ],
        desserts: [],
        searchList: {},
        copyDesserts: null,
        time:''
      }
    },
    watch: {
    },
    methods: {
      getRecordsListFromServer: function() {
        this.$store.dispatch("global/startLoading");
        this.$store
          .dispatch("dnsRecord/getDNSRecord",)
          .then(
            function(result) {
              var data = this.formatData(
                result.data['data']
              );
              this.time = result.data['time']
              this.desserts = data
              this.copyDesserts = data
              this.$store.dispatch("global/finishLoading");
            }.bind(this)
          )
          .catch(
            function(error) {
              this.$store.dispatch("global/showSnackbarError", error.message);
              this.$store.dispatch("global/finishLoading");
            }.bind(this)
          );
      },
      rowIndex: function(index) {
        // 計算 每一列 Index 顯示 id
        return (this.page - 1) * this.itemsPerPage + index + 1
      },
      clearFilter(value, search, item) {
        // 清空 Filter 條件
        this.searchList = {}
        this.searchText = ''
        this.backupAndRcoverData()
      },
      formatData(data) {
        data.forEach(element => {
          if (element.monitor_error == null) element.monitor_error = "no";
          if (element.backup == "0" && element.true_enabled == "1")
            element.status = "active";
          else element.status = " ";
        });
        return data;
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
                  .toString()
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
    created() {
      this.getRecordsListFromServer();
    },
    mounted() {
      document.title = 'DNS Records';
    }
  }
</script>

<style scoped>

</style>