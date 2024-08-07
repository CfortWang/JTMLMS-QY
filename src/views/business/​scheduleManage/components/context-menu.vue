<!-- ContextMenu.vue -->
<template>
    <transition name="fade">
        <div v-if="visible" class="context-menu" :style="{ top: `${scheduleData.top}px`, left: `${scheduleData.left}px` }">
            <ul>
                <li v-for="(menu, index) in menus" :key="index" @click="handleClick(menu)">
                    <el-tooltip
                        effect="dark"
                        :content="menu.name"
                    >
                        <i :class="menu.icon" :style="{ color: `${menu.color};` }" />
                    </el-tooltip>
                </li>
            </ul>
        </div>
    </transition>
</template>

<script>
export default {
    props: {
        scheduleData: {
            type: Object,
            default: () => {}
        },
        visible: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            menus: [
                {
                    name: '早班',
                    key: 'morning',
                    icon: 'el-icon-sunrise',
                    color: '#FFA500'
                },
                {
                    name: '午班',
                    key: 'afternoon',
                    icon: 'el-icon-sunrise-1',
                    color: '#FF4500'
                },
                {
                    name: '白班',
                    key: 'day',
                    icon: 'el-icon-sunny',
                    color: '#00BFFF'
                },
                {
                    name: '夜班',
                    key: 'night',
                    icon: 'el-icon-moon',
                    color: '#8A2BE2'
                },
                {
                    name: '休息',
                    key: 'rest',
                    icon: 'el-icon-coffee-cup',
                    color: '#8B4513'
                }
            ]
        }
    },
    methods: {
        handleClick (item) {
            this.$emit('select', item)
            this.$emit('close') // 关闭菜单
        }
    }
}
</script>

<style lang="scss" scoped>
.context-menu {
    position: absolute;
    background-color: white;
    border: 1px solid #ccc;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    z-index: 1000;
}

.fade-enter-active, .fade-leave-active {
    transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to {
    opacity: 0;
}

.context-menu ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.context-menu li {
    padding: 8px 12px;
    cursor: pointer;
}

.context-menu li:hover {
    background-color: #f0f0f0;
}
</style>
