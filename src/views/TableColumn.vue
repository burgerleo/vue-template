<template>
    <div class="row">
        <div class="col-6">
            <h3>Draggable table</h3>

            <table class="table table-striped">
                <thead class="thead-dark">
                    <draggable tag="tr" v-bind="dragOptions" v-model="headers">
                        <th :key="header" scope="col" v-for="header in headers">{{ header }}</th>
                    </draggable>
                </thead>

                <draggable tag="tbody" v-bind="dragOptions" v-model="list">
                    <tr :key="item.name" v-for="item in list">
                        <td :key="header" v-for="header in headers">{{ item[header] }}</td>
                    </tr>
                </draggable>
            </table>
        </div>

        <pre class="col-2">{{list}}</pre>

        <pre class="col-2">{{headers}}</pre>
    </div>
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
            dragging: false
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
