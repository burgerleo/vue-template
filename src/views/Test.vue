<template  lang="pug">
    v-container#sample-layout(grid-list-lg)
        v-layout(wrap)
            v-flex(xs12)
                .title Test Tool
            v-flex(xs12)
                v-card
                    v-card-text
                        v-form(ref="form" onsubmit="return false;")
                            v-layout(wrap)
</template>

<script>
  import textFieldRules from "../utils/textFieldRules";
  export default {
    name: "Test",
    mixins: [textFieldRules],
    data() {
      return {
      }
    },
    methods: {

    }
  };
</script>

<style lang="sass" scoped>

</style>