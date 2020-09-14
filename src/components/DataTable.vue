<template lang="pug">
#dataTable
    v-data-table.elevation-1(
        :headers='headers',
        :items='items',
        :page.sync='page',
        :items-per-page='itemsPerPage',
        :search='searchText',
        hide-default-footer,
        @page-count='pageCount = $event',
        :dense='dense'
    )
        template(v-slot:item='{ item, index }')
            slot(name='item', v-bind:item='item, index')
                tr
                    td(
                        v-for='header in headers',
                    ) {{ header.value != "actions" ? item[header.value] : "" }}
                        template(v-if='header.value== "index"') {{ rowIndex(index) }}
                        template(v-if='header.value == "actions"')
                            v-icon.mr-2(v-if='header.edit', small, @click) mdi-pencil
                            v-icon.mr-2(v-if='header.delete', small, @click) mdi-delete
        template(v-slot:footer)
            v-footer
                v-col.text-right.pt-0.pl-0.pb-0(cols='12', sm='2')
                    div Items per page
                v-col.text-center.pt-0.pl-0.pb-0(cols='12', sm='2')
                    v-select.mt-0.pt-0(
                        :value='itemsPerPage',
                        :items='itemsPerPageList',
                        menu-props='auto',
                        label='Items per page',
                        hide-details,
                        single-line,
                        @change='itemsPerPage = parseInt($event, 10)'
                    )
                v-col.text-right.pt-0.pl-0.pb-0 {{ getFooterText() }}
                v-col.text-right.pt-0.pl-0.pb-0 
                    v-pagination(v-model='page', :length='pageCount')

</template>
<script>
export default {
    props: {
        headers: {
            type: Array,
        },
        items: {
            type: Array,
        },
        dense: {
            type: Boolean,
            default: true,
        },
        hideFooter: {
            type: Boolean,
            default: true,
        },
        searchText: {
            type: String,
            default: '',
        },
        itemsPerPageList: {
            type: Array,
            default: () => [5, 10, 15, 25, 50, 100],
        },
    },
    data() {
        return {
            page: 1,
            pageCount: 0,
            itemsPerPage: 10,
        }
    },
    methods: {
        rowIndex(index) {
            // 計算每一列開頭 "流水號"
            return (this.page - 1) * this.itemsPerPage + index + 1
        },
        getFooterText() {
            var max = this.items.length
            var maxStr = this.itemsPerPage * this.page

            if (maxStr > max) {
                maxStr = max
            }

            return (
                'Displaying item ' +
                (this.itemsPerPage * (this.page - 1) + 1) +
                '-' +
                maxStr +
                ' from ' +
                max +
                ' items.'
            )
        },
    },
}
</script>
<style lang="sass" scoped>
*
    // border: 1px solid black
</style>

