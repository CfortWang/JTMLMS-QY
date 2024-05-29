<template>
    <div class="maintenanceCycle">
        <el-row>
            <el-col>
                <el-form-item label="温度范围限值">
                    <el-input-number v-model="environmentInfo.temperatureMin" :min="environmentInfo.minTemperature"
                        :max="environmentInfo.temperatureMax" controls-position="right" :precision="0"
                        :step="1"></el-input-number>
                    <span> 至 </span>
                    <el-input-number v-model="environmentInfo.temperatureMax" :min="environmentInfo.temperatureMin"
                        :max="environmentInfo.maxTemperature" controls-position="right" :precision="0"
                        :step="1"></el-input-number>
                    <span> (℃)</span>
                </el-form-item>
            </el-col>
            <el-col>
                <el-form-item label="湿度范围限值">
                    <el-input-number v-model="environmentInfo.humidityMin" :min="environmentInfo.minHumidity"
                        :max="environmentInfo.humidityMax" controls-position="right" :precision="0"
                        :step="1"></el-input-number>
                    <span> 至 </span>
                    <el-input-number v-model="environmentInfo.humidityMax" :min="environmentInfo.humidityMin"
                        :max="environmentInfo.maxHumidity" controls-position="right" :precision="0"
                        :step="1"></el-input-number>
                    <span> (%)</span>
                </el-form-item></el-col>
        </el-row>
    </div>
</template>
<script>
export default {
    props: {
        visible: {
            type: Boolean,
            default: false,
        },
        title: {
            type: String,
        },
        customClass: {
            type: String,
        },
        width: {
            type: String,
            default: "80%",
        },
        top: {
            type: String,
            default: "10%",
        },
        editFromType: {
            type: String,
            default: "add",
        },
        dynamicParams: {
            type: Object,
        },
        templateKey: {
            type: String,
            default: "",
        },
        // 所有字段数据,(包含主主子表)
        formData: [Object, Array],
        field: {
            type: Object,
            required: true
        },
        // 子表行数
        // row: [String, Number],
        params: {
            type: Object,
        },
    },
    data() {
        return {
            environmentInfo: {
                // 温度默认大小值
                temperatureMin: 0,
                temperatureMax: 0,
                // 温度范围大小值
                minTemperature: -100,
                maxTemperature: 100,
                // 湿度默认大小值
                humidityMin: 0,
                humidityMax: 0,
                // 湿度范围大小值
                minHumidity: 0,
                maxHumidity: 100,
            },
            dialogVisible: true, //this.visible,
            // qmonthDateOptions: monthLunarGeneration(4), // 貌似是监听函数变化
            toolbars: [{ key: "confirm", label: "确定" }, { key: "cancel" }],
            toolbarsConsult: [{ key: "cancel" }],
        };
    },
    watch: {
        visible: {
            handler: function (val, oldVal) {
                this.dialogVisible = this.visible;
            },
            immediate: true,
        },
        environmentInfo: {
            deep: true,
            handler() {
                this.process();
            },
        }
    },
    created() {
        this.loadFormData();
    },
    methods: {
        clickBtn() {
            this.dialogVisible = true;
        },
        process() {
            const result = this.packageObj();
            this.$emit("change-data", "defaultEnvironmen", result);
        },
        handleActionEvent({ key }) {
            switch (key) {
                case "confirm":
                    this.handleConfirm();
                    break;
                case "cancel":
                    this.closeDialog();
                    break;
                default:
                    break;
            }
        },
        packageObj() {
            const obj = {
                temperature: {
                    min: this.environmentInfo.temperatureMin || this.environmentInfo.minTemperature,
                    max: this.environmentInfo.temperatureMax || this.environmentInfo.maxTemperature,
                },
                humidity: {
                    min: this.environmentInfo.humidityMin || this.environmentInfo.minHumidity,
                    max: this.environmentInfo.humidityMax || this.environmentInfo.maxHumidity,
                },
            };
            return JSON.stringify(obj);
        },
        resolveObj(jsonString = "") {
            const data = jsonString.trim() !== "" && JSON.parse(jsonString);
            this.environmentInfo.temperatureMin = data?.temperature?.min || this.environmentInfo.temperatureMin;
            this.environmentInfo.temperatureMax = data?.temperature?.max || this.environmentInfo.temperatureMax;
            this.environmentInfo.humidityMin = data?.humidity?.min || this.environmentInfo.humidityMin;
            this.environmentInfo.humidityMax = data?.humidity?.max || this.environmentInfo.humidityMax;
        },
        // 关闭当前窗口
        closeDialog() {
            this.$emit("close", false);
        },
        loadFormData() {
            setTimeout(() => {
                const environmentRange = this.formData.defaultEnvironmen
                this.resolveObj(environmentRange)
            }, 500);
        },
    },
};
</script>
<style lang="scss" scoped>
.maintenanceCycle {
    display: flex;
    align-items: center;
    margin-left: -120px;
}
</style>
