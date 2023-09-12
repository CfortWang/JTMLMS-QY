
<template>
    <el-tooltip effect="dark" :content="cache[type] ? `清除${cache[type].name }缓存`: ''" placement="bottom">
        <el-button type="text" class="ibps-mr btn-text can-hover" @click="cleanCache()">
            <ibps-icon :name="cache[type] ? cache[type].icon : 'drupal'" style="font-size: 18px;" />
        </el-button>
    </el-tooltip>
</template>
<script>
    import { cleanFormCache, cleanPlatformCache, cleanOauthCache, cleanOfficeCache } from '@/api/platform/system/cache'
    const cache = {
        platform: {
            name: '平台',
            api: cleanPlatformCache,
            icon: 'eercast'
        },
        form: {
            name: '表单',
            api: cleanFormCache,
            icon: 'connectdevelop'
        },
        oauth: {
            name: '认证',
            api: cleanOauthCache,
            icon: 'empire'
        },
        office: {
            name: '办公',
            api: cleanOfficeCache,
            icon: 'drupal'
        }
    }
    export default {
        props: {
            type: {
                type: String,
                default: ''
            }
        },
        data () {
            return {
                cache
            }
        },
        methods: {
            cleanCache () {
                if (!this.type || !this.cache[this.type] || !this.cache[this.type].api) {
                    return
                }
                this.cache[this.type].api().then(() => {
                    this.$message.success(`清除${this.cache[this.type].name}缓存成功！`)
                })
            }
        }
    }
</script>
