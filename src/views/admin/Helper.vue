<template lang="pug">
    v-container#sample-layout(grid-list-lg)
        v-layout(wrap)
            v-flex(xs12)
                .title Helper Manage
            v-flex(xs12)
                quill-editor(ref="myQuillEditor" v-model="content" :options="editorOption" @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"  @ready="onEditorReady($event)")
                    v-divider
</template>
<script>
  import textFieldRules from "../../utils/textFieldRules";
  import { quillEditor } from 'vue-quill-editor'
  export default {
    mixins: [textFieldRules],
    components: {
      quillEditor
    },
    data () {
      return {
        page:'',
        content: '',
        editorOption: {
          // Some Quill options...
        }
      }
    },
    methods: {
      onEditorBlur(quill) {
        // console.log('editor blur!', quill)
      },
      onEditorFocus(quill) {
        // console.log('editor focus!', quill)
      },
      onEditorReady(quill) {
        // console.log('editor ready!', quill)
      },
      onEditorChange({ quill, html, text }) {
        // console.log('editor change!', quill, html, text)
        this.content = html
      }
    },
    computed: {
      editor() {
        return this.$refs.myQuillEditor.quill
      }
    },
    mounted() {
      // console.log('this is current quill instance object', this.editor)
    },
    created() {
      console.log(this.$router.options.routes);
    }
  }
</script>