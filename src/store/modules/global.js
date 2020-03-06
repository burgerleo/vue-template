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
        },
        updateLoadingStatus: (state, status) => {
            state.isLoading = status;
        }
    },
    // -----------------------------------------------------------------
    actions: {
        showDenseTable: (context, denseTable) => {
            context.commit("updateTableMode", denseTable);
        },
        startLoading: (context) => {
            context.commit("updateLoadingStatus", true);
        },
        showSnackbarSuccess: (context, text) => {
            context.commit("updateSnackbar", {
                status: true,
                text: text,
                color: "success",
                timeout: 6000
            });
        },
        showSnackbarError: (context, text) => {
            context.commit("updateSnackbar", {
                status: true,
                text: text,
                color: "error",
                timeout: 20000
            });
        },
        closeSnackbar: (context) => {
            context.commit("updateSnackbar", {
                text: "",
                color: "success",
                status: false,
                timeout: 6000
            });
        },
        finishLoading: (context) => {
            context.commit("updateLoadingStatus", false);
        }
    }
};
