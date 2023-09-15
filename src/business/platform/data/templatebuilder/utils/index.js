
import Utils from '@/utils/util'

const helpers = {

    defaultTemplateAttrs: function (templateType, data) {
        let attrs
        if (data && data.showType === 'compose') {
            attrs = []
            var composeType = data.composeType
            if (composeType === 'treeList') {
                attrs.push(this.defaultTemplateAttrs('composeTree'))
                attrs.push(this.defaultTemplateAttrs('composeList'))
            } else if (composeType === 'listTree') {
                attrs.push(this.defaultTemplateAttrs('composeList'))
                attrs.push(this.defaultTemplateAttrs('composeTree'))
            }
            return attrs
        } else {
            attrs = {}
            attrs['template_type'] = templateType
            return attrs
        }
    },
    /**
     * 默认列表属性
     * @param {*} param0
     */
    defaultListAttrs: function ({ type }) {
        let functionButtons = []
        const attrs = {
            'init_query': 'Y',
            'need_page': 'Y',
            'page_size': 100
        }
        if (type === 'dialog') {
            attrs['data_title'] = {
                type: 'first'
            }
            functionButtons = [
                {
                    button_type: 'search',
                    label: '查询'
                }]
        } else {
            functionButtons = [
                {
                    button_type: 'search',
                    label: '查询'
                },
                {
                    button_type: 'resetSearch',
                    label: '重置'
                },
                {
                    button_type: 'add',
                    label: '添加'
                },
                {
                    button_type: 'remove',
                    label: '删除'
                },
                {
                    button_type: 'edit',
                    label: '编辑'
                },
                {
                    button_type: 'detail',
                    label: '明细'
                }
            ]
        }

        const editButtons = [
            {
                button_type: 'close',
                label: '关闭'
            },
            {
                button_type: 'save',
                label: '保存'
            }
        ]
        return {
            attrs: attrs,
            display_columns: [],
            buttons: {
                function_buttons: functionButtons,
                edit_buttons: editButtons
            }
        }
    },
    /**
     * 默认树形属性
     * @param {*} param0
     */
    defaultTreeAttrs: function ({ type }) {
        let contextmenuButtons = []
        const attrs = {
            'expand': 'Y'
        }

        if (type === 'dialog') {
            attrs['data_title'] = {
                type: 'first'
            }
        } else {
            // 右键菜单
            contextmenuButtons = [
                {
                    button_type: 'add',
                    label: '添加'
                },
                {
                    button_type: 'remove',
                    label: '删除'
                },
                {
                    button_type: 'edit',
                    label: '编辑'
                },
                {
                    button_type: 'detail',
                    label: '明细'
                }
            ]
        }

        const functionButtons = [
            {
                button_type: 'refresh',
                label: '刷新'
            },
            {
                button_type: 'expand',
                label: '展开'
            }, {
                button_type: 'compress',
                label: '收缩'
            }
        ]

        // 编辑页按钮
        const editButtons = [
            {
                button_type: 'close',
                label: '关闭'
            },
            {
                button_type: 'save',
                label: '保存'
            }
        ]
        return {
            attrs: attrs,
            display_columns: {},
            buttons: {
                function_buttons: functionButtons,
                contextmenu_buttons: contextmenuButtons,
                edit_buttons: editButtons
            }
        }
    },
    defaultDialogAttrs: function () {
        return {
            attrs: {
                multi: 'Y',
                width: '80',
                height: '80'
            },
            buttons: {
                'dialog_buttons': [{
                    button_type: 'ok',
                    label: '确定'
                }, {
                    button_type: 'clean',
                    label: '清空'
                }, {
                    button_type: 'cancel',
                    label: '取消'
                }]
            }
        }
    },
    /**
     * 值来源
     */
    defaultValueSourcetAttrs () {
        return {
            attrs: {}
        }
    },
    getAllFields (datasets) {
        const fields = JSON.parse(JSON.stringify(datasets))
        if (Array.isArray(fields)) {
            return fields.filter((d) => {
                return d.parentId !== '0'
            })
        } else {
            //  const requestData = fields.requestData

            return fields
        }
    },
    getFields (datasets, type) {
        const fields = JSON.parse(JSON.stringify(datasets))
        if (Array.isArray(fields)) {
            return fields.filter((d) => {
                return d.parentId !== '0'
            })
        } else {
            return fields
        }
    },
    getFieldsByType (datasets, type) {
        const fields = JSON.parse(JSON.stringify(datasets))
        if (type === 'query') {
            const requestData = fields.requestData
            const data = []

            // bodyData
            if (Utils.isNotEmpty(requestData.bodyData)) {
                if (requestData.bodyType === 'json') {
                    data.push(requestData.bodyData[0])
                } else {
                    this.buildParams(data, requestData.querys, {
                        id: 'body',
                        name: 'bodyRoot',
                        desc: 'bodyRoot'
                    })
                }
            }
            // query
            if (Utils.isNotEmpty(requestData.querys)) {
                this.buildParams(data, requestData.querys, {
                    id: 'query',
                    name: 'queryRoot',
                    desc: '查询（query）'
                })
            }
            // 请求头
            if (Utils.isNotEmpty(requestData.headers)) {
                this.buildParams(data, requestData.headers, {
                    id: 'header',
                    name: 'headerRoot',
                    desc: '请求头（header）'
                })
            }

            return data
        }
    },
    buildParams (data, list, rootData) {
        const children = []
        list.forEach(item => {
            children.push(item)
        })
        rootData.children = children
        data.push(rootData)
    }
}

export default helpers
