import Vue from "vue";

export default {
    namespaced: true,
    // -----------------------------------------------------------------
    state: {
        denseTable: true
    },
    // -----------------------------------------------------------------
    getters: {
        // getters and computed props on the data
        tableMode: state => () => {
            return state.denseTable;
        }
    },
    // -----------------------------------------------------------------
    mutations: {
        // stuff to set data locally
        updateTableMode: (state, denseTable) => {
            state.denseTable = denseTable;
        }
    },
    // -----------------------------------------------------------------
    actions: {
        showDenseTable: (context, denseTable) => {
            context.commit("updateTableMode", denseTable);
        }
    }
};
