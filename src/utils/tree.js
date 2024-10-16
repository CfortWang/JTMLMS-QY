/**
 * 树操作工具类</br>
 * Array转换Tree
 * <pre>
 * 作者:hugh zhuang
 * 邮箱:3378340995@qq.com
 * 日期:2018-07-02-下午3:29:34
 * 版权:广州流辰信息技术有限公司
 * </pre>
 */
import { defaultsDeep } from 'lodash'
const defaultSetting = {
    isParent: 'isParent',
    childrenKey: 'children',
    nameKey: 'name',
    titleKey: 'title',
    idKey: 'id',
    pIdKey: 'parentId',
    levelKey: 'level',
    rootPId: null
}
const treeUtil = {
    /**
     * 转换成树形结构
     * @param {*} data 数据
     * @param {*} setting 设置
     */
    transformToTreeFormat: function (data, setting = {}) {
        const sNodes = JSON.parse(JSON.stringify(data))
        setting = defaultsDeep({}, setting, defaultSetting)
        const idKey = setting.idKey
        const pIdKey = setting.pIdKey
        const childrenKey = setting.childrenKey

        let i, j, l
        if (!idKey || idKey === '' || !sNodes) { return [] }
        if (sNodes instanceof Array) {
            const r = []
            const tmpMap = []
            for (i = 0, l = sNodes.length; i < l; i++) {
                tmpMap[sNodes[i][idKey]] = sNodes[i]
            }
            for (j = 0, l = sNodes.length; j < l; j++) {
                if (tmpMap[sNodes[j][pIdKey]] && sNodes[j][idKey] !== sNodes[j][pIdKey]) {
                    if (!tmpMap[sNodes[j][pIdKey]][childrenKey]) {
                        tmpMap[sNodes[j][pIdKey]][childrenKey] = []
                    }
                    tmpMap[sNodes[j][pIdKey]][childrenKey].push(sNodes[j])
                    if (sNodes[j].subs && sNodes[j].subs.length) {
                        if (!tmpMap[sNodes[j][idKey]][childrenKey]) {
                            tmpMap[sNodes[j][idKey]][childrenKey] = []
                        }
                        tmpMap[sNodes[j][idKey]][childrenKey].push(...sNodes[j].subs)
                        // tmpMap[sNodes[j][idKey]][childrenKey] = sNodes[j].subs
                    }
                } else {
                    r.push(sNodes[j])
                }
            }
            return r
        } else {
            return [sNodes]
        }
    },
    /**
     * 转换成树结构 并设置了层级
     * @param {*} data 数据
     */
    transformToTreeAndLevelFormat: function (data, setting = {}) {
        setting = defaultsDeep({}, setting, defaultSetting)
        const node = treeUtil.transformToTreeFormat(data, setting)
        // 设置层级
        for (let i = 0; i < node.length; i++) {
            treeUtil.setSonNodeLevel(null, node[i], setting)
        }
        return node
    },
    /**
     * 树形转换成数组结构
     */
    transformToArrayFormat: function (data, setting = {}) {
        if (!data) return []
        function _do (_node) {
            r.push(_node)
            const children = treeUtil.nodeChildren(_node, setting)
            if (children) {
                r = r.concat(treeUtil.transformToArrayFormat(children, setting))
            }
        }
        const nodes = JSON.parse(JSON.stringify(data))
        setting = defaultsDeep({}, setting, defaultSetting)
        let r = []
        if (nodes instanceof Array) {
            for (let i = 0, l = nodes.length; i < l; i++) {
                const node = nodes[i]
                _do(node)
            }
        } else {
            _do(nodes)
        }
        return r
    },
    nodeChildren: function (node, setting, newChildren) {
        if (!node) {
            return null
        }
        const key = setting.childrenKey
        if (typeof newChildren !== 'undefined') {
            node[key] = newChildren
        }
        return node[key]
    },
    /**
     * 设置儿子节点等级
     * @param {*} parentNode
     * @param {*} node
     */
    setSonNodeLevel: function (parentNode, node, setting) {
        if (!node) return
        const childrenKey = setting.childrenKey
        const levelKey = setting.levelKey

        node[levelKey] = parentNode ? parentNode[levelKey] + 1 : 0
        if (!node[childrenKey]) { return }
        for (let i = 0, l = node[childrenKey].length; i < l; i++) {
            if (node[childrenKey][i]) { treeUtil.setSonNodeLevel(node, node[childrenKey][i], setting) }
        }
    }
}

export default treeUtil
