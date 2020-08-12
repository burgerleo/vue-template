<template lang="pug">
.row
    .col-6
        h3 Draggable table
        table.table.table-striped(v-columns-resizable)
            thead.thead-dark
                draggable(tag='tr', v-bind='dragOptions', v-model='headers')
                    th(:key='header', scope='col', v-for='header in headers') {{ header }}
            draggable(tag='tbody', v-bind='dragOptions', v-model='list')
                tr(:key='item.name', v-for='item in list')
                    td(:key='header', v-for='header in headers') {{ item[header] }}

        input(v-model='tag')
        tag(:is='tag', :tag='tag') Hello, world!

        v-data-table.leo-table(
            :headers='headers2',
            :items='desserts',
            dense,
            v-columns-resizable
        )
            template(v-slot:header)
                draggable(tag='tr', v-bind='dragOptions', v-model='headers2')
                    td(:key='item.value', v-for='item in headers2') {{ item.text }}
        pre {{ desserts }}
    .col-2
        pre {{ list }}
    .col-2
    .col-2
        pre {{ headers }}
</template>

<script>
import draggable from 'vuedraggable'
export default {
    name: 'table-column-example',
    display: 'Table Column',
    order: 9,
    components: {
        draggable,
    },
    data() {
        return {
            headers: ['id', 'name', 'sport'],
            list: [
                { id: 1, name: 'Abby', sport: 'basket' },
                { id: 2, name: 'Brooke', sport: 'foot' },
                { id: 3, name: 'Courtenay', sport: 'volley' },
                { id: 4, name: 'David', sport: 'rugby' },
                { id: 5, name: 'Leo', sport: 'climb' },
            ],
            dragging: false,
            headers2: [
                {
                    text: '#',
                    align: 'center',
                    sortable: false,
                    width: '50px',
                    value: 'index',
                },
                {
                    text: 'Site',
                    align: 'left',
                    sortable: true,
                    value: 'site',
                },
                {
                    text: 'In',
                    align: 'left',
                    sortable: true,
                    value: 'inName',
                },
                {
                    text: 'Out',
                    align: 'left',
                    sortable: true,
                    value: 'outName',
                },
            ],
            desserts: [
                {
                    index: '1',
                    site: '11',
                    inName: '11',
                    outName: '11',
                },
                {
                    index: '2',
                    site: '22',
                    inName: '22',
                    outName: '22',
                },
                {
                    index: '3',
                    site: '333',
                    inName: '333',
                    outName: '333',
                },
                {
                    index: '4',
                    site: '44444',
                    inName: '44444',
                    outName: '44444',
                },
                {
                    index: '5',
                    site: '5555',
                    inName: '5555',
                    outName: '5555',
                },
            ],
            abc: true,
            tag: 'h1',
        }
    },
    methods: {},
    computed: {
        dragOptions() {
            return {
                animation: 0,
                group: 'description',
                disabled: false,
                ghostClass: 'ghost',
            }
        },
    },
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
.moveTag {
    cursor: move;
}

.table {
    .thead-dark th {
        color: #fff;
        background-color: #343a40;
        border-color: #454d55;
    }
    thead th {
        vertical-align: bottom;
        border-bottom: 2px solid #dee2e6;
        cursor: move;
    }
    td,
    th {
        padding: 0.75rem;
        vertical-align: top;
        border-top: 1px solid #dee2e6;
        cursor: move;
    }
}
.leo-table {
    tr {
        th {
            background-color: #343a40;
            border-color: #454d55;
        }
    }
}
</style>
