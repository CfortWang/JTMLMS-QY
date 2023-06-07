<template>
  <el-dialog

    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    append-to-body
    width="40%"
    top="5vh"
    class="news-detail-dialog"
    @open="getFormData"
    @close="closeDialog"
  >
    <div style="padding: 10px;">
      <el-row>
        <el-col :span="24">
          <el-col :span="18">
            <el-col :span="24">
                         <span> 标题： <div class="text-border">{{ form.templatename_ }}</div></span>
              </el-col>
            <el-col :span="24">
              <el-col :span="8">
                <span>发布时间:<div class="text-border" style="font-weight: normal;">{{ form.create_time_}}</div></span>
              </el-col>
              <el-col :span="8">
                <span>发布人:<div class="text-border"style="font-weight: normal;" >{{ form.tong_zhi_ren_}}</div></span>
              </el-col>
              <el-col :span="8" style="display: none;">
                <span>作者：<div class="text-border">{{ form.author|| "/" }}</div></span>
              </el-col>
              <el-col :span="8" style="display: none;">
                <div>公告类型：<div class="text-border">{{ form.publicItem|optionsFilter(publicItemOptions,'label') || "/"}}</div></div>
              </el-col>
            </el-col>
            <el-col :span="24" style="display: none;">
              <el-col :span="8">
                <span>是否公共：<div class="text-border">{{ form.isPublic|optionsFilter(isPublicOptions,'label')|| "/" }}</div></span>
              </el-col>
              <el-col :span="16" style="display: none;">
                <span>查看范围组织：<div class="text-border">{{ form.depName || "/"}}</div> </span>
              </el-col>
            </el-col>
            <el-col :span="24">

              <el-col :span="16" style="display: none;">
                <span>关键字：<label style="color:red"><div class="text-border">{{ form.key || "/"}}</div></label></span>
              </el-col>
            </el-col>
            <el-col :span="24" style="display: none;">
              <span>附件：</span>
              <ibps-attachment-selector
                ref="fileAttach"
                :value="form.fileAttach"
                multiple
                readonly
                allow-download
                :download="readonly"
                style="margin:5px;"
                @callback="data => formId = data.id"
                v-if="form.fileAttach"
              />
              <span v-else>/</span>

            </el-col>
          </el-col>
           <br/>
          <el-col :span="6" style="display: none;">
            <el-image :src="image" class="avatar" style="width: 180px; height: 180px; display: block;">
              <div slot="error">
                <i class="el-icon-picture-outline" style="font-size:180px;color: #909399;" />
              </div>
            </el-image>
            <!-- <img :src="image" class="avatar"> -->
          </el-col>
        </el-col>
        <el-col :span="24">
          <el-row :gutter="10">
            <el-col :span="24">内容：<span  v-if="!form.content_">/</span></el-col>
              <el-col :span="24">
                <div class="ibps-p-10" v-html="form.content_"  v-if="form.content_"/>
              </el-col>
          </el-row>
          </span>

          <!-- <ibps-ueditor v-model="form.content" :readonly="readonly" destroy /> -->
        </el-col>
      </el-row>

    </div>
    <div slot="footer" class="el-dialog--center">
      <ibps-toolbar
        :actions="toolbars"
        @action-event="handleActionEvent"
      />
    </div>
  </el-dialog>
</template>

<script>
import { getAccountInfo,findBpm,getNews,unreadMessage ,getCmsNews} from '@/api/detection/newHomeApi'
import IbpsAttachmentSelector from '@/business/platform/file/attachment/selector'
import { get } from '@/api/platform/system/news'
import { typeOptions, publicItemOptions, isPublicOptions } from './constants'
import { getFile } from '@/utils/avatar'
export default {
  components: {
    IbpsAttachmentSelector
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    id: String,
    title: String
  },
  data() {
    return {
      formName: 'form',
      dialogVisible: this.visible,
      dialogLoading: false,
      dialogFormVisible: false, // 弹窗
      typeOptions: typeOptions,
      publicItemOptions: publicItemOptions,
      isPublicOptions: isPublicOptions,
      form: {},
      toolbars: [
        { key: 'cancel' }
      ]
    }
  },
  computed: {
    formId() {
      return this.id
    },
    image() {
      return getFile(this.form.picture)
    }
  },
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.dialogVisible = this.visible
      },
      immediate: true
    }
  },
  methods: {
    handleActionEvent({ key }) {
      switch (key) {
        case 'cancel':
          this.closeDialog()
          break
        default:
          break
      }
    },
    // 关闭当前窗口
    closeDialog() {
      this.$emit('close', false)
    },
    titleStyle(color) {
      this.$refs.title.style.color = color
    },
    /**
     * 获取表单数据
     */
    getFormData() {
      this.dialogLoading = true
      console.log("cms")
     console.log(this.formId)
      let params={
        parameters:[
            {
              "key": "response_data",
              "value": "{\"template_id\":\"961299238640156672\",\"template_type\":\"\",\"attrs\":{\"init_query\":\"Y\",\"need_page\":\"Y\",\"page_size\":20},\"query_columns\":[{\"label\":\"接收人\",\"name\":\"received_\",\"rights\":[{\"type\":\"all\"}],\"common\":\"Y\",\"same\":\"Y\",\"field_type\":\"text\",\"field_options\":{},\"data_type\":\"varchar\"},{\"label\":\"编制部门\",\"name\":\"bian_zhi_bu_men_\",\"field_type\":\"selector\",\"field_options\":{\"default_value_type\":\"present\",\"placeholder\":\"请选择\",\"selector_type\":\"org\",\"store\":\"id\",\"multiple\":false,\"filter\":[],\"required\":false,\"hide_rights\":false,\"read_rights\":false,\"hide_label\":false,\"is_width\":false,\"width\":100,\"width_unit\":\"%\",\"is_label_width\":false,\"label_width\":100,\"label_width_unit\":\"px\",\"mobile\":true,\"display\":true,\"clearable\":true},\"data_type\":\"varchar\"}],\"display_columns\":[{\"label\":\"方式\",\"name\":\"fa_song_fang_shi_\",\"rights\":[{\"type\":\"all\"}],\"noRightStyle\":\"\",\"align\":\"left\",\"sortable\":true,\"width\":\"80\",\"same\":\"Y\",\"field_type\":\"radio\",\"field_options\":{\"required\":false,\"hide_rights\":false,\"read_rights\":false,\"hide_label\":false,\"is_label_width\":false,\"label_width\":100,\"label_width_unit\":\"px\",\"mobile\":true,\"arrangement\":\"horizontal\",\"default_value_type\":\"fixed\",\"datasource\":\"custom\",\"options\":[{\"val\":\"公告\",\"label\":\"系统内\",\"checked\":true},{\"val\":\"短信\",\"label\":\"短信\",\"checked\":false},{\"val\":\"短信和公告\",\"label\":\"短信和系统内\",\"disabled\":false,\"checked\":false}],\"display\":true,\"clearable\":true,\"custom_class\":\"font-weight:bolder\"},\"data_type\":\"varchar\"},{\"label\":\"类型\",\"name\":\"templatename_\",\"rights\":[{\"type\":\"all\"}],\"noRightStyle\":\"\",\"align\":\"left\",\"sortable\":true,\"width\":\"80\",\"same\":\"Y\",\"field_type\":\"text\",\"field_options\":{\"default_value_type\":\"fixed\",\"placeholder\":\"请输入\",\"required\":false,\"is_min_length\":false,\"is_max_length\":false,\"hide_rights\":true,\"read_rights\":false,\"hide_label\":false,\"is_width\":false,\"width\":100,\"width_unit\":\"%\",\"is_label_width\":false,\"label_width\":100,\"label_width_unit\":\"px\",\"clearable\":true,\"mobile\":true,\"display\":true},\"data_type\":\"varchar\"},{\"label\":\"通知内容\",\"name\":\"content_\",\"rights\":[{\"type\":\"all\"}],\"noRightStyle\":\"\",\"align\":\"left\",\"sortable\":true,\"width\":\"\",\"same\":\"Y\",\"field_type\":\"textarea\",\"field_options\":{\"default_value_type\":\"fixed\",\"placeholder\":\"\",\"required\":false,\"is_min_length\":false,\"is_max_length\":false,\"hide_rights\":true,\"read_rights\":false,\"hide_label\":false,\"is_width\":false,\"width\":100,\"width_unit\":\"%\",\"is_label_width\":false,\"label_width\":100,\"label_width_unit\":\"px\",\"clearable\":true,\"mobile\":true,\"display\":true,\"default_value\":\"\"},\"data_type\":\"varchar\"},{\"label\":\"状态\",\"name\":\"state_\",\"rights\":[{\"type\":\"all\"}],\"noRightStyle\":\"\",\"align\":\"left\",\"sortable\":true,\"width\":\"80\",\"same\":\"Y\",\"field_type\":\"text\",\"field_options\":{},\"data_type\":\"varchar\"},{\"label\":\"接收人\",\"name\":\"received_\",\"rights\":[{\"type\":\"all\"}],\"noRightStyle\":\"\",\"align\":\"left\",\"sortable\":true,\"width\":\"240\",\"same\":\"Y\",\"field_type\":\"text\",\"field_options\":{},\"data_type\":\"varchar\"},{\"label\":\"发送时间\",\"name\":\"sendtime_\",\"rights\":[{\"type\":\"all\"}],\"noRightStyle\":\"\",\"align\":\"left\",\"sortable\":true,\"width\":\"150\",\"same\":\"Y\",\"field_type\":\"datePicker\",\"field_options\":{\"default_value_type\":\"today\",\"placeholder\":\"请选择\",\"datefmt_type\":\"datetime\",\"datefmt\":\"yyyy-MM-dd HH:mm:ss\",\"required\":false,\"is_start_date\":false,\"is_end_date\":false,\"hide_rights\":true,\"read_rights\":false,\"hide_label\":false,\"is_width\":false,\"width\":100,\"width_unit\":\"%\",\"is_label_width\":false,\"label_width\":100,\"label_width_unit\":\"px\",\"clearable\":true,\"mobile\":true,\"display\":true},\"data_type\":\"varchar\"},{\"label\":\"部门\",\"name\":\"bian_zhi_bu_men_\",\"rights\":[{\"type\":\"all\"}],\"noRightStyle\":\"\",\"align\":\"left\",\"sortable\":true,\"width\":\"80\",\"same\":\"Y\",\"field_type\":\"selector\",\"field_options\":{\"default_value_type\":\"present\",\"placeholder\":\"请选择\",\"selector_type\":\"org\",\"store\":\"id\",\"multiple\":false,\"filter\":[],\"required\":false,\"hide_rights\":false,\"read_rights\":false,\"hide_label\":false,\"is_width\":false,\"width\":100,\"width_unit\":\"%\",\"is_label_width\":false,\"label_width\":100,\"label_width_unit\":\"px\",\"mobile\":true,\"display\":true,\"clearable\":true},\"data_type\":\"varchar\"},{\"label\":\"通知人\",\"name\":\"bian_zhi_ren_\",\"rights\":[{\"type\":\"all\"}],\"noRightStyle\":\"\",\"align\":\"left\",\"sortable\":true,\"width\":\"120\",\"same\":\"Y\",\"field_type\":\"selector\",\"field_options\":{\"default_value_type\":\"present\",\"placeholder\":\"请选择\",\"selector_type\":\"user\",\"store\":\"id\",\"multiple\":false,\"filter\":[],\"required\":false,\"hide_rights\":false,\"read_rights\":false,\"hide_label\":false,\"is_width\":false,\"width\":100,\"width_unit\":\"%\",\"is_label_width\":false,\"label_width\":100,\"label_width_unit\":\"px\",\"mobile\":true,\"display\":true,\"clearable\":true},\"data_type\":\"varchar\"},{\"label\":\"通知人\",\"name\":\"tong_zhi_ren_\",\"field_type\":\"text\",\"field_options\":{\"default_value_type\":\"fixed\",\"placeholder\":\"请输入\",\"required\":false,\"is_min_length\":false,\"is_max_length\":false,\"hide_rights\":true,\"read_rights\":true,\"hide_label\":false,\"is_width\":false,\"width\":100,\"width_unit\":\"%\",\"is_label_width\":false,\"label_width\":100,\"label_width_unit\":\"px\",\"clearable\":true,\"mobile\":true,\"display\":true},\"data_type\":\"varchar\"}],\"orig_display_columns\":\"\",\"filter_conditions\":[{\"label\":\"默认条件\",\"key\":\"ffc246c0-5132-4c64-a31c-e46e240f4574\",\"type\":\"condition\",\"rights\":[{\"type\":\"all\"}],\"filter\":{\"condition\":\"OR\",\"rules\":[{\"id\":\"fa_song_fang_shi_\",\"field\":\"fa_song_fang_shi_\",\"label\":\"发送方式\",\"type\":\"string\",\"input\":\"text\",\"operator\":\"equal\",\"source\":\"fixed\",\"value\":\"公告\"},{\"id\":\"fa_song_fang_shi_\",\"field\":\"fa_song_fang_shi_\",\"label\":\"发送方式\",\"type\":\"string\",\"input\":\"text\",\"operator\":\"equal\",\"source\":\"fixed\",\"value\":\"短信和公告\"}]}}],\"result_columns\":[{\"label\":\"主键\",\"name\":\"id_\"},{\"label\":\"租户ID\",\"name\":\"tenant_id_\"},{\"label\":\"IP地址\",\"name\":\"ip_\"},{\"label\":\"创建人\",\"name\":\"create_by_\"},{\"label\":\"发送时间\",\"name\":\"create_time_\",\"rights\":[{\"type\":\"all\"}],\"same\":\"Y\",\"field_type\":\"orig\",\"field_options\":{\"datefmt_type\":\"date\",\"datefmt\":\"yyyy-MM-dd\",\"selector_type\":\"user\",\"options\":[{\"val\":\"\",\"label\":\"\"}],\"store\":\"id\",\"dictionary\":\"\",\"dictionary_name\":\"\"}},{\"label\":\"更新时间\",\"name\":\"update_time_\"},{\"label\":\"更新人\",\"name\":\"update_by_\"},{\"label\":\"是否过审\",\"name\":\"shi_fou_guo_shen_\"},{\"label\":\"编制人\",\"name\":\"bian_zhi_ren_\"},{\"label\":\"编制部门\",\"name\":\"bian_zhi_bu_men_\"},{\"label\":\"编制时间\",\"name\":\"bian_zhi_shi_jian\"},{\"label\":\"sendTime\",\"name\":\"sendtime_\"},{\"label\":\"state\",\"name\":\"state_\"},{\"label\":\"templateCode\",\"name\":\"templatecode_\"},{\"label\":\"receive\",\"name\":\"received_\"},{\"label\":\"content\",\"name\":\"content_\"},{\"label\":\"phone\",\"name\":\"phone_\"},{\"label\":\"templateName\",\"name\":\"templatename_\"},{\"label\":\"字段一\",\"name\":\"zi_duan_yi_\"},{\"label\":\"字段二\",\"name\":\"zi_duan_er_\"},{\"label\":\"字段三\",\"name\":\"zi_duan_san_\"},{\"label\":\"通知部门\",\"name\":\"tong_zhi_bu_men_\"},{\"label\":\"发送方式\",\"name\":\"fa_song_fang_shi_\"},{\"label\":\"通知人\",\"name\":\"tong_zhi_ren_\"}],\"sort_columns\":[{\"label\":\"创建时间\",\"name\":\"create_time_\",\"direction\":\"desc\"}],\"buttons\":{\"function_buttons\":[{\"button_type\":\"search\",\"label\":\"查询\",\"position\":\"toolbar\"},{\"label\":\"添加\",\"button_type\":\"custom\",\"rights\":[{\"type\":\"all\"}],\"position\":\"toolbar\",\"code\":\"openTask\",\"style\":\"success\"},{\"label\":\"删除\",\"button_type\":\"remove\",\"rights\":[{\"type\":\"all\"}],\"position\":\"toolbar\"}],\"edit_buttons\":[{\"button_type\":\"close\",\"label\":\"关闭\"},{\"button_type\":\"save\",\"label\":\"保存\"}]},\"export_columns\":\"\",\"ext_columns\":\"\",\"datasetKey\":\"dxtz\",\"unique\":\"id_\",\"dynamic_params\":{}}"
            },
            {
              "key": "filter_condition_key",
              "value": ""
            },
            {key: "Q^sendtime_^SL", value: "2022-04-11 15:58:28"}
        ],
        requestPage: {
          "pageNo": 1,
          "limit": 20
        },
        sorts: []
      };
      params.parameters[2].value=this.formId;

      console.log(params.parameters[2].value)

      getCmsNews(params).then(response =>{
        console.log(response.data.dataResult)
       // this.newsDataCms = response.data;
         this.form = response.data.dataResult[0]
        this.dialogLoading = false
      }).catch(() => {
        this.dialogLoading = false
      })



/*

      get({
        newsId: this.formId
      }).then(response => {
        const data = response.data
        this.form = data
        if (response.data.publicItem === 'important') {
          this.titleStyle('red')
        } else {
          this.titleStyle('black')
        }

        this.dialogLoading = false
      }).catch(() => {
        this.dialogLoading = false
      })
      */


    }
  }

}
</script>
<style lang="scss">
.news-detail-dialog{
  .text-border{
    width:100%;
    color: #000000;
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.1),
    0 0 0 0 rgba(0, 0, 0, 0.1),
    0 0 0 0 rgba(0, 0, 0, 0.1),
    0 1px 0px 0 rgba(0, 0, 0, 0.1);
    min-height: 38px;
    font-size: 14px;
    font-weight: bold;
    text-align: center;
  }
  .el-dialog__body{
    height:  calc(70vh - 110px) !important;
  }
}
</style>
