<template>
    <div style="height: 100%">
        <dv-scroll-board :config="config" style="width: 100%; height: 100%" />
    </div>
</template>

<script>
export default {
    name: 'scrollBoard',
    props:{
        config: {
            type: Object,
            default: () => ({
                header: [],
                data: []
            })
        }
    },
    created(){
    },
    data() {
        return {
        }
    }
}
</script>

<style scoped>
</style>
