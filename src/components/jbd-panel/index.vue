<!--
 * @Author: cyy szjbdcyy@126.com
 * @Date: 2023-01-03 11:58:44
 * @LastEditors: cyy szjbdcyy@126.com
 * @LastEditTime: 2023-02-21 15:11:53
 * @FilePath: \lh_firm_former\src\components\jbd-panel\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
    <div class="jbd-sys-title">
        <span class="jbd-sys-title-cont-center" style="margin-left: 40px;float: left;">{{ systemName }}</span>
        <span style="float: right; " class="jbd-sys-title-contact">
            <br>
            深圳市金源信通科技有限公司开发 <i style="margin-left: 10px;" class="el-icon-phone" /> 0755-2642-4403
            <i style="margin-left: 20px;" class="el-icon-phone" /> 181 2638 3365
        </span>
    </div>
</template>
<script>
import { SYSTEM_NAME } from '@/constant'
export default {
    data () {
        const { first = '' } = this.$store.getters.level || {}
        const { deptList = [] } = this.$store.getters || {}
        const dept = deptList.find(i => i.positionId === first)
        return {
            systemName: SYSTEM_NAME,
            deptName: dept ? dept.positionName : ''
        }
    }
}
</script>