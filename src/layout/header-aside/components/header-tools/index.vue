
<template>
    <div>
        <el-dropdown trigger="click">
            <el-tooltip effect="dark" content="工具箱" placement="bottom">
                <el-button type="text" class="ibps-mr btn-text can-hover">
                    <i class="ibps-icon-wrench" style="font-size: 18px;" />
                </el-button>
            </el-tooltip>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                    v-for="(item, index) in tools"
                    :key="index"
                    :icon="item.icon"
                    @click.native="handleShowDialog(item.visible)"
                >{{ item.name }}</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
        <convert-aes
            v-if="showConvertAes"
            :visible.sync="showConvertAes"
            @close="() => showConvertAes = false"
        />
    </div>
</template>
<script>
import ConvertAes from '@/views/platform/system/tools/convertByAes.vue'
export default {
    components: {
        ConvertAes
    },
    data () {
        return {
            showConvertAes: false,
            tools: [
                {
                    name: 'AES加解密',
                    visible: 'showConvertAes',
                    icon: 'ibps-icon-unlock-alt'
                }
            ]
        }
    },
    methods: {
        handleShowDialog (visible) {
            this[visible] = true
        }
    }
}
</script>
