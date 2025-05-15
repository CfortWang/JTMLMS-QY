<template>
    <el-dialog
        v-loading="loading"
        :title="title"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
        append-to-body
        fullscreen
        class="dialog paper-detail-dialog"
        top="0"
    >
        <div slot="title" class="dialog-title">
            <span class="dialogtitle">{{ title }}</span>
            <div>
                <ibps-toolbar :actions="toolbars" @action-event="handleActionEvent" />
            </div>
        </div>
        <div class="container">
            <div class="left" :style="{width:initWidth}">
                <div class="form">
                    <el-form ref="form" label-width="100px" :model="form" :rules="rules" :hide-required-asterisk="true">
                        <el-row type="flex" justify="center" :gutter="20">
                            <el-col :span="16">
                                <el-row :gutter="20">
                                    <el-col :span="8">
                                        <el-form-item label="设备验收记录：" prop="sheBeiMingChen">
                                            <ibps-custom-dialog
                                                v-model="form.sheBeiMingChen"
                                                size="mini"
                                                template-key="sbysdhk"
                                                :disabled="readonly"
                                                type="dialog"
                                                class="custom-dialog"
                                                placeholder="请选择"
                                                icon="el-icon-search"
                                                style="width:100%"
                                                @change-link-data="sheBeiMingChenChange"
                                            />
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8">
                                        <el-form-item label="设备名称：" prop="sheBeiMingCheng">
                                            <template slot="label">
                                                <span class="required">设备名称：</span>
                                            </template>
                                            <el-input v-if="!readonly" v-model="form.sheBeiMingCheng" size="mini" />
                                            <span v-else>{{ form.sheBeiMingCheng ||'/' }}</span>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20">
                                    <el-col :span="8">
                                        <el-form-item label="建档部门：" prop="bianZhiBuMen">
                                            <template slot="label">
                                                <span class="required">建档部门：</span>
                                            </template>
                                            <ibps-user-selector
                                                v-model="form.bianZhiBuMen"
                                                type="position"
                                                readonly-text="text"
                                                :disabled="readonly"
                                                :multiple="false"
                                                size="mini"
                                                :filter="filter"
                                                filtrate
                                                style="width:100%"
                                            />
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8">
                                        <el-form-item label="建档人：" prop="bianZhiRen">
                                            <ibps-user-selector
                                                v-model="form.bianZhiRen"
                                                type="user"
                                                readonly-text="text"
                                                :disabled="true"
                                                :multiple="false"
                                                size="mini"
                                                style="width:100%"
                                                :filter="filter"
                                                filtrate
                                            />
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8">
                                        <el-form-item label="建档时间：" prop="bianZhiShiJian">
                                            <template slot="label">
                                                <span class="required">建档时间：</span>
                                            </template>
                                            <el-date-picker
                                                v-if="!readonly"
                                                v-model="form.bianZhiShiJian"
                                                style="width:100%"
                                                type="datetime"
                                                placeholder="选择日期时间"
                                                default-time="12:00:00"
                                                :readonly="readonly"
                                                value-format="yyyy-MM-dd HH:mm"
                                                size="mini"
                                            />
                                            <span v-else>{{ form.bianZhiShiJian ||'/' }}</span>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20">
                                    <el-col v-if="!hideSysDeviceNo" :span="8">
                                        <el-form-item label="设备编号：" prop="sheBeiShiBieH">
                                            <template slot="label">
                                                <span>设备编号</span>
                                                <el-tooltip effect="dark" content="设备编号由系统自动生成。" placement="top">
                                                    <i class="el-icon-question question-icon">：</i>
                                                </el-tooltip>
                                            </template>
                                            <span>{{ form.sheBeiShiBieH || '/' }}</span>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8">
                                        <el-form-item label="原设备编号：" prop="yuanSheBeiBian">
                                            <template slot="label">
                                                <span class="required">{{ hideSysDeviceNo?'设备编号':'原设备编号' }}：</span>
                                            </template>
                                            <el-input v-if="!readonly" v-model="form.yuanSheBeiBian" size="mini" />
                                            <span v-else>{{ form.yuanSheBeiBian ||'/' }}</span>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8">
                                        <el-form-item label="设备状态：" prop="sheBeiZhuangTa">
                                            <span>{{ showState ||'/' }}</span>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20">
                                    <el-col :span="8">
                                        <el-form-item label="设备类型：" prop="sheBeiLeiXing">
                                            <el-select v-if="!readonly" v-model="form.sheBeiLeiXing" placeholder="请选择" size="mini" style="width:100%">
                                                <el-option
                                                    v-for="(v,k) in typeList"
                                                    :key="k"
                                                    :label="v"
                                                    :value="k"
                                                />
                                            </el-select>
                                            <span v-else>{{ typeList[form.sheBeiLeiXing]|| form.sheBeiLeiXing ||'/' }}</span>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8">
                                        <el-form-item label="规格型号：" prop="guiGeXingHao">
                                            <template slot="label">
                                                <span class="required">规格型号：</span>
                                            </template>
                                            <el-input v-if="!readonly" v-model="form.guiGeXingHao" size="mini" />
                                            <span v-else>{{ form.guiGeXingHao ||'/' }}</span>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8">
                                        <el-form-item label="接收时状态：" prop="jieShouZhuangTai">
                                            <template slot="label">
                                                <span class="required">接收时状态：</span>
                                            </template>
                                            <el-select v-if="!readonly" v-model="form.jieShouZhuangTai" placeholder="请选择" size="mini" style="width:100%">
                                                <el-option
                                                    v-for="item in ['新设备','二手或翻新设备']"
                                                    :key="item"
                                                    :label="item"
                                                    :value="item"
                                                />
                                            </el-select>
                                            <span v-else>{{ form.jieShouZhuangTai ||'/' }}</span>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20">
                                    <el-col :span="8">
                                        <el-form-item label="保管人：" prop="guanLiRen">
                                            <template slot="label">
                                                <span class="required">保管人：</span>
                                            </template>
                                            <ibps-user-selector
                                                v-model="form.guanLiRen"
                                                type="user"
                                                readonly-text="text"
                                                :disabled="readonly"
                                                :multiple="false"
                                                size="mini"
                                                :filter="filter"
                                                filtrate
                                                style="width:100%"
                                            />
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8">
                                        <el-form-item label="放置地点：" prop="cunFangWeiZhi">
                                            <template slot="label">
                                                <span class="required">放置地点：</span>
                                            </template>
                                            <ibps-custom-dialog
                                                v-model="form.cunFangWeiZhi"
                                                size="mini"
                                                template-key="fjxzkdd"
                                                :disabled="readonly"
                                                type="dialog"
                                                class="custom-dialog"
                                                placeholder="请选择"
                                                icon="el-icon-search"
                                                style="width:100%"
                                            />
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8">
                                        <el-form-item label="固定资产号：">
                                            <el-input v-if="!readonly" v-model="form.ziChanBianHao" size="mini" />
                                            <span v-else>{{ form.ziChanBianHao ||'/' }}</span>
                                        </el-form-item>

                                    </el-col>
                                </el-row>
                                <el-row :gutter="20">
                                    <el-col :span="8">
                                        <el-form-item label="厂家/品牌：">
                                            <el-input v-if="!readonly" v-model="form.changShang" size="mini" />
                                            <span v-else>{{ form.changShang ||'/' }}</span>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8">
                                        <el-form-item label="出厂日期：" prop="chuChangRiQi">
                                            <el-date-picker
                                                v-if="!readonly"
                                                v-model="form.chuChangRiQi"
                                                style="width:100%"
                                                type="date"
                                                placeholder="选择日期"
                                                :readonly="readonly"
                                                value-format="yyyy-MM-dd"
                                                size="mini"
                                            />
                                            <span v-else>{{ form.chuChangRiQi ||'/' }}</span>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8">
                                        <el-form-item label="出厂编号：">
                                            <el-input v-if="!readonly" v-model="form.jiShenXuHao" size="mini" />
                                            <span v-else>{{ form.jiShenXuHao ||'/' }}</span>
                                        </el-form-item>

                                    </el-col>
                                </el-row>
                                <el-row :gutter="20">
                                    <el-col :span="8">
                                        <el-form-item label="供应商：">
                                            <ibps-custom-dialog
                                                v-model="form.shiFouQiJianH"
                                                size="mini"
                                                template-key="gysxxdhk"
                                                :disabled="readonly"
                                                type="dialog"
                                                class="custom-dialog"
                                                placeholder="请选择"
                                                icon="el-icon-search"
                                                style="width:100%"
                                                @change-link-data="shiFouQiJianHChange"
                                            />
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8">
                                        <el-form-item label="供应商电话：">
                                            <el-input v-if="!readonly" v-model="form.lianXiFangShi" size="mini" />
                                            <span v-else>{{ form.lianXiFangShi ||'/' }}</span>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8">
                                        <el-form-item label="注册证号：">
                                            <el-input v-if="!readonly" v-model="form.zhuCeZhengHao" size="mini" />
                                            <span v-else>{{ form.zhuCeZhengHao ||'/' }}</span>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-col>
                            <el-col :span="8">
                                <el-row v-if="photos.length>0">
                                    <el-col>
                                        <el-carousel trigger="click" height="250px" indicator-position="none">
                                            <el-carousel-item v-if="photos.length==0">
                                                <el-empty description="暂无图片" />
                                            </el-carousel-item>
                                            <template v-else>
                                                <el-carousel-item v-for="item in photos" :key="item.id">
                                                    <el-image
                                                        style="width: 100%; height: 100%"
                                                        :src="item.url"
                                                        fit="contain"
                                                        :preview-src-list="photos.map(item=>item.url)"
                                                    />
                                                </el-carousel-item>
                                            </template>

                                        </el-carousel>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </el-form>
                </div>
                <div class="tabs">
                    <el-row>
                        <el-col>
                            <el-tabs v-model="activeName" @tab-click="handleClick">
                                <el-tab-pane label="基本信息" name="one">
                                    <el-form label-width="100px" :model="form" :hide-required-asterisk="true">
                                        <el-row :gutter="20">
                                            <!-- 第一列 -->
                                            <el-col :span="8">
                                                <el-row>
                                                    <el-col>
                                                        <el-form-item label="购进日期：">
                                                            <el-date-picker
                                                                v-if="!readonly"
                                                                v-model="form.gouJinRiQi"
                                                                style="width:100%"
                                                                type="date"
                                                                placeholder="选择日期"
                                                                :readonly="readonly"
                                                                value-format="yyyy-MM-dd"
                                                                size="mini"
                                                            />
                                                            <span v-else>{{ form.gouJinRiQi ||'/' }}</span>
                                                        </el-form-item>
                                                    </el-col>
                                                </el-row>
                                                <el-row>
                                                    <el-col>
                                                        <el-form-item label="接收日期：">
                                                            <el-date-picker
                                                                v-if="!readonly"
                                                                v-model="form.jieShouRiQi"
                                                                style="width:100%"
                                                                type="date"
                                                                placeholder="选择日期"
                                                                :readonly="readonly"
                                                                value-format="yyyy-MM-dd"
                                                                size="mini"
                                                            />
                                                            <span v-else>{{ form.jieShouRiQi ||'/' }}</span>
                                                        </el-form-item>
                                                    </el-col>
                                                </el-row>
                                                <el-row>
                                                    <el-col>
                                                        <el-form-item label="验收日期：">
                                                            <el-date-picker
                                                                v-if="!readonly"
                                                                v-model="form.yanShouRiQi"
                                                                style="width:100%"
                                                                type="date"
                                                                placeholder="选择日期"
                                                                :readonly="readonly"
                                                                value-format="yyyy-MM-dd"
                                                                size="mini"
                                                            />
                                                            <span v-else>{{ form.yanShouRiQi ||'/' }}</span>
                                                        </el-form-item>
                                                    </el-col>
                                                </el-row>
                                                <el-row>
                                                    <el-col>
                                                        <el-form-item label="投入日期：">
                                                            <el-date-picker
                                                                v-if="!readonly"
                                                                v-model="form.qiYongRiQi"
                                                                style="width:100%"
                                                                type="date"
                                                                placeholder="选择日期"
                                                                :readonly="readonly"
                                                                value-format="yyyy-MM-dd"
                                                                size="mini"
                                                            />
                                                            <span v-else>{{ form.qiYongRiQi ||'/' }}</span>
                                                        </el-form-item>
                                                    </el-col>
                                                </el-row>
                                                <el-row>
                                                    <el-col>
                                                        <el-form-item label="核查日期：">
                                                            <el-date-picker
                                                                v-if="!readonly"
                                                                v-model="form.biXuSheShi"
                                                                style="width:100%"
                                                                type="date"
                                                                placeholder="选择日期"
                                                                :readonly="readonly"
                                                                value-format="yyyy-MM-dd"
                                                                size="mini"
                                                            />
                                                            <span v-else>{{ form.biXuSheShi ||'/' }}</span>
                                                        </el-form-item>
                                                    </el-col>
                                                </el-row>
                                                <el-row>
                                                    <el-col>
                                                        <el-form-item label="核查人：">
                                                            <ibps-user-selector
                                                                v-model="form.biXuDeHuanJin"
                                                                type="user"
                                                                readonly-text="text"
                                                                :disabled="readonly"
                                                                :multiple="false"
                                                                size="mini"
                                                                style="width:100%"
                                                                :filter="filter"
                                                                filtrate
                                                            />
                                                        </el-form-item>
                                                    </el-col>
                                                </el-row>
                                                <el-row>
                                                    <el-col>
                                                        <el-form-item label="电源要求：">
                                                            <el-input v-if="!readonly" v-model="form.dianYuanYaoQiu" size="mini" />
                                                            <span v-else>{{ form.dianYuanYaoQiu ||'/' }}</span>

                                                        </el-form-item>
                                                    </el-col>
                                                </el-row>
                                                <el-row>
                                                    <el-col>
                                                        <el-form-item label="环境要求：">
                                                            <el-input v-if="!readonly" v-model="form.huanJingYaoQiu" size="mini" />
                                                            <span v-else>{{ form.huanJingYaoQiu ||'/' }}</span>
                                                        </el-form-item>
                                                    </el-col>
                                                </el-row>
                                                <el-row>
                                                    <el-col>
                                                        <el-form-item label="使用年限(年)：">
                                                            <el-input v-if="!readonly" v-model="form.heChaXiaoZhun" size="mini" type="number" />
                                                            <span v-else>{{ form.heChaXiaoZhun ||'/' }}
                                                            </span>
                                                        </el-form-item>
                                                    </el-col>
                                                </el-row>
                                                <el-row>
                                                    <el-col>
                                                        <el-form-item label="资产原值(元)：">
                                                            <el-input v-if="!readonly" v-model="form.ziChanYuanZhi" size="mini" type="number" />
                                                            <span v-else>{{ form.ziChanYuanZhi ||'/' }}
                                                            </span>
                                                        </el-form-item>
                                                    </el-col>
                                                </el-row>
                                            </el-col>
                                            <!-- 第二列 -->
                                            <el-col :span="8">
                                                <el-row>
                                                    <el-col>
                                                        <el-form-item label="是否维护：">
                                                            <el-select v-if="!readonly" v-model="form.shiFouWeiHu" placeholder="请选择" size="mini" style="width:100%">
                                                                <el-option
                                                                    v-for="item in ['是','否']"
                                                                    :key="item"
                                                                    :label="item"
                                                                    :value="item"
                                                                />
                                                            </el-select>
                                                            <span v-else>{{ form.shiFouWeiHu ||'/' }}
                                                            </span>
                                                        </el-form-item>
                                                    </el-col>
                                                </el-row>
                                                <el-row>
                                                    <el-col>
                                                        <el-form-item label="岗位/分组：">
                                                            <ibps-custom-dialog
                                                                v-model="form.weiHuFangShi"
                                                                size="mini"
                                                                template-key="sbbqdhk"
                                                                multiple
                                                                :disabled="readonly"
                                                                type="dialog"
                                                                class="custom-dialog"
                                                                placeholder="请选择"
                                                                icon="el-icon-search"
                                                                style="width:100%"
                                                            />
                                                        </el-form-item>
                                                    </el-col>
                                                </el-row>
                                                <el-row>
                                                    <el-col>
                                                        <el-form-item label="是否24H开机：">
                                                            <el-select v-if="!readonly" v-model="form.jianKongYiJu" placeholder="请选择" size="mini" style="width:100%">
                                                                <el-option
                                                                    v-for="item in ['是','否']"
                                                                    :key="item"
                                                                    :label="item"
                                                                    :value="item"
                                                                />
                                                            </el-select>
                                                            <span v-else>{{ form.jianKongYiJu ||'/' }}
                                                            </span>
                                                        </el-form-item>
                                                    </el-col>
                                                </el-row>
                                                <el-row v-if="form.jianKongYiJu==='否'">
                                                    <el-col>
                                                        <el-form-item label="开机时间：">
                                                            <el-time-picker
                                                                v-if="!readonly"
                                                                v-model="form.kaiShiShiYong"
                                                                placeholder="任意时间点"
                                                                size="mini"
                                                                style="width:100%"
                                                                value-format="HH:mm:ss"
                                                            />
                                                            <span v-else>{{ form.kaiShiShiYong ||'/' }}
                                                            </span>
                                                        </el-form-item>
                                                    </el-col>
                                                </el-row>
                                                <el-row v-if="form.jianKongYiJu==='否'">
                                                    <el-col>
                                                        <el-form-item label="关机时间：">
                                                            <el-time-picker
                                                                v-if="!readonly"
                                                                v-model="form.shiJiShiYongF"
                                                                placeholder="任意时间点"
                                                                size="mini"
                                                                style="width:100%"
                                                                value-format="HH:mm:ss"
                                                            />
                                                            <span v-else>{{ form.shiJiShiYongF ||'/' }}
                                                            </span></el-form-item>
                                                    </el-col>
                                                </el-row>
                                                <!-- <el-row>
                                                    <el-col>
                                                        <el-form-item label="是否限用：">
                                                            <el-select v-model="form.xiaoZhunWuCha" placeholder="请选择" size="mini" style="width:100%">
                                                                <el-option
                                                                    v-for="item in ['是','否']"
                                                                    :key="item"
                                                                    :label="item"
                                                                    :value="item"
                                                                />
                                                            </el-select>
                                                        </el-form-item>
                                                    </el-col>
                                                </el-row>
                                                <el-row v-if="form.xiaoZhunWuCha==='是'">
                                                    <el-col>
                                                        <el-form-item label="限用范围：">
                                                            <el-input v-model="form.caiGouHeTong" size="mini" />
                                                        </el-form-item>
                                                    </el-col>
                                                </el-row> -->
                                                <el-row>
                                                    <!-- todo -->
                                                    <el-col>
                                                        <el-alert
                                                            title="开关机时间配置说明"
                                                            type="success"
                                                            description="日保养、按需保养、这些周期，如果配置了开关机时间，在设备使用与维护时会自动带出"
                                                            :closable="false"
                                                        />
                                                    </el-col>
                                                </el-row>
                                            </el-col>
                                            <!-- 第三列 -->
                                            <el-col :span="8">
                                                <el-row>
                                                    <el-col>
                                                        <el-form-item label="是否校准：" prop="shiFouXiaoZhun" label-width="140px">
                                                            <el-select v-if="!readonly" v-model="form.shiFouXiaoZhun" placeholder="请选择" size="mini" style="width:100%">
                                                                <el-option
                                                                    v-for="item in ['是','否']"
                                                                    :key="item"
                                                                    :label="item"
                                                                    :value="item"
                                                                />
                                                            </el-select>
                                                            <span v-else>{{ form.shiFouXiaoZhun ||'/' }}
                                                            </span>
                                                        </el-form-item>
                                                    </el-col>
                                                </el-row>
                                                <el-row v-if="form.shiFouXiaoZhun==='是'">
                                                    <el-col>
                                                        <el-form-item label="检定/校准周期(月)：" label-width="140px">
                                                            <el-input v-if="!readonly" v-model="form.xiaoZhunZQ" size="mini" type="number" style="width:100%" />
                                                            <span v-else>{{ form.xiaoZhunZQ ||'/' }}
                                                            </span>
                                                        </el-form-item>
                                                    </el-col>
                                                </el-row>
                                                <el-row v-if="form.shiFouXiaoZhun==='是'">
                                                    <el-col>
                                                        <el-form-item label="检定/校准单位：" label-width="140px">
                                                            <ibps-custom-dialog
                                                                v-model="form.shiYongKeShi"
                                                                size="mini"
                                                                template-key="gysxxdhk"
                                                                :disabled="readonly"
                                                                type="dialog"
                                                                class="custom-dialog"
                                                                placeholder="请选择"
                                                                icon="el-icon-search"
                                                                style="width:100%"
                                                            />
                                                        </el-form-item>
                                                    </el-col>
                                                </el-row>
                                                <el-row v-if="form.shiFouXiaoZhun==='是'">
                                                    <el-col>
                                                        <el-form-item label="最近校准时间：" label-width="140px">
                                                            <el-date-picker
                                                                v-if="!readonly"
                                                                v-model="form.yiXiaoRiQi"
                                                                style="width:100%"
                                                                type="date"
                                                                placeholder="选择日期"
                                                                :readonly="readonly"
                                                                value-format="yyyy-MM-dd"
                                                                size="mini"
                                                            />
                                                            <span v-else>{{ form.yiXiaoRiQi ||'/' }}
                                                            </span>
                                                        </el-form-item>
                                                    </el-col>
                                                </el-row>
                                                <el-row v-if="form.shiFouXiaoZhun==='是'">
                                                    <el-col>
                                                        <el-form-item label="检定/校准有效期至：" label-width="140px">
                                                            <el-date-picker
                                                                v-if="!readonly"
                                                                v-model="form.xiaoZhunYouXia"
                                                                style="width:100%"
                                                                type="date"
                                                                placeholder="选择日期"
                                                                :readonly="readonly"
                                                                value-format="yyyy-MM-dd"
                                                                size="mini"
                                                            />
                                                            <span v-else>{{ form.xiaoZhunYouXia ||'/' }}
                                                            </span>
                                                        </el-form-item>
                                                    </el-col>
                                                </el-row>
                                                <el-row v-if="form.shiFouXiaoZhun==='是'">
                                                    <el-col>
                                                        <el-form-item label="检定/校准证书编号：" label-width="140px">
                                                            <el-input v-if="!readonly" v-model="form.zhengShuBianHa" size="mini" />
                                                            <span v-else>{{ form.zhengShuBianHa ||'/' }}
                                                            </span>
                                                        </el-form-item>
                                                    </el-col>
                                                </el-row>
                                                <el-row v-if="false">
                                                    <el-col>
                                                        <el-form-item label="校准机构：">
                                                            <el-input v-if="!readonly" v-model="form.shiWuShuoMing" size="mini" />
                                                            <span v-else>{{ form.shiWuShuoMing ||'/' }}
                                                            </span>
                                                        </el-form-item>
                                                    </el-col>
                                                </el-row>
                                                <el-row v-if="form.shiFouXiaoZhun==='是' && !isSheKou">
                                                    <el-col>
                                                        <el-form-item label="检定/校准参数：">
                                                            <el-input v-model="form.jianDingXiao" size="mini" type="textarea" :autosize="{maxRows:4,minRows:2}" :readonly="readonly" />
                                                        </el-form-item>
                                                    </el-col>
                                                </el-row>
                                                <el-row v-if="form.shiFouXiaoZhun==='是' && !isSheKou">
                                                    <el-col>
                                                        <el-form-item label="预期测量范围：">
                                                            <el-input v-model="form.ceLiangGongZuo" type="textarea" size="mini" :autosize="{maxRows:4,minRows:2}" :readonly="readonly" />
                                                        </el-form-item>
                                                    </el-col>
                                                </el-row>
                                                <el-row v-if="form.shiFouXiaoZhun==='是' && !isSheKou">
                                                    <el-col>
                                                        <el-form-item label="U/精确度/最大允差：" label-width="130">
                                                            <el-input v-model="form.zuiDaYunCha" type="textarea" size="mini" style="width:100%" :autosize="{maxRows:4,minRows:2}" :readonly="readonly" />
                                                        </el-form-item>
                                                    </el-col>
                                                </el-row>
                                                <el-row v-if="form.shiFouXiaoZhun==='是' && !isSheKou">
                                                    <el-col>
                                                        <el-form-item label="修正值：">
                                                            <el-input v-if="!readonly" v-model="form.xiuZhengZhiXiu" size="mini" />
                                                            <span v-else>{{ form.xiuZhengZhiXiu ||'/' }}
                                                            </span>
                                                        </el-form-item>
                                                    </el-col>
                                                </el-row>

                                            </el-col>
                                        </el-row>
                                        <el-row :gutter="20">
                                            <el-col :span="24">
                                                <el-alert :closable="false" type="success" style="margin-bottom:20px">设备照片及相关附件</el-alert>
                                            </el-col>
                                            <el-col :span="24">
                                                <el-form-item label="设备图片：">
                                                    <ibps-image
                                                        v-model="form.beiZhu"
                                                        height="160"
                                                        width="160"
                                                        accept=".jpg,.jpeg,.png,.gif,.bmp,.webp"
                                                        multiple
                                                        download
                                                        :disabled="readonly"
                                                        size=""
                                                    />
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="24">
                                                <el-form-item label="附件上传：">
                                                    <ibps-attachment
                                                        v-model="form.yqzp"
                                                        :download="true"
                                                        multiple
                                                        accept="*"
                                                        :readonly="readonly"
                                                        style="width:100%"
                                                    />
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="24">
                                                <el-form-item label="资质证书：">
                                                    <ibps-attachment
                                                        v-model="form.faPiao"
                                                        :download="true"
                                                        multiple
                                                        accept="*"
                                                        :readonly="readonly"
                                                        style="width:100%"
                                                    />
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="24">
                                                <el-form-item label="设备说明书：">
                                                    <ibps-attachment
                                                        v-model="form.fuJianShang"
                                                        :download="true"
                                                        multiple
                                                        accept="*"
                                                        :readonly="readonly"
                                                        style="width:100%"
                                                    />
                                                </el-form-item>
                                            </el-col>
                                            <!-- <el-col :span="24">
                                                <el-form-item label="说明书分类：">
                                                    <SelectType :field="{}" @change-data="changeData" />
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="24">
                                                <el-form-item label="文件路径：">
                                                    <span>{{ form.wenJianXiLei }}</span>
                                                </el-form-item>
                                            </el-col> -->
                                        </el-row>
                                    </el-form>

                                </el-tab-pane>

                                <el-tab-pane v-for="item in tabItems" :key="item.name" :label="item.label" :name="item.name" :disabled="item.isKeepAlive&&!isEdit">
                                    <template v-if="item.isKeepAlive">
                                        <!-- 使用 v-if 配合 keep-alive 实现按需加载 -->
                                        <keep-alive>
                                            <component :is="item.component" v-if="activeName===item.name" :params="form" />
                                        </keep-alive>
                                    </template>
                                    <template v-else>
                                        <component :is="item.component" :ref="item.ref" :readonly="readonly" :list-data="form[item.data]" />
                                    </template>
                                </el-tab-pane>
                            </el-tabs>
                        </el-col>
                    </el-row>
                </div>
            </div>
        </div>
    </el-dialog>
</template>

<script>
import dayjs from 'dayjs'
import ibpsUserSelector from '@/business/platform/org/selector'
import { getequipmentCard, saveEquipmentCard } from '@/api/platform/device/device'
import Maintenance from './maintenance.vue'
import MoreDevices from './moreDevices.vue'
import ScrappedRecord from './scrappedRecord.vue'
import MaintenanceRecord from './maintenanceRecord.vue'
import RepairRecord from './repairRecord.vue'
import CalibrationCheckRecord from './calibrationCheckRecord.vue'
import IbpsAttachment from '@/business/platform/file/attachment/selector'
import SelectType from '@/views/component/selectType.vue'
import { getImage } from '@/api/platform/file/attachment'
export default {
    components: {
        ibpsUserSelector, Maintenance, MoreDevices, ScrappedRecord, MaintenanceRecord, RepairRecord, CalibrationCheckRecord, IbpsAttachment, SelectType,
        IbpsCustomDialog: () => import('@/business/platform/data/templaterender/custom-dialog'),
        IbpsImage: () => import('@/business/platform/file/image')
    },
    props: {
        readonly: {
            type: Boolean,
            default: false
        },
        params: {
            type: Object,
            default: function () {
                return {}
            }
        },
        stateList: {
            type: Object,
            default: function () {
                return { '停用': '停用', '报废': '报废', '合格': '合格' }
            }
        },
        hideSysDeviceNo: {
            type: Boolean,
            default: false
        },
        tabList: {
            type: Object,
            default: function () {
                return {}
            }
        },
        typeList: {
            type: Object,
            default: function () {
                return { '检验系统': '检验系统', '通用设备': '通用设备', '软件': '软件', '信息系统': '信息系统' }
            }
        }
    },
    data () {
        const { userId, position, level, deptList } = this.$store.getters
        return {
            tabItems: [
                { label: '维护项目', name: 'two', ref: 'MaintenanceRef', data: 'maintenanceItemPoList', component: 'Maintenance', isKeepAlive: false },
                { label: '附属设备及配件', name: 'three', ref: 'MoreDevicesRef', data: 'accessoriesDevicePoList', component: 'MoreDevices', isKeepAlive: false },
                { label: '使用与维护记录', name: 'four', component: 'MaintenanceRecord', isKeepAlive: true },
                { label: '校准记录', name: 'five', component: 'CalibrationCheckRecord', isKeepAlive: true },
                { label: '维修记录', name: 'six', component: 'RepairRecord', isKeepAlive: true },
                { label: '停用、报废记录', name: 'seven', component: 'ScrappedRecord', isKeepAlive: true }
            ],
            filter: [{
                descVal: '1',
                includeSub: true,
                old: 'position',
                partyId: this.$store.getters.userInfo.employee.positions,
                partyName: '',
                scriptContent: '',
                type: 'user',
                userType: 'position'
            }],
            isFirstyiXiaoRiQi: true,
            isFirstbianZhiBuMen: true,
            isSheKou: false,
            activeName: 'one',
            dialogVisible: true,
            userId: userId,
            position: position,
            deptList: deptList,
            level: level.second || level.first,
            org: level.first || '',
            loading: false,
            title: '设备档案卡',
            toolbars: [
                { key: 'save', label: '保存', hidden: () => { return this.readonly } },
                { key: 'cancel', label: '退出', type: 'danger', icon: 'ibps-icon-close' }
            ],
            initWidth: '1480px',
            isEdit: false,
            isFinished: false,
            preParams: {},
            Ids: [],
            form: {
                gouJinRiQi: '', // 购进日期
                changShang: '', // 厂家/品牌
                guiGeXingHao: '', // 规格型号
                jieShouRiQi: '', // 接收日期
                qiYongRiQi: '', // 投入日期
                cunFangDiDian: '',
                cunFangWeiZhi: '', // 放置地点
                jieShouZhuangTai: '', // 接收时状态
                guanLiRen: '', // 保管人
                weiHuFangShi: '', // 设备分组
                bianZhiRen: '', // 建档人
                bianZhiBuMen: '', // 建档部门
                bianZhiShiJian: '', // 建档时间
                shiFouGuoShen: '',
                sheBeiLeiXing: '', // 设备类型
                sheBeiZhuangTa: '', // 设备状态
                sheBeiShiBieH: '', // 设备编号
                shiFouXiaoZhun: '', // 是否校准
                gongYingShang: '',
                shiFouQiJianH: '', // 供应商id
                lianXiFangShi: '', // 供应商电话
                xiaoZhunYouXia: '', // 校准有效期至
                chuChangRiQi: '', // 出厂日期
                sheBeiMingCheng: '', // 设备名称
                sheBeiMingChen: '', // 设备名称id
                yiXiaoRiQi: '', // 最近校准时间
                heChaXiaoZhun: '', // 使用年限
                shiJiShiYongF: '', // 关机时间
                kaiShiShiYong: '', // 开机时间
                zhengShuBianHa: '', // 校准证书编号
                xiaoZhunWuCha: '', // 是否限用
                xiaoZhunZQ: '', // 检定/校准周期
                shiYongKeShi: '', // 检定/校准单位
                yuanSheBeiBian: '', // 原设备编号
                jianKongYiJu: '', // 是否24H开机
                biXuDeHuanJin: '', // 核查人
                biXuSheShi: '', // 核查日期
                ziChanYuanZhi: '', // 资产原值
                ziChanBianHao: '', // 固定资产号
                shiFouWeiHu: '', // 是否维护
                jiShenXuHao: '', // 出厂编号
                yanShouRiQi: '', // 验收日期
                huanJingYaoQiu: '', // 环境要求
                dianYuanYaoQiu: '', // 电源要求
                zhuCeZhengHao: '', // 注册证号
                yqzp: '', // 附件上传
                faPiao: '', // 资质证书
                fuJianShang: '', // 设备使用说明书
                beiZhu: '', // 设备图片
                caiGouHeTong: '', // 限用范围
                zhuanYeBuMen: '',
                wenJianXiLei: '', // 附件细类
                xiLeiId: '',
                quanXianLeiXing: '',
                diDian: '',
                buMen: '', // 图片id
                ceLiangGongZuo: '', // 测量范围
                jianDingXiao: '', // 检定/校准参数
                xiuZhengZhiXiu: '', // 修正值
                zuiDaYunCha: '', // U/精确度/最大允差
                shiWuShuoMing: '' // 校准机构

            },
            rules: {
                sheBeiMingCheng: [
                    { required: true, message: '设备名称不能为空', trigger: 'blur' }
                ],
                yuanSheBeiBian: [
                    { required: true, message: '原设备编号不能为空', trigger: 'blur' }
                ],
                sheBeiLeiXing: [
                    { required: true, message: '设备类型不能为空', trigger: 'blur' }
                ],
                sheBeiZhuangTa: [
                    { required: true, message: '设备状态不能为空', trigger: 'blur' }
                ],
                guiGeXingHao: [
                    { required: true, message: '规格型号不能为空', trigger: 'blur' }
                ],
                bianZhiBuMen: [
                    { required: true, message: '建档部门不能为空', trigger: 'blur' }
                ],
                bianZhiRen: [
                    { required: true, message: '建档人不能为空', trigger: 'blur' }
                ],
                bianZhiShiJian: [
                    { required: true, message: '建档时间不能为空', trigger: 'blur' }
                ],
                jieShouZhuangTai: [
                    { required: true, message: '接收时状态不能为空', trigger: 'blur' }
                ],
                guanLiRen: [
                    { required: true, message: '保管人不能为空', trigger: 'blur' }
                ],
                cunFangWeiZhi: [
                    { required: true, message: '放置地点不能为空', trigger: 'blur' }
                ],
                shiFouXiaoZhun: [
                    { required: true, message: '是否校准不能为空', trigger: 'blur' }
                ]
            }
        }
    },
    computed: {
        photos () {
            if (this.form.beiZhu) {
                const photos = JSON.parse(this.form.beiZhu)
                photos.forEach(item => {
                    item.url = getImage(item.id)
                })
                return photos
            }
            return []
        },
        showState () {
            return this.stateList[this.form.sheBeiZhuangTa] || this.form.sheBeiZhuangTa
        }
    },
    watch: {
        photos: {
            handler (val) {
                this.form.buMen = val.map(item => item.id).join(',')
            }
        },
        'form.xiaoZhunWuCha': {
            handler (val, old) {
                if (!old) return
                if (val === '否') {
                    this.form.sheBeiZhuangTa = '合格'
                } else if (val === '是') {
                    this.form.caiGouHeTong = ''
                    this.form.sheBeiZhuangTa = '限用'
                }
            }
        },
        'form.cunFangWeiZhi': {
            async handler (val) {
                if (!val) return
                const sql = `select fang_jian_ming_ha from t_jjqfjb where id_='${val}'`
                const { variables: { data }} = await this.$common.request('sql', sql)

                this.form.cunFangDiDian = data && data[0] ? data[0].fang_jian_ming_ha : ''
            }
        },
        // 根据编制部门动态获取对应文件存放处数据
        // 'form.bianZhiBuMen': {
        //     handler (value) {
        //         if (value) {
        //             if (this.isFirstbianZhiBuMen) {
        //                 this.isFirstbianZhiBuMen = false
        //                 return
        //             }
        //             this.handleData(value)
        //         }
        //     }
        // },
        // 根据最近检定时间动态计算对应有效期至
        'form.yiXiaoRiQi': {
            handler (value) {
                if (value) {
                    if (this.isFirstyiXiaoRiQi) {
                        this.isFirstyiXiaoRiQi = false
                        return
                    }
                    const cycle = this.form.xiaoZhunZQ || 0
                    const expiredDate = this.$common.getFormatDate('string', 10, this.$common.getDate('month', parseInt(cycle), value))
                    this.form.xiaoZhunYouXia = this.$common.getFormatDate('string', 10, this.$common.getDate('day', -1, expiredDate))
                }
            }
        }
    },

    mounted () {
        this.init()
    },
    methods: {
        sheBeiMingChenChange (key, data) {
            this.form.sheBeiMingCheng = data.ming_cheng_str_
            this.form.guiGeXingHao = data.xing_hao_gui_ge_
            this.form.jiShenXuHao = data.chu_chang_bian_ha
            this.form.changShang = data.sheng_chan_chang_
            this.form.yuanSheBeiBian = data.she_bei_bian_hao_
        },
        // 根据供应商自动带出供应商名称和电话
        shiFouQiJianHChange (key, data) {
            this.form.lianXiFangShi = data.lian_xi_dian_hua_
            this.form.gongYingShang = data.gong_ying_shang_m
        },
        changeData (...args) {
            this.form[args[0]] = args[1]
        },
        handleData (departmentId) {
        // JSON_UNQUOTE( JSON_EXTRACT( AUTHORITY_NAME, '$.chaYue' ) )
            const sql = `select
                        id_ AS leiXingId,
                        AUTHORITY_NAME AS chaYueValue 
                    FROM
                        ibps_cat_type 
                    WHERE
                        category_key_ = 'FILE_TYPE' 
                        AND AUTHORITY_NAME LIKE '%"${departmentId}"%' 
                        AND name_ = '设备使用说明书'`
            // console.log(sql)
            const { deptList = [] } = this.$store.getters || {}
            const dept = deptList.find((i) => i.positionId === departmentId)
            this.$common.request('sql', sql).then((res) => {
                const { data = [] } = res.variables || {}
                this.form.wenJianXiLei = `外部文件 / ${dept?.positionName} / 设备使用说明书`
                if (!data.length) {
                    return
                }
                const { leiXingId, chaYueValue } = data[0] || {}
                this.form.xiLeiId = leiXingId
                this.form.quanXianLeiXing = JSON.parse(chaYueValue).chaYue
                this.form.zhuanYeBuMen = departmentId
            })
        },
        handleClick () {

        },
        handleActionEvent ({ key }) {
            switch (key) {
                case 'cancel':
                    this.closeDialog(true)
                    break
                case 'save':
                    this.goSave('close')
                    break
                default:
                    break
            }
        },

        // 获取人员部门
        getPersonPosition (id) {
            const userList = this.$store.getters.userList
            const bianzhiUserid = userList.find(i => i.userId === id)
            if (bianzhiUserid) {
                return bianzhiUserid.positionId
            }
        },
        isDateMoreThenSecondDay (firstTime, secondTime) {
            if (!firstTime || !secondTime) {
                return false
            }
            return new Date(firstTime).getTime() > new Date(secondTime).getTime()
        },
        async checkRequired (flag) {
            if (this.form.xiaoZhunWuCha === '是' && !this.form.caiGouHeTong) {
                throw new Error('请填写限用范围！')
            }
            if (this.form.accessoriesDevicePoList.length > 0) {
                for (let i = 0; i < this.form.accessoriesDevicePoList.length; i++) {
                    const item = this.form.accessoriesDevicePoList[i]
                    if (!item.mingCheng) {
                        throw new Error(`附属设备及配件第${i + 1}行名称缺失！`)
                    }
                    if (!item.guiGeXingHao1) {
                        throw new Error(`附属设备及配件第${i + 1}行规格型号缺失！`)
                    }
                    if (!item.danWei) {
                        throw new Error(`附属设备及配件第${i + 1}行单位缺失！`)
                    }
                    if (!item.shuLiang) {
                        throw new Error(`附属设备及配件第${i + 1}行数量缺失！`)
                    }
                }
            }

            const sysDeviceNo = this.form.sheBeiShiBieH
            const originalDeviceNo = this.form.yuanSheBeiBian
            const position = this.form.diDian
            const sql = `select count(1) as num from t_sbdj where yuan_she_bei_bian = '${originalDeviceNo}' and di_dian_ = '${position}' and she_bei_shi_bie_h <> '${sysDeviceNo}' limit 1`
            const result = await this.$common.request('sql', sql)
            const { data = [] } = result.variables || {}
            if (data[0].num > 0) {
                throw new Error(`系统当前已经存在此原设备编号,请更换另一个编号!`)
            }

            const exFactoryTime = this.form.chuChangRiQi
            const reviceTime = this.form.jieShouRiQi
            const useTime = this.form.qiYongRiQi
            // 如果有出厂日期，则接收日期必须在出厂日期之后，投入日期必须在出厂日期之后
            // 校验接收日期是否在投入日期之前
            if (exFactoryTime && reviceTime) {
                if (this.isDateMoreThenSecondDay(exFactoryTime, reviceTime)) {
                    throw new Error(`该设备的接收日期不得早于出厂日期!`)
                }
            }
            if (exFactoryTime && useTime) {
                if (this.isDateMoreThenSecondDay(exFactoryTime, useTime)) {
                    throw new Error(`该设备的投入日期不得早于出厂日期!`)
                }
            }
            if (reviceTime && useTime) {
                if (this.isDateMoreThenSecondDay(reviceTime, useTime)) {
                    throw new Error(`该设备的投入日期不得早于接收日期!`)
                }
            }
        },
        async goAdd () {
            try {
                this.loading = true
                this.form.sheBeiShiBieH = await this.getNextAlias()
                await saveEquipmentCard(this.form)
                this.$message.success('添加成功')
                this.closeDialog(true)
                this.loading = false
            } catch (error) {
                console.log(error)
                this.$message.warning('添加失败')
                this.loading = false
            }
        },
        async subForm (id, table, parentData) {
            const sql1 = `select id_ from ${table} where parent_id_='${id}'`
            const { variables: { data }} = await this.$common.request('sql', sql1)
            const pre_list = data.length > 0 ? data.map(item => item.id_) : []
            const update_list = []
            const add_list = []
            parentData.forEach(item => {
                if (item.id) {
                    update_list.push(item)
                } else {
                    add_list.push(item)
                }
            })
            const delete_list = pre_list.filter(id => !update_list.map(item => item.id).includes(id))
            return {
                add_list,
                update_list,
                delete_list
            }
        },
        async goEdit (flag) {
            try {
                this.loading = true
                await saveEquipmentCard(this.form)
                this.$message.success('修改成功')
                this.closeDialog(true)
                this.loading = false
            } catch (error) {
                this.$message.warning(error.message)
                this.loading = false
                throw new Error(error.message)
            }
        },
        goSave (flag) {
            this.$refs.form.validate(async (valid) => {
                if (valid) {
                    try {
                        // 维护项目
                        this.form.maintenanceItemPoList = this.$refs.MaintenanceRef?.[0]?.listDataCopy || this.form.maintenanceItemPoList || []
                        // 附属设备及配件
                        this.form.accessoriesDevicePoList = this.$refs.MoreDevicesRef?.[0]?.listDataCopy || this.form.accessoriesDevicePoList || []
                        await this.checkRequired()
                        if (this.isEdit) {
                            this.goEdit(flag)
                        } else {
                            this.goAdd()
                        }
                    } catch (error) {
                        this.$message.warning(error.message)
                    }
                } else {
                    return this.$message.warning('请填写必填项！')
                }
            })
        },
        // 刷新
        async goRefresh () {
        },
        // 关闭当前窗口
        closeDialog (needRefresh) {
            this.dialogVisible = false
            if (needRefresh) {
                this.$emit('close')
            }
        },
        // 检查设备编号是否重复
        async checkIsRepeat (id) {
            const sql = `select id_ from t_sbdj where she_bei_shi_bie_h='${id}' limit 1`
            const { variables: { data }} = await this.$common.request('sql', sql)
            return data.length > 0
        },
        generateRandomString () {
            return `JYK-${Math.floor(Math.random() * 88888) + 10000}`
        },
        getNextAlias () {
            return new Promise((resolve, reject) => {
                this.$common.getNextIdByAlias({
                    'alias': 'sbbh'
                }).then(response => {
                    resolve(response.data)
                }).catch((error) => {
                    reject(error)
                })
            })
        },
        async init () {
            if (this.hideSysDeviceNo) {
                this.rules.yuanSheBeiBian[0].message = '设备编号不能为空'
            }
            this.loading = true
            this.isEdit = !!(this.params && this.params.id)
            this.isSheKou = this.deptList[0].positionId === '1166372468122714112' // 判断是否是蛇口医院

            // 根据全局配置动态生成tab
            const newTab = []
            for (const key in this.tabList) {
                if (Object.hasOwnProperty.call(this.tabList, key)) {
                    const newLabel = this.tabList[key]
                    const t = this.tabItems.find(i => i.label === key)
                    if (t) {
                        t.label = newLabel
                        newTab.push(t)
                    }
                }
            }
            if (newTab.length > 0) {
                this.tabItems = newTab
            }

            if (this.isEdit) {
                const { data } = await getequipmentCard({ id: this.params.id })
                this.form = data
            } else {
                this.isFirstbianZhiBuMen = false
                this.isFirstyiXiaoRiQi = false
                // 随机生成一个不重复的设备编号
                // this.form.sheBeiShiBieH = this.generateRandomString()
                // for (; await this.checkIsRepeat(this.form.sheBeiShiBieH);) {
                //     this.form.sheBeiShiBieH = this.generateRandomString()
                // }
                this.form.jieShouRiQi = dayjs().format('YYYY-MM-DD')
                this.form.qiYongRiQi = dayjs().format('YYYY-MM-DD')
                this.form.xiaoZhunWuCha = '否'
                this.form.jieShouZhuangTai = '新设备'
                this.form.bianZhiRen = this.userId
                const pos = this.position.split(',')
                this.form.bianZhiBuMen = pos[pos.length - 1]
                this.form.bianZhiShiJian = dayjs().format('YYYY-MM-DD HH:mm')
                this.form.shiFouGuoShen = '已完成'
                this.form.sheBeiLeiXing = '检验系统'
                this.form.sheBeiZhuangTa = '合格'
                this.form.shiFouXiaoZhun = '是'
                this.form.jianKongYiJu = '否'
                this.form.shiFouWeiHu = '是'
                this.form.diDian = this.level
            }
            this.loading = false
        }
    }
}
</script>

<style lang="scss" scoped>
.paper-detail-dialog {
    ::v-deep {
        .el-dialog__header {
            text-align: center;
        }
    }
.dialog-title{
    display: flex;
    align-items: center;
    justify-content: center;
    div{
        z-index: 99999999;
        position: absolute;
        right:8vw;
    }
    .dialogtitle{
        font-size: 22px;
        font-family: SimHei;
        font-weight: bold;
        color: #222;
    }
}
.container {
        display: flex;
        width: 100%;
        justify-content: center;
        .el-row{
            margin: 0 !important;
        }
        .required{
            color: #606266 !important;
            &::before{
                content: '*';
                margin: 0 4px 0 -7.5px;
                color: #F56C6C;
            }
        }
        .left{
            height: calc(100vh - 100px);
            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
            padding:20px;
            overflow-y: auto;
            .form{
                margin-left: -20px;
            }
            .item{
                width: 100%;
            }
            .title{
                margin: 16px 0 6px -16px;
            }
            .tabs{
                margin-top: 40px;
            }
            .question-icon{
                margin-left: 2px;
            }

        }
    }
}
    ::v-deep {
        .el-form-item__label{
            text-align: left;
            font-size: 12px !important;
        }
        .el-form-item__content{
            font-size: 12px !important;
            display: flex;
        }
        .el-table th {
            background-color:#f5f7fa !important;
        }
        .el-tabs__header {
            margin: 0 0 30px !important;
        }
        .ibps-image{
            width: 100%;
            .ibps-p-0{
                width: 100%;
                .list-group{
                    display: flex;
                    align-items: center;
                    gap: 20px;
                    flex-wrap: wrap;
                }
            }
        }
    }

</style>
