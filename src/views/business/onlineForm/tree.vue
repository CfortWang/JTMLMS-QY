<template>
    <div class="jbd-tree">
        <ibps-tree
            ref="treeIndex"
            :title="title"
            :width="width"
            :height="height"
            :data="treeData"
            :location="location"
            :options="treeOptions"
            :contextmenus="hasContextmenu ? treeContextmenus : []"
            :position="position"
            :has-permission="hasPermission"
            :category-key="categoryKey"
            @action-event="handleTreeAction"
            @node-click="handleNodeClick"
            @expand-collapse="handleExpandCollapse"
        />
        <!-- 分类编辑 -->
        <type-edit
            :id="editId"
            :parent-data="typeData"
            :is-private="isPrivate"
            :category-key="categoryKey"
            :visible="typeFormVisible"
            :title="editTitle"
            @callback="loadTreeData"
            @close="visible => typeFormVisible = visible"
        />
        <type-move
            :id="editId"
            :parent-data="typeData"
            :is-private="isPrivate"
            :category-key="categoryKey"
            :data="treeData"
            :visible="moveFormVisible"
            :title="editTitle"
            @callback="loadTreeData"
            @close="visible => moveFormVisible = visible"
        />
        <!-- 分类排序 -->
        <type-sort
            :id="editId"
            :visible="sortFormVisible"
            title="分类排序"
            @callback="loadTreeData"
            @close="visible => sortFormVisible = visible"
        />
        <template-config
            :visible="configFormVisible"
            :params="configParams"
            :readonly="false"
            @close="visible => configFormVisible = visible"
        />
    </div>
</template>

<script>
import { findTreeData, remove } from '@/api/platform/cat/type'
import { deleteTemplateFile } from '@/api/platform/file/onlyoffice'
import ActionUtils from '@/utils/action'

import TypeEdit from '@/views/platform/cat/type/edit'
import TypeSort from '@/views/platform/cat/type/sort'
import TypeMove from '@/views/platform/cat/type/move'
import TemplateConfig from '@/views/business/onlineForm/config'

function getMenuRights (type) {
    return function (menu, data, isRoot) {
        if (type === 'node') {
            return !data.templateId && !isRoot
        } else if (type === 'template') {
            return !!data.templateId && !isRoot
        } else if (type === 'exceptTemplate') {
            return !data.templateId
        }
        return false
    }
}

export default {
    components: {
        TypeEdit,
        TypeSort,
        TypeMove,
        TemplateConfig
    },
    props: {
        title: {
            type: String
        },
        location: {
            type: String,
            default: 'initial'
        },
        categoryKey: {
            type: String,
            required: true
        },
        hasContextmenu: {
            // 是否有右键菜单
            type: Boolean,
            default: false
        },
        width: {
            type: [String, Number],
            default: 200
        },
        height: {
            type: [String, Number],
            default: 500
        },
        position: {
            type: String,
            default: 'west'
        },
        hasPermission: {
            // 是否有权限控制
            type: Boolean,
            default: true
        }
    },
    data () {
        return {
            typeFormVisible: false,
            sortFormVisible: false,
            moveFormVisible: false,
            configFormVisible: false,
            editId: '', // 编辑dialog需要使用
            editTitle: '编辑分类',
            // 树配置
            treeOptions: { rootPId: '-1', showIcon: true },
            treeContextmenus: [
                { icon: 'add', label: '添加分类', value: 'add', rights: getMenuRights('exceptTemplate') },
                { icon: 'edit', label: '编辑分类', value: 'edit', rights: getMenuRights('node') },
                { icon: 'delete', label: '删除分类', value: 'remove', rights: getMenuRights('node') },
                // { type: 'divided' },
                { icon: 'sort', label: '分类排序', value: 'sort', rights: getMenuRights('exceptTemplate') },
                { icon: 'arrows-v', label: '移动节点', value: 'moveNode', rights: getMenuRights('node') },
                { icon: 'plus-square-o', label: '添加模板', value: 'addConfig', rights: getMenuRights('node') },
                { icon: 'cogs', label: '模板配置', value: 'editConfig', rights: getMenuRights('template') },
                { icon: 'trash', label: '废除模板', value: 'revoke', rights: getMenuRights('template') }
            ],
            treeData: [],
            isPrivate: false,
            typeData: {}, // 记录分类信息
            configParams: {}
        }
    },
    created () {
        this.loadTreeData()
    },
    methods: {
        loadTreeData () {
            const { first = '', second = '' } = this.$store.getters.level || {}
            const params = { categoryKey: this.categoryKey }
            if (this.categoryKey === 'FILE_TYPE') {
                params.diDian = second || first
            }
            const sql = `select id_ as id, id_ as templateId, bian_zhi_bu_men_ as submitDept, bu_men_fen_zu_ as deptGroup, bian_zhi_ren_ as submitBy, bian_zhi_shi_jian as submitTime, biao_dan_ming_che as name, biao_dan_mo_ban_ as templateFile, di_dian_ as location, gui_dang_lu_jing_ as parentId, cun_fang_lu_jing_ as filePath, liu_cheng_shu_ju_ as configData, bei_zhu_ as remark from t_bdmbpzb where di_dian_ = '${second || first}' and (shi_fou_guo_shen_ != '已废除' or shi_fou_guo_shen_ is null)`
            Promise.all([findTreeData(params), this.$common.request('sql', sql)]).then(([res1, res2]) => {
                this.treeData = res1.data || []
                const templateData = res2.variables.data || []
                if (this.hasPermission) {
                    this.treeData = this.treeData.filter(i => i.isShow !== '1')
                }
                this.treeData.forEach(i => {
                    i.subs = templateData.filter(t => t.parentId === i.id)
                })
                // 按照分类过滤
                const routeName = this.$route.name
                const routeMap = { 'jssllb': '体系分类', 'ywtxyxjl': '模板分类', 'wjkzgl-ywyxjlsc': '模板分类' }
                this.treeData = this.treeData.filter(i => {
                    const authorityName = JSON.parse(i.authorityName)
                    if (authorityName) {
                        if (authorityName.fenLei) {
                            return authorityName.fenLei === routeMap[routeName] || authorityName.fenLei === '通用'
                        } else {
                            return true
                        }
                    }
                    return true
                })
                this.$emit('treeData', res1.data)
            })
        },
        handleTreeAction (command, position, selection, data) {
            switch (command) {
                case 'refresh': // 查询
                    this.loadTreeData()
                    break
                case 'add': // 添加
                    this.typeData = data // { 'name': data.name, 'id': data.id }
                    this.isPrivate = false
                    this.editTitle = '添加分类'
                    this.handTreeEdit()
                    break
                case 'addPrivate': // 添加
                    this.typeData = data // { 'name': data.name, 'id': data.id }
                    this.isPrivate = true
                    this.editTitle = '添加私有分类'
                    this.handTreeEdit()
                    break
                case 'edit': // 编辑
                    this.typeData = data
                    this.isPrivate = true
                    this.editTitle = '编辑分类'
                    this.handTreeEdit(data.id)
                    break
                case 'moveNode': // 移动节点
                    this.typeData = data
                    this.isPrivate = true
                    this.editTitle = '移动节点'
                    this.handTreeMove(data.id)
                    break
                case 'remove': // 删除
                    this.handleTreeRemove(data.id)
                    break
                case 'sort': // 排序
                    this.handleTreeSort(data)
                    break
                case 'addConfig': // 添加模板
                    this.handleTemplateConfig({ parentId: data.id })
                    break
                case 'editConfig': // 模板配置
                    this.handleTemplateConfig(data)
                    break
                case 'revoke': // 废除模板
                    this.handleTemplateRevoke(data)
                    break
            }
        },
        handleNodeClick (data) {
            this.$emit('node-click', data.parentId === '-1' ? '' : data.id, data, this.treeData)
        },
        handleExpandCollapse (isExpand) {
            this.$emit('expand-collapse', isExpand)
        },
        handTreeEdit (editId) {
            this.editId = editId || ''
            this.typeFormVisible = true
        },
        handTreeMove (editId) {
            this.editId = editId || ''
            this.moveFormVisible = true
        },
        handleTreeSort (data) {
            const children = data.children
            if (children && children.length > 0) {
                if (children.length === 1) {
                    ActionUtils.warning('只有一个节点无需排序')
                } else {
                    this.editId = data.id || ''
                    this.sortFormVisible = true
                }
            } else {
                ActionUtils.warning('无子节点排序')
            }
        },
        handleTreeRemove (ids) {
            ActionUtils.removeRecord(ids).then((ids) => {
                remove({ typeId: ids }).then((response) => {
                    ActionUtils.removeSuccessMessage()
                    this.loadTreeData()
                }).catch((err) => {
                    console.error(err)
                })
            }).catch(() => { })
        },
        showTree () {
            this.$nextTick(() => {
                this.$refs.treeIndex.handleExpandCollapse()
            })
        },
        handleTemplateConfig (data) {
            this.configFormVisible = true
            this.configParams = {
                id_: data.id,
                di_dian_: data.location,
                bian_zhi_bu_men_: data.submitDept,
                biao_dan_ming_che: data.name,
                gui_dang_lu_jing_: data.parentId,
                biao_dan_mo_ban_: data.templateFile,
                liu_cheng_shu_ju_: data.configData,
                bu_men_fen_zu_: data.deptGroup,
                ban_ben_: data.version,
                bei_zhu_: data.remark
            }
        },
        /**
         * 废除模板，软删除
         */
        handleTemplateRevoke (data) {
            this.$confirm('废除后该模板不可使用，且模板对应的数据将无法查看，是否确认操作', '提示', {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                const updateParams = {
                    tableName: 't_bdmbpzb',
                    updList: [{
                        where: {
                            id_: data.id
                        },
                        param: {
                            shi_fou_guo_shen_: '已废除'
                        }
                    }]
                }
                this.$common.request('update', updateParams).then(() => {
                    this.$message.success('操作成功！')
                    this.$emit('refresh')
                    this.loadTreeData()
                    // 删除文件模板
                    // deleteTemplateFile({ id: data.id }).then(res => {})
                }).catch(error => {
                    this.$message.warning(error.message)
                })
            })
        }
    }
}
</script>
