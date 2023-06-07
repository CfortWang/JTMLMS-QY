<!-- 样品接收确认 -->
<template>
  <div class="sample-scan">
    <!-- 扫码接收的输入框-->
        <el-input
          v-model="facilityId"
          ref="redarInput"
          @change="facilityData(facilityId)"
          style="z-index: -999;"
          ></el-input>
         <!-- <el-button type="primary" @click="openRedar" >
            測試</el-button> -->
         <!-- 扫码操作组件-->
           <div class="popContainer" v-if="redar" @click="remRedar">
                <dv-decoration-12 style="width:150px;height:100px;margin:0 auto;top: 35%;">
                 <span style=" color: #66D9EF;">开启扫描设备连接-样品接收确认</span>
                </dv-decoration-12>
           </div>
              <el-dialog
               width="90%"
               top="5vh"
               :modal-append-to-body='false'
               title="      样品补数据操作 - 确认样品数量及相关信息 
               如有修改样品类型规格等信息，请前往质量管理-客户反馈-客户沟通模块填写客户沟通记录表"
               @close="closeDialog"
               :before-close = "handleClose"
               :visible.sync="visible"
               > <!-- 表单是否显示 -->
                   <div style="height: 600px;overflow: auto;"  @click.self="handleChange">
                     <el-form label-position="top" size="mini" :model="listData" label-width="100px">
                      <div v-for="(item,index) in listData">
                        <el-row>
                          <div class="dynamic-form-table">
                            <div class="dynamic-form-table__block panel panel-info">
                            <div class="panel-heading ibps-clearfix">
                              <!--块模式：工具栏-->
                              <div class="ibps-fl dynamic-form-table__label">
                                样品No:{{ index+1 }}
                              </div>
                            </div>
                            </div>
                          </div>
                        </el-row>

                        <div style="padding: 10px 20px;">

                        
                        <el-row>
                          <el-col :span="6">
                            <el-form-item label="样品编号">
                              <el-input v-model="item.yang_pin_bian_hao" readonly="true"></el-input>
                            </el-form-item>
                          </el-col>
                          <el-col :span="6">
                            <el-form-item label="样品名称">
                              <el-input v-model="item.yang_pin_ming_che" readonly="true"></el-input>
                            </el-form-item>
                          </el-col>
                          <el-col :span="6">
                            <el-form-item label="样品总数">
                              <el-input v-model="item.yang_pin_zong_shu" readonly="true"></el-input>
                            </el-form-item>
                          </el-col>
                          <el-col :span="6">
                            <el-form-item label="本次确认数量"  required>
                              <el-input v-model="item.jie_yang_shu_lian"></el-input>
                            </el-form-item>
                          </el-col>
                        </el-row>


                        <el-row>
                          <el-col :span="6">
                            <el-form-item label="样品类型(一)">
                              <!-- <el-input v-model="item.yang_pin_lei_xing " ></el-input> -->
                              <template slot-scope="scope">
                                <el-select v-model="item.yang_pin_lei_xing" placeholder="请选择" filterable allow-create>
                                <el-option
                                    v-for="item in sampleTypes"
                                    :key = "item.value"
                                    :label = "item.label"
                                    :value = "item.value"
                                >
                                </el-option>
                                </el-select>
                              </template>
                            </el-form-item>
                          </el-col>
                          
                          <el-col :span="6">
                            <el-form-item label="样品运输条件(一)">
                              <!-- <el-input v-model="item.yang_ben_yun_shu_" ></el-input> -->
                              <template slot-scope="scope">
                                <el-select v-model="item.yang_ben_yun_shu_" placeholder="请选择" filterable allow-create>
                                <el-option
                                    v-for="item in sampleTransportationConditions"
                                    :key = "item.value"
                                    :label = "item.label"
                                    :value = "item.value"
                                >
                                </el-option>
                                </el-select>
                              </template>
                            </el-form-item>
                          </el-col>
                          
                          <el-col :span="6">
                            <el-form-item label="样品数量(一)">
                              <el-input v-model="item.shu_liang_" @change="changeShuLiang(index)"></el-input>
                            </el-form-item>
                          </el-col>
                          
                          <el-col :span="6">
                            <el-form-item label="样品规格(一)">
                              <!-- <el-input v-model="item.yang_pin_gui_ge_"></el-input> -->
                              <template slot-scope="scope">
                                <el-select v-model="item.yang_pin_gui_ge_" placeholder="请选择" filterable allow-create>
                                <el-option
                                    v-for="item in sampleSpecifications"
                                    :key = "item.value"
                                    :label = "item.label"
                                    :value = "item.value"
                                >
                                </el-option>
                                </el-select>
                              </template>
                            </el-form-item>
                          </el-col>
                        </el-row>
                        <!--每种类型对应的留样数量和留样存放位置-->
                        <el-row >
                            <el-col :span="6">
                                <el-form-item label="样品存放位置(一)" required  >
                                    <template slot-scope="scope">
                                        <weizhiData  v-model="item.shou_yang_wei_zhi_yi"/>
                                    </template>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="是否留样" class="zzj">
                                <template slot-scope="scope">
                                    <el-select v-model="item.shi_fou_liu_yang_yi" placeholder="请选择"
                                        @change="ifLiuYangChange_One(index)">
                                    <el-option
                                        v-for="item in ifLY"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                    </el-select>
                                </template>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                            <el-form-item label="留样数量(一)" required class="zzj">
                                <template slot-scope="scope">
                                    <el-input v-model="item.liu_yang_shu_lian_yi"></el-input>
                                </template>
                            </el-form-item>
                          </el-col>
                          <el-col :span="6">
                            <el-form-item label="留样存放位置(一)" required>
                                <template slot-scope="scope">
                                    <liuyangData v-model="item.liu_yang_wei_zhi_yi"/>
                               </template>
                            </el-form-item>
                          </el-col>
                        </el-row>


                        <el-row  v-if="item.flag2">
                          <el-col :span="6">
                            <el-form-item label="样品类型(二)" >
                              <!-- <el-input v-model="item.yang_pin_lei_er_"   ></el-input> -->
                              <template slot-scope="scope">
                                <el-select v-model="item.yang_pin_lei_er_" placeholder="请选择" filterable allow-create>
                                <el-option
                                    v-for="item in sampleTypes"
                                    :key = "item.value"
                                    :label = "item.label"
                                    :value = "item.value"
                                >
                                </el-option>
                                </el-select>
                              </template>
                            </el-form-item>
                          </el-col>
                          <el-col :span="6">
                            <el-form-item label="样品运输条件(二)">
                              <!-- <el-input v-model="item.yang_pin_yun_shu_"  ></el-input> -->
                              <template slot-scope="scope">
                                <el-select v-model="item.yang_pin_yun_shu_" placeholder="请选择" filterable allow-create>
                                <el-option
                                    v-for="item in sampleTransportationConditions"
                                    :key = "item.value"
                                    :label = "item.label"
                                    :value = "item.value"
                                >
                                </el-option>
                                </el-select>
                              </template>
                            </el-form-item>
                          </el-col>
                          <el-col :span="6">
                            <el-form-item label="样品数量(二)" >
                              <el-input v-model="item.shu_liang_er_"  @change="changeShuLiang(index)"></el-input>
                            </el-form-item>
                          </el-col>
                          <el-col :span="6">
                            <el-form-item label="样品规格(二)">
                              <!-- <el-input v-model="item.yang_pin_gui_ge_e"  ></el-input> -->
                              <template slot-scope="scope">
                                <el-select v-model="item.yang_pin_gui_ge_e" placeholder="请选择" filterable allow-create>
                                <el-option
                                    v-for="item in sampleSpecifications"
                                    :key = "item.value"
                                    :label = "item.label"
                                    :value = "item.value"
                                >
                                </el-option>
                                </el-select>
                              </template>
                            </el-form-item>
                          </el-col>
                        </el-row>
                        <!--每种类型对应的留样数量和留样存放位置-->
                        <el-row v-if="item.flag2">
                            <el-col :span="6">
                                <el-form-item label="样品存放位置(二)" required>
                                    <template slot-scope="scope">
                                        <weizhiData  v-model="item.shou_yang_wei_zhi_er"/>
                                    </template>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="是否留样" class="zzj">
                                <template slot-scope="scope">
                                    <el-select v-model="item.shi_fou_liu_yang_er" placeholder="请选择"
                                        @change="ifLiuYangChange_Two(index)">
                                    <el-option
                                        v-for="item in ifLY"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                    </el-select>
                                </template>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                            <el-form-item label="留样数量(二)" required class="zzj">
                                <template slot-scope="scope">
                                    <el-input v-model="item.liu_yang_shu_lian_er"></el-input>
                                </template>
                            </el-form-item>
                          </el-col>
                          <el-col :span="6">
                            <el-form-item label="留样存放位置(二)" required>
                                <template slot-scope="scope">
                                    <liuyangData v-model="item.liu_yang_wei_zhi_er"/>
                               </template>
                            </el-form-item>
                          </el-col>
                        </el-row>
                          
                        <el-row v-if="item.flag3">
                          <el-col :span="6">
                            <el-form-item label="样品类型(三)" >
                              <!-- <el-input v-model="item.yang_pin_lei_san_"  ></el-input> -->
                              <template slot-scope="scope">
                                <el-select v-model="item.yang_pin_lei_san_" placeholder="请选择" filterable allow-create>
                                <el-option
                                    v-for="item in sampleTypes"
                                    :key = "item.value"
                                    :label = "item.label"
                                    :value = "item.value"
                                >
                                </el-option>
                                </el-select>
                              </template>
                            </el-form-item>
                          </el-col>
                          <el-col :span="6">
                            <el-form-item label="样品运输条件(三)">
                              <!-- <el-input v-model="item.yang_pin_yun_san"  ></el-input> -->
                              <template slot-scope="scope">
                                <el-select v-model="item.yang_pin_yun_san" placeholder="请选择" filterable allow-create>
                                <el-option
                                    v-for="item in sampleTransportationConditions"
                                    :key = "item.value"
                                    :label = "item.label"
                                    :value = "item.value"
                                >
                                </el-option>
                                </el-select>
                              </template>
                            </el-form-item>
                          </el-col>
                          <el-col :span="6">
                            <el-form-item label="样品数量(三)">
                              <el-input v-model="item.shu_liang_san_"  @change="changeShuLiang(index)"></el-input>
                            </el-form-item>
                          </el-col>
                          <el-col :span="6">
                            <el-form-item label="样品规格(三)">
                              <!-- <el-input v-model="item.yang_pin_gui_ge_s"  ></el-input> -->
                              <template slot-scope="scope">
                                <el-select v-model="item.yang_pin_gui_ge_s" placeholder="请选择" filterable allow-create>
                                <el-option
                                    v-for="item in sampleSpecifications"
                                    :key = "item.value"
                                    :label = "item.label"
                                    :value = "item.value"
                                >
                                </el-option>
                                </el-select>
                              </template>
                            </el-form-item>
                          </el-col>
                        </el-row>
                        <!--每种类型对应的留样数量和留样存放位置-->
                        <el-row  v-if="item.flag3">
                            <el-col :span="6">
                                <el-form-item label="样品存放位置(三)" required>
                                    <template slot-scope="scope">
                                        <weizhiData  v-model="item.shou_yang_wei_zhi_san"/>
                                    </template>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="是否留样" class="zzj">
                                <template slot-scope="scope">
                                    <el-select v-model="item.shi_fou_liu_yang_san" placeholder="请选择"
                                        @change="ifLiuYangChange_Three(index)">
                                    <el-option
                                        v-for="item in ifLY"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                    </el-select>
                                </template>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                            <el-form-item label="留样数量(三)" required class="zzj">
                                <template slot-scope="scope">
                                    <el-input v-model="item.liu_yang_shu_lian_san"></el-input>
                                </template>
                            </el-form-item>
                          </el-col>
                          <el-col :span="6">
                            <el-form-item label="留样存放位置(三)" required>
                                <template slot-scope="scope">
                                    <liuyangData v-model="item.liu_yang_wei_zhi_san"/>
                               </template>
                            </el-form-item>
                          </el-col>
                        </el-row>   

                        <el-row  v-if="item.flag4">
                          <el-col :span="6">
                            <el-form-item label="样品类型(四)">
                              <!-- <el-input v-model="item.yang_pin_lei_si_"   ></el-input> -->
                              <template slot-scope="scope">
                                <el-select v-model="item.yang_pin_lei_si_" placeholder="请选择" filterable allow-create>
                                <el-option
                                    v-for="item in sampleTypes"
                                    :key = "item.value"
                                    :label = "item.label"
                                    :value = "item.value"
                                >
                                </el-option>
                                </el-select>
                              </template>
                            </el-form-item>
                          </el-col>
                          <el-col :span="6">
                            <el-form-item label="样品运输条件(四)">
                              <!-- <el-input v-model="item.yang_pin_yun_si_"  ></el-input> -->
                              <template slot-scope="scope">
                                <el-select v-model="item.yang_pin_yun_si_" placeholder="请选择" filterable allow-create>
                                <el-option
                                    v-for="item in sampleTransportationConditions"
                                    :key = "item.value"
                                    :label = "item.label"
                                    :value = "item.value"
                                >
                                </el-option>
                                </el-select>
                              </template>
                            </el-form-item>
                          </el-col>
                          <el-col :span="6">
                            <el-form-item label="样品数量(四)">
                              <el-input v-model="item.shu_liang_si_" @change="changeShuLiang(index)"></el-input>
                            </el-form-item>
                          </el-col>
                          <el-col :span="6">
                            <el-form-item label="样品规格(四)">
                              <!-- <el-input v-model="item.yang_pin_gui_si_"  ></el-input> -->
                              <template slot-scope="scope">
                                <el-select v-model="item.yang_pin_gui_si_" placeholder="请选择" filterable allow-create>
                                <el-option
                                    v-for="item in sampleSpecifications"
                                    :key = "item.value"
                                    :label = "item.label"
                                    :value = "item.value"
                                >
                                </el-option>
                                </el-select>
                              </template>
                            </el-form-item>
                          </el-col>
                        </el-row> 
                        <!--每种类型对应的留样数量和留样存放位置-->
                        <el-row  v-if="item.flag4">
                            <el-col :span="6">
                                <el-form-item label="样品存放位置(四)" required>
                                    <template slot-scope="scope">
                                        <weizhiData  v-model="item.shou_yang_wei_zhi_si"/>
                                    </template>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="是否留样" class="zzj">
                                <template slot-scope="scope">
                                    <el-select v-model="item.shi_fou_liu_yang_si" placeholder="请选择"
                                        @change="ifLiuYangChange_Four(index)">
                                    <el-option
                                        v-for="item in ifLY"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                    </el-select>
                                </template>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                            <el-form-item label="留样数量(四)" required class="zzj">
                                <template slot-scope="scope">
                                    <el-input v-model="item.liu_yang_shu_lian_si"></el-input>
                                </template>
                            </el-form-item>
                          </el-col>
                          <el-col :span="6">
                            <el-form-item label="留样存放位置(四)" required>
                                <template slot-scope="scope">
                                    <liuyangData v-model="item.liu_yang_wei_zhi_si"/>
                               </template>
                            </el-form-item>
                          </el-col>
                        </el-row>   
                        
                        <el-row>
                          
                          <!-- <el-col :span="6">
                            <el-form-item label="样品存放位置" required>
                              <template slot-scope="scope">
                                <weizhiData  v-model="item.shou_yang_wei_zhi"/>
                               </template>
                            </el-form-item>
                          </el-col> -->
                          <!-- <el-col :span="6">
                            <el-form-item label="留样存放位置" required>
                              <template slot-scope="scope">
                                <liuyangData v-model="item.liu_yang_wei_zhi_"/>
                               </template>
                            </el-form-item>
                          </el-col> -->
                         
                        </el-row>  
                        
                        <el-row>
                            <!-- <el-col :span="6">
                                <el-form-item label="是否留样">
                                <template slot-scope="scope">
                                    <el-select v-model="item.shi_fou_liu_yang_" placeholder="请选择"
                                        @change="ifLiuYangChange(item,index)">
                                    <el-option
                                        v-for="item in ifLY"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                    </el-select>
                                </template>
                                </el-form-item>
                            </el-col> -->
                          <el-col :span="6">
                            <el-form-item label="留样日期">
                              <template slot-scope="scope">
                              <el-date-picker
                                v-model="item.liu_yang_ri_qi_"
                                type="date"
                                value-format="yyyy-MM-dd"
                                format="yyyy-MM-dd"
                                placeholder="请选择"
                                :readonly="false"
                                :clearable="true"
                                @change="liuyanChange(item,index)"
                              />
                            </template>
                            </el-form-item>
                          </el-col>
                          <!-- <el-col :span="6">
                            <el-form-item label="留样数量" required>
                             <template slot-scope="scope">
                              <el-input 
                                v-model="item.liu_yang_shu_lian"
                                >
                              </el-input>
                             </template>
                            </el-form-item>
                          </el-col> -->
                          <el-col :span="6">
                            <el-form-item label="留样期限至">
                              <template slot-scope="scope">
                                <el-date-picker
                                  v-model="item.liu_yang_qi_xian"
                                  type="date"
                                  value-format="yyyy-MM-dd"
                                  format="yyyy-MM-dd"
                                  placeholder="请选择"
                                  :readonly="false"
                                  :clearable="true"
                                />
                              </template>
                            </el-form-item>
                          </el-col>
                          <!-- <el-col :span="6">
                            <el-form-item v-if="flag" label="销毁日期" >
                              <template slot-scope="scope">
                                <el-date-picker
                                  v-model="item.xiao_hui_ri_qi_"
                                  type="date"
                                  value-format="yyyy-MM-dd"
                                  format="yyyy-MM-dd"
                                  placeholder="请选择"
                                  :readonly="true"
                                  :clearable="true"
                                />
                              </template>
                            </el-form-item>
                          </el-col> -->
                        </el-row>

                        <el-row>
                          <el-col :span="6">
                            <el-form-item label="返样日期">
                              <template slot-scope="scope">
                                <el-date-picker
                                  v-model="item.fan_yang_ri_qi_"
                                  type="date"
                                  value-format="yyyy-MM-dd"
                                  format="yyyy-MM-dd"
                                  placeholder="请选择"
                                  :readonly="false"
                                  :clearable="true"
                                />
                              </template>
                            </el-form-item>
                          </el-col>
                          <el-col :span="6">
                            <el-form-item label="返样接样人">
                              <template slot-scope="scope">
                                <el-input
                                      v-model="item.fan_yang_jyr"
                                      placeholder="请输入"
                                      type="text"
                                      :readonly="false"
                                      clearable
                                    />
                              </template>
                            </el-form-item>
                          </el-col>

                         <el-col :span="6">
                          <el-form-item label="是否加急" >
                            <el-input v-model="item.chu_ju_bao_gao_ya" readonly="true" class="jiaji"></el-input>
                          </el-form-item>
                         </el-col>
                         <el-col :span="6">
                            <el-form-item label="验收结果">
                              <template slot-scope="scope">
                                <el-select v-model="item.yan_shou_jie_guo_" placeholder="请选择">
                                  <el-option
                                    v-for="item in checkOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                  </el-option>
                                </el-select>
                             </template>
                            </el-form-item>
                          </el-col>
                          <!-- <el-col :span="6">
                            <el-form-item label="分装留样数量">
                              <template slot-scope="scope">
                                <el-input
                                      v-model="item.fen_zhuang_liu_ya"
                                      placeholder="请输入"
                                      type="text"
                                      :readonly="false"
                                      clearable
                                    />
                              </template>
                            </el-form-item>
                          </el-col> -->
                        </el-row>

                        <el-row>
                          <el-col :span="6">
                            <el-form-item label="姓名">
                              <template slot-scope="scope">
                                <el-input
                                      v-model="item.xing_ming_"
                                      placeholder="请输入"
                                      type="text"
                                      :readonly="false"
                                      clearable
                                    />
                              </template>
                            </el-form-item>
                          </el-col>
                          <el-col :span="6">
                            <el-form-item label="性别">
                              <template slot-scope="scope">
                                  <el-select v-model="item.xing_bie_" placeholder="请选择">
                                    <el-option
                                      v-for="item in sex"
                                      :key="item.value"
                                      :label="item.label"
                                      :value="item.value">
                                    </el-option>
                                  </el-select>
                               </template>
                            </el-form-item>
                          </el-col>
                          <el-col :span="6">
                            <el-form-item label="年龄">
                              <template slot-scope="scope">
                                <el-input
                                      v-model="item.nian_ling_"
                                      placeholder="请输入"
                                      type="text"
                                      :readonly="false"
                                      clearable
                                    />
                              </template>
                            </el-form-item>
                          </el-col>
                        </el-row>

                        <el-row>
                          
                          <el-col :span="6">
                            <el-form-item label="备注">
                              <template slot-scope="scope">
                                <el-input
                                      v-model="item.bei_zhu_"
                                      placeholder="请输入"
                                      type="text"
                                      :readonly="false"
                                      clearable
                                    />
                              </template>
                            </el-form-item>
                          </el-col>
                          <el-col :span="6">
                            <el-form-item label="送样要求">
                              <template slot-scope="scope">
                                <el-input
                                      v-model="item.song_yang_yao_qiu"
                                      placeholder="请输入"
                                      type="text"
                                      :readonly="false"
                                      clearable
                                    />
                              </template>
                            </el-form-item>
                          </el-col>
                          <el-col :span="6">
                            <el-form-item label="接样确认状态">
                              <template slot-scope="scope">
                                  <el-select v-model="item.jie_yang_zhuang_t" placeholder="请选择">
                                    <el-option
                                      v-for="item in options"
                                      :key="item.value"
                                      :label="item.label"
                                      :value="item.value">
                                    </el-option>
                                  </el-select>
                               </template>
                            </el-form-item>
                          </el-col>
                          <el-col :span="6">
                            <el-form-item label="功能">
                              <template slot-scope="scope">
                                     <el-button
                                       size="small"
                                       type="danger"
                                       icon="el-icon-delete"
                                       @click="deleteData(item.id_)"
                                     >删除</el-button>
                                 </template>
                            </el-form-item>
                          </el-col> 
                        </el-row>

                        <el-row>
                        </el-row>
                      </div>
                      </div>
                     </el-form>
                   </div>
                   <span slot="footer" class="dialog-footer">
                      <el-button @click="visible = false">取 消</el-button>
                      <el-button @click="submitData('确认')" type="primary" >样品确认</el-button>
                   </span>
             </el-dialog>

  </div>
</template>


<script>
import manualConfirmationJSSupplementary from '../js/manualConfirmationJSSupplementary.js'
import IbpsLinkData from '@/business/platform/data/templaterender/link-data'
import weizhiData from "./weizhiData.vue"
import liuyangData from "./liuyangData.vue"
import * as dayjs from 'dayjs'

 export default {
   components:{
     IbpsLinkData,
     weizhiData,
     liuyangData,
   },
   mixins:[manualConfirmationJSSupplementary],
   props:{scanVisible:Boolean},
   watch:{
    listData: {
           handler(val, oldName) {
            if(val.length>0){
              this.visible = true
              this.redar = false    // 扫描后就让扫描组件隐藏
            }
         },
         deep: true,
         immediate: true
         },
     scanVisible:{
       handler(val, oldName) {
          if(val){
            this.redar = false       // 扫码的组件  一开始先展示
            this.visible = true    // 结果列表   一开始没扫描就不展示

            this.$nextTick(() => {
                this.$refs.redarInput.focus(); //聚焦input
              })
            this.listData = [] //清空列表
          }else{
            this.remRedar()
          }
       },
       deep: true,
       immediate: true
     }
   },
   created() {
     this.facilityData(1)
   },
  data () {
    return {
     updateNum:1,
     visible:false,
     redar:false,
     facilityId:'',
     listData:[],
     currentPage:1,
     options: [{
               value: '已确认',
               label: '已确认'
             }, {
               value: '未确认',
               label: '未确认'
             }],
      checkOptions:[{
            value:'完好',
            label:'完好'
          },{
            value:'残缺',
            label:'残缺'
          }],
      ifLY:[{
          value:'是',
          label:'是'
        },{
          value:'否',
          label:'否'
        }],
        sex:[{
          value:'男',
          label:'男'
        },{
          value:'女',
          label:'女'
        }],
      // OriginalPosition:[],
      sampleTypes:[],
      sampleSpecifications:[],
      sampleTransportationConditions:[{
         value:'常温',
         label:'常温'
      },{
         value:'冰袋（2-8℃）',
         label:'冰袋（2-8℃）'
      },{
         value:'干冰',
         label:'干冰'
      },{
         value:'液氮',
         label:'液氮'
      },{
         value:'其它',
         label:'其它'
      }],
      pageCount:1,
      item:'',
      flag: true,
    }
  },
  methods:{
    current_change(currentPage){
      this.currentPage = currentPage
      this.facilityData(currentPage)
    },
    liuyanChange(item,index){
      // console.log(item,index)
      if(this.listData[index].liu_yang_ri_qi_=== undefined || this.listData[index].liu_yang_ri_qi_ === null){
        this.listData[index].xiao_hui_ri_qi_ = null
        this.listData[index].liu_yang_qi_xian = null
      }else{
        this.flag = false
        // let itemData =  dayjs(this.listData[index].liu_yang_ri_qi_).add(7,'day').format("YYYY-MM-DD")
        let val =  dayjs(this.listData[index].liu_yang_ri_qi_).add(3,'month').format("YYYY-MM-DD")
        // this.listData[index].xiao_hui_ri_qi_ = itemData
        this.listData[index].xiao_hui_ri_qi_ = null
        this.listData[index].liu_yang_qi_xian = val
        this.flag = true
      }
    },
    changeShuLiang(index){
        let item = this.listData[index]
        let total = parseInt(item.shu_liang_ || 0) + parseInt(item.shu_liang_er_ || 0) + parseInt(item.shu_liang_san_ || 0) + parseInt(item.shu_liang_si_ || 0)
        item.yang_pin_zong_shu = total
        item.jie_yang_shu_lian = total
    },
    ifLiuYangChange(item,index){
        console.log(index)
        // if(this.listData[index].shi_fou_liu_yang_ == '否'){
        //     this.listData[index].liu_yang_ri_qi_ = null
        //     this.listData[index].liu_yang_qi_xian = null
        //     this.listData[index].liu_yang_shu_lian_yi = null
        //     this.listData[index].liu_yang_shu_lian_er = null
        //     this.listData[index].liu_yang_shu_lian_san = null
        //     this.listData[index].liu_yang_shu_lian_si = null

        //     this.listData[index].liu_yang_wei_zhi_yi = null
        //     this.listData[index].liu_yang_wei_zhi_er = null
        //     this.listData[index].liu_yang_wei_zhi_san = null
        //     this.listData[index].liu_yang_wei_zhi_si = null
        //     // todo 更新留样位置1-4
        // }
    },
    ifLiuYangChange_One(index){
        if(this.listData[index].shi_fou_liu_yang_yi == '否'){
            this.listData[index].liu_yang_shu_lian_yi = null
        }
    },
    ifLiuYangChange_Two(index){
        if(this.listData[index].shi_fou_liu_yang_er == '否'){
            this.listData[index].liu_yang_shu_lian_er = null
        }
    },
    
    ifLiuYangChange_Three(index){
        if(this.listData[index].shi_fou_liu_yang_san == '否'){
            this.listData[index].liu_yang_shu_lian_san = null
        }
    },
    
    ifLiuYangChange_Four(index){
        if(this.listData[index].shi_fou_liu_yang_si == '否'){
            this.listData[index].liu_yang_shu_lian_si = null
        }
    }
  }

  }
</script>


<style lang="less" scoped>

/deep/ .el-form-item__label,/deep/ .el-input__inner{
    color: none;
}
 .sample-scan .popContainer{
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 9999999;
      background: rgba(0,0,0,0.7);
  }
    // .dynamic-form-table__label:before {
    //   content: '*';
    //   color: #F56C6C;
    // }
    .dynamic-form-table__label{
      color: #F56C6C;
      font-size: 18px;
      line-height: 40px;
      font-weight: bold;
    }
    /**必须设置.el-form-item__label为none */
    /deep/.zzj .el-form-item__content .el-input__inner{
        color: #e60c14; 
    }
    /deep/.el-form-item__content{
    display: inline-block;
  }
  /deep/.el-form-item__label{
    padding: 0;
    margin-right: 5px;
    width: 120px;
  }
   /deep/.el-input__inner{
   border-top: none !important;
   border-left: none !important;
   border-right: none !important;
   border-radius: 0;
 }
 /deep/.jiaji{
      // color: #F56C6C;
      // font-size: 18px;
      // line-height: 40px;
      // font-weight: bold;  
 }
 /deep/.el-dialog__title{
    line-height: 24px;
    color: #e60c14;
    font-weight: 600;
 }
</style>