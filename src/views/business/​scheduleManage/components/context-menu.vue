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
                    v-for="(shift, index) in shiftList"
                    :key="index"
                    :disabled="isMenuDisable(shift.alias)"
                    :class="selectedShift.includes(shift.alias) ? 'shift-actived' : ''"
                    @click="handleClick(shift.alias)"
                >
                    <!-- <el-tooltip
                        effect="dark"
                        :content="shift.name"
                    >
                        <div :style="`color: ${shift.color};`" class="shift-item">{{ shift.name }}</div>
                    </el-tooltip> -->
                    <el-popover
                        :title="shift.name"
                        width="300"
                        placement="right"
                        trigger="hover"
                    >
                        <div>
                            {{ shift.desc }}
                        </div>
                        <div
                            slot="reference"
                            :style="`color: ${shift.color};`"
                            class="shift-item"
                        >{{ shift.alias }}</div>
                    </el-popover>
                </li>
                <el-button class="confirm-btn" type="success" icon="el-icon-check" @click="handleSubmit" />
            </ul>
        </div>
    </transition>
</template>

<script>
export default {
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        shiftList: {
            type: Array,
            default: () => []
        },
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
            ],
            selectedShift: []
        }
    },
    watch: {
        visible: {
            handler (val) {
                console.log(this.itemData)
                this.selectedShift = this.itemData.map(i => i.alias) || []
            },
            immediate: true
        }
    },
    methods: {
        handleClick (key) {
            // 执行trigger
            if (this.selectedShift.includes(key)) {
                this.selectedShift = this.selectedShift.filter(i => i !== key)
                return
            }
            this.selectedShift.push(key)
        },
        isMenuDisable (key) {
            // 已设置休息班次，则不可再设置其他班次
            if (this.selectedShift.includes('rest')) {
                return key !== 'rest'
            }
            if (this.selectedShift.includes('day')) {
                return !['day', 'night'].includes(key)
            }
            if (this.selectedShift.includes('morning') || this.selectedShift.includes('afternoon')) {
                return !['morning', 'afternoon', 'night'].includes(key)
            }
            if (this.selectedShift.includes('night')) {
                return key === 'rest'
            }
        },
        handleSubmit () {
            const selected = this.shiftList.filter(i => this.selectedShift.includes(i.alias))
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
            .shift-actived {
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
            .confirm-btn {
                width: 100%;
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
