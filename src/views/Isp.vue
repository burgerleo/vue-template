<template lang="pug">
    v-container(grid-list-lg)
        v-layout
            v-flex(xs12 sm12 md12)
                v-card
                    v-card-text
                        v-layout(wrap)
                            v-flex(xs12 sm6 md4)
                                v-text-field(v-model="searchText" append-icon="mdi-magnify" label="Search" single-line hide-details)
                            v-flex(xs12 sm6 md6)
                            v-flex(xs12 sm6 md2)
                                v-btn(color="primary" block) ADD ISP
                    h7-data-table(:headers="headers" :items="desserts" :dense="$store.getters['global/tableMode']()" :search-text="searchText" :hide-footer="true" )

</template>

<script>
import HelloWorld from '../components/HelloWorld'

export default {
    name: 'Home',
    components: {
        HelloWorld
    },
    data() {
        return {
            page: 1,
            pageCount: 0,
            itemsPerPage: 10,
            searchText: "",
            headers: [
                {
                    text: 'Dessert (100g serving)',
                    align: 'left',
                    sortable: false,
                    value: 'name'
                },
                { text: 'Calories', value: 'calories' },
                { text: 'Fat (g)', value: 'fat' },
                { text: 'Carbs (g)', value: 'carbs' },
                { text: 'Protein (g)', value: 'protein' },
                { text: 'Iron (%)', value: 'iron' }
            ],
            items: [
                {
                    name: 'Karen',
                    email: 'karen.chen@hiero7.com',
                    role: 'Admin',
                    index: 1
                },
                {
                    name: 'Yuan',
                    email: 'yuan.kao@hiero7.com',
                    role: 'Admin',
                    index: 2
                }
            ],
            desserts: [
                {
                    name: 'Frozen Yogurt',
                    calories: 159,
                    fat: 6.0,
                    carbs: 24,
                    protein: 4.0,
                    iron: '1%'
                },
                {
                    name: 'Ice cream sandwich',
                    calories: 237,
                    fat: 9.0,
                    carbs: 37,
                    protein: 4.3,
                    iron: '1%'
                },
                {
                    name: 'Eclair',
                    calories: 262,
                    fat: 16.0,
                    carbs: 23,
                    protein: 6.0,
                    iron: '7%'
                },
                {
                    name: 'Pancake',
                    calories: 305,
                    fat: 3.7,
                    carbs: 67,
                    protein: 4.3,
                    iron: '8%'
                },
                {
                    name: 'Gingerbread',
                    calories: 356,
                    fat: 16.0,
                    carbs: 49,
                    protein: 3.9,
                    iron: '16%'
                },
                {
                    name: 'Jelly bean',
                    calories: 375,
                    fat: 0.0,
                    carbs: 94,
                    protein: 0.0,
                    iron: '0%'
                },
                {
                    name: 'Lollipop',
                    calories: 392,
                    fat: 0.2,
                    carbs: 98,
                    protein: 0,
                    iron: '2%'
                }
            ]
        }
    },
    methods: {}
}
</script>
