<template lang="pug">
    v-container#sample-layout(grid-list-lg)
        v-layout(wrap column)
            v-flex(xs12)
                v-card
                    v-card-text
                        v-row
                            v-toolbar(flat white)
                                v-radio-group.pt-0.pb-0.mb-0.mt-0(v-model="testType" :mondatory="true" row)
                                    v-radio(label="Single Testing" :value="0")
                                    v-radio(label="Periodical Testing" :value="1")
                                    v-flex.pb-0(v-if="testType==1" xs12 sm3 md3)
                                        v-btn.mb-2.mr-2(x-small color="primary" dark @click="newWindow()") New Window
                                        v-btn.mb-2.mr-2(x-small color="primary" dark @click="newTabWindow()") New Tab
                                v-spacer
                                v-btn.mb-2.mr-2(color="primary" dark @click="editDialog()") Setting
                        v-form(ref="form" onsubmit="return false;")
                            v-layout(wrap)
                                v-layout.ml-auto.mr-auto(wrap)
                                    v-flex.pt-0.pb-0.mt-0.mb-0(xs12 sm12 md12)
                                        v-radio-group.pt-0.pb-0.mt-0.mb-0(v-model="area" :mondatory="true" row)
                                            v-radio(label="TW" :value="0")
                                            v-radio(label="HK" :value="1")
                                            v-flex.pt-0.pb-0.mt-0.mb-0(xs12 sm6 md3)
                                                v-select(v-if="area==0" :disabled="area==1" v-model="edge" :items="twEdge" label="TW Edge" name="tw_edge" item-text="text" item-value="id")
                                                v-select(v-if="area==1" :disabled="area==0" v-model="edge" :items="hkEdge" label="HK Edge" name="hk_edge" item-text="text" item-value="id")
                                    v-flex.pt-0.pb-0(xs12 sm6 md1)
                                        v-select(v-model="method" :items="selectMethod" label="HTTP Method" item-text="name" item-value="id" :rules="[rules.required]" @change="defaultParameters")
                                    v-flex.pt-0.pb-0(xs12 sm6 md2)
                                        v-select(v-model="redirect" :items="selectRedir" label="Max Num. of Redirects" item-text="name" item-value="id" )
                                    v-flex.py-6.pt-0.pb-0(xs12 sm6 md5)
                                        v-text-field(v-model="url" label="URL" type="" name="url" :rules="[rules.required, rules.url]")
                                    v-flex.py-6.pt-0.pb-0(xs12 sm6 md2)
                                        v-checkbox(v-model="original" label="Origin" @change="clearOriginal")
                                    v-flex.py-6.pt-0.pb-0(xs12 sm12 md2)
                                        v-checkbox(v-model="headerOnly" label="Header only")
                                    v-flex.py-6.pt-0.pb-0(xs12 sm6 md6 v-if="original==true")
                                        v-text-field(v-model="hostName" label="Host Name" type="" name="hostName" readonly background-color="#ECEFF1")
                                    v-flex.py-6.pt-0.pb-0(xs12 sm3 md3 v-if="original==true")
                                        v-text-field(v-model="port" label="Port" type="" name="port")
                                    v-flex.py-6.pt-0.pb-0(xs12 sm3 md3 v-if="original==true && multiHostIp==false")
                                        v-text-field(v-model="hostIp" label="Host IP" type="" name="hostIp")
                                    v-flex.py-6.pt-0.pb-0(xs12 sm3 md3 v-else="original==true && multiHostIp==true")
                                        v-radio-group.pt-0.mt-1(row v-model="hostIp" :mandatory="true")
                                            v-spacer.pl-3
                                                v-radio(v-for="ip in hostIpList" :label="ip" :value="ip")
                                    v-flex.pt-0.pb-0(xs12 pa-2)
                                        v-layout.px-2(row v-for="(header,index) in headers " :key="index")
                                            v-flex(xs12 sm3 md3)
                                                v-text-field(label="Key" v-model="header.key")
                                            v-flex(xs12 sm6 md6)
                                                v-text-field(label="Value" v-model="header.value")
                                            v-flex(xs12 sm3 md3)
                                                v-btn( color="primary" dark @click="deleteRow(index)") X
                                    v-flex.pt-0.pb-0.ml-1(row align-center xs12 sm12 md12)
                                        v-btn( color="primary" dark @click="addRow") Add Headers

                                    v-layout.px-2.pt-0.pb-0(row v-if="method=='POST'")
                                        v-flex(xs12 sm12 md12)
                                            v-flex(xs12 v-if="postInput=='Parameters'")
                                                v-layout.px-2(row v-for="(parameter,index) in parameters " :key="index")
                                                    v-flex(xs12 sm3 md3)
                                                        v-text-field(label="Key" v-model="parameter.key")
                                                    v-flex(xs12 sm6 md6)
                                                        v-text-field(label="Value" v-model="parameter.value")
                                                    v-flex(xs12 sm3 md3)
                                                        v-btn( color="primary" dark @click="deleteParameter(index)") X
                                        v-flex.pt-0.pb-0(xs12 sm6 md3)
                                            v-select(v-model="postInput" :items="selectPostInput" label="Data Input Method" @change="defaultParameters")
                                        v-flex.pt-0.pb-0.ml-1(row align-center xs12 sm12 md3 v-if="postInput=='Parameters'")
                                            v-btn(color="primary" dark @click="addParameter") Add Parameters
                                        v-flex.pt-0.pb-0.ml-1(xs12 sm12 md8 v-if="postInput!='Parameters'")
                                            v-text-field(label="Post Body" v-model="postBody")

                                    v-flex.pb-0(xs12 sm3 md2)
                                        v-btn(color="primary" block @click="send('nameForm')") SEND
                                    v-flex.pt-0.pb-0(xs12)

                                        v-card-text.pb-0.pl-0
                                            .subheading.font-weight-black Response:
                                            .subheading.text-right {{timestamp}}
                                        v-divider
                                        v-card-text.font-weight-bold.pb-0 CURL Command:
                                        pre(v-highlightjs="commandData")
                                            code.bash
                                        v-card-text.font-weight-bold.pb-0 Response Code & Download Time:
                                        pre(v-highlightjs="responseCodeAndTimeTotal")
                                            code.java.display-1.font-weight-black

                                        v-card-text.font-weight-bold Header:
                                            v-expansion-panels
                                                v-expansion-panel
                                                    v-expansion-panel-header
                                                        v-expansion-panel-content
                                                            pre(v-highlightjs="headerData")
                                                                code.bash

                                        v-card-text.font-weight-bold.pt-0 Body:
                                            v-expansion-panels
                                                v-expansion-panel
                                                    v-expansion-panel-header
                                                        v-expansion-panel-content
                                                            pre(v-highlightjs="bodyData")
                                                                code.bash

                                        v-card-text.font-weight-bold Requests:
                                            v-flex(xs12 sm12 md12)
                                                v-card
                                                    v-data-table.elevation-1(:headers="tableHeaders" :items="desserts" :dense="true" :loading="loading" disable-pagination hide-default-footer fixed-header)
                                                        template(v-slot:header="{item,index}")

                                                        template(v-slot:item="{item,index}")
                                                            tr
                                                                td {{rowIndex(index)}}
                                                                td
                                                                    v-tooltip(top)
                                                                        template(v-slot:activator="{ on }")
                                                                            span &nbsp;
                                                                            a(:href="item.url" target="_blank" v-on="on" :style="(item.status.toString().substr(0,1)==4 || item.status.toString().substr(0,1)==5)?'color:red':''")
                                                                                span(v-if="item.file==='' || item.file== null || item.file == undefined ") {{item.url}}
                                                                                span(v-else-if="item.file==item.file.slice(-40)") {{item.file}}
                                                                                span(v-else) {{'....' + item.file.slice(-40)}}
                                                                            v-icon.mr-2(small @click="newWindowWithParams(item.url)") mdi-checkbox-multiple-blank-outline
                                                                        span {{item.url}}
                                                                td
                                                                    span.font-weight-bold.title(:style="statusStyle(item.status)") {{item.status}}
                                                                td {{item.host}}
                                                                td {{item.ip}}
                                                                td {{item.method}}
                                                                td
                                                                    span.font-weight-bold.title(:style="dnsStyle(item.dnsLookup)") {{item.dnsLookup}}
                                                                td
                                                                    span.font-weight-bold.title(:style="connectStyle(item.tcpConnection)") {{item.tcpConnection}}
                                                                td
                                                                    span.font-weight-bold.title(:style="downloadStyle(item.total)") {{item.total}}
                                                                td {{item.size}}
                                                                td {{item.failure}}

        v-dialog(v-model="dialog" max-width="600" scrollable persistent)
            v-card
                v-card-title.title Setting
                v-card-text.font-weight-bold.pt-6 Requests Color Range
                    v-form(ref="form" onsubmit="return false;")
                        v-card-text DNS Resolution Time (ms)
                            v-slider.align-center.pt-10(v-model="configs.dnsRange" hide-details thumb-label="always" thumb-size="36" step='1')
                        v-card-text Connect Time (ms)
                            v-slider.align-center.pt-10(v-model="configs.connectRange" hide-details thumb-label="always" thumb-size="36" step='1')
                        v-card-text Download Time (ms)
                            v-slider.align-center.pt-10(v-model="configs.downloadRangeFirstStage" :max="configs.downloadRangeSecondStage[0]" hide-details thumb-label="always" thumb-size="36" step='1')
                            v-range-slider.align-center.mt-12(v-model="configs.downloadRangeSecondStage" :max="configs.max" :min="configs.min" hide-details thumb-label="always" thumb-size="36" step='1')

                v-card-actions
                    v-spacer
                    v-btn(color="grey" @click="closeDialog") Cancel
                    v-btn(color="primary" @click="save") Save

</template>
<script>
  import textFieldRules from "../utils/textFieldRules";
  export default {
    mixins: [textFieldRules],
    data() {
      return {
        selectMethod: ["GET", "POST"],
        selectRedir: [0,1,2,3],
        selectPostInput:['Parameters', 'Raw Body'],
        postInput:'Parameters',
        postBody:'',
        method:'GET',
        redirect: 3,
        url:'',
        headerOnly:0,
        commandData:'',
        timeTotal:'',
        responseCode:'',
        headerData:'',
        bodyData:'',
        original: true,
        hostName:'',
        port:'',
        hostIp:'',
        parameters: [],
        headers: [],
        area: 0,
        timestamp:'',
        responseCodeAndTimeTotal:'',
        domainList:[],
        hostIpList: [],
        multiHostIp: false,
        customerList: [],
        edgeList: [],
        hkEdge:[],
        twEdge:[],
        edge:'',
        testType : 0,
        second: 5,
        pollingList:[],
        tabItems: [],
        tab: null,
        newWin:'',
        newWinWithParams:'',
        newTab:'',
        page: 1,
        pageCount: 0,
        itemsPerPage: 50,
        searchText: '',
        loading:false,
        tableHeaders: [
          {
            text: '#',
            align: 'center',
            sortable: false,
            width: '50px',
            value: 'index'
          },
          {
            text: 'Path/File',
            align: 'left',
            sortable: true,
            value: 'file',
            width: '300px',
          },
          {
            text: 'Status Code',
            align: 'left',
            sortable: true,
            value: 'status',
            width: '80px',
          },
          {
            text: 'Host',
            align: 'left',
            sortable: true,
            value: 'host',
            width: '100px',
          },
          {
            text: 'IP Address',
            align: 'left',
            sortable: true,
            value: 'ip',
            width: '150px',
          },
          {
            text: 'Method',
            align: 'left',
            sortable: true,
            value: 'method',
            width: '40px',
          },
          {
            text: 'Dns Resolution Time (ms)',
            align: 'left',
            sortable: true,
            value: 'dnsLookup',
            width: '80px',
          },
          {
            text: 'Connect Time (ms)',
            align: 'left',
            sortable: true,
            width: '80px',
            value: 'tcpConnection'
          },
          {
            text: 'Download time (ms)',
            align: 'left',
            sortable: true,
            width: '80px',
            value: 'total'
          },
          {
            text: 'Size',
            align: 'left',
            sortable: true,
            width: '100px',
            value: 'size'
          },
          {
            text: 'Note',
            align: 'left',
            sortable: true,
            width: '100px',
            value: 'failure'
          }
        ],
        desserts: [],
        searchList: {},
        copyDesserts: null,
        dialog: false,
        configs: {
          dnsRange:5,
          connectRange:5,
          downloadRangeFirstStage:50,
          min:1,
          max:10000,
          downloadRangeSecondStage:[1000,5000]
        }
      };
    },
    watch:{
      url: function(value) {
        if (value !== '' && value.match(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.%]+$/gm)){
          const domain = this.originalDataFormat(value)
          this.getDomainList(domain)
        }else{
          this.hostName = this.url
        }
      },
      area: function (value) {
        if (value==0){
          this.edge = this.twEdge[0].id
        }else{
          this.edge = this.hkEdge[0].id
        }
      },
      newWin(){
        let routeData = this.$router.resolve({path: '/new-periodical-curl'});
        window.open(routeData.href,'','height=900,width=1200,resizable=yes,scrollbars=yes,toolbar=yes,status=yes')
      },
      newTab(){
        let routeData = this.$router.resolve({path: '/periodical-curl'});
        window.open(routeData.href,'',)
      },
      newWinWithParams(){
        let routeData = this.$router.resolve({path: '/new-periodical-curl'});
        window.open(routeData.href,'','height=900,width=1200,resizable=yes,scrollbars=yes,toolbar=yes,status=yes')
      },
    },
    methods: {
      send: function() {
        const method = (this.method == "GET" ? "get" : "post")
        const headerOnly = (this.headerOnly == true ? 1 : 0)
        const header = this.headers
        const parameters = this.parameters
        const time = new Date();
        if (this.$refs.form.validate()) {
          this.timestamp = time;
          var data = {
            "url" : this.url,
            "method" : method,
            "redirect" : this.redirect,
            "headerOnly" : headerOnly,
            "original": this.original,
            "hostName": this.hostName,
            "port": this.port,
            "hostIp": this.hostIp,
            "header": header,
            "parameters": parameters,
            "postInput": this.postInput,
            "postBody": this.postBody,
            "area": this.area,
            "edge": this.edge,
            "second": this.second
          }
          this.$store.dispatch("global/startLoading");
          this.getInfo(data)
          this.getRecursiveDate()
        }
      },
      getInfo: function(data) {
        this.$store
          .dispatch("curl/getCurlInfo", data)
          .then(
            function(result) {
              this.headerData = result.data.header;
              this.bodyData = result.data.body;
              this.commandData = result.data.command;
              this.responseCode = result.data.responseCode;
              this.timeTotal = result.data.timeTotal
              this.responseCodeAndTimeTotal = result.data.responseCode+' '+result.data.timeTotal + 'Sec'
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
      clearOriginal: function() {
        if(this.original == false){
          this.hostName = '';
          this.port = '';
          this.hostIp = ''
        }else{
          this.originalDataFormat(this.url)
        }
      },
      originalDataFormat: function(value) {
        let url = '';
        if(/(http(s?)):\/\//i.test(value)) {
          url = value;
        }else{
          url= 'http://' + value;
        }

        url = new URL(url);
        this.hostName = url.host;
        this.port = url.href.indexOf('https') ? 80 : 443
        return url.host;
      },
      defaultParameters : function() {
        if(this.postInput == 'Parameters' || this.selectMethod=='GET'){
          this.parameters = []
        }else{
          this.postBody = ''
        }
      },
      addRow: function () {
        this.headers.push({key:'', value:''})
      },
      deleteRow: function (index) {
        this.headers.splice(index, 1)
      },
      addParameter: function () {
        this.parameters.push({key:'', value:''})
      },
      deleteParameter: function (index) {
        this.parameters.splice(index, 1)
      },
      mappingIp:function (value) {
        this.multiHostIp = false;
        this.hostIp = '';
        var arr = [];
        let list = this.domainList.filter((item, index, array) => {
          // return item.domain.match(value)//模糊搜尋
          return item.domain == value//完整搜尋
        })

        list.forEach((item) => {
          arr.push(item.host)
        })
        if (list.length ==1) {
          this.hostIp = arr[0]
        }else if (list.length >1) {
          this.multiHostIp = true
          this.hostIpList = arr
        }else{
          this.hostIp = "FQDN Not Found in CDNBest"
        }
      },
      getDomainList:function (value) {
        var data = {
          domain : value
        };
        this.$store.dispatch("curl/getDomainList", data)
          .then(
            function(result) {
              this.domainList = result.data.list;
              this.mappingIp(value)
            }.bind(this)
          )
          .catch(
            function(error) {
              this.$store.dispatch("global/showSnackbarError", error.message);
              this.$store.dispatch("global/finishLoading");
            }.bind(this)
          );
      },
      getCustomerInfo: function () {
        this.$store
          .dispatch('edge/getCustomerInfo')
          .then(
            function(result) {
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
      getEdgeInfo: function () {
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

              result.data.forEach((item) => {item.customer
                item.text = item.name + ' (' + item.edge_oob + ') '
                if (item.area=='HK'){
                  this.hkEdge.push(item)
                  this.edge = this.twEdge[0].id
                }else if(item.area=='TW'){
                  this.twEdge.push(item)
                }
              })

              this.edgeList = result.data
            }.bind(this)
          )
          .catch(
            function(error) {
              this.$store.dispatch(
                'global/showSnackbarError ',
                error.message
              )
            }.bind(this)
          )
      },
      getRecursiveDate: function () {
        const self = this;
        let url = '';
        this.desserts = [];
        if(/(http(s?)):\/\//i.test(this.url)) {
          url = this.url;
        }else{
          url =  (this.port == 443)? 'https://' + this.url : 'http://' + this.url;
        }
        const data = {
          "url" : url,
          "area": self.area,
          "edge": self.edge
        }
        this.loading= true;
        this.$store
          .dispatch('curl/getRecursive', data)
          .then(
            function(result) {
              this.desserts = result.Response
              this.copyDesserts = result.Response
              result.Response.forEach(function(item) {
                item.size = self.bytesToSize(item.size)
              })

              this.loading= false;
            }.bind(this)
          )
          .catch(
            function(error) {
              this.loading= false;
              console.log(error)
            }.bind(this)
          )
      },
      newWindow: function () {
        this.newWin = [];
      },
      newWindowWithParams: function (path) {
        let routeData = this.$router.resolve({path: '/new-periodical-curl', query: {  path: path }});
        window.open(routeData.href,'','height=900,width=1200,resizable=yes,scrollbars=yes,toolbar=yes,status=yes')
      },
      newTabWindow: function () {
        this.newTab = [];
      },
      rowIndex: function(index) {
        // 計算 每一列 Index 顯示 id
        return (this.page - 1) * this.itemsPerPage + index + 1
      },
      bytesToSize: function(bytes){
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes == 0 || bytes == null) return '0 Byte';
        var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
      },
      statusStyle: function (status) {
        if (status.toString().substr(0,1) === '2'){
          return 'color: #26A69A;'//green
        }else if (status.toString().substr(0,1) === '3'){
          return 'color: #42A5F5;'//blue
        }else if (status.toString().substr(0,1) === '4'){
          return 'color: #FB8C00;'//orange
        }else if (status.toString().substr(0,1) === '5'){
          return 'color: #E53935;'//red
        }
      },
      dnsStyle: function (dnsTime) {
        if (dnsTime > this.configs.dnsRange){
          return 'color: #E53935;'
        }else{
          return 'color: #26A69A;'
        }
      },
      connectStyle: function (connectTime) {
        if (connectTime > this.configs.connectRange){
          return 'color: #E53935;'
        }else{
          return 'color: #26A69A;'
        }
      },
      downloadStyle: function (downloadTime) {
        if (downloadTime >= this.configs.downloadRangeSecondStage[1]){
          return 'color: #E53935;'
        }else if(downloadTime < this.configs.downloadRangeSecondStage[1] && downloadTime >= this.configs.downloadRangeSecondStage[0]){
          return 'color: #FB8C00;'
        }else if(downloadTime >= this.configs.downloadRangeFirstStage && downloadTime <= this.configs.downloadRangeSecondStage[0]){
          return 'color: #42A5F5;'
        }else if(downloadTime < this.configs.downloadRangeFirstStage){
          return 'color: #26A69A;'
        }
      },
      editDialog() {
        this.dialog = true
      },
      closeDialog() {
        this.dialog = false
      },
      save() {
        if (this.$refs.form.validate()) {
          const download = new Object();
          download.min = this.configs.downloadRangeFirstStage;
          download.middle = this.configs.downloadRangeSecondStage[0];
          download.max = this.configs.downloadRangeSecondStage[1];

          const data = {
            "dnsRange" : this.configs.dnsRange,
            "connectRange" : this.configs.connectRange,
            "downloadRange" : download

          }

          this.$store
            .dispatch('curl/setConfig', data)
            .then(
              function() {
                this.$store.dispatch(
                  'global/showSnackbarSuccess',
                  'Success!'
                )
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

          this.closeDialog()
        }
      },
      getConfig() {
        this.$store.dispatch('global/startLoading')
        this.$store
          .dispatch('curl/getConfig')
          .then(
            function(result) {
              for (var config of result.data) {
                if (config.attributes && Object.keys(config.actions) != "downloadRange") {
                  this.configs[config.attributes] = config.actions[config.attributes]
                }else{
                  const downloadRange = config.actions[config.attributes]
                  this.configs.downloadRangeFirstStage = downloadRange.min;
                  this.configs.downloadRangeSecondStage[0] = downloadRange.middle;
                  this.configs.downloadRangeSecondStage[1] = downloadRange.max;
                }
              }
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
      }
    },
    created() {
      this.getCustomerInfo();
      this.getEdgeInfo();
    },mounted() {
      this.getConfig();
    }
  };
</script>


<style lang="sass" scoped>
    .hljs
        display: block
        color: #abb2bf
        background: #282c34
        word-break: break-all
</style>