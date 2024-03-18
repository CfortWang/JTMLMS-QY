<template>
    <div class="login-info text-white animated fadeInLeft">
        <el-divider content-position="center"> <h1 class="login-info-title">{{ systemName }}</h1></el-divider>
        <!-- <ul class="login-info-list">
            <li class="login-info-item">
                <i class="el-icon-check" /> 集成实验室资源管理、质量管理、检测流程管理等子系统
                </br>
                </br>
                <i class="el-icon-check" /> 涵盖实验室管理体系，持续满足实验室认证认可要求
                </br>
                </br>

                <i class="el-icon-check" /> 计划自动提醒、远程移动办公、实现无纸化运作
                </br>
                </br>
                <i class="el-icon-check" /> 实现用户在线设计工作流程、在线设计表单、在线生成报告、在线生成网页等功能</li>
        </ul> -->
    </div>
</template>
<script>
import { SYSTEM_NAME } from '@/constant'
export default {
    data () {
        return {
            systemName: SYSTEM_NAME
        }
    }
}
</script>
