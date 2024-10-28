<template>
    <el-dialog
        width="80%"
        title="文件信息"
        :visible="innerVisible"
        append-to-body
        :close-on-click-modal="false"
        @close="closeDiag"
    >
        <!--  close-on-click-modal="false"//禁止点击遮罩层关闭弹窗。 -->
        <!-- $emit('update-inner-visible', false) -->
        <el-row class="row">
            <el-col :span="12">
                <el-row>
                    <el-col :span="5" class="nameClass">文件名称：</el-col>
                    <el-col :span="19" class="contentClass">{{ digData?digData.FILE_NAME_:'/' }}</el-col>
                </el-row>
            </el-col>
            <el-col :span="12">
                <el-row>
                    <el-col :span="5" class="nameClass">版本号：</el-col>
                    <el-col :span="19" class="contentClass">{{ digData?(digData.ban_ben_?digData.ban_ben_:(digData.xiu_ding_ban_ben_?digData.xiu_ding_ban_ben_:'/')):'/' }}</el-col>
                </el-row>
            </el-col>
        </el-row>
        <el-row class="row">
            <el-col :span="12">
                <el-row>
                    <el-col v-if="digData.cao_zuo_lei_xing_=='新增'" :span="5" class="nameClass">创建人：</el-col>
                    <el-col v-else :span="5" class="nameClass">修订人：</el-col>
                    <el-col :span="19" class="contentClass">{{ digData?(digData.fileInfos.CREATOR_NAME_?digData.fileInfos.CREATOR_NAME_:'/'):'/' }}</el-col>
                </el-row>
            </el-col>
            <el-col :span="12">
                <el-row>
                    <el-col v-if="digData.cao_zuo_lei_xing_=='新增'" :span="5" class="nameClass">创建日期：</el-col>
                    <el-col v-else :span="5" class="nameClass">修订日期：</el-col>
                    <el-col :span="19" class="contentClass">{{ digData?(digData.fileInfos.CREATE_TIME_?formattedTimestamp(digData.fileInfos.CREATE_TIME_):'/'):'/' }}</el-col>
                </el-row>
            </el-col>
        </el-row>
        <el-row v-if="digData.cao_zuo_lei_xing_=='修订'" class="row">
            <el-col :span="3" class="nameClass">修订内容：</el-col>
            <el-col :span="21" class="contentClass">{{ digData.xiu_ding_nei_rong?digData.xiu_ding_nei_rong:'/' }}</el-col>
        </el-row>
        <el-row v-if="digData.cao_zuo_lei_xing_=='修订'" class="row">
            <el-col :span="3" class="nameClass">修订原因：</el-col>
            <el-col :span="21" class="contentClass">{{ digData.yuan_yin_?digData.yuan_yin_:'/' }}</el-col>
        </el-row>
        <el-table
            :data="listData"
            stripe
            border
            max-height="380px"
            highlight-current-row
            style="width: 100%;padding:10px;"
        >
            <el-table-column
                label="用户"
                width="300"
            >
                <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ changUserName(scope.row.create_by_) }}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="最近阅读时间"
                width="300"
            >
                <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ formattedTimestamp(scope.row.create_time_) }}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="累计阅读时长"
            >
                <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ formatDuration(scope.row.shi_chang_) }}</span>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            style="margin-top: 5px; padding-bottom: 10px"
            :current-page="currentPage"
            :page-sizes="[10, 20,30, 50,100]"
            :page-size="pageSize"
            layout="prev,pager,next,jumper,sizes,->,total"
            :total="showList.length"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        />
    </el-dialog>
</template>
<script>
export default {
    props: {
        showList: {
            type: Array,
            default: () => []
        },
        digData: {
            type: Object,
            default: () => {}
        },
        innerVisible: {
            type: Boolean,
            default: false
        },
        fileIndex: {
            type: Number }
    },
    data () {
        const { userList } = this.$store.getters
        return {
            userList: userList,
            listData: [],
            currentPage: 1,
            pageSize: 10,
            timer: null,
            controlShow: false
        }
    },

    watch: {
        innerVisible: {
            immediate: true,
            handler (val) {
                if (val) {
                    this.updateShowList()
                }
            }
        }
    },
    mounted () {
        this.setInterfaceTime()
    },
    methods: {
        updateShowList () {
            const start = (this.currentPage - 1) * this.pageSize
            const end = start + this.pageSize
            this.listData = this.showList.slice(start, end)
        },
        handleSizeChange (val) {
            this.pageSize = val
            this.updateShowList()
        },
        handleCurrentChange (val) {
            this.currentPage = val
            this.updateShowList()
        },
        // 定时器
        setInterfaceTime () {
            this.timer = setTimeout(() => {
                this.$emit('pause')
            }, 180000)
        },
        formattedTimestamp (timestamp) {
            const date = new Date(timestamp)
            // 获取年月日时分秒
            const year = date.getFullYear()
            const month = String(date.getMonth() + 1).padStart(2, '0')
            const day = String(date.getDate()).padStart(2, '0')
            const hours = String(date.getHours()).padStart(2, '0')
            const minutes = String(date.getMinutes()).padStart(2, '0')
            const seconds = String(date.getSeconds()).padStart(2, '0')

            // 格式化日期
            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
        },

        // id转name
        changUserName (id) {
            const user = this.userList.find(item => item.userId === id)
            if (user) {
                return user.userName
            }
        },
        // 查阅时长的转化
        formatDuration (data) {
            // 定义变量
            let hours = 0
            let minutes = 0
            let seconds = data

            // 处理大于 60 分钟的情况
            if (data >= 3600) { // 3600 秒 = 1 小时
                hours = Math.floor(data / 3600)
                data %= 3600
            }

            // 处理大于 60 秒的情况
            if (data >= 60) {
                minutes = Math.floor(data / 60)
                seconds = data % 60
            }

            // 格式化输出
            const formattedHours = hours > 0 ? `${hours}小时` : ''
            const formattedMinutes = minutes > 0 ? `${minutes}分钟` : ''
            const formattedSeconds = seconds > 0 ? `${seconds}秒` : ''

            // 返回格式化的字符串
            return `${formattedHours}${formattedMinutes}${formattedSeconds}`
        },
        closeDiag () {
            this.$emit('update-inner-visible', false)
            this.$emit('start')
            clearTimeout(this.timer)
        }
    }

}
</script>
<style scoped lang="scss">
        .row{
            padding: 1% 2%;
           .nameClass{
            font-size: 16px;
            color: #555;
            font-weight: 600;
           }
           .contentClass{
            font-size: 16px;
            color: #777;
           }
        }
</style>

