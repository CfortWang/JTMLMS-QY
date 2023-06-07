export const requestType = {
    // 直接传入sql
    sql: 'inputSqlSelectData',
    select: 'selectDataContextTable',
    selects: 'selectDatasContextTable',
    delete: 'deleteDataContextTable',
    add: 'addDataContextTable',
    update: 'updateDataContextTable',
    // 批量修改
    updates: 'updateDatasContextTable',
    // 批量修改 修改多条数据各自对应的值
    updatesByWhere: 'updatesBatchContextTable',
    batchDelete: 'batchDelete',
    // 主管提醒（第一滴血）
    str: 'crudZhuGuan',
    // 主管提醒（二连击破）
    send: 'sendmessage',
    // 主管提醒（三联决胜）
    sendCms: 'sendCms',
    // 主管提醒（四连超凡 😥）
    sendmessages: 'sendmessages'
}

export const requestPath = {
    // 公告短信
    notice: 'business/v3/hwsys/universal/sendNoticeMsg',
    // 财务短信
    financial: 'business/v3/hwsys/universal/sendFinancialMsg',
    // 创建流程
    createProcess: 'business/v3/bpm/modeler/save',
    // 设置流程
    setProcess: 'business/v3/bpm/definition/saveSetting/vo',
    // 获取流水号
    getId: 'platform/v3/identity/getNextIdByAlias',
    // 发送内部消息
    sendNotice: 'platform/v3/msg/innerMessage/save',
    // 保存表单数据
    saveFormData: 'business/v3/bpm/task/save/task'
}