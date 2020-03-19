<template lang="pug">
    v-container#sample-layout(grid-list-lg)
        v-layout(wrap column)
            v-flex(xs12)
                v-layout.ml-1.mt-1(row)
                    .title {{ title }} Online Helper
                    v-spacer
                    v-btn(color="primary" dark ) Edit
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
        title:''
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