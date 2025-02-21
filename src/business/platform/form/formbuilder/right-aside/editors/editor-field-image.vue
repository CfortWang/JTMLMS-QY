<template>
    <div class="panel panel-default">
        <div class="panel-heading">图片设置</div>
        <div class="panel-body">
            <el-form-item>
                <template slot="label">图片类型<help-tip prop="imageType" /></template>
                <el-select v-model="fieldOptions.accept" style="width:100%;">
                    <el-option value="" label="不限制" />
                    <el-option
                        v-for="item in imageTypeOptions"
                        :key="item.value"
                        :value="item.value"
                        :label="item.label"
                    />
                    <el-option value="custom" label="自定义" />
                </el-select>
                <el-input
                    v-if="fieldOptions.accept==='custom'"
                    v-model="fieldOptions.media"
                    type="textarea"
                    rows="1"
                    resize="none"
                    autosize
                    placeholder="自定义图片类型,逗号[,]分割"
                    style="padding-top:5px;"
                />
            </el-form-item>
            <el-form-item>
                <template slot="label">图片大小<help-tip prop="imageSize" /></template>
                <el-input
                    v-model="fieldOptions.size"
                    placeholder="图片大小（单个）"
                    type="text"
                    @change="(val)=>changeImageSet(val,'size')"
                ><template slot="append">M</template></el-input>
            </el-form-item>
            <el-form-item>
                <template slot="label">图片展示尺寸<help-tip prop="imageWidthAndHeight" /></template>
                <el-input
                    v-model="fieldOptions.width"
                    placeholder="宽度"
                    type="text"
                    @change="(val)=>changeImageSet(val,'width')"
                >
                    <template slot="prepend">宽度大小</template>
                    <template slot="append">px</template>
                </el-input>
                <p />
                <el-input
                    v-model="fieldOptions.height"
                    placeholder="高度"
                    type="text"
                    @change="(val)=>changeImageSet(val,'height')"
                >
                    <template slot="prepend">高度大小</template>
                    <template slot="append">px</template>
                </el-input>
            </el-form-item>
            <el-form-item>
                <template slot="label">图片数量<help-tip prop="imageLimit" /></template>
                <el-input-number v-model="fieldOptions.limit" :min="1" style="width:100%" />
            </el-form-item>
            <el-form-item>
                <template slot="label">是否压缩</template>
                <el-radio-group v-model="fieldOptions.is_compress" @input="changeCompress">
                    <el-radio-button label="N">否</el-radio-button>
                    <el-radio-button label="Y">是</el-radio-button>
                </el-radio-group>
            </el-form-item>
            <template v-if="fieldOptions.is_compress === 'Y'">
                <el-form-item>
                    <template slot="label">图片限宽<help-tip prop="imageCompressWidth" /></template>
                    <el-input
                        v-model="fieldOptions.compress_width"
                        placeholder="最大宽度"
                        type="text"
                        @change="(val)=>changeImageSet(val, 'compress_width')"
                    >
                        <template slot="prepend">宽度大小</template>
                        <template slot="append">px</template>
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <template slot="label">图片压缩大小<help-tip prop="imageCompressSize" /></template>
                    <el-input
                        v-model="fieldOptions.compress_size"
                        placeholder="图片压缩大小"
                        type="text"
                        @change="(val)=>changeImageSet(val, 'compress_size')"
                    ><template slot="append">M</template></el-input>
                </el-form-item>
                <el-form-item>
                    <template slot="label">压缩质量</template>
                    <el-slider
                        v-model="fieldOptions.quality"
                        :step="0.1"
                        :min="0.1"
                        :max="1"
                    />
                </el-form-item>
            </template>
            <el-form-item>
                <template slot="label">上传方式<help-tip prop="uploadType" /></template>
                <el-select v-model="fieldOptions.uploadType" style="width:100%;">
                    <el-option
                        v-for="item in uploadTypeOptions"
                        :key="item.value"
                        :value="item.value"
                        :label="item.label"
                    />
                </el-select>
            </el-form-item>
            <el-form-item>
                <template slot="label">提示信息<help-tip prop="imagePlaceholder" /></template>
                <el-input v-model="fieldOptions.tip" rows="3" placeholder="" type="textarea" />
            </el-form-item>
        </div>
    </div>
</template>
<script>
import { imageTypeOptions, uploadTypeOptions } from '@/business/platform/form/constants/fieldOptions'
import EditorMixin from '../mixins/editor'

export default {
    mixins: [EditorMixin],
    data () {
        return {
            imageTypeOptions: imageTypeOptions,
            uploadTypeOptions: uploadTypeOptions
        }
    },
    methods: {
        changeImageSet (val, property) {
            const imagePropertyValue = parseInt(val, 10)

            if (imagePropertyValue < 0) {
                const resetFields = ['size', 'compress_size', 'compress_width', 'width', 'height']

                if (resetFields.includes(property)) {
                    this.fieldOptions[property] = ''
                }

                this.$message({
                    message: '该设置不能输入小于0',
                    type: 'warning'
                })
            }
        },
        changeCompress (val) {
            if (val === 'Y') {
                this.fieldOptions = {
                    ...this.fieldOptions,
                    compress_width: 1000,
                    compress_size: 0.2,
                    quality: 0.8
                }
            }
        }
    }
}
</script>
