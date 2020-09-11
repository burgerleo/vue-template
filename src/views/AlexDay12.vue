<template lang="pug">
v-container(grid-list-lg)
    v-card
        v-card-title {{ text }}
        ComponentLearn3
            template(v-slot:header) {{ text }}
            template(v-slot:body) 這裡是 Body 喔
            template 不寫 Slot 可以塞嗎

            template(v-slot:footer) 
                h6 這裡是 footer 喔

</template>

<script>
import ComponentLearn3 from '../components/ComponentLearn3'

export default {
    name: 'AlexDay12',
    components: {
        ComponentLearn3,
    },
    data() {
        return {
            text: 'Leo!!',
        }
    },
    computed: {
    },
    methods: {},
    mounted() {},
}
</script>
