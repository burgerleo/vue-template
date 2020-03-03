<template lang="pug">
    v-container#sample-layout(grid-list-lg)
        v-layout(wrap)
            v-flex(xs12)
                .title Helper Manage
            v-flex(xs12)
                v-card
                    v-card-text
                        v-form(ref="form" onsubmit="return false;")
                            v-layout(wrap)

                    v-divider
</template>
