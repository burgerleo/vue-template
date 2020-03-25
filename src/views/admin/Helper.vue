<template lang="pug">
    v-container#sample-layout(grid-list-lg)
        v-layout(wrap column)
            v-flex(xs12)
                v-layout.ml-1.mt-1(row)
                    .title {{ title }} Online Helper
                    v-spacer
                    v-dialog(v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition")
                        template(v-slot:activator="{ on }")
                            v-btn.mr-2(color="primary"  dark v-on="on") Edit
                        v-card
                            v-toolbar(dark color="primary")
                                v-btn(icon dark @click="dialog = false")
                                    v-icon mdi-close
                                v-toolbar-title Edit
                                v-spacer
                                v-toolbar-items
                                    v-btn(dark text @click="saveHtml") Save
                            v-list(three-line subheader)
                                v-layout(wrap)
                                    .title.ml-5.mt-2 Edit Helper Content
                                    v-flex.pa-5.pt-1(xs12)
                                        quill-editor.fill-height(
                                            ref="myQuillEditor"
                                            :options="editorOption"
                                            v-model="editContent"
                                            @blur="onEditorBlur($event)"
                                            @focus="onEditorFocus($event)"
                                            @change="onEditorChange($event)"
                                            )
                                            v-divider


            v-flex(xs12)
                v-card
                    v-card-text(v-html="content")

</template>
<script>
  import textFieldRules from "../../utils/textFieldRules";
  import { quillEditor } from 'vue-quill-editor'
  import * as Quill from 'quill'
  import { ImageDrop } from 'quill-image-drop-module';

  Quill.register('modules/imageDrop', ImageDrop);

  export default {
    mixins: [textFieldRules],
    components: {
      quillEditor
    },
    data() {
      return {
        title:'',
        dialog: false,
        notifications: false,
        sound: true,
        widgets: false,
        helperId:'',
        content: '',
        editContent:'',
        editorOption: {
          modules:{
            imageDrop: true,
            toolbar:[
              ['bold', 'italic', 'underline', 'strike'],    //加粗，斜體，下劃線，刪除線
              ['blockquote', 'code-block'],     //引用，程式碼塊
              [{ 'header': 1 }, { 'header': 2 }],        // 標題，鍵值對的形式；1、2表示字型大小
              [{ 'list': 'ordered'}, { 'list': 'bullet' }],     //列表
              [{ 'script': 'sub'}, { 'script': 'super' }],   // 上下標
              [{ 'indent': '-1'}, { 'indent': '+1' }],     // 縮排
              [{ 'direction': 'rtl' }],             // 文字方向
              [{ 'size': ['small', false, 'large', 'huge'] }], // 字型大小
              [{ 'header': [1, 2, 3, 4, 5, 6, false] }],     //幾級標題
              [{ 'color': [] }, { 'background': [] }],     // 字型顏色，字型背景顏色
              [{ 'font': [] }],     //字型
              [{ 'align': [] }],    //對齊方式
              ['clean'],    //清除字型樣式
              ['link'],
              ['image','video'],    //上傳圖片、上傳視訊
              ['clean']
            ]
          },
          theme:'snow'
        }
      };
    },
    watch:{

    },
    methods: {
      onEditorReady(editor) { // 準備編輯器
        // console.log(editor)
      },
      onEditorBlur(){}, // 失去焦點事件
      onEditorFocus(){}, // 獲得焦點事件
      onEditorChange(){}, // 內容改變事件
      saveHtml:function(event){
        this.$store.dispatch("global/startLoading");
        // alert(this.content);
        this.setContent()
        this.dialog= false
      },
      getHelperInfo(){
        const data = {
          path : this.helperId
        }
        this.$store.dispatch("helper/getHelperInfo", data)
          .then(
            function(result) {
              this.title = result.data.name
              this.content = this.editContent = result.data.content
            }.bind(this)
          )
          .catch(
            function(error) {
              this.$store.dispatch("global/showSnackbarError", error.message);
              this.$store.dispatch("global/finishLoading");
            }.bind(this)
          );
      },
      setContent(){
        const data = {
          path : this.$router.currentRoute.params.helper_id,
          content : this.editContent
        }
        this.$store.dispatch("helper/setContent", data)
          .then(
            function(result) {
              this.content = this.editContent= result.data.content
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
    },
    created() {
      this.helperId = this.$router.currentRoute.params.helper_id
      this.getHelperInfo()
    },
    mounted() {
    }
  };
</script>
<style lang="sass" scoped>
    .title
        text-transform: capitalize
</style>