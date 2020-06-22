<template lang="pug">
    v-container#sample-layout(grid-list-lg)
        Loading
        v-layout(wrap column)
            v-flex(xs12)
                v-card
                    v-card-text
                        v-form(ref="form" onsubmit="return false;")
                            v-layout(wrap)
                                v-flex.pt-0.pb-0(xs12 v-if="testType==0")

                                    v-card-text.pb-0.pl-0
                                        .subheading.font-weight-black Response:
                                    v-divider
                                    v-card-text.font-weight-bold.pb-0 CURL Command:
                                    pre(v-highlightjs="commandData")
                                        code.bash
                                    v-card-text.font-weight-bold.pb-0 Response Code & Download Time:
                                    pre(v-highlightjs="responseCodeAndTimeTotal")
                                        code.python.title.font-weight-medium

                    v-divider
</template>
<script>
  import textFieldRules from "../utils/textFieldRules";
  import Loading from '../components/Loading'
  export default {
    components: {
      Loading
    },
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
        date:'',
        time:'',
        responseCodeAndTimeTotal:'',
        TempResponseCodeAndTimeTotal:[],
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
        path:''
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
      }
    },
    methods: {
      send: function() {
          this.$store.dispatch("global/startLoading");
          this.polling(this.pollingList)
      },
      getInfo: function(data) {
        this.$store
          .dispatch("curl/getCurlInfo", data)
          .then(
            function(result) {
              const time = new Date().toString();
              const timeArray = time.split(" ");
              this.date = timeArray[0] +' '+ timeArray[1]+ ' ' + timeArray[2] +' '+ timeArray[3];
              this.time = timeArray[4] +' '+ timeArray[5];
              this.headerData = result.data.header;
              this.bodyData = result.data.body;
              this.commandData = result.data.command;
              this.responseCode = result.data.responseCode;
              this.timeTotal = result.data.timeTotal

              this.TempResponseCodeAndTimeTotal.push(this.date+ '   ' + this.time+'  '+result.data.responseCode+ '   ' + result.data.timeTotal + 'Sec')
              if (this.TempResponseCodeAndTimeTotal.length>20) {
                this.TempResponseCodeAndTimeTotal.shift()
              }
              this.responseCodeAndTimeTotal = this.TempResponseCodeAndTimeTotal.join("\r\n ")

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
                'global/showSnackbarError',
                error.message
              )
            }.bind(this)
          )
      },
      polling: function (data) {
        clearInterval(this.timer)
        console.log(data)
        data.forEach((item, index, array) => {
          var second = parseInt(item.second+'000')
          this.timer = window.setInterval(() => {
            setTimeout(() => {
              this.getInfo(item)
            }, 1)

          }, second);
        })
      }
    },
    created() {
      this.getCustomerInfo();
      this.getEdgeInfo();
    },
    mounted() {
      if (this.$route.query){
        // console.log(this.$route.query)
        const data = this.$route.query

        if (data.original==='false'){
          data.original = false
        }else{
          data.original = true
        }

        this.pollingList.push(data)
        this.send()
      }
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