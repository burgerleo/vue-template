<template>
    <div class="fluid container">
        <div class="form-group form-group-lg panel panel-default">
            <h2> npm i -S vuedraggable</h2>
            <div class="panel-heading">
                <h3 class="panel-title">Sortable control</h3>
            </div>
            <div class="panel-body">
                <div class="checkbox">
                    <label>
                        <input type="checkbox" v-model="editable" />Enable drag and drop
                    </label>
                </div>
                <v-btn @click="orderList" class="btn btn-default" type="button">Sort by original order</v-btn>
            </div>
        </div>

        <v-flex class="xs12 sm12 md12">
            <v-row class="px-1 py-1">
                <v-col cols="3">
                    <draggable
                        :move="onMove"
                        @end="isDragging=false"
                        @start="isDragging=true"
                        class="list-group"
                        tag="ul"
                        v-bind="dragOptions"
                        v-model="list"
                    >
                        <transition-group :name="'flip-list'" type="transition">
                            <li :key="element.order" class="list-group-item" v-for="element in list">
                                <v-icon @click=" element.fixed =! element.fixed">{{element.fixed ? 'mdi-anchor' : 'mdi-pin' }}</v-icon>
                                <span class="badge">{{element.order}}</span>
                                {{element.name}}
                            </li>
                        </transition-group>
                    </draggable>
                </v-col>

                <v-col cols="3">
                    <draggable :move="onMove" element="span" v-bind="dragOptions" v-model="list2">
                        <transition-group class="list-group" name="no" tag="ul">
                            <li :key="element.order" class="list-group-item" v-for="element in list2">
                                <v-icon @click=" element.fixed =! element.fixed">{{element.fixed ? 'mdi-anchor' : 'mdi-pin' }}</v-icon>
                                <span class="badge">{{element.order}}</span>
                                {{element.name}}
                            </li>
                        </transition-group>
                    </draggable>
                </v-col>

                <v-col class="list-group col-3">
                    <pre>{{listString}}</pre>
                </v-col>

                <v-col class="list-group col-3">
                    <pre>{{list2String}}</pre>
                </v-col>
            </v-row>
        </v-flex>
    </div>
</template>

<script>
import draggable from 'vuedraggable'

const message = [
    'vue.draggable',
    'draggable',
    'component',
    'for',
    'vue.js 2.0',
    'based',
    'on',
    'Sortablejs'
]

export default {
    name: 'hello',
    components: {
        draggable
    },
    data() {
        return {
            list: message.map((name, index) => {
                return { name, order: index + 1, fixed: false }
            }),
            list2: [
                {
                    order: 9,
                    name: 'Leo',
                    fixed: false
                },
                {
                    order: 10,
                    name: 'Leo2',
                    fixed: false
                },
                {
                    order: 11,
                    name: 'Leo3',
                    fixed: false
                }
            ],
            editable: true,
            isDragging: false,
            delayedDragging: false
        }
    },
    methods: {
        orderList() {
            this.list = this.list.sort((one, two) => {
                return one.order - two.order
            })
        },
        onMove({ relatedContext, draggedContext }) {
            const relatedElement = relatedContext.element
            const draggedElement = draggedContext.element
            return (
                (!relatedElement || !relatedElement.fixed) &&
                !draggedElement.fixed
            )
        }
    },
    computed: {
        dragOptions() {
            return {
                animation: 0,
                group: 'description',
                disabled: !this.editable,
                ghostClass: 'ghost'
            }
        },
        listString() {
            return JSON.stringify(this.list, null, 2)
        },
        list2String() {
            return JSON.stringify(this.list2, null, 2)
        }
    },
    watch: {
        isDragging(newValue) {
            if (newValue) {
                this.delayedDragging = true
                return
            }
            this.$nextTick(() => {
                this.delayedDragging = false
            })
        }
    }
}
</script>

<style>

.list-group-item {
    position: relative;
    display: block;
    padding: 10px 15px;
    margin-bottom: -1px;
    background-color: #fff;
    border: 1.5px solid #ddd;
}
.list-group-item:first-child {
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
}

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

.list-group {
    min-height: 20px;
}

.list-group-item {
    cursor: move;
}

.list-group-item i {
    cursor: pointer;
}
</style>
