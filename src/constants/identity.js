/**
 * 模块唯一标识
 */
export default {
  IBPS: {
    ORG: {
      EMPLOYEE: 'ibps_org_employee',
      LEVEL: 'ibps_org_level',
      // 组织管理
      ORG: 'ibps_org_org',
      ORG_CHARGE: 'ibps_org_org_charge',
      ORG_POSITION: 'ibps_org_org_position',
      ORG_EMPLOYEE: 'ibps_org_org_employee',
      ORG_EXTATTR: 'ibps_org_org_ext_attr',
      ORG_ROLE: 'ibps_org_org_role',
      ORG_AUTH: 'ibps_org_org_auth',
      ORG_TREE: 'ibps_org_tree',
      // 岗位管理
      POSITION: 'ibps_org_position',
      POSITION_EMPLOYEE: 'ibps_org_position_employee',
      POSITION_ORG: 'ibps_org_position_org',
      POSITION_ROLE: 'ibps_org_position_role',
      POSITION_TREE: 'ibps_position_tree',
      // 角色管理
      ROLE: 'ibps_org_role',
      // 分级组织管理
      AUTH_ORG: 'ibps_org_auth_org',
      AUTH_ORG_CHARGE: 'ibps_org_auth_org_charge',
      AUTH_ORG_POSITION: 'ibps_org_auth_org_position',
      AUTH_ORG_EMPLOYEE: 'ibps_org_auth_org_employee',
      AUTH_ORG_EXTATTR: 'ibps_org_auth_org_ext_attr',
      AUTH_ORG_ROLE: 'ibps_org_auth_org_role',
      AUTH_ORG_AUTH: 'ibps_org_auth_org_auth',
      AUTH_ORG_TREE: 'ibps_org_auth_org_tree',
      // 参与者属性管理
      ATTR: 'ibps_org_attr',
      // 用户组管理
      GROUP: 'ibps_org_group',
      // 上下级管理 userSecurity
      RELATION: 'ibps_org_relation',
      RELATION_SUPERIOR: 'ibps_org_relation_superior',
      RELATION_UNDER: 'ibps_org_relation_under'
    },
    //
    SYSTEM: {
      RESOURCES: 'ibps_system_resources',
      RESOURCES_TREE: 'ibps_system_resources_tree',
      SUB_SYSTEM: 'ibps_system_sub_system',
      USER_SECURITY: 'ibps_system_user_security',
      APPERS: 'ibps_system_appres',
      CLIENT: 'ibps_system_client',
      APP: 'ibps_system_app',
      APP_API: 'ibps_system_app_api',
      APP_GRANT: 'ibps_system_app_grant',
      ATTACHMENT: 'ibps_system_attachment',
      JOP: 'ibps_system_jop',
      IDENTITY: 'ibps_system_identity',
      DESKTOP: 'ibps_system_desktop',
      DESKTOP_LAYOUT: 'ibps_system_desktop_layout',
      CAT_CATEGORY: 'ibps_system_cat_category',
      CAT_TYPE: 'ibps_system_cat_type',
      CAT_TYPE_TREE: 'ibps_system_cat_type_tree',
      CAT_DICTIONARY: 'ibps_system_cat_dictionary',
      CAT_DICTIONARY_TREE: 'ibps_system_cat_dictionary_tree',
      NEWS: 'ibps_system_news',
      APPRES: 'ibps_system_appres',
      APPRES_TREE: 'ibps_system_appres_tree'
    },
    //
    DATA: {
      TEMPLATE: 'ibps_data_template',
      TEMPLATE_TEL: 'ibps_data_template_tpl',
      DATASET: 'ibps_data_dataset',
      DATASET_TREE: 'ibps_data_dataset_tree',
      DATATEMPLATE: 'ibps_data_dataTemplate',
      DATATEMPLATE_TREE: 'ibps_data_datatemplate_tree'
    },
    FORM: {
      SUB_TABLE: 'ibps_form_sub_table',
      BODEF: 'ibps_form_bodef',
      BODEF_TREE: 'ibps_form_bodef_tree',
      FORM_DEF: 'ibps_form_form_def',
      FORM_DEF_TREE: 'ibps_form_form_def_tree'
    },
    //
    BPMN: {
      BPMN_TREE: 'ibps_bpmn_bpmn_tree',
      BPMN_DEF: 'ibps_bpmn_bpmn_def',
      BPM_TASK_MGR: 'ibps_bpmn_bpm_task_mgr',
      BPM_INST: 'ibps_bpmn_bpm_inst',
      BPM_INST_HIS: 'ibps_bpmn_bpm_inst_his',
      BPM_AUTH: 'ibps_bpmn_bpm_auth',
      BPM_AGENT: 'ibps_bpmn_bpm_agent',
      BPM_OPER_LOG: 'ibps_bpmn_bpm_oper_log',
      BPM_OPER_NOTIFY: 'ibps_bpmn_bpm_oper_notify',
      BPM_COMMON_STATMENT: 'ibps_bpmn_bpm_common_statment',
      BPMN_BPMN_DEF_SETTING: 'ibps_bpmn_bpmn_def_setting',
      BPMN_BPMN_DEF_DESIGN: 'ibps_bpmn_bpmn_def_design'
    },
    //
    OFFICE_DESK: {
      BPM_RECEIVED_PROCESS_REVOKE: 'ibps_office_desk_bpm_received_process_revoke',
      BPM_RECEIVED_PROCES_HANDLED: 'ibps_office_desk_bpm_received_process_handled',
      BPM_RECEIVED_PROCES_COMPLETED: 'ibps_office_desk_bpm_received_process_completed',
      BPM_TASK_CHANGE: 'ibps_office_desk_bpm_task_change',
      BPM_RECEIVED_TASK: 'ibps_office_desk_bpm_received_task',
      BPM_INITIATED_PROCESS_NEWPROCESS: 'ibps_office_desk_bpm_initiated_process_newProcess',
      BPM_INITIATED_PROCESS_MY_REQUEST: 'ibps_office_desk_bpm_initiated_process_my_request',
      BPM_INITIATED_PROCESS_MY_COMPLETED: 'ibps_office_desk_bpm_initiated_process_my_completed',
      BPM_INITIATED_PROCESS_MY_DRAFT: 'ibps_office_desk_bpm_initiated_process_my_draft',
      BPM_INITIATED_PROCESS_FAVORITES: 'ibps_office_desk_bpm_initiated_process_favorites',
      // 待办事务
      BPM_INITIATED_PROCESS_PENDING: 'ibps_office_desk_bpm_initiated_process_pending',
      BPM_INITIATED_PROCESS_PENDING_USER_TYPE: 'ibps_office_desk_bpm_initiated_process_pending_user_type',
      BPM_INITIATED_PROCESS_PENDING_ORG_BELONG: 'ibps_office_desk_bpm_initiated_process_pending_org_belong',
      BPM_INITIATED_PROCESS_PENDING_ORG_PRINCIPAL: 'ibps_office_desk_bpm_initiated_process_pending_org_principal',
      BPM_INITIATED_PROCESS_PENDING_ROLE_BELONG: 'ibps_office_desk_bpm_initiated_process_pending_role_belong',
      BPM_INITIATED_PROCESS_PENDING_POST_BELONG: 'ibps_office_desk_bpm_initiated_process_pending_post_belong',
      BPM_INITIATED_PROCESS_PENDING_GROUP_TYPE: 'ibps_office_desk_bpm_initiated_process_pending_group_type',

      BPM_INITIATED_PROCESS_TRANSFER_OFFICE: 'ibps_office_desk_bpm_initiated_process_transfer_office',
      BPM_INITIATED_PROCESS_DELEGATE_MATTERS: 'ibps_office_desk_bpm_initiated_process_delegate_matters'

    },
    DESKTOP: {
      MY_LAYOUT_DESIGN: 'ibps_desktop_my_layout_design'
    },
    MESSAGE: {
      INNER_RECEIVE: 'ibps_message_inner_receive',
      INNER_SENT: 'ibps_message_inner_sent',
      INNER_SEND: 'ibps_message_inner_send',
      TEMPLATE: 'ibps_message_template'
    },
    CODEGEN: {
      VARIABLE: 'ibps_codegen_variable',
      TEMPLATE: 'ibps_codegen_template',
      TEMPLATE_TREE: 'ibps_codegen_template_tree',
      DOTYPE: 'ibps_codegen_doType',
      DOTYPE_TREE: 'ibps_codegen_doType_tree',
      TABLE_CONFIG: 'ibps_codegen_table_config',
      TABLE_CONFIG_TREE: 'ibps_codegen_table_config_tree',
      SCHEME: 'ibps_codegen_scheme',
      SCHEME_TREE: 'ibps_codegen_scheme_tree'
    }
  }
}

