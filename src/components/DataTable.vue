<template lang="pug">
    #dataTable
        v-data-table.elevation-1(:headers="headers" :items="items" :page.sync="page" :items-per-page="itemsPerPage" hide-default-footer @page-count="pageCount = $event" :dense="dense")
        v-row.align-center(v-if="hideFooter")
            v-col.pa-5(cols="12" sm="4")
                v-text-field(:value="itemsPerPage" label="Items per page" type="number" min="-1" max="15" @input="itemsPerPage = parseInt($event, 10)")
            v-col.pa-5(cols="12" sm="4")
            v-col.pa-5(cols="12" sm="4")
                v-pagination(v-model="page" :length="pageCount")
</template>
<script>
export default {
    props: {
        headers: {
            type: Array
        },
        items: {
            type: Array
        },
        dense: {
            type: Boolean,
            default: true
        },
        hideFooter: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            page: 1,
            pageCount: 0,
            itemsPerPage: 10
        };
    },
    methods: {}
};
</script>
<style lang="sass" scoped>
*
    // border: 1px solid black
</style>

