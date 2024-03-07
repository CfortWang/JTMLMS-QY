<template>
    <div style="color: #000000;" class="jbd-dynamic-form-field">
        <!-- 单行文本、 多行文本、数字-->
        <template v-if="fieldType === 'text' || fieldType === 'textarea' || fieldType === 'number'">
            <template v-if="readonlyText">
                <div v-if="fieldType === 'number'" :class="isTable ? '' : dataModel ? 'ibps-field-text' : 'ibps-field-text-no'">{{ dataModel || '/' }}</div>
                <div v-else :class="isTable ? 'ibps-overflow' : dataModel ? 'ibps-field-text' : 'ibps-field-text-no'">
                    {{ dataModel || '/' }}
                </div>
            </template>

            <el-dropdown
                v-else-if="fieldType === 'text' || fieldType === 'textarea'"
                :style="{ width: width }"
                size="mini"
                placement="top-start"
                trigger="click"
                @command="handleCommand"
            >
                <!-- <el-dropdown
                v-else-if="fieldType==='text'||fieldType==='textarea'"
                :style="{width:width}"
                size="mini"
                @click.native="reqPhrase($store.getters.userInfo.employee.groupID,field)"
                placement="top-start"
                trigger="click"
                @command="handleCommand"
            > -->
                <el-input
                    v-model="dataModel"
                    :placeholder="placeholder"
                    :type="fieldType"
                    :name="field.name"
                    :autosize="autosize"
                    :rows="fieldOptions.rows || 3"
                    :readonly="readonly"
                    unselectable="on"
                    :style="{ width: width }"
                    :clearable="clearable && hasFocus"
                    @focus="() => hasFocus = true"
                    @blur="() => hasFocus = false"
                    v-on="$listeners"
                />

                <!-- <el-button
                    v-if="(!fieldOptions.custom_class || fieldOptions.custom_class>=120) && !dataModel"
                    size="mini"
                    title='添加短语'
                    plain
                    icon="el-icon-folder-add"
                    align="center"
                    class="elButtonPlace"
                    @click.stop="addDict($store.getters.userInfo.employee.groupID,field,field.label)"
                /> -->

                <el-dropdown-menu v-show="menuHide" slot="dropdown">
                    <el-dropdown-item
                        v-for="(item, index) in selectModel"
                        :key="index"
                        :command="item.contextName"
                    >
                        {{ index + 1 }}. {{ item.contextName | ellipsis }}
                        <span style="float: right; margin-left: 50px; color: #eb6709;" @click.stop="deleteDicts(item.uuId, field.label)">删</span>
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>

            <el-input
                v-else
                v-model="dataModel"
                :placeholder="placeholder"
                :type="fieldType"
                :name="field.name"
                :autosize="autosize"
                :rows="fieldOptions.rows || 2"
                :readonly="readonly"
                clearable
                v-on="$listeners"
            />
        </template>

        <!-- 计数器 -->
        <template v-else-if="fieldType === 'inputNumber'">
            <template v-if="readonlyText">
                <div :class="isTable ? '' : dataModel ? 'ibps-field-text' : 'ibps-field-text-no'">
                    {{ dataModel || '/' }}
                </div>
            </template>
            <el-input-number
                v-else
                v-model="numberDataModel"
                :max="fieldOptions.max"
                :min="fieldOptions.min"
                :step="fieldOptions.step"
                :controls="fieldOptions.controls"
                :controls-position="fieldOptions.controls_position"
                :placeholder="fieldOptions.placeholder"
                :readonly="readonly"
                unselectable="on"
                :style="{ width: width }"
                v-on="$listeners"
            />
        </template>
        <!-- 单项选择 -->
        <template v-else-if="fieldType === 'radio'">
            <template v-if="readonlyText">
                <div v-if="$utils.isNotEmpty(dataModel)" :class="isTable ? 'ibps-overflow' : dataModel ? 'ibps-field-text' : 'ibps-field-text-no'">
                    {{ dataModel | optionsFilter(dataOptions, 'label', 'val') }}
                </div>
                <div v-else :class="isTable ? '' : 'ibps-field-text-no'">/</div>
            </template>
            <el-radio-group
                v-else
                v-model="dataModel"
                :disabled="readonly"
                v-on="$listeners"
            >
                <component
                    :is="fieldOptions.button ? 'el-radio-button' : 'el-radio'"
                    v-for="o in dataOptions"
                    :key="o.val"
                    :label="o.val"
                    :border="fieldOptions.border"
                    :style="{ display: fieldOptions.arrangement === 'vertical' ? 'block' : null }"
                    class="ibps-pt-5"
                    @click.native.stop.prevent="handleRadioChange(o.val)"
                >
                    {{ o.label }}
                </component>
            </el-radio-group>
        </template>

        <!-- 多选项选择 -->
        <div v-else-if="fieldType === 'checkbox' && readonlyText && !dataModel" :class="isTable ? '' : 'ibps-field-text-no'">/</div>
        <template v-else-if="fieldType === 'checkbox'">
            <template v-if="readonlyText">
                <template v-if="checkboxDataModel && checkboxDataModel.length > 0">
                    <div :class="isTable ? 'ibps-overflow' : readonlyText ? 'ibps-field-text' : ''">
                        <span v-for="(v, i) in checkboxDataModel" :key="i" class="ibps-mr-5">
                            {{ v | optionsFilter(dataOptions, 'label', 'val') }}
                        </span>
                    </div>
                </template>
            </template>
            <el-checkbox-group v-else v-model="checkboxDataModel" v-on="$listeners">
                <component
                    :is="fieldOptions.button ? 'el-checkbox-button' : 'el-checkbox'"
                    v-for="o in dataOptions"
                    :key="o.val"
                    :label="o.val"
                    :border="fieldOptions.border"
                    :style="{ display: fieldOptions.arrangement === 'vertical' ? 'block' : null }"
                >
                    {{ o.label }}
                </component>
            </el-checkbox-group>
        </template>

        <!-- <div v-else-if="fieldType === 'customDialog' && readonlyText && !dataModel"  :class="isTable ? '' :'ibps-field-text-no'">/</div>
        <ibps-custom-dialog v-else-if="fieldType === 'customDialog'" :class="isTable ? '' : readonlyText ? 'ibps-field-text' :''"></ibps-custom-dialog> -->

        <!-- 下拉框 -->
        <div v-else-if="fieldType === 'select' && readonlyText && !dataModel" :class="isTable ? '' : 'ibps-field-text-no'">/</div>
        <template v-else-if="fieldType === 'select'">
            <template v-if="readonlyText">
                <template v-if="multipleSelect">
                    <template v-if="selectDataModel && selectDataModel.length > 0">
                        <div :class="isTable ? '' : readonlyText ? 'ibps-field-text' : ''">
                            <span v-for="(v, i) in selectDataModel" :key="i" class="ibps-mr-5">
                                {{ v | optionsFilter(dataOptions, 'label', 'val') }}
                            </span>
                        </div>
                    </template>
                </template>
                <template v-else>
                    <div :class="isTable ? '' : readonlyText ? 'ibps-field-text' : ''">
                        <span v-if="$utils.isNotEmpty(dataModel)" class="ibps-mr-5">
                            {{ dataModel | optionsFilter(dataOptions, 'label', 'val') }}
                        </span>
                    </div>
                </template>
            </template>
            <el-select
                v-else
                v-model="selectDataModel"
                :placeholder="dropdownPlaceholder"
                :name="field.name"
                :disabled="readonly"
                :style="{ width: width }"
                :multiple="multipleSelect"
                :clearable="clearable"
                :filterable="allowCreate"
                :allow-create="allowCreate"
                v-on="$listeners"
                @change="selectLinkageChange"
            >
                <el-option v-for="o in dataOptions" :key="o.val" :label="o.label" :value="o.val" />
            </el-select>
        </template>
        <!-- 开关 -->
        <template v-else-if="fieldType === 'switch'">
            <template v-if="readonlyText">
                <el-tag v-if="$utils.isNotEmpty(dataModel)" :class="isTable ? '' : dataModel ? 'ibps-field-text' : 'ibps-field-text-no'">
                    {{ dataModel | optionsFilter(switchOptions, 'label', 'val') }}
                </el-tag>
            </template>
            <template v-else>
                <el-checkbox
                    v-if="fieldOptions.appearance === 'checkbox'"
                    v-model="dataModel"
                    :disabled="readonly"
                    v-on="$listeners"
                />
                <el-switch
                    v-else
                    v-model="dataModel"
                    :width="switchWidth"
                    :active-value="fieldOptions.active_value"
                    :inactive-value="fieldOptions.inactive_value"
                    :active-text="fieldOptions.active_text"
                    :inactive-text="fieldOptions.inactive_text"
                    :active-color="fieldOptions.active_color"
                    :inactive-color="fieldOptions.inactive_color"
                    :disabled="readonly"
                    v-on="$listeners"
                />
            </template>
        </template>

        <!-- 滑块 -->
        <template v-else-if="fieldType === 'slider'">
            <template v-if="readonlyText">
                <div :class="isTable ? '' : dataModel ? 'ibps-field-text' : 'ibps-field-text-no'">
                    {{ dataModel || '/' }}
                </div>
            </template>
            <div v-else style="width: 99%;">
                <el-slider
                    v-model="numberDataModel"
                    :show-input="fieldOptions.show_input"
                    :show-tooltip="fieldOptions.show_tooltip"
                    :max="fieldOptions.max"
                    :min="fieldOptions.min"
                    :step="fieldOptions.step"
                    :disabled="readonly"
                    :style="{ width: width }"
                    v-on="$listeners"
                />
            </div>
        </template>
        <!-- 评分 -->
        <template v-else-if="fieldType === 'rate'">
            <template v-if="readonlyText">
                <div :class="isTable ? '' : dataModel ? 'ibps-field-text' : 'ibps-field-text-no'">{{ dataModel || '/' }}</div>
            </template>
            <el-rate
                v-else
                v-model="numberDataModel"
                :max="fieldOptions.max"
                :allow-half="fieldOptions.allow_half"
                :show-text="fieldOptions.show_text"
                :show-score="fieldOptions.show_score"
                :disabled="readonly"
                class="ibps-pt-10"
                v-on="$listeners"
            />
        </template>

        <!-- <div v-else-if="fieldType === 'customDialog' && readonlyText && !dataModel"  :class="isTable ? '' :'ibps-field-text-no'">/</div>
        <ibps-custom-dialog v-else-if="fieldType === 'customDialog'" :class="isTable ? '' : readonlyText ? 'ibps-field-text' :''"></ibps-custom-dialog> -->

        <!-- 日期控件 -->
        <template v-else-if="fieldType === 'datePicker' || fieldType === 'currentTime' || fieldType === 'currentDate'">
            <div v-if="readonlyText" :class="isTable ? '' : dataModel ? 'ibps-field-text' : 'ibps-field-text-no'">
                {{ dataModel | dateFormat(datefmt, datefmt) || '/' }}
            </div>
            <template v-else>
                <el-date-picker
                    v-if="datePckerType === 'datePicker'"
                    v-model="dataModel"
                    :type="dateType"
                    :value-format="datefmt"
                    :format="datefmt"
                    :placeholder="selectPlaceholder"
                    :style="{ width: width }"
                    :readonly="fieldType === 'currentTime' || fieldType === 'currentDate' ? true : readonly"
                    :clearable="clearable"
                    unselectable="on"
                    @change="selectTime"
                    v-on="$listeners"
                />
                <el-time-picker
                    v-else-if="datePckerType === 'timePicker'"
                    v-model="dataModel"
                    :value-format="datefmt"
                    :format="datefmt"
                    :placeholder="selectPlaceholder"
                    :style="{ width: width }"
                    :readonly="fieldType === 'currentTime' || fieldType === 'currentDate' ? true : readonly"
                    :clearable="clearable"
                    unselectable="on"
                    v-on="$listeners"
                />
                <!--TODO:时间控件自定义格式-->
            </template>
        </template>

        <!-- =======================增强字段==============================-->
        <!--富文本框-->
        <template v-else-if="fieldType === 'editor'">
            <div
                v-if="readonlyText"
                :class="isTable ? '' : dataModel ? 'ibps-field-text' : 'ibps-field-text-no'"
                v-html="$utils.formatText(dataModel)"
            />
            <ibps-ueditor
                v-else
                v-model="dataModel"
                :placeholder="placeholder"
                :readonly="readonly"
                :config="ueditorConfig"
                destroy
                v-on="$listeners"
            />
        </template>
        <!--数据字典-->
        <ibps-dictionary
            v-else-if="fieldType === 'dictionary'"
            v-model="dataModel"
            :type-key="fieldOptions.dictionary"
            :multiple="multiple"
            :select-mode="fieldOptions.select_mode"
            :display-mode="fieldOptions.display_mode"
            :separator="fieldOptions.split"
            :placeholder="fieldOptions.placeholder"
            :disabled="readonly"
            :readonly="readonly"
            :readonly-text="readonlyText ? 'text' : 'original'"
            :clearable="clearable"
            :style="{ width: width }"
            v-on="$listeners"
        />
        <!-- 自动编号-->
        <template v-else-if="fieldType === 'autoNumber'">
            <ibps-auto-number
                v-if="!readonlyText"
                v-model="dataModel"
                :alias="fieldOptions.identity"
                :init="fieldOptions.init === 'true' || fieldOptions.init"
                :placeholder="placeholder"
                :readonly="readonly"
                :readonly-text="readonlyText"
                v-on="$listeners"
            />
            <div v-if="readonlyText" :class="isTable ? '' : dataModel ? 'ibps-field-text' : 'ibps-field-text-no'">{{ dataModel || '/' }}</div>
        </template>

        <!-- 上传附件-->
        <div v-else-if="fieldType === 'attachment' && readonlyText && !dataModel" :class="isTable ? '' : 'ibps-field-text-no'">/</div>
        <ibps-attachment
            v-else-if="fieldType === 'attachment'"
            v-model="dataModel"
            :class="isTable ? '' : readonlyText ? 'ibps-field-text' : ''"
            :placeholder="selectPlaceholder"
            :download="fieldOptions.download"
            :readonly="readonly"
            :limit="fileQuantity"
            :file-size="maxFileSize"
            :accept="fileAccept"
            :file-ext="fileFormates"
            :multiple="multiple"
            :operation_status="operation_status"
            :upload-type="fieldOptions.uploadType"
            :store="fieldOptions.store"
            :media-type="fieldOptions.media_type"
            :media="fieldOptions.media"
            :style="{ width: width }"
            v-on="$listeners"
        />
        <!-- 选择器-->
        <div v-else-if="(fieldType === 'selector' || fieldType === 'currentUser' || fieldType === 'currentOrg' || fieldType === 'currentPosition') && readonlyText && !dataModel" :class="isTable ? '' : 'ibps-field-text-no'">/</div>
        <ibps-user-selector
            v-else-if="fieldType === 'selector' || fieldType === 'currentUser' || fieldType === 'currentOrg' || fieldType === 'currentPosition'"
            v-model="dataModel"
            :class="isTable ? '' : readonlyText ? 'ibps-field-text' : ''"
            :placeholder="selectPlaceholder"
            :type="fieldOptions.selector_type"
            :filter="fieldOptions.filter"
            :multiple="multiple"
            :filtrate="filtrate"
            :store="fieldOptions.store || 'id'"
            :disabled="fieldType === 'currentUser' || fieldType === 'currentOrg' || fieldType === 'currentPosition' ? true : readonly"
            :readonly-text="readonlyText ? 'text' : null"
            :style="{ width: width }"
            @change-link-data="handleSeletorLinkageData"
            v-on="$listeners"
        />
        <!--自定义对话框-->
        <div v-else-if="fieldType === 'customDialog' && readonlyText && !dataModel" :class="isTable ? '' : 'ibps-field-text-no'">/</div>
        <ibps-custom-dialog
            v-else-if="fieldType === 'customDialog'"
            v-model="dataModel"
            :class="isTable ? '' : readonlyText ? 'ibps-field-text' : ''"
            :template-key="fieldOptions.dialog"
            :dynamic-params="dynamicParams"
            :has-dynamic-params="hasDynamicParams"
            :multiple="multipleString"
            :placeholder="selectPlaceholder"
            :store="fieldOptions.store"
            :icon="fieldOptions.icon ? 'ibps-icon-' + fieldOptions.icon : ''"
            :type="fieldOptions.dialog_type"
            :disabled="readonly"
            :readonly-text="readonlyText ? 'text' : null"
            :style="{ width: width }"
            @change-link-data="handleLinkageData"
            @change-link-attr="handleLinkageAttr"
            v-on="$listeners"
        />
        <!-- 关联数据-->
        <div v-else-if="fieldType === 'linkdata' && readonlyText && !dataModel" :class="isTable ? '' : 'ibps-field-text-no'">/</div>
        <ibps-link-data
            v-else-if="fieldType === 'linkdata'"
            v-model="dataModel"
            :class="isTable ? '' : readonlyText ? 'ibps-field-text' : ''"
            :template-key="fieldOptions.linkdata"
            :dynamic-params="dynamicParams"
            :has-dynamic-params="hasDynamicParams"
            :placeholder="selectPlaceholder"
            :multiple="multipleString"
            :structure="structure"
            :value-key="valueKey"
            :label-type="labelType"
            :label-key="labelKey"
            :config="linkConfig"
            :disabled="readonly"
            :readonly="readonly"
            :readonly-text="readonlyText ? 'text' : 'original'"
            :style="{ width: width }"
            @change-link-data="handleLinkageData"
            @change-link-attr="handleLinkageAttr"
            v-on="$listeners"
        />

        <!-- 地址-->
        <div v-else-if="fieldType === 'address'">
            <ibps-address
                v-model="addressValue"
                :size="fieldOptions.size"
                :top="fieldOptions.top || 'country'"
                :top-val="addressTopVal"
                :level="fieldOptions.level || 'district'"
                :disabled="readonly"
                :readonly-text="readonlyText ? 'text' : null"
                :placeholder="selectPlaceholder"
                data-type="code"
                :style="{ width: width }"
                v-on="$listeners"
            />
            <div v-if="fieldOptions.is_street && readonlyText" :class="isTable ? '' : dataModel ? 'ibps-field-text' : 'ibps-field-text-no'">{{ streetValue || '/' }}</div>
            <template v-else>
                <p />
                <el-input
                    v-if="fieldOptions.is_street"
                    v-model="streetValue"
                    :disabled="readonly"
                    :style="{ width: width }"
                    :placeholder="fieldOptions.street_placeholder"
                    type="textarea"
                />
            </template>
        </div>
        <!-- 签名-->
        <div v-else-if="fieldType === 'signature' && readonlyText && !dataModel" :class="isTable ? '' : 'ibps-field-text-no'">/</div>
        <ibps-signature
            v-else-if="fieldType === 'signature'"
            v-model="dataModel"
            :class="isTable ? '' : readonlyText ? 'ibps-field-text' : ''"
            :placeholder="placeholder"
            :height="fieldOptions.height"
            :disabled="readonly"
            :style="{ width: width }"
            v-on="$listeners"
        />
        <!-- 图片-->
        <div v-else-if="fieldType === 'image' && readonlyText && !dataModel" :class="isTable ? '' : 'ibps-field-text-no'">/</div>
        <ibps-image
            v-else-if="fieldType === 'image'"
            v-model="dataModel"
            :class="isTable ? '' : readonlyText ? 'ibps-field-text-img' : ''"
            :width="fieldOptions.width"
            :height="fieldOptions.height"
            :limit="fieldOptions.limit"
            :accept="imagesAccept"
            :media="fieldOptions.media"
            :tip="fieldOptions.tip"
            :size="fieldOptions.size"
            :upload-type="fieldOptions.uploadType"
            :disabled="readonly"
            v-on="$listeners"
        />
        <!-- 流程实例 -->
        <ibps-bpm-inst-his
            v-else-if="fieldType === 'bpmInstHis'"
            v-model="jsonArrayDataModel"
            :bpm-def-scope="fieldOptions.filter.bpmDefScope"
            :bpm-def-key="fieldOptions.filter.bpmDefKey"
            :script="fieldOptions.filter.script"
            :starter-scope="fieldOptions.filter.starterScope"
            :starter="fieldOptions.filter.starter"
            :placeholder="selectPlaceholder"
            :readonly="readonly"
            v-on="$listeners"
        />
        <!-- =======================自定义控件==============================-->
        <!-- 自定义组件 -->
        <template v-else-if="fieldType === 'component'">
            <component
                :is="fieldOptions.component_name"
                v-model="dataModel"
                :field="field"
                :form-data="formData"
                :readonly="readonly"
                :readonly-style="readonlyStyle"
                :code="code"
                :row="row"
                :params="params"
                @change-data="changeFormData"
                v-on="$listeners"
            />
        </template>
        <!-- 自定义控件 -->
        <template v-else-if="fieldType === 'control'">
            <component
                :is="fieldOptions.component_name"
                v-model="dataModel"
                :field="field"
                :form-data="formData"
                :readonly="readonly"
                :readonly-style="readonlyStyle"
                :code="code"
                :row="row"
                :params="params"
                @change-data="changeFormData"
                v-on="$listeners"
            />
        </template>

        <!-- 链接 -->
        <ibps-link
            v-else-if="fieldType === 'hyperlink'"
            :text="fieldOptions.text"
            :link="fieldOptions.link"
            :show-type="fieldOptions.showType"
            :text-type="fieldOptions.textType"
            :link-type="fieldOptions.linkType"
            :text-javascript="fieldOptions.text_javascript"
            :type="fieldOptions.type"
            :form-data="dynamicForm"
            preview-entrance
            :icon="fieldOptions.icon ? 'ibps-icon-' + fieldOptions.icon : ''"
            v-on="$listeners"
        />
        <Dictionaryitem
            v-if="dict_add"
            ref="dict_add"
            @proceedCont="proceedCont()"
        />
        <!-- =======================其它字段==============================-->
        <!-- 文本-->
        <span v-else-if="fieldType === 'label'" :class="isTable ? '' : dataModel ? 'ibps-field-text' : 'ibps-field-text-no'">
            <template v-if="value">{{ value || '/' }}</template>
            <template v-else>{{ placeholder || '/' }}</template>
        </span>
    </div>
</template>
<script>
import Vue from 'vue'
import { getByKey, queryDataTable } from '@/api/platform/data/dataTemplate'
import ActionUtils from '@/utils/action'
import FormOptions from '@/business/platform/form/constants/formOptions'
import { fileTypes as FILE_TYPES, accept as ACCEPT } from '@/business/platform/file/constants/fileTypes'
import FormUtils from '@/business/platform/form/utils/formUtil'
import DateFormatUtil from '@/business/platform/form/utils/dateFormatUtil'
import request from '@/utils/request'
import { BPMN_URL } from '@/api/baseUrl'

import IbpsUeditor from '@/components/ibps-ueditor'
import IbpsDictionary from '@/business/platform/cat/dictionary/select'
import IbpsAutoNumber from '@/business/platform/system/identity/auto-number'
import IbpsAttachment from '@/business/platform/file/attachment/selector'
import IbpsUserSelector from '@/business/platform/org/selector'
import IbpsAddressCascader from '@/components/ibps-address/cascader'
import IbpsSignature from './components/signature'
import IbpsImage from '@/business/platform/file/image'
import IbpsLink from '@/components/ibps-link'
import IbpsCustomDialog from '@/business/platform/data/templaterender/custom-dialog'
import IbpsLinkData from '@/business/platform/data/templaterender/link-data'
import IbpsBpmInstHis from '@/business/platform/bpmn/components/bpm-inst-his'
import Dictionaryitem from '@/business/platform/form/formrender/dynamic-form/addCont/dictionaryitem-add'

const _import = require('@/utils/util.import.' + process.env.NODE_ENV)

export default {
    inject: ['dynamicForm'],
    components: {
        'ibps-ueditor': IbpsUeditor,
        'ibps-dictionary': IbpsDictionary,
        'ibps-auto-number': IbpsAutoNumber,
        'ibps-attachment': IbpsAttachment,
        'ibps-user-selector': IbpsUserSelector,
        'ibps-address': IbpsAddressCascader,
        'ibps-signature': IbpsSignature,
        'ibps-image': IbpsImage,
        'ibps-link': IbpsLink,
        'ibps-custom-dialog': IbpsCustomDialog,
        'ibps-link-data': IbpsLinkData,
        'ibps-bpm-inst-his': IbpsBpmInstHis,
        Dictionaryitem: Dictionaryitem
    },
    filters: {
        // 定义过滤器
        ellipsis (value) {
            if (!value) return ''
            if (value.length > 40) {
                return value.slice(0, 40) + '...'
            }
            return value
        }
    },
    props: {
        value: {
            type: [String, Number, Date, Object, Array]
        },
        isTable: {
            type: Boolean,
            default: false
        },
        // 所有字段数据,(包含主主子表)
        formData: [Object, Array],
        field: {
            type: Object,
            required: true
        },
        readonly: {
            type: Boolean,
            default: false
        },
        readonlyStyle: {
            type: String,
            default: 'text'
        },
        // 表名
        code: String,
        // 子表行数
        row: [String, Number],
        params: {
            type: Object
        }
    },
    data () {
        return {
            dataModel: this.value,
            ajaxOptions: [],
            dataTemplate: {},
            menuHide: true,
            selectModel: [],
            watchKey: false,
            inputKey: '',
            dict_add: false,
            selectDataResult: [],
            hasFocus: false
        }
    },
    computed: {
        fieldType () {
            return this.field.field_type
        },
        fieldOptions () {
            return this.field.field_options || {}
        },
        width () {
            return this.fieldOptions.is_width ? (this.fieldOptions.width || 100) + (this.fieldOptions.width_unit || '%') : '100%'
        },
        switchWidth () {
            return this.fieldOptions.is_width ? this.fieldOptions.width || 40 : 40
        },
        checkboxDataModel: {
            get () {
                if (Array.isArray(this.dataModel)) {
                    return this.dataModel
                }
                return this.dataModel ? this.dataModel.split(',') : []
            },
            set (value) {
                this.dataModel = value.join(',')
            }
        },
        selectDataModel: {
            get () {
                if (this.multipleSelect) {
                    if (Array.isArray(this.dataModel)) {
                        return this.dataModel
                    }
                    return this.dataModel ? this.dataModel.split(',') : []
                } else {
                    return this.dataModel
                }
            },
            set (value) {
                this.dataModel = this.multipleSelect ? value.join(',') : value
            }
        },
        numberDataModel: {
            get () {
                if (!this.$utils.isNum(this.dataModel)) {
                    return
                }
                return Number(this.dataModel)
            },
            set (value) {
                this.dataModel = value
            }
        },
        jsonArrayDataModel: {
            get () {
                if (this.$utils.isEmpty(this.dataModel)) {
                    return ''
                }
                return this.$utils.parseJSON(this.dataModel)
            },
            set (value) {
                this.dataModel = value === '' ? '' : JSON.stringify(value)
            }
        },
        addressTopVal () {
            return FormUtils.getAddressTopVal(this.fieldOptions)
        },
        // 地址值
        addressValue: {
            get () {
                return FormUtils.getAddressControlValue(this.dataModel, this.fieldOptions)
            },
            set (value) {
                this.dataModel = FormUtils.getAddressValue(value, this.dataModel, this.fieldOptions)
            }
        },
        streetValue: {
            get () {
                if (this.$utils.isEmpty(this.dataModel)) {
                    return ''
                }
                const data = this.$utils.parseJSON(this.dataModel)
                return data['street'] || ''
            },
            set (val) {
                let data = {}
                if (this.$utils.isNotEmpty(this.dataModel)) {
                    data = this.$utils.parseJSON(this.dataModel)
                }
                data['street'] = val
                this.dataModel = JSON.stringify(data)
            }
        },
        readonlyText () {
            if (!this.readonly) return false
            return this.readonlyStyle === 'text'
        },
        // 自适应内容高度
        autosize () {
            let autosize = this.fieldOptions.autosize
            if (this.fieldOptions.autosize && (this.fieldOptions.min_rows || this.fieldOptions.max_rows)) {
                const rows = {}
                rows.minRows = this.fieldOptions.min_rows ? this.fieldOptions.min_rows : null
                rows.maxRows = this.fieldOptions.max_rows ? this.fieldOptions.max_rows : null
                autosize = rows
            }
            return autosize
        },
        // 日期格式
        datefmt () {
            if (this.fieldOptions['datefmt_type'] && this.fieldOptions['datefmt_type'] !== 'custom') {
                if (this.fieldType === 'currentDate') {
                    return (FormOptions.t.DATE_FORMATS[this.fieldOptions['datefmt_type']] || FormOptions.t.DATE_FORMATS['date'])
                } else if (this.fieldType === 'currentTime') {
                    return (FormOptions.t.DATE_FORMATS[this.fieldOptions['datefmt_type']] || FormOptions.t.DATE_FORMATS['time'])
                } else {
                    return (FormOptions.t.DATE_FORMATS[this.fieldOptions['datefmt_type']] || FormOptions.t.DATE_FORMATS['date'])
                }
            } else {
                return (this.fieldOptions['datefmt'] || FormOptions.t.DATE_FORMATS['date'])
            }
        },
        // 日期格式处理
        dateDealFmt () {
            return DateFormatUtil.dealFmt(this.datefmt)
        },
        // 日期控件类型
        datePckerType () {
            return this.dateDealFmt.datePckerType
        },
        dateType () {
            // year/month/date/week/ datetime/datetimerange/daterange
            // 根据自定义日期格式的配置
            return this.dateDealFmt.dateType || 'datetime'
        },
        // 单选、多选、下拉等选项
        dataOptions () {
            return this.field.field_options['options'] || this.ajaxOptions
        },
        // switch选项
        switchOptions () {
            return FormUtils.getSwitchOptions(this.field.field_options)
        },
        // 占位符
        placeholder () {
            return !this.readonly ? this.fieldOptions['placeholder'] : ''
        },
        // 下拉占位符
        dropdownPlaceholder () {
            return this.$utils.isNotEmpty(this.placeholder) ? this.fieldOptions['include_blank_value'] || this.placeholder : ''
        },
        // 选择类型占位符
        selectPlaceholder () {
            return this.$utils.isNotEmpty(this.placeholder) ? this.placeholder : '请选择'
        },
        // 可清空
        clearable () {
            return this.$utils.toBoolean(this.fieldOptions['clearable'], true)
        },
        // 下拉是否允许创建，仅数据来源为静态数据时生效
        allowCreate () {
            return this.fieldOptions['allowCreate'] && this.fieldOptions['datasource'] === 'custom'
        },
        // 编辑器按钮
        ueditorConfig () {
            const config = {
                initialContent: this.placeholder,
                toolbars: []
            }

            const toolbars = this.fieldOptions.toolbars
            if (toolbars && toolbars.length > 0) {
                config.toolbars.push(toolbars)
            }
            return config
        },
        // 最大文件上传
        maxFileSize () {
            return this.$utils.isNotEmpty(this.fieldOptions.max_file_size) ? this.fieldOptions.max_file_size * 1024 * 1024 : null
        },
        // 最大文件个数
        fileQuantity () {
            if (this.$utils.isNotEmpty(this.fieldOptions.max_file_quantity) && (this.fieldOptions.max_file_quantity !== '-1' || this.fieldOptions.max_file_quantity !== -1)) {
                return parseInt(this.fieldOptions.max_file_quantity, 10)
            } else {
                return null
            }
        },
        // 格式类型
        fileAccept () {
            const mediaType = this.fieldOptions.media_type
            if (this.$utils.isEmpty(mediaType)) {
                return '*'
            }
            return ACCEPT[mediaType] || '*'
        },
        imagesAccept () {
            const accept = this.fieldOptions.accept
            if (this.$utils.isEmpty(accept)) {
                return ACCEPT['images']
            }
            if (accept === 'custom') {
                return this.fieldOptions.media
            }
            return accept
        },
        fileFormates () {
            const mediaType = this.fieldOptions.media_type
            if (this.$utils.isEmpty(mediaType)) {
                return []
            }
            const x = FILE_TYPES[mediaType]
            if (x) {
                return x.map(v => {
                    return '.' + v
                })
            } else {
                return (this.fieldOptions.media || '').split(',')
            }
        },
        bindId () {
            return this.fieldOptions['bind_id'] || ''
        },
        // 是否多选[字符串]
        multipleString () {
            return this.$utils.toBoolean(this.fieldOptions['multiple'] === 'Y', true)
        },
        // 是否多选
        multiple () {
            return this.$utils.toBoolean(this.fieldOptions['multiple'], true)
        },
        // 是否多选
        multipleSelect () {
            return this.$utils.toBoolean(this.fieldOptions['multiple'], false)
        },

        // 是否过滤
        filtrate () {
            return this.$utils.toBoolean(this.fieldOptions['filtrate'] || false, false)
        },

        operation_status () {
            return this.fieldOptions['operation_status']
        },
        // 高
        height () {
            return this.fieldOptions.height ? parseInt(this.fieldOptions.height, 10) : null
        },
        // 其他选项值
        otherOptionValue: {
            get () {
                const otherId = this.fieldOptions['option_other_id']
                if (this.$utils.isEmpty(otherId)) return
                return this.models[otherId] || ''
            },
            set (value) {
                const otherId = this.fieldOptions['option_other_id']
                if (this.$utils.isEmpty(otherId)) return
                this.changeFormData(otherId, value)
            }
        },
        structure () {
            return FormUtils.getLinkStructure(this.fieldOptions, this.models)
        },
        valueKey () {
            return FormUtils.getLinkValueKey(this.fieldOptions, this.models)
        },
        labelType () {
            return FormUtils.getLinkLabelType(this.fieldOptions, this.models)
        },
        labelKey () {
            return FormUtils.getLinkLabelKey(this.fieldOptions, this.models)
        },
        linkConfig () {
            return FormUtils.getLinkConfig(this.fieldOptions, this.models)
        },
        hasDynamicParams () {
            return FormUtils.hasLinkDynamicParams(this.fieldOptions)
        },
        dynamicParams () {
            return FormUtils.getLinkDynamicParams(this.fieldOptions, this.formData, this.code, this.row)
        },
        models () {
            if (!this.formData) return {}
            return this.$utils.isNotEmpty(this.row) ? this.formData[this.code] ? this.formData[this.code][this.row] : this.formData : this.formData
        },
        isValueSource () {
            return ((this.fieldType === 'radio' || this.fieldType === 'checkbox' || this.fieldType === 'select') && this.fieldOptions['datasource'] === 'valuesource')
        }
    },
    watch: {
        value: {
            handler (val) {
                this.dataModel = val
            },
            deep: true
        },
        dataModel: {
            handler (val) {
                this.$emit('update:value', val)
            },
            deep: true
        },
        dynamicParams: {
            handler (val, oldVal) {
                if (val !== oldVal && this.isValueSource) {
                    // 每次表单值变动都请求数据，严重影响性能
                    this.loadAjaxOptions()
                }
            },
            deep: true
        }
    },
    created () {
        if (this.isValueSource) {
            this.field.field_options['options'] = null
            getByKey({ dataTemplateKey: this.fieldOptions['value_source'] }).then((response) => {
                this.dataTemplate = this.$utils.parseData(response.data)
                this.loadAjaxOptions()
            }).catch(() => {})
        }
        if (this.fieldType === 'component' || this.fieldType === 'control') {
            const component = _import(this.fieldOptions.component_url)
            if (component) {
                Vue.component(this.fieldOptions.component_name, component)
            }
        }
    },
    methods: {
        handleRadioChange (val) {
            if (this.dataModel === val && this.fieldOptions.uncheck === true) {
                this.dataModel = null
            } else {
                this.dataModel = val
            }
            // 因@click.native.stop.prevent修饰符阻止了父元素的事件监听，需手动触发el-radio-group的change事件
            this.$nextTick(() => {
                this.$emit('change', this.dataModel)
            })
        },
        // 日期格式调整
        selectTime (val) {
            const date = new Date(new Date())
            const year = date.getFullYear()
            const month = this.trans(date.getMonth() + 1)
            const day = this.trans(date.getDate())
            const addDate = year + '' + month + '' + day
            if (this.datefmt === 'MM') {
                this.dataModel = addDate.substring(0, 4) + '-' + val + '-01'
            } else if (this.datefmt === 'yyyy-MM') {
                this.dataModel = val + '-01'
            } else if (this.datefmt === 'yyyy') {
                this.dataModel = val + '-01-01'
            }
        },
        // 获取当前时间
        trans (val) {
            return val < 10 ? '0' + val : val
        },
        getValuesourceParams (template, dataTemplate) {
            const formParams = {}
            const responseData = JSON.parse(JSON.stringify(template))
            responseData.datasetKey = dataTemplate.datasetKey
            responseData.unique = this.valueKey
            responseData['key'] = this.fieldOptions['value_source']
            responseData['dynamic_params'] = this.dynamicParams
            formParams['response_data'] = JSON.stringify(responseData)
            formParams['filter_condition_key'] = ''
            return ActionUtils.formatParams(formParams)
        },
        loadAjaxOptions () {
            if (this.$utils.isEmpty(this.dataTemplate)) {
                return
            }
            const template = this.dataTemplate.templates[0]
            queryDataTable(this.getValuesourceParams(template, this.dataTemplate)).then(resp => {
                const data = resp.data || {}
                const dataResult = data.dataResult || []
                this.selectDataResult = dataResult
                const options = dataResult.map(item => {
                    return {
                        val: item[this.valueKey],
                        label: item[this.labelKey]
                    }
                })
                this.ajaxOptions = options
            })
        },
        // 选择器存储格式-绑定标识
        handleSeletorLinkageData (value, data, type) {
            if (this.multipleString) {
                return
            }
            const linkLinkage = this.fieldOptions['bindFiled'] // 绑定字段
            let bind = this.fieldOptions['bind'] // 获取作为绑定字段属性值得属性
            if (type === 'role') {
                bind = 'roleAlias'
            }
            if (this.$utils.isEmpty(linkLinkage) || this.$utils.isEmpty(data)) {
                return
            }
            const field = linkLinkage
            const fieldObj = field ? field.split('.') : [] // 改变的字段
            const selectorData = JSON.parse(JSON.stringify(data))
            const targetValues = []
            selectorData.forEach(s => {
                targetValues.push(s[bind])
            })
            const targetString = targetValues.join(',')
            if (this.$utils.isNotEmpty(fieldObj)) {
                const fieldName = fieldObj.length > 1 ? fieldObj[1] : fieldObj[0]
                if (this.$utils.isNotEmpty(fieldName) && this.models.hasOwnProperty(fieldName)) {
                    this.changeFormData(fieldName, targetString || '')
                }
            }
        },
        selectLinkageChange (value) {
            const dataValue = this.selectDataResult.find(item => item.id_ === value)
            if (dataValue) {
                this.handleLinkageData(value, dataValue)
            }
        },
        // 联动数据
        handleLinkageData (value, data) {
            if (this.multipleString) {
                return
            }
            const linkLinkage = this.fieldOptions['link_linkage']
            if (this.$utils.isEmpty(linkLinkage) || this.$utils.isEmpty(data)) {
                return
            }
            for (let i = 0; i < linkLinkage.length; i++) {
                const item = linkLinkage[i]
                const field = item.field
                const fieldObj = field ? field.split('.') : [] // 改变的字段
                if (this.$utils.isNotEmpty(fieldObj)) {
                    const fieldName = fieldObj.length > 1 ? fieldObj[1] : fieldObj[0]
                    if (this.$utils.isNotEmpty(fieldName) && this.models.hasOwnProperty(fieldName)) {
                        this.changeFormData(fieldName, data[item.name] || '')
                    }
                }
            }
        },
        // 联动属性
        handleLinkageAttr (value, data) {
            if (this.multipleString) {
                return
            }
            const linkAttr = this.fieldOptions['link_attr']
            if (this.$utils.isEmpty(linkAttr) || this.$utils.isEmpty(data)) {
                return
            }
            for (let i = 0; i < linkAttr.length; i++) {
                const item = linkAttr[i]
                const field = item.field
                const fieldObj = field ? field.split('.') : [] // 改变的字段
                if (this.$utils.isNotEmpty(fieldObj)) {
                    const fieldName = fieldObj.length > 1 ? fieldObj[1] : fieldObj[0]
                    if (this.$utils.isNotEmpty(fieldName) && this.models.hasOwnProperty(fieldName)) {
                        this.changeFormData(fieldName, data[item.name] || '')
                    }
                }
            }
        },
        // 选择器绑定id
        selectorBindCallback (value) {
            const bindId = this.bindId
            if (this.$utils.isEmpty(bindId)) {
                this.$message.error('[' + this.label + ']字段未绑Id')
                return
            }
            this.changeFormData(bindId, value || '')
        },
        // 更新字段值（主表或其他子表）
        changeFormData (name, value) {
            this.$emit('change-data', name, value)
        },
        // 请求记忆数据库
        reqPhrase (orderId, field) {
            if (!this.watchKey || this.inputKey != field.name + field.field_text) {
                this.watchKey = true
                this.inputKey = field.name + field.field_text
                request({
                    url: BPMN_URL() + '/sys/SysDataContext/getDataContext',
                    method: 'post',
                    data: JSON.stringify({
                        attrName: this.inputKey,
                        orderId: orderId
                    })
                }).then(response => {
                    if (response.state === 200) {
                        this.selectModel = response.variables.page
                    }
                }).catch(error => {
                    this.$message.error('系统忙、或数据错误,请稍后再试')
                })
            }
        },
        // 选定短语
        handleCommand (val) {
            if (!this.dataModel) {
                this.dataModel = val
            } else {
                this.dataModel = this.dataModel + val
            }
        },
        // 删除字典内容
        deleteDicts (id, name) {
            this.menuHide = false
            this.$confirm(`确定对[ ${name} ]进行 [ 删除操作 ]?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.watchKey = false
                request({
                    url: BPMN_URL() + '/sys/SysDataContext/deleteDataContext',
                    method: 'post',
                    data: JSON.stringify({ uuId: id })
                }).then(response => {
                    this.menuHide = true
                    if (response.state === 200) {
                        this.$message({
                            message: '删除成功！',
                            type: 'success',
                            duration: 800,
                            onClose: () => {
                                this.visible = false
                                this.$emit('proceedCont')
                            }
                        })
                    }
                }).catch(error => {
                    this.$message.error('系统忙、或数据错误,请稍后再试')
                })
            }).catch(() => {})
        },
        // 添加字典
        addDict (orderId, inputKey, name) {
            var valueCont = inputKey.name + inputKey.field_text
            this.dict_add = true
            this.$nextTick(() => {
                this.$refs.dict_add.init(orderId, valueCont, name)
            })
        },
        // 回调进行再次点击开关
        proceedCont () {
            // 防止恶意查询 。 为空表示可以点击了
            this.watchKey = false
        }
    }
}
</script>
<style>
    .jbd-dynamic-form-field{
        font-size: 12px;
    }
    .el-form-item {
        margin-bottom: 6px !important;
    }
    .el-form-item__error {
        line-height: 0;
    }
    .elButtonPlace {
        position: absolute;
        right: 0px;
        z-index: 99;
        opacity: 0.2;
        width: 10px;
        padding-left: 0px;
    }
    .ibps-overflow {
        white-space: pre-line;
    }
    .ibps-field-text {
        white-space: pre-line;
        color: #000000;
        box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.1), 0 0 0 0 rgba(0, 0, 0, 0.1), 0 0 0 0 rgba(0, 0, 0, 0.1), 0 1px 0px 0 rgba(0, 0, 0, 0.1);
        padding-left: 5px;
        min-height: 32px;
    }
    .ibps-field-text-img {
        color: #000000;
        box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.1), 0 0 0 0 rgba(0, 0, 0, 0.1), 0 0 0 0 rgba(0, 0, 0, 0.1), 0 1px 0px 0 rgba(0, 0, 0, 0.1);
        padding-left: 5px;
        height: 150px;
    }
    .ibps-field-text-no {
        color: #000000;
        box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.1), 0 0 0 0 rgba(0, 0, 0, 0.1), 0 0 0 0 rgba(0, 0, 0, 0.1), 0 1px 0px 0 rgba(0, 0, 0, 0.1);
        padding-left: 15px;
        min-height: 32px;
        margin-top: 5px;
        font-size: 20px;
    }
</style>
