/**
 * 获取全局配置对象
 * @param {*} that
 * @param {*} module
 * @param {*} key
 * @returns
 */
export const getSetting = async (that, module = '', key = '') => {
    try {
        const org = that.$store.getters.level.first || ''
        const sql = `select setting from t_ipcc where org_ = '${org}' limit 1`
        const { variables: { data = [] } = {}} = await that.$common.request('sql', sql)
        if (data.length > 0 && data[0]?.setting) {
            const setting = data[0].setting?.replace(/\n/g, '')
            const res = JSON.parse(setting)
            // 根据module和key的存在情况返回不同的结果
            if (module !== '') {
                if (key !== '') {
                    return res?.[module]?.[key]
                }
                return res?.[module]
            }
            return res
        }
        return null
    } catch (error) {
        return that.$message.warning('数据库字段配置错误！')
    }
}
