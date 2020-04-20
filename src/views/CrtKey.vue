<template lang="pug">
    v-container(grid-list-lg)
        v-layout
            v-flex(xs12 sm12 md12)
                v-card
                    v-data-table.elevation-1(v-model="selected" show-select :headers="headers" :items="desserts" :search="searchText" :dense="true" hide-default-footer :items-per-page="itemsPerPage" :page.sync="page" @page-count="pageCount = $event")
                        template(v-slot:top)
                            v-toolbar(flat white)
                                v-toolbar-title Cert Management
                                v-divider.mx-4(inset vertical)
                                v-text-field(v-model="searchText" append-icon="mdi-magnify" label="Search" single-line hide-details)
                                v-divider.mx-4(inset vertical)
                                v-spacer
                                v-col.mt-6(cols="12" sm="2")
                                    v-select(:items="fileTypeList" v-model="fileType" label="File type" item-text="text" item-value="value")
                                v-btn.mb-2.mr-2(color="primary" dark @click="downloadFiles") Batch Download
                                v-btn.mb-2.mr-2(color="primary" dark @click="clearFilter") clear Filter
                        template(v-slot:header="{item,index}")
                            tr
                                td
                                td
                                    v-text-field.mt-0.pt-0(v-model="searchList.name" width="10px" label="Search" single-line hide-details @input="filterOnlyColumn($event,'name')")
                                td
                                    v-text-field.mt-0.pt-0(v-model="searchList.time" width="10px" label="Search" single-line hide-details @input="filterOnlyColumn($event,'time')")
                        template(slot="items" slot-scope="{props, index}")
                            tr
                                td
                                    v-simple-checkbox(v-model="props.selected" primary hide-details)
                                td {{props.item.name}}
                                td {{props.item.time}}
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
    name: "CrtKey",
    watch: {
      fileType: function(value) {
        this.filterData();
      }
    },
    data() {
      return {
        page: 1,
        pageCount: 0,
        itemsPerPage: 50,
        itemsPerPageList: [10, 25, 50, 100],
        searchText: '',
        formTitle: '',
        editedIndex: -1,
        selected:[],
        headers: [
          {
            text: 'File Name',
            align: 'left',
            sortable: true,
            value: 'name'
          },
          {
            text: 'Time',
            align: 'left',
            sortable: true,
            value: 'time'
          }
        ],
        desserts: [],
        searchList: {},
        copyDesserts: null,
        // files: [],
        // filterFiles: [],
        columns: [
          {
            field: "name",
            label: "File Name"
          }
        ],
        checkedRows: [],
        searchText: "",
        perPage: 20,
        isLoading: true,
        fileType: "",
        fileTypeList:[
          {
            text: "All Files",
            value: ''
          },
          {
            text: ".crt",
            value: '.crt'
          },
          {
            text: ".key",
            value: '.key'
          }
        ]

      }
    },
    methods: {
      getList: function() {
        this.$store.dispatch("global/startLoading");
        this.$store
          .dispatch("cert/getList",)
          .then(
            function(result) {
              this.isLoading = true;
              this.files = [];
              this.copyDesserts = this.desserts = this.fileDataHandler(
                result.data
              );
              this.isLoading = false;
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
      fileDataHandler: function(rawData) {
        var fileList = [];
        for (var i = 3; i < rawData.length; i++) {
          var fileRawData = rawData[i].split(" ");
          var fileData = [];
          for (var j = 0; j < fileRawData.length; j++) {
            if (fileRawData[j] != "") fileData.push(fileRawData[j]);
          }

          var date = new Date(fileData[5] + " " + fileData[6]);


          var file = {
            id: i - 2,
            name: fileData[8],
            time: this.formDate(date),
            size: fileData[4]
          };
          fileList.push(file);
        }
        return fileList;
      },
      formDate:function(dateForm) {
        if (dateForm === "") {
          return "";
        }else{
          var tempDate = new Date(dateForm ).toJSON();
          var date = new Date(+new Date(tempDate)+ 8 * 3600 * 1000).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'');
          return date;
        }
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
      },
      filterData: function() {
        var searchResult
        var vm = this

        this.backupAndRcoverData()

        searchResult = this.desserts.filter(function(item) {
          if (item['name']) {
            return (
              item['name']
                .toString()
                .toLowerCase()
                .indexOf(vm.fileType) !== -1
            )
          }
          return false
        })

        this.desserts = searchResult
        this.selected = [];
      },
      downloadFiles: function() {
        var commandString = "";
        for (var i = 0; i < this.selected.length; i++) {
          commandString = commandString + this.selected[i].name + " ";
        }
        var postItem = {
          host: process.env.VUE_APP_HOST,
          filename: commandString
        };

        this.$store.dispatch('global/startLoading')
        this.$store
          .dispatch('cert/download', postItem)
          .then(
            function(result) {
              var filename = result[3].filename;
              window.open(
                process.env.VUE_APP_API_BASEURL + "certs/download/" + filename
              );
              this.selected = [];
              this.$store.dispatch("global/finishLoading");
            }.bind(this)
          )
          .catch(
            function(error) {
              this.$store.dispatch("global/showSnackbarError", error.message);
              this.$store.dispatch("global/finishLoading");
            }.bind(this)
          )
      }
    },
    created() {
      this.getList();
    },
  }
</script>

<style scoped>

</style>