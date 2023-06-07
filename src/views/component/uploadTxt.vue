<template>
    <div>
        <label for="uploadTxt" :class="$style.upload">
            <el-tooltip class="item" effect="dark" content="请选择格式为txt的原始数据文件" placement="top">
                <div :class="$style.btn"><i class="el-icon-upload"/>选择文件</div>
            </el-tooltip>
            <span :class="$style.file">{{ fileName }}</span>
            <input
                id="uploadTxt"
                type="file"
                accept=".txt"
                hidden
                @change="onChange"
            >
        </label>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                fileName: ''
            }
        },
        methods: {
            onChange(e) {
                const { files } = e.dataTransfer || e.target
                // console.log(files)
                this.fileName = files[0].name
            }
        }
    }
</script>
<style lang="scss" module>
    .upload {
        // display: block;
        // width: 200px;
        .btn {
            display: inline-block;
            width: 100px;
            font-size: 12px;
            line-height: 20px;
            text-align: center;
            background-color: #409eff;
            color: #fff;
            border-radius: 5px;
            padding: 7px 15px;
            i{
                margin-right: 5px;
            }
        }
        .file {
            display: inline-block;
            font-size: 12px;
            color: #666;
            margin-left: 20px;
        }
    }
</style>