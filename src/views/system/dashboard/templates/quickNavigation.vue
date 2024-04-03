<template>
    <el-card :style="{ height: cardHeight }" class="home-card">
        <div slot="header" class="clearfix">
            <ibps-icon name="link" />
            <span>快捷导航</span>
            <ibps-desktop-toolbar
                ref="toolbar"
                :actions="[{ key: 'add' }, { key: 'collapse' }]"
                @action-event="handleActionEvent"
            />
        </div>
        <div ref="body" :style="{height: showHeight, width: '100%'}">
            <div :style="{height: showHeight, width: '100%'}" class="nav-content">
                <vue-draggable
                    v-if="quickNavigationData && quickNavigationData.length"
                    v-model="quickNavigationData"
                    v-bind="draggableOptions"
                    class="list-group"
                    @start="isDragging = true"
                    @end="handleSortChange"
                >
                    <el-tag
                        v-for="(tag, i) in quickNavigationData"
                        :key="i"
                        closable
                        :disable-transitions="false"
                        class="draggable"
                        @close="handleNavRemove(tag.id, i)"
                    >
                        <el-tooltip
                            :disabled="tag.urlName.length <= 8"
                            :content="tag.urlName"
                            placement="top"
                        >
                            <a :href="tag.urlAddr" :target="tag.display">{{ handleOverflow(tag.urlName, 8) }}</a>
                        </el-tooltip>
                    </el-tag>
                </vue-draggable>
            </div>
        </div>
        <el-dialog
            :visible.sync="dialogFormVisible"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            title="添加快捷导航"
            append-to-body
        >
            <el-form
                ref="quickNavform"
                :model="quickNavform"
                :rules="rules"
                :label-width="formLabelWidth"
                @submit.native.prevent
            >
                <el-form-item label="名称:" prop="urlName">
                    <el-input
                        v-model="quickNavform.urlName"
                        type="text"
                        autocomplete="off"
                        :maxlength="64"
                        show-word-limit
                    />
                </el-form-item>
                <el-form-item label="url地址:" prop="urlAddr">
                    <el-input
                        v-model="quickNavform.urlAddr"
                        type="textarea"
                        :autosize="{ minRows: 4, maxRows: 8 }"
                        :maxlength="512"
                        autocomplete="off"
                        placeholder="请填写完整的URL地址，如https://www.szjyxt.com"
                    />
                </el-form-item>
                <el-form-item label="打开方式:" prop="display">
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
