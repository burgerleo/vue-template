<template lang="pug">
v-container(grid-list-lg)
    v-card
        v-card-title {{ text }}
        p {{objData}}
        v-text-field(v-model='text', label='Text', type='text')
    hr
    br
    ComponentLearn1(:parentMessage.sync='text', v-bind.sync='objData')
    hr
    br

    ComponentLearn2()
</template>

<script>
import ComponentLearn1 from '../components/ComponentLearn1'
import ComponentLearn2 from '../components/ComponentLearn2'

export default {
    name: 'component1',
    components: {
        ComponentLearn1,
        ComponentLearn2
    },
    data() {
        return {
            text: 'Test Sync',
            objData: {
                leo: 'aaa',
                leo2: 'bbb',
            },
        }
    },
    methods: {
        eventHandler() {
            console.log('for test')
        },
    },
}
</script>
