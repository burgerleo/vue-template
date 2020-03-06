<template lang="pug">
    v-container#sample-layout(grid-list-lg)
        v-layout(wrap)
            v-flex(xs12)
                .title Curl Manage
            v-flex(xs12)
                v-card
                    v-card-text
                        v-form(ref="form" onsubmit="return false;")
                            v-layout(wrap)
                                v-flex(xs12 sm12 md12)
                                    v-radio-group(row v-model="edge")
                                        v-radio(label="TW" :value="0")
                                        v-radio(label="HK" :value="1")
                                v-flex(xs12 sm6 md4)
                                    v-select(v-model="method" :items="selectMethod" label="HTTP Method" item-text="name" item-value="id" :rules="[rules.required]" @change="defaultParameters")
                                v-flex(xs12 sm6 md4)
                                    v-select(v-model="redirect" :items="selectRedir" label="Max Num. of Redirects" item-text="name" item-value="id" )
                                v-flex.py-6(xs12 sm6 md6)
                                    v-text-field(v-model="url" label="URL" type="" name="url" :rules="[rules.required, rules.url]")
                                v-flex.py-6(xs12 sm6 md6)
                                    v-checkbox(v-model="original" label="Original" @change="clearOriginal")
                                v-flex.py-6(xs12 sm6 md6 v-if="original==true")
                                    v-text-field(v-model="hostName" label="Host Name" type="" name="hostName")
                                v-flex.py-6(xs12 sm3 md3 v-if="original==true")
                                    v-text-field(v-model="port" label="Port" type="" name="port")
                                v-flex.py-6(xs12 sm3 md3 v-if="original==true")
                                    v-text-field(v-model="hostIp" label="Host IP" type="" name="hostIp")
                                v-flex(xs12 pa-2)
                                    v-layout.px-2(row v-for="(header,index) in headers " :key="index")
                                        v-flex(xs12 sm3 md3)
                                            v-text-field(label="Key" v-model="header.key")
                                        v-flex(xs12 sm6 md6)
                                            v-text-field(label="Value" v-model="header.value")
                                        v-flex(xs12 sm3 md3)
                                            v-btn( color="primary" dark @click="deleteRow(index)") X
                                v-flex(row align-center xs12 sm12 md12)
                                    v-btn( color="primary" dark @click="addRow") Add Headers

                                v-layout.px-2(row v-if="method=='POST'")
                                    v-flex(xs12 sm12 md12)
                                        v-flex(xs12 sm6 md3)
                                            v-select(v-model="postInput" :items="selectPostInput" label="Data Input Method" @change="defaultParameters")
                                        v-flex(xs12 sm12 md8 v-if="postInput!='Parameters'")
                                            v-text-field(label="Post Body" v-model="postBody")
                                        v-flex(xs12 v-if="postInput=='Parameters'")
                                            v-layout.px-2(row v-for="(parameter,index) in parameters " :key="index")
                                                v-flex(xs12 sm3 md3)
                                                    v-text-field(label="Key" v-model="parameter.key")
                                                v-flex(xs12 sm6 md6)
                                                    v-text-field(label="Value" v-model="parameter.value")
                                                v-flex(xs12 sm3 md3)
                                                    v-btn( color="primary" dark @click="deleteParameter(index)") X
                                        v-flex(row align-center xs12 sm12 md12 v-if="postInput=='Parameters'")
                                            v-btn(color="primary" dark @click="addParameter") Add Parameters

                                v-flex.py-6(xs12 sm12 md12)
                                    v-checkbox(v-model="headerOnly" label="Header only")
                                v-flex(xs12)
                                    v-btn(color="primary" block @click="getCurlInfo('nameForm')") SEND
                                v-flex(xs12)
                                    v-card-text
                                        .subheading Response:
                                    v-divider
                                    v-card-text Header:
                                        pre(v-highlightjs="headerData")
                                            code.bash
                                    v-card-text Body:
                                        pre(v-highlightjs="bodyData")
                                            code.bash
                    v-divider
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
        method:'',
        redirect: 0,
        url:'',
        headerOnly:0,
        headerData:'',
        bodyData:'',
        original:false,
        hostName:'',
        port:'',
        hostIp:'',
        parameters: [],
        headers: [],
        edge:0
      };
    },
    watch:{
      url: function(value) {
        this.originalDataFormat(value)
      }
    },
    methods: {
      getCurlInfo: function(formURL) {
        const method = (this.method == "GET" ? "get" : "post")
        const headerOnly = (this.headerOnly == true ? 1 : 0)
        const header = this.headers
        const parameters = this.parameters
        if (this.$refs[formURL].validate()) {
          this.$store.dispatch("global/startLoading");
          this.$store
            .dispatch("curl/getCurlInfo", {
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
              "edge": this.edge
            })
            .then(
              function(result) {
                this.headerData = result.data.header;
                this.bodyData = result.data.body;
                this.$store.dispatch("global/finishLoading");
              }.bind(this)
            )
            .catch(
              function(error) {
                this.$store.dispatch("global/showSnackbarError", error.message);
                this.$store.dispatch("global/finishLoading");
              }.bind(this)
            );
        }
      },
      clearOriginal: function() {
        if(this.original == false){
          this.hostName = ''
          this.port = ''
          this.hostIp = ''
        }else{
          this.originalDataFormat(this.url)
        }
      },
      originalDataFormat: function(value) {
        const protomatch = /^(https?):\/\//
        this.hostName = value.replace(protomatch, '');
        if(protomatch && this.url != ''){
          this.port = value.indexOf('https') ? 80 : 443
        }
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
    }
  };
</script>


<style lang="sass" scoped>
    .hljs
        display: block
        color: #abb2bf
        background: #282c34
</style>