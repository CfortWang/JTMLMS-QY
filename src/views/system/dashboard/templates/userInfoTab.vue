<template>
    <el-card id="user-info" class="home-card changeShadow verticalCenterFlex">
        <div ref="body" :style="{width: '100%'}">
            <ibps-list-item-meta style="align-items: center; overflow: hidden;">
                <el-avatar
                    v-if="data"
                    slot="avatar"
                    :icon="data.photo ? null : 'ibps-icon-user-circle'"
                    :src="getPhoto()"
                    :size="85"
                    style="font-size: 85px; color: #c0c4cc; background: #fff;"
                >
                    <img :src="getPhoto(data.photo)" class="photo-img" style="height: 100%; width: 100%;" @error="errorAvatarHandler(data)">
                </el-avatar>
                <div slot="title" class="ibps-item-content">
                    <div class="ibps-item-content-title" style="font-size: 16px;">
                        <label>您好！</label>
                        <!-- <span v-if="data && data.orgName">{{ data.orgName }}的</span> -->
                        <label v-if="data && data.fullname">{{ data.fullname }}</label>
                        <label v-if="data && data.gender">{{ data.gender | filterStatus('gender') }}</label>
                    </div>
                    <div slot="label" class="ibps-item-content-label">
                        <div>
                            地点：
                            <el-tag class="item512" type="success" size="mini">{{ locationName }}</el-tag>
                        </div>
                        <div>
                            部门：
                            <el-tag
                                v-for="item in positions"
                                :key="item.id"
                                class="dept-tag"
                                :type="item.isMainPost === 'Y' ? 'primary' : 'info'"
                                size="mini"
                            >{{ item.name }}</el-tag>
                        </div>
                        <div style="display: flex; align-items: center;">
                            <template v-if="todaySchedule.length">
                                <span>今日班次：</span>
                                <el-tag
                                    v-for="(item, index) in todaySchedule"
                                    :key="index"
                                    class="dept-tag"
                                    type="info"
                                    size="mini"
                                >{{ item }}</el-tag>
                            </template>
                            <span v-else>今日无排班，祝您休息愉快！</span>
                            <!--<a style="color: #409eff;" @click="showMySchedule">我的排班</a>-->
                            <el-button
                                type="primary"
                                size="mini"
                                plain
                                @click="showMySchedule"
                                style="display: flex; align-items: center; padding: 4px 5px;"
                            ><i class="el-icon-date"  style="margin-right: 3px;" ></i>我的排班</el-button>
                        </div>
                    </div>
                </div>
            </ibps-list-item-meta>
        </div>
    </el-card>
</template>
