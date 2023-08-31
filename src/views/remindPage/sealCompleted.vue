<template>
    <div class="contain">
        <div class="center">
            <img class="ok-img" src="../../assets/images/success/completed.png" alt="">
            <div>
                签章已经完成，请关闭当前页面，回到上个页面继续操作
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: "sealCompleted",
    data() {
        return {
            timer: null
        };
    },
    mounted() {

    },
    beforeDestroy() {
    },
};
</script>

<style scoped lang="less">
.ok-img {
    width: 200px;
    height: 200px;
    margin: auto;
    margin-bottom: 20px;
}

.contain {
    height: 300px;
    position: relative;
    margin-top: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.contain .center {
    height: 200px;
    display: flex;
    flex-direction: column;
    text-align: center;
}
</style>
