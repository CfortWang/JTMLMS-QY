<template>
    <div class="ibps-layout-header-user">
        <el-dropdown
            size="small"
            trigger="click"
            :hide-on-click="false"
            @command="command => handleControlItemClick(command)"
            @visible-change="visible =>dropdownVisible=visible"
        >
            <div>
                <!-- <el-avatar
                    :src="avatar"
                    :text="userName"
                    :alt="userName"
                    style="background: none;"
                    @error="errorImageHandler"
                /> -->

                <span class="user-name-span">
                    <div class="user-name-title"> <i class="el-icon-user-solid" /> {{ userName }}</div>
                </span>
                <!-- <i
                    class="user-dropdown"
                    :class="{
                        'el-icon-arrow-down':!dropdownVisible,
                        'el-icon-arrow-up':dropdownVisible
                    }"
                    style="position: absolute;right: -15px;top: 15px;"
                /> -->
            </div>
            <el-dropdown-menu slot="dropdown" class="user-dropdown">
                <!-- <el-dropdown-item command="dashboard">
                    <ibps-icon name="home" class="ibps-mr-10" />
                    {{ $t('navbar.dashboard') }}
                </el-dropdown-item> -->
                <el-dropdown-item v-if="!regOpen && $store.getters.isTenantAdmin !== true" command="userInfo">
                    <ibps-icon name="user" class="ibps-mr-10" />
                    {{ $t('navbar.userInfo') }}
                </el-dropdown-item>
                <el-dropdown-item command="changePassword">
                    <ibps-icon name="lock" class="ibps-mr-10" />
                    {{ $t('navbar.changePassword') }}
                </el-dropdown-item>

                <el-dropdown-item v-if="$utils.isNotEmpty(switchAccount)" command="exitSwitchUser">
                    <ibps-icon name="reply" class="ibps-mr-10" />
                    {{ $t('navbar.exitSwitchUser') }}
                </el-dropdown-item>

                <el-dropdown-item v-if="tenants&& tenants.length > 0" command="switchTenant">
                    <ibps-icon name="reply" class="ibps-mr-10" />
                    {{ $t('navbar.switchTenant') }}
                </el-dropdown-item>
                <el-dropdown-item v-if="tenants&& tenants.length > 0">
                    <ibps-icon name="my-request" class="ibps-mr-10" />
                    {{ tenantid|optionsFilter(tenants,'name','id') }}
                </el-dropdown-item>
                <el-dropdown-item command="logout">
                    <ibps-icon name="sign-out" class="ibps-mr-10" />
                    {{ $t('navbar.logOut') }}
                </el-dropdown-item>
                <el-dropdown-item class="dropdown512" divided>
                    <div class="title512">
                        <i class="el-icon-location" />地点
                    </div>
                    <!-- <div class="item">{{ locationName }}</div> -->
                    <el-tag class="item512" type="success">{{ locationName }}</el-tag>
                    <template v-if="positions.length">
                        <div class="title512">
                            <i class="el-icon-office-building" />部门
                            <el-tooltip
                                effect="light"
                                content="双击下方部门可切换主部门"
                                placement="top"
                                style="z-index: 9999;"
                            >
                                <i class="el-icon-info" style="color: #dd5b44;" />
                            </el-tooltip>
                        </div>
                        <div
                            v-for="item in positions"
                            :key="item.id"
                            class="div512"
                            @dblclick="handleMainChange(item)"
                        >
                            <el-tag
                                class="item512"
                                :type="item.isMainPost === 'Y' ? 'primary' : 'info'"
                                size="small"
                            >{{ item.name }}</el-tag>
                        </div>
                    </template>
                    <template v-if="roleName.length">
                        <div class="title512">
                            <i class="el-icon-postcard" />岗位
                        </div>
                        <el-tag
                            v-for="(item, index) in roleName"
                            :key="Date.now() + Math.random() + index"
                            class="item512"
                            type="warning"
                        >{{ item }}</el-tag>
                    </template>
                </el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>

        <change-password
            :ids="userId"
            :reg-open="regOpen"
            :visible="changePasswordVisible"
            :title=" $t('navbar.changePassword') "
            @close="visible => changePasswordVisible = visible"
        />
        <user-info
            :id="userId"
            :form-type="formType"
            :visible="userInfoVisible"
            :title=" $t('navbar.userInfo') "
            readonly
            @close="visible => userInfoVisible = visible"
        />
    </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import { getFile } from '@/utils/avatar'
import setting from '@/setting.js'
import ChangePassword from '@/views/platform/org/employee/change-password'
import UserInfo from '@/views/platform/org/employee/edit'

export default {
    components: {
        ChangePassword,
        UserInfo
    },
    data () {
        const { first = '', second = '' } = this.$store.getters.level
        const { userList = [], deptList = [], userId = '', mainPosition = {}, userInfo } = this.$store.getters || {}
        const t1 = deptList.find(i => i.positionId === first) || {}
        const t2 = deptList.find(i => i.positionId === second) || {}
        const locationName = second ? t1.positionName + t2.positionName : t1.positionName
        const t3 = userList.find(i => i.userId === userId) || {}
        const roleName = t3.roles ? t3.roles.split(',') : []
        return {
            userList,
            locationName,
            roleName,
            positions: userInfo.positions || [],
            mainPosition,
            tenants: this.$store.getters.tenants,
            tenantid: this.$store.getters.tenantid,
            dropdownVisible: false,
            changePasswordVisible: false,
            userInfoVisible: false,
            formType: 'part',
            changeMainposiVisible: false
        }
    },
    computed: {
        ...mapState('ibps/user', [
            'info',
            'switchAccount'
        ]),
        userId () {
            return this.info && this.info.employee ? this.info.employee.id : (this.info && this.info.user && this.info.user.id ? this.info.user.id : '')
        },
        avatar () {
            const photo = this.info && this.info.employee ? this.info.employee.photo : null
            if (this.$utils.isEmpty(photo)) {
                return this.errorImage
            }
            return getFile(photo)
        },
        errorImage () {
            return this.$baseUrl + setting.userInfo.user.photo
        },
        userName () {
            return this.info && this.info.user ? this.info.user.fullname : ''
        },
        orgName () {
            return this.info && this.info.user ? this.info.user.orgName : ''
        },
        regOpen () {
            return this.$store.getters.regOpen
        }
    },
    methods: {
        ...mapMutations({
            pageKeepAliveClean: 'ibps/page/keepAliveClean'
        }),
        ...mapActions({
            logout: 'ibps/account/logout',
            exitSwitchUser: 'ibps/user/exitSwitchUser',
            setTenantids: 'ibps/user/setTenantids'
        }),
        handleControlItemClick (command) {
            switch (command) {
                case 'dashboard':// 主页
                    this.$router.push({ path: '/' })
                    break
                case 'userInfo':// 个人信息
                    this.userInfo()
                    break
                case 'changePassword':// 修改密码
                    this.changePassword()
                    break
                case 'exitSwitchUser':// 切换用户
                    this.handleExitSwitchUser()
                    break
                case 'switchTenant':// 切换租户
                    this.handleSwitchTenant()
                    break
                case 'logout':// 登出
                    this.logOff()
                    break
            }
        },
        /**
         * @description 登出
         */
        logOff () {
            this.logout({
                vm: this,
                confirm: true
            })
        },
        changePassword () {
            this.changePasswordVisible = true
        },
        userInfo () {
            this.userInfoVisible = true
        },
        errorImageHandler () {
            return false
        },
        handleExitSwitchUser () {
            this.exitSwitchUser().then(() => {
                this.$message.closeAll()
                this.$message.success('退出用户成功!')
                // 由于已经加载过设置 需要清空缓存设置
                this.pageKeepAliveClean()
                // 由于已经加载过设置 需要刷新此页面
                this.$router.replace('/refresh')
            })
        },
        handleSwitchTenant () {
            // 清空当前租户ID
            this.setTenantids('')
            // 清除子系统
            this.$store.dispatch('ibps/system/set', null, { root: true })
            //  清除菜单
            this.$store.dispatch('ibps/menu/menusSet', null, { root: true })
            this.$router.replace('/tenantSelect')
        },
        handleMainChange (item) {
            if (this.mainPosition && this.mainPosition.id === item.id) {
                return
            }
            this.setMainPosition(this.mainPosition.id, item.id)
        },
        setMainPosition (oldId, newId) {
            const { userId } = this.$store.getters || {}
            const updateParams = {
                tableName: 'ibps_party_rel',
                updList: [
                    {
                        where: {
                            biz_: 'mainPost',
                            main_type_: 'position',
                            sub_type_: 'employee',
                            main_pid_: oldId,
                            sub_pid_: userId
                        },
                        param: {
                            main_pid_: newId
                        }
                    }
                ]
            }
            this.$common.request('update', updateParams).then(() => {
                this.$message.success('切换成功!')
                location.reload()
            })
        }
    }
}
</script>
<style lang="scss" scoped>
    .ibps-layout-header-user {
        ::v-deep {
            .el-dialog__body {
                display: flex;
                justify-content: center;
                padding: 20px 0 !important;
            }
            .el-dialog__footer {
                text-align: center;
            }
            .el-transfer-panel__filter .el-input__inner {
                width: 90%;
            }
            .el-transfer-panel__filter {
                margin: 10px 0;
            }
            .el-transfer-panel .el-checkbox__inner {
                border-radius: 100%;
            }
        }
    }
    .dropdown512 {
        max-width: 150px;
        max-height: 300px;
        overflow-x: hidden;
        overflow-y: auto;
        line-height: 24px;
        padding: 0 5px 0 15px;
        &:hover {
            background-color: #fff !important;
        }
        .title512 {
            line-height: 20px;
            font-weight: 400;
            color: #606266;
        }
        .div512 {
            display: inline-block;
            margin-right: 8px;
        }
        .item512 {
            font-size: 12px;
            height: 20px;
            line-height: 18px;
            padding: 0px 4px;
        }
    }
</style>
