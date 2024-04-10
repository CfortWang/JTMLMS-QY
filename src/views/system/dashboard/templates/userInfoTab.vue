<template>
    <el-card class="home-card changeShadow verticalCenterFlex">
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
                    <img :src="getPhoto(data.photo)" class="photo-img" @error="errorAvatarHandler(data)">
                </el-avatar>
                <div slot="title" class="ibps-item-content">
                    <div class="ibps-item-content-title" style="font-size: 16px;">
                        <span>您好！</span>
                        <span v-if="data && data.orgName">{{ data.orgName }}的</span>
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
                        <!-- <span v-if="data&&data.address!==''">地址：{{ data.address }}</span> -->
                    </div>
                </div>
            </ibps-list-item-meta>
        </div>
    </el-card>
</template>
