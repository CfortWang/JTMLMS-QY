<template>
    <div style="width: 86%">
        <div style="font-size: 32px; font-weight: bold; color: rgb(51, 150, 209); margin-top: 10%; text-align: center">
            <img src="./img/jinyuan.png" width="22%" />
            <div style="color: #01a394">
                <i style="font-size: 28px" :class="'ibps-icon-' + $route.query.icon"></i>
                {{ $route.query.name }}
            </div>
            <div style="color: #01a394; font-size: 16px;margin-top: 10px;">选择左侧菜单功能项</div>
        </div>
    </div>
</template>

<script>
</script>

<style>
</style>
