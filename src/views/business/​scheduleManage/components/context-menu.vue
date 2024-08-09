<!-- ContextMenu.vue -->
<template>
    <transition name="fade">
        <div
            v-if="visible"
            class="context-menu"
            :style="{ top: `${position.top}px`, left: `${position.left}px` }"
        >
            <ul>
                <li
                    v-for="(menu, index) in menus"
                    :key="index"
                    :disabled="isMenuDisable(menu.key)"
                    :class="selectedMenu.includes(menu.key) ? 'menu-actived' : ''"
                    @click="handleClick(menu.key)"
                >
                    <el-tooltip
                        effect="dark"
                        :content="menu.name"
                    >
                        <i :class="menu.icon" :style="{ color: `${menu.color}` }" />
                    </el-tooltip>
                </li>
                <el-button type="success" icon="el-icon-check" @click="handleSubmit" />
            </ul>
        </div>
    </transition>
</template>

<script>
export default {
    props: {
        params: {
            type: Object,
            default: () => {}
        },
        position: {
            type: Object,
            default: () => {}
        },
        itemData: {
            type: Array,
            default: () => []
        },
        visible: {
            type: Boolean,
            default: false
        }
    },
    data () {
        console.log(this.itemData)
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
            ],
            selectedMenu: []
        }
    },
    watch: {
        visible: {
            handler (val) {
                console.log(this.itemData)
                this.selectedMenu = this.itemData.map(i => i.key) || []
            },
            immediate: true
        }
    },
    methods: {
        // handleClick (item) {
        //     this.selectedMenu.push(item.key)
        // },
        handleClick (key) {
            // 执行trigger
            if (this.selectedMenu.includes(key)) {
                this.selectedMenu = this.selectedMenu.filter(i => i !== key)
                return
            }
            // 校验是否可选
            if (this.isMenuDisable(key)) {
                this.$message.warning('班次冲突，如需修改请先取消选中当前班次！')
                return
            }
            let temp = this.selectedMenu
            temp.push(key)
            if (temp.includes('morning') && temp.includes('afternoon')) {
                temp = temp.filter(i => !['morning', 'afternoon'].includes(i))
                temp.push('day')
            }
            this.selectedMenu = temp
            console.log(this.selectedMenu)
        },
        isMenuDisable (key) {
            // 已设置休息班次，则不可再设置其他班次
            if (this.selectedMenu.includes('rest')) {
                return key !== 'rest'
            }
            if (this.selectedMenu.includes('day')) {
                return !['day', 'night'].includes(key)
            }
            if (this.selectedMenu.includes('morning') || this.selectedMenu.includes('afternoon')) {
                return !['morning', 'afternoon', 'night'].includes(key)
            }
            if (this.selectedMenu.includes('night')) {
                return key === 'rest'
            }
        },
        handleSubmit () {
            const selected = this.menus.filter(i => this.selectedMenu.includes(i.key))
            this.$emit('select', { selected, params: this.params })
            this.$emit('close')
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
        ul {
            list-style: none;
            padding: 0;
            margin: 0;
            li {
                padding: 8px 12px;
                cursor: pointer;
                // &:hover {
                //     background-color: #f0f0f0;
                // }
            }
            .menu-actived {
                // background-color: rgba(1, 245, 131, 0.5);
                background-color: #007BFF;
                color: #ffffff;
                border: 1px solid #0056b3;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                border-radius: 4px;
                font-weight: 600;
                transition: all 0.3s ease;
                &:hover {
                    transform: scale(1.05);
                }
            }
            li[disabled] {
                background-color: #E0E0E0;
                color: #A0A0A0;
                // border: 1px solid #C0C0C0;
                cursor: not-allowed;
                opacity: 0.6;
                filter: grayscale(100%);
            }
        }
    }

    .fade-enter-active, .fade-leave-active {
        transition: opacity 0.3s;
    }
    .fade-enter, .fade-leave-to {
        opacity: 0;
    }
</style>
