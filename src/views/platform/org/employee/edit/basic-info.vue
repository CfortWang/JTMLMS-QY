<template>
    <el-row style="height: 500px">
        <el-col :span="6">
            <div style="padding-left: 55px">
                <span class="photo-area" @click="dialogFormVisible = canEdit">
                    <img v-if="formData.photo" :src="image" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon" />
                    <div
                        v-if="canEdit"
                        :class="formData.photo !== '' ? 'handle-photo-buttons' : null"
                        @click.stop="() => { dialogFormVisible = false }"
                    >
                        <div v-if="formData.photo !== ''">
                            <i class="el-icon-edit" @click.stop="dialogFormVisible = canEdit" />
                            <i class="el-icon-delete" @click.stop="formData.photo = ''" />
                        </div>
                    </div>
                </span>
            </div>
            <span v-if="canEdit" class="operation">点击上方进行头像操作</span>
            <ibps-uploader
                :visible="dialogFormVisible"
                :limit="limit"
                :accept="accept"
                @action-event="uploaderAction"
                @close="(visible) => (dialogFormVisible = visible)"
            />
        </el-col>
        <el-col :span="16">
            <el-form
                ref="employeeForm"
                :rules="rules"
                :model="formData"
                label-width="130px"
                @submit.native.prevent
            >
                <input type="password" style="width: 0; height: 0; line-height: 0; padding: 0; border-width: 0">
                <el-form-item label="账号" prop="account">
                    <el-input v-if="canEdit" v-model="formData.account" autocomplete="off" clearable />
                    <span v-else>{{ formData.account }}</span>
                </el-form-item>
                <el-form-item v-show="!formData.id" label="密码" :prop="!formData.id ? 'password' : ''">
                    <el-input
                        v-if="canEdit"
                        v-model="formData.password"
                        autocomplete="off"
                        type="password"
                        show-password
                        clearable
                    />
                    <span v-else>{{ formData.password }}</span>
                </el-form-item>
                <!-- <el-form-item label="是否管理员" prop="isSuper">
                    <el-switch
                        v-if="!readonly"
                        v-model="formData.isSuper"
                        :disabled="isSuper?false:formData.id===''&&isSuper?false:true"
                        active-value="Y"
                        inactive-value="N"
                    />
                    <el-tag v-else :type="formData.isSuper|optionsFilter(isSuperOptions,'type')">
                        {{ formData.isSuper|optionsFilter(isSuperOptions,'label') }}
                    </el-tag>
                </el-form-item> -->
                <el-form-item label="单位名称">
                    <el-input v-if="!readonly" v-model="formData.qq" clearable />
                    <span v-else>{{ formData.qq }}</span>
                </el-form-item>
                <el-form-item label="员工编号">
                    <el-input v-if="canEdit" v-model="formData.jianDingZiGeZ" clearable />
                    <span v-else>{{ formData.jianDingZiGeZ }}</span>
                </el-form-item>
                <el-form-item label="员工姓名" prop="name">
                    <el-input v-if="canEdit" v-model="formData.name" clearable />
                    <span v-else>{{ formData.name }}</span>
                </el-form-item>
                <el-form-item label="员工状态" prop="status">
                    <el-select v-if="!readonly" v-model="formData.status" clearable placeholder="请选择" style="width: 100%">
                        <el-option label="激活" value="actived" />
                        <el-option label="未激活" value="inactive" />
                        <el-option label="锁定" value="locked" />
                        <el-option label="禁用" value="disabled" />
                        <el-option label="过期" value="expired" />
                        <el-option label="已删除" value="deleted" />
                    </el-select>
                    <el-tag v-else :type="formData.status | optionsFilter(statusOptions, 'type')">
                        {{ formData.status | optionsFilter(statusOptions, 'label') }}
                    </el-tag>
                </el-form-item>
                <el-form-item label="性别">
                    <el-radio-group v-if="!readonly" v-model="formData.gender">
                        <el-radio label="male">男</el-radio>
                        <el-radio label="female">女</el-radio>
                    </el-radio-group>
                    <el-tag v-else :type="formData.gender | optionsFilter(genderOptions, 'type')">
                        {{ formData.gender | optionsFilter(genderOptions, 'label') }}
                    </el-tag>
                </el-form-item>
                <el-form-item>
                    <template slot="label">
                        用户类型
                        <help-tip :title="formAsterisk.title" :content="formAsterisk.content" />
                    </template>
                    <el-radio-group v-if="!readonly" v-model="formData.jiNengZhiCheng">
                        <el-radio label="inside">内部员工</el-radio>
                        <el-radio label="ordinary">临床医护</el-radio>
                    </el-radio-group>
                    <el-tag v-else>
                        {{ formData.jiNengZhiCheng == 'ordinary' ? '临床医护' : '内部员工' }}
                    </el-tag>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <!-- <el-input v-model="formData.email" clearable /> -->
                    <el-input v-if="canEdit" v-model="formData.email" clearable />
                    <span v-else>{{ formData.email }}</span>
                </el-form-item>
                <el-form-item label="地址">
                    <el-input v-if="canEdit" v-model="formData.address" clearable />
                    <span v-else>{{ formData.address }}</span>
                </el-form-item>
                <el-form-item label="手机号码">
                    <el-input v-if="canEdit" v-model="formData.mobile" clearable />
                    <span v-else>{{ formData.mobile }}</span>
                </el-form-item>
                <!-- 功能逻辑存在问题，弃用 -->
                <!-- <el-form-item v-if="!readonly">
                    <template slot="label">
                        入职/转岗培训
                        <help-tip title="" content="开启时，保存数据后将为当前用户开启入职/转岗培训" />
                    </template>
                    <el-switch
                        v-model="formData.isTrain"
                        active-value="Y"
                        active-text="开启"
                        inactive-value="N"
                        inactive-text="关闭"
                        @change="value => { formData.isTrain = value }"
                    />
                </el-form-item>
                <el-form-item v-if="!readonly && formData.isTrain === 'Y'" label="培训类型" required>
                    <el-select v-model="formData.trainType" clearable placeholder="请选择" style="width: 100%">
                        <el-option label="新员工" value="新员工" />
                        <el-option label="转岗人员" value="转岗人员" />
                        <el-option label="教学实习人员" value="教学实习人员" />
                    </el-select>
                </el-form-item>
                <el-form-item v-if="!readonly && formData.isTrain === 'Y'" label="带教老师" required>
                    <ibps-custom-dialog
                        v-model="formData.teacher"
                        size="mini"
                        template-key="gjxcxryk"
                        style="width: 200px;"
                        :multiple="false"
                        type="dialog"
                        placeholder="请选择培训人员带教老师"
                    />
                </el-form-item> -->
            </el-form>
        </el-col>
    </el-row>
</template>
<script>
import { fileUrl } from '@/api/platform/file/attachment'
import { getDefaultUserSecurity } from '@/api/platform/auth/userSecurity'
import { genderOptions, statusOptions, isSuperOptions, userSecurityTextObj, regx } from '../constants'
import { getFile } from '@/utils/avatar'
import { validateEmpty } from '@/utils/validate'
export default {
    components: {
        IbpsUploader: () => import('@/business/platform/file/uploader'),
        helpTip: () => import('@/business/platform/form/formbuilder/right-aside/components/help-tip.vue'),
        IbpsCustomDialog: () => import('@/business/platform/data/templaterender/custom-dialog')
    },
    props: {
        data: Object,
        readonly: {
            type: Boolean,
            default: false
        },
        formType: {
            type: String,
            default: 'add'
        }
    },
    data () {
        const validateWcAccount = (rule, value, callback) => {
            const re = /^\S+$/
            if (!re.test(value)) {
                callback(new Error('企业微信账户不能包含空格'))
            } else {
                callback()
            }
        }
        const validateAccount = (rule, value, callback) => {
            // const re = /^[a-zA-Z][0-9a-zA-Z]{1,192}$/
            const re = /^[\w-]{4,16}$/
            if (!re.test(value)) {
                callback(new Error('由数字、字母、下划线及减号组成，长度最少4位最多16位'))
            } else {
                callback()
            }
        }
        const validateEmail = (rule, value, callback) => {
            var search = '@'
            var start = value.indexOf(search) // 获得字符串的开始位置
            var result = value.substring(start, search.length - start)
            const re = /^[0-9a-zA-Z]{1}[0-9a-zA-Z_.-]{1,16}[0-9a-zA-Z]{1}$/
            if (!re.test(result) && result.length > 3 && result.length < 18) {
                callback(new Error('必须以字母或者数字开头；字母或者数字结尾（结尾不包括邮箱后缀名），且字符类型为字母、数字、下划线、点、减号'))
            } else if (!re.test(result) && (result.length > 18 || result.length < 3)) {
                callback(new Error('长度最少为3位，最多为18位'))
            } else {
                callback()
            }
        }
        const validatePassword = (rule, value, callback) => {
            // const re = /^[0-9a-zA-Z]{1,128}$/
            const complexityRegular = this.regx
            if (value !== undefined) {
                if (this.userSecurity.complexity.length === 0) {
                    // if (!re.test(value)) {
                    //     callback(new Error('密码必须是由数字字母组成，至少1位'))
                    // } else {
                    //     callback()
                    // }
                    callback()
                } else {
                    const flag = []
                    for (var l in complexityRegular) {
                        if (value.match(complexityRegular[l]) !== null) {
                            flag.push(l)
                        }
                    }
                    if (flag.toString() !== this.userSecurity.complexity.toString()) {
                        callback(new Error('格式：' + this.userSecurity.maxLengthText + ';' + this.userSecurity.minLengthText + ';' + this.userSecurity.complexityText))
                    } else {
                        if (value.length > this.userSecurity.maxLength || value.length < this.userSecurity.minLength) {
                            callback(new Error('格式：' + this.userSecurity.maxLengthText + ';' + this.userSecurity.minLengthText + ';' + this.userSecurity.complexityText))
                        } else {
                            callback()
                        }
                    }
                }
            } else {
                callback()
            }
        }
        const canEdit = !this.readonly || this.formType === 'part'
        return {
            canEdit,
            formAsterisk: {
                title: '关于用户类型',
                content: `此属性用于设置用户端展示的功能`
            },
            dialogFormVisible: false,
            limit: 1, // 规定上传个数
            accept: '.jpeg,.gif,.png,.jpg,.JPEG,.GIF,.PNG,.JPG', // 规定上传类型
            formName: 'employeeForm',
            formData: {},
            isSuper: this.$store.getters.isSuper,
            genderOptions: genderOptions,
            statusOptions: statusOptions,
            isSuperOptions: isSuperOptions,
            userSecurityTextObj: userSecurityTextObj,
            regx: regx,
            required: true,
            // 用户安全设置
            userSecurity: {
                complexity: [],
                complexityText: '',
                maxLength: '',
                maxLengthText: '',
                minLength: '',
                minLengthText: ''
            },
            rules: {
                account: [
                    { required: true, message: this.$t('validate.required') },
                    { type: 'string', min: 4, max: 16, message: '帐号长度至少4位,至多16位', trigger: 'blur' },
                    { validator: validateAccount, trigger: 'blur' }
                ],
                wcAccount: [
                    { required: false, message: this.$t('validate.required') },
                    { validator: validateWcAccount, trigger: 'blur' }
                ],
                password: [
                    { required: true, message: this.$t('validate.required') },
                    { type: 'string', min: 1, max: 128, message: '密码长度至少3位,至多128位', trigger: 'blur' },
                    { validator: validatePassword, trigger: 'blur' }
                ],
                name: [
                    { required: true, message: this.$t('validate.required') },
                    { validator: validateEmpty, trigger: 'blur' },
                    { min: 1, max: 64, message: '长度不能超过64个字符', trigger: 'blur' }
                ],
                status: [{ required: true, message: this.$t('validate.required') }],
                gender: [{ required: true, message: this.$t('validate.required') }]
                // email: [
                //     { required: true, message: this.$t('validate.required') },
                //     { type: 'email', message: '请输入正确的邮箱地址', min: 3, max: 18, trigger: ['blur', 'change'] },
                //     { validator: validateEmail, trigger: 'blur' }
                // ]
            }
        }
    },
    computed: {
        image () {
            return getFile(this.formData.photo)
        }
    },
    watch: {
        data () {
            this.formData = this.data
        },
        formData: {
            handler: function (val, oldVal) {
                if (val !== oldVal) {
                    if (this.formData.id && !this.readonly) {
                        this.rules.password[0].required = false
                    } else {
                        this.rules.password[0].required = true
                    }
                    this.handleEmitEvent()
                    this.formValidate()
                }
            },
            deep: true
        }
    },
    mounted () {
        this.formData = this.data
    },
    created () {
        this.isSuper = this.$store.getters.isSuper
    },
    methods: {
        handleGetDefaultUserSecurity () {
            getDefaultUserSecurity().then((response) => {
                const userSecurityTextObj = this.userSecurityTextObj
                const complexityArr = response.data.complexity.split(',').sort()
                const arr = []
                complexityArr.forEach((i) => {
                    arr.push(userSecurityTextObj[parseInt(i)])
                })
                this.userSecurity.complexity = complexityArr
                this.userSecurity.complexityText = arr.join(',')
                this.userSecurity.maxLength = response.data.maxLength
                this.userSecurity.maxLengthText = '最大长度' + response.data.maxLength
                this.userSecurity.minLength = response.data.minLength
                this.userSecurity.minLengthText = '最小长度' + response.data.minLength
            }).catch(() => {})
        },
        /**
         * 表单验证
         */
        formValidate () {
            this.$nextTick(() => {
                this.$refs[this.formName].validate(() => {})
            })
        },
        validate (callback) {
            this.$refs[this.formName].validate((v) => {
                callback(v)
            })
        },
        /**
         * 重置字段
         */
        resetFields () {
            this.$refs[this.formName].resetFields()
        },
        handleEmitEvent () {
            this.$emit('input', this.formData)
        },
        uploaderAction (buttonKey, data) {
            this.formData.photo = fileUrl(data.id || data[0].id)
            this.dialogFormVisible = false
        }
    }
}
</script>

<style lang="scss" >
.operation {
    margin-left: 75px;
    height: 30px;
    line-height: 30px;
    display: block;
}
.avatar-uploader .el-upload {
    /* margin-top: 5px; */
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
.avatar-uploader .el-upload:hover {
    border-color: #409eff;
}
.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px !important;
    text-align: center;
    border: 1px dashed #d9d9d9;
    border-radius: 4px;
}
.photo-area {
    display: block;
    position: relative;
    width: 178px;
    height: 178px;
    z-index: 9997;
    .avatar {
        display: block;
        width: 178px;
        height: 178px;
    }
    .handle-photo-buttons {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        background: rgba(7, 0, 0, 0.6);
        display: none;
        z-index: 9998;
        > div {
            margin: 44% 0 0 30%;
            i {
                z-index: 9999;
                cursor: pointer;
                margin: 0 7px;
                color: white;
                font-size: 18px;
            }
        }
    }
}
.photo-area:hover > .handle-photo-buttons {
    display: block;
}
</style>
