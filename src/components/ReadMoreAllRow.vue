<template>
    <div v-if="moreString !== ''">
        <div v-if="showLessValue">
            <p :class="[contentClass, 'content___syling']">
                <span v-if="lessString" v-html="lessString"></span>
                <span
                    v-else
                    v-html="getTruncate(moreString, symbol, subsLimit)"
                ></span>
                <span
                    v-if="
                        moreString !== null &&
                        moreString.length > lessString.length &&
                        findStr(moreString, symbol, subsLimit) > -1
                    "
                    @click="switchLess(false, rowIndex, showLessString)"
                    :class="[linkClass, 'anchorTagStyling']"
                    :target="target ? target : ''"
                >
                    more
                </span>
                <v-btn
                    v-if="copy"
                    outlined
                    x-small
                    class="ml-5 mb-2"
                    color="indigo"
                    @click="doCopy(moreString)"
                    >Copy!</v-btn
                >
            </p>
        </div>
        <div v-else>
            <p v-if="moreString" :class="[contentClass, 'content___syling']">
                <span
                    v-if="symbol == ','"
                    v-html="moreString.replace(/,/g, '<br>')"
                ></span>
                <span v-else v-html="moreString"></span>
                <span
                    v-if="
                        (lessString !== null &&
                            moreString.length > lessString.length) ||
                        lessString === null
                    "
                    @click="switchLess(true, rowIndex, showLessString)"
                    :class="[linkClass, 'anchorTagStyling']"
                    :target="target ? target : ''"
                >
                    less
                </span>
                <v-btn
                    v-if="copy"
                    outlined
                    x-small
                    class="ml-5 mb-2"
                    color="indigo"
                    @click="doCopy(moreString)"
                    >Copy!</v-btn
                >
            </p>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        link: {
            type: String,
            default: '#',
        },
        lessString: {
            type: String,
            default: '',
            required: false,
        },
        moreString: {
            type: String,
            default: '',
        },
        contentClass: {
            type: String,
            default: 'content-class',
        },
        linkClass: {
            type: String,
            default: 'primaryColor',
        },
        target: {
            type: String,
            default: '',
        },
        subsLimit: {
            type: [Number, String],
            default: 4,
        },
        symbol: {
            type: [String],
            default: '<br>',
        },
        rowIndex: {
            type: Number,
            default: 1,
        },
        nowIndex: {
            type: Number,
            default: 1,
        },
        showLessString: {
            type: Boolean,
            default: true,
            required: false,
        },
        copy: {
            type: Boolean,
            default: false,
        },
    },
    computed: {
        showLessValue() {
            if (this.$props.nowIndex === this.$props.rowIndex) {
                return this.$props.showLessString
            }
            return true
        },
    },
    data() {
        return {
            showLess: true,
            message: 'Copy These Text',
        }
    },
    methods: {
        doCopy(val) {
            this.$copyText(val).then(
                function (e) {
                    this.$store.dispatch(
                        'global/showSnackbarSuccess',
                        'Copied !'
                    )
                }.bind(this),
                function (e) {
                    this.$store.dispatch(
                        'global/showSnackbarError',
                        'Can not copy'
                    )
                }.bind(this)
            )
        },
        switchLess(val, index, showLessString) {
            if (this.$props.nowIndex === this.$props.rowIndex) {
                this.showLess = showLessString
            }
            const moreStatus = {
                showLess: !this.showLess,
                index: index,
            }
            this.$emit('update-more-status', moreStatus)
        },
        getTruncate(val, symbol, till) {
            if (val) {
                var str = this.findStr(val, symbol, till)
                let temp = ''
                if (symbol != '<br>') {
                    temp =
                        str > 0
                            ? val
                                  .split('')
                                  .splice(0, str)
                                  .join('')
                                  .replace(/,/g, '<br>')
                            : val.replace(/,/g, '<br>')
                } else {
                    temp =
                        str > 0
                            ? val.split('').splice(0, str).join('') + '...'
                            : val
                }
                return temp
            } else {
                return ''
            }
        },
        findStr(str, cha, num) {
            var x = ''
            for (var i = 0; i < num; i++) {
                if (i === 0) {
                    x = str.indexOf(cha)
                } else {
                    x = str.indexOf(cha, x + cha.length)
                }
            }
            return x
        },
    },
}
</script>
<style lang="sass" scoped>
.primaryColor
  color: blue
  cursor: pointer

  .content___syling
    word-break: break-word

    .content___syling
      margin-bottom: 0px !important

    .anchorTagStyling
      cursor: pointer
</style>