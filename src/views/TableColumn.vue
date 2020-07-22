<template lang="pug">
    div.row
        div.col-6
            h3 Draggable table
            table.table.table-striped
                thead.thead-dark
                    draggable(tag="tr" v-bind="dragOptions" v-model="headers")
                        th(:key="header" scope="col" v-for="header in headers") {{ header }}
                draggable(tag="tbody" v-bind="dragOptions" v-model="list")
                    tr(:key="item.name" v-for="item in list")
                        td(:key="header" v-for="header in headers") {{ item[header] }}

        div.col-2
            pre {{list}}
        div.col-2
        div.col-2
            pre {{headers}}
        
        div.col-8
            draggable(tag="tbody" v-bind="dragOptions" v-model="headers2")
                tr(:key="item.value" v-for="item in headers2")
                    td(:key="item.value") {{ item.value }}

            v-data-table(:headers="headers2" :items="desserts" v-columns-resizable)
                //- draggable(tag="div" v-bind="dragOptions" v-model="headers2")
                    template(v-slot:header.site="{ header }")
                        div {{ header.text.toUpperCase() }}
                    template(v-slot:header.inName="{ header }")
                        div {{ header.text.toUpperCase() }}
                    template(v-slot:header.outName="{ header }")
                        div {{ header.text.toUpperCase() }}    
                template(v-slot:header)
                    draggable(tag="tr" v-bind="dragOptions" v-model="headers2")
                        //- td(:key="item.value" v-for="item in headers2") {{ item.text }}
                        td {{ headers2[0].text }}
                        td {{ headers2[1].text }}
                        td {{ headers2[2].text }}
                        td {{ headers2[3].text }}

</template>

<script>
import draggable from 'vuedraggable'
export default {
    name: 'table-column-example',
    display: 'Table Column',
    order: 9,
    components: {
        draggable
    },
    data() {
        return {
            headers: ['id', 'name', 'sport'],
            list: [
                { id: 1, name: 'Abby', sport: 'basket' },
                { id: 2, name: 'Brooke', sport: 'foot' },
                { id: 3, name: 'Courtenay', sport: 'volley' },
                { id: 4, name: 'David', sport: 'rugby' },
                { id: 5, name: 'Leo', sport: 'climb' }
            ],
            dragging: false,
            headers2: [
                {
                    text: '#',
                    align: 'center',
                    sortable: false,
                    width: '50px',
                    value: 'index'
                },
                {
                    text: 'Site',
                    align: 'left',
                    sortable: true,
                    value: 'site'
                },
                {
                    text: 'In',
                    align: 'left',
                    sortable: true,
                    value: 'inName'
                },
                {
                    text: 'Out',
                    align: 'left',
                    sortable: true,
                    value: 'outName'
                }
            ],
            desserts: [
                {
                    index: '1',
                    site: '123',
                    inName: '333',
                    outName: '222'
                },
                {
                    index: '2',
                    site: 'r242fe',
                    inName: '333',
                    outName: '1223'
                },
                {
                    index: '3',
                    site: '12123123',
                    inName: '335235353',
                    outName: '44443'
                }
            ]
        }
    },
    computed: {
        dragOptions() {
            return {
                animation: 0,
                group: 'description',
                disabled: false,
                ghostClass: 'ghost'
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.flip-list-move {
    transition: transform 0.2s;
}

.no-move {
    transition: transform 0s;
}

.ghost {
    opacity: 0.5;
    background: #c8ebfb;
}

thead {
    tr {
        th {
            cursor: move;
        }
    }
}

tbody {
    tr {
        cursor: move;
    }
}
</style>
