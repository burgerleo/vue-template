<template lang="pug">
    v-container#sample-layout(grid-list-lg)
        v-layout(wrap column)
            v-flex(xs12)
                v-layout.ml-1.mt-1(row)
                    .title {{ title }} Online Helper
                    v-spacer
                    v-dialog(v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition")
                        template(v-slot:activator="{ on }")
                            v-btn(color="primary"  dark v-on="on") Edit
                        v-card
                            v-toolbar(dark color="primary")
                                v-btn(icon dark @click="dialog = false")
                                    v-icon mdi-close
                                v-toolbar-title Edit
                                v-spacer
                                v-toolbar-items
                                    v-btn(dark text @click="dialog= false") Save
                            v-list(three-line subheader)
                                v-subheader Edit Helper Content
                                    

            v-flex(xs12)
                v-card
                    v-card-text

</template>
<script>
  import textFieldRules from "../../utils/textFieldRules";
  export default {
    mixins: [textFieldRules],
    data() {
      return {
        title:'',
        dialog: false,
        notifications: false,
        sound: true,
        widgets: false,
      };
    },
    watch:{

    },
    methods: {
      setTitle: function () {
        this.title = this.$router.currentRoute.params.helper_id;
      },
    },
    created() {

    },
    mounted() {
      this.setTitle();
    }
  };
</script>
<style lang="sass" scoped>
    .title
        text-transform: capitalize
</style>