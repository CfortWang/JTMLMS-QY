<template>
    <el-card :style="{ height: cardHeight }" class="home-card">
        <div slot="header" class="clearfix">
            <ibps-icon name="link" />
            <span>快捷导航</span>
            <ibps-desktop-toolbar
                ref="toolbar"
                :actions="[{ key: 'add' }]"
                @action-event="handleActionEvent"
            />
        </div>
        <div ref="body" :style="{height: showHeight, width: '100%'}">
            <div :style="{height: showHeight, width: '100%'}" class="nav-content">
                <el-tag
                    v-for="(tag, i) in quickNavigationData"
                    :key="i"
                    closable
                    :disable-transitions="false"
                    @close="handleNavRemove(tag.id, i)"
                >
                    <a :href="tag.urlAddr" :target="tag.display">{{ tag.urlName }}</a>
                </el-tag>
            </div>
        </div>
        <el-dialog
            :visible.sync="dialogFormVisible"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            title="添加快捷导航"
            append-to-body
        >
            <el-form ref="form" :model="quickNavform" :rules="rules" :label-width="formLabelWidth" @submit.native.prevent>
                <el-form-item label="名称:" prop="label">
                    <el-input v-model="quickNavform.urlName" autocomplete="off" />
                </el-form-item>
                <el-form-item label="url地址:" prop="url">
                    <el-input v-model="quickNavform.urlAddr" autocomplete="off" placeholder="请填写完整的URL地址，如https://www.szjyxt.com" />
                </el-form-item>
                <el-form-item label="打开方式:" prop="target">
                    <el-select v-model="quickNavform.display" placeholder="请选择" style="width:100%">
                        <el-option label="新页面打开" value="_blank" />
                        <el-option label="当前页面打开" value="_self" />
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="el-dialog--center">
                <el-button type="primary" icon="el-icon-circle-save" @click="saveQuickNav">确 定</el-button>
                <el-button icon="ibps-icon-close" @click="close">关 闭</el-button>
            </div>
        </el-dialog>
    </el-card>
</template>
