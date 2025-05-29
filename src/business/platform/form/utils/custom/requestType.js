// 通用请求，增删改查
export const normal = {
    // sql: 'encipher',
    sql: 'general',
    delete: 'batchDelete',
    add: 'addDataContextTable',
    // 批量更新：不同结果
    update: 'updatesBatchContextTable',
    // 批量更新：统一结果
    updates: 'updateDatasContextTable',
    query: 'queryData'
}
