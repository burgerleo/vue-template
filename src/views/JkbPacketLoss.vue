<template lang="pug">
    v-layout
        v-flex(xs12 sm12 md12)
            v-card
                v-data-table.elevation-1(:headers="headers" :items="desserts" dense hide-default-header hide-default-footer :items-per-page="1000" @page-count="1000")
                    template(v-slot:top)
                                v-toolbar(flat white)
                                    v-toolbar-title HK
                                    v-divider.mx-4(inset vertical)
                                    v-spacer
                                    v-btn.mb-2(color="primary" dark @click="editDialog") Setting Color
                    
                    template(v-slot:header="{item,index}")
                        tr
                            th.pr-2.pl-2 {{"In/Out"}}
                            th.pr-2.pl-2(v-for="(outLine,value) in desserts") {{outLine}}
                    template(v-slot:item="{item,index}")
                        tr
                            th.pr-2.pl-2 {{desserts[index]}}
                            td.pr-1.pl-1.text-center(v-for="(outLine,value) in desserts")
                                div.text-center(:class="getColor()")
                                    v-avatar(size="64" color="black")
                                        v-avatar(size="60" :color="getColor()")
                                            v-avatar(size="44" color="black")
                                                v-avatar(size="40" :color="getColor()")

            v-dialog(v-model="dialog" max-width="600" scrollable persistent)
                v-card
                    v-card-title.title Setting Color Range
                    v-card-text.pt-4 Color Range
                        v-range-slider.align-center(v-model="range" :max="max" :min="min" hide-details thumb-label="always" step='0.1')
                    v-card-actions
                        v-spacer
                        v-btn(color="grey" @click="closeDialog") Cancel
                        v-btn(color="primary" @click="save") Save

            //- v-card
                v-subheader Default range slider
                v-card-text Color Range
                    v-range-slider.align-center(v-model="range" :max="max" :min="min" tick-size="2" hide-details thumb-label="always" step='0.1' color="yellow darken-3" track-color="red darken-1"  track-fill-color="green darken-3")
</template>

<script>  
import textFieldRules from '../utils/textFieldRules'

export default {
    name: 'Dummy',
    mixins: [textFieldRules],

    components: {},
    data() {
        return {
            headers: [
                {
                    align: 'center',
                    sortable: false
                },
                {
                    align: 'center',
                    sortable: false
                },
                {
                    align: 'center',
                    sortable: false
                },
                {
                    align: 'center',
                    sortable: false
                },
                {
                    align: 'center',
                    sortable: false
                }
            ],
            desserts: ['CU_R1', 'CU_R2'],
            siteList: [],
            desserts3: ['CU_R1', 'CU_R2'],
            name: '',
            message: '',
            bodys: [],
            websock: null,
            isSetName: false,
            toName: null,
            min: 90,
            max: 100,
            slider: 40,
            range: [97, 99.5],
            dialog: false,
            pageName: 'packet-loss'
        }
    },
    watch: {},
    methods: {
        editDialog() {
            this.dialog = true
        },
        closeDialog() {
            this.dialog = false
        },
        getConfig() {
            this.$store.dispatch('global/startLoading')
            this.$store
                .dispatch('jkb/getConfig', { page: this.pageName })
                .then(
                    function(result) {
                        var range = []

                        result.data.map(function(item) {
                            range = [item.actions.min, item.actions.max]
                        })

                        this.range = range === [] ? range : this.range
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
        },
        save() {
            this.$store.dispatch('global/startLoading')
            var data = {
                page: this.pageName,
                actions: {
                    max: this.range[0],
                    min: this.range[1]
                }
            }
            this.$store
                .dispatch('jkb/setConfig', data)
                .then(
                    function(result) {
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
        },
        getColor() {
            var color = [
                'green lighten-1',
                'yellow lighten-1',
                'orange lighten-1',
                'deep-purple lighten-1',
                'blue lighten-1',
                'indigo lighten-1',
                'pink lighten-1',
                'red lighten-1',
                'teal lighten-1'
            ]
            var rand = this.getRndInteger(0, 9)

            return color[rand]
        },
        getRndInteger(min, max) {
            return Math.floor(Math.random() * (max - min)) + min
        }
    },
    created() {},
    mounted() {
        this.getConfig()
    }
}
</script>


<style lang="sass" scoped>
</style>
