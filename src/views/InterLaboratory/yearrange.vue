
<template>
    <div class="year-range-picker">
        <el-date-picker
            v-model="yearValues[0]"
            type="year"
            placeholder="选择开始年"
            :size="size"
            class="year-picker"
            format="yyyy"
            :value-format="valueFormat"
            :picker-options="startDatePicker"
        />
        <span class="range-word"> 至 </span>
        <el-date-picker
            v-model="yearValues[1]"
            type="year"
            placeholder="选择结束年"
            :size="size"
            class="year-picker"
            :value-format="valueFormat"
            :picker-options="endDatePicker"
        />
    </div>
</template>

<script>
export default {
    name: 'yearrange',
    // 接收父组件传入的数据
    props: {
        yearValues: {
            type: Array,
            required: true
        },
        size: {
            type: String, default: 'mini'
        },
        valueFormat: {
            type: String, default: 'yyyy'
        }
    },
    data () {
        return {
            dateList: [],
            startDatePicker: this.beginDate(),
            endDatePicker: this.processDate()
        }
    },
    watch: {
        yearValues (v) {
            this.dateList = v || []
        },
        dateList (v) {
            this.$emit('input', v)
        }
    },
    mounted () {
    },
    methods: {
    // 选择年份范围选择时开始时间不能大于结束时间，结束时间不能小于开始时间

        // 提出开始时间必须小于提出结束时间
        beginDate () {
            const self = this
            return {
                disabledDate (time) {
                    if (self.dateList[1] !== '') {
                        const fixedTime = new Date(time)
                        return fixedTime.getFullYear() > self.dateList[1]
                    }
                }
            }
        },
        // 提出结束时间必须大于提出开始时间
        processDate () {
            const self = this
            return {
                disabledDate (time) {
                    // let fixedTime = new Date(self.oldTime).getTime()
                    // return time.getTime() < fixedTime
                    const fixedTime = new Date(time)
                    return fixedTime.getFullYear() < self.dateList[0]
                }
            }
        }

    }
}
</script>

<style scoped>
.year-range-picker {
  background: white !important;
  color: black;
  text-align: center;
  border: 1px solid #dcdfe6;
  border-radius:4px;
  line-height: 25px;
  overflow: hidden;
  display: flex;
  margin: 4px 0;
}

 .el-input__inner{
  border: 0;
  /*padding: 0;*/
  line-height: 28px;
  height: 28px;
  margin:0;
}

.range-word {
  margin-left: 10px;
  margin-right: 10px;
  font-size: 12px;
}

.year-range-picker .year-picker {
  max-width: 150px;
  margin:0;
}
</style>

