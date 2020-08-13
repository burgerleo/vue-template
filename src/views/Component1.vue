<template lang="pug">
v-container(grid-list-lg)
    v-card
        v-card-title {{ text }}
        p {{ objData }}
        v-text-field(v-model='text', label='Text', type='text')
    hr
    br
    ComponentLearn1(:parentMessage.sync='text', v-bind.sync='objData')
    hr
    br
    //- 可一次多傳入多個的參數
    ComponentLearn2(v-bind='basicBind', checked='checked')
</template>

<script>
import ComponentLearn1 from '../components/ComponentLearn1'
import ComponentLearn2 from '../components/ComponentLearn2'

export default {
    name: 'component1',
    components: {
        ComponentLearn1,
        ComponentLearn2,
    },
    data() {
        return {
            text: 'Test Sync',
            objData: {
                leo: 'aaa',
                leo2: 'bbb',
            },
            add2: {},
            active: true,
            'is-active': 123,
        }
    },
    computed: {
        // 組成物件
        basicBind() {
            return {
                active: this.active,
                'is-active': false,
            }
        },
    },
    methods: {
        eventHandler() {
            console.log('for test')
        },
    },
    mounted() {
        console.log(this['is-active'])
    },
}
</script>
