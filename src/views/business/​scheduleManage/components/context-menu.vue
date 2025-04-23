<!-- ContextMenu.vue -->
<template>
    <transition name="fade">
        <div
            v-if="visible"
            class="context-menu"
            :style="{ top: `${position.top}px`, left: `${position.left}px` }"
        >
            <el-checkbox-group v-model="selectedShift" class="shift-list">
                <el-checkbox
                    v-for="(shift, index) in shiftList"
                    :key="index"
                    :label="viewType === 'users' ? shift.alias : shift.userName"
                    class="shift-item ibps-ellipsis"
                >
                    <!-- <el-popover
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
                    </el-popover> -->
                    {{ viewType === 'users' ? shift.alias : shift.userName }}
                </el-checkbox>
            </el-checkbox-group>
            <el-button
                class="confirm-btn"
                type="success"
                icon="el-icon-check"
                size="mini"
                @click="handleSubmit"
            />
        </div>
    </transition>
</template>

<script>
export default {
    props: {
        viewType: {
            type: String,
            default: 'users'
        },
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
            selectedShift: this.viewType === 'users' ? (this.itemData.map(i => i.alias) || []) : (this.itemData.map(i => i.userName) || [])
        }
    },
    watch: {
        itemData: {
            handler (val) {
                this.selectedShift = this.viewType === 'users' ? (val.map(i => i.alias) || []) : (val.map(i => i.userName) || [])
            },
            deep: true,
            immediate: true
        }
    },
    methods: {
        handleSubmit () {
            const selected = this.viewType === 'users' ? this.shiftList.filter(i => this.selectedShift.includes(i.alias)) : this.shiftList.filter(i => this.selectedShift.includes(i.userName))
            if (selected.length > 3) {
                this.$message.warning('不能超过三个班次！')
                return
            }
            this.$emit('select', { selected, params: this.params })
            this.$emit('close')
        }
    }
}
</script>

<style lang="scss" scoped>
    .context-menu {
        position: absolute;
        background-color: rgba(204, 204, 204, 0.9);
        border: 1px solid #cccccc;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        text-align: center;
        z-index: 1000;
        padding-bottom: 10px;
        .shift-list {
            display: flex;
            align-items: center;
            flex-direction: column;
            height: 200px;
            overflow-y: scroll;
            .shift-item {
                padding: 8px 12px;
                cursor: pointer;
                margin: 0;
                height: 35px;
                // width: calc(100% - 24px);
                width: 100px;
                text-align: left;
                //flex-shrink: 0;
                min-height: 15px;
            }
            .shift-actived {
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
            .confirm-btn {
                margin: 20px auto;
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
