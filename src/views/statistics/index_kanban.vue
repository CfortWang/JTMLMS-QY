<template>
  <div id="container">
  			<div class="page_top">
  				<div class="top_left">
  					<div class="logo">
  						<img src="../../assets/logo.jpg"/>
  					</div>
  					<h2 class="wms_name"><span>保税区A仓</span><em>单仓</em></h2>
  					<div class="depot">
  						<input type="text" placeholder="选择仓库..." readonly="readonly"/>
  						<div class="depo_down">
  							<ul>
  								<li>A仓库</li>
  								<li>B仓库</li>
  								<li>C仓库</li>
  							</ul>
  						</div>
  					</div>
  				</div>
  				<div class="top_time">
  					<input type="text" class="time_star" id="time_star" value="2018-11-11 00:00:00" readonly="readonly"/><span>至</span><input type="text" class="time_end" id="time_end" value="2018-12-11 00:00:00" readonly="readonly"/>
  				</div>
  			</div>
  			<!--顶部-->
  			<div class="order_list">
  				<div class="order">
  					<div class="order_name">总单量</div>
  					<h2 class="order_num">204398</h2>
  				</div>
  				<div class="order">
  					<div class="order_name">总出库量</div>
  					<h2 class="order_num">197672</h2>
  				</div>
  				<div class="order">
  					<div class="order_name">未出库单量</div>
  					<h2 class="order_num">1350</h2>
  				</div>
  				<div class="order">
  					<div class="order_name">今天出库量</div>
  					<h2 class="order_num">5414</h2>
  				</div>
  				<div class="order">
  					<div class="order_name">未开始单量</div>
  					<h2 class="order_num">734</h2>
  				</div>
  			</div>
  			<!--订单量-->
  			<div class="maina">
  				<div class="main_left">
  					<div class="home_today" >
  						<div class="home_tit">
  							今天作业趋势图
  						</div>
  						<div class="home_list">
  							<div class="home_order">
  								<div class="home_name">
  									新增单量
  								</div>
  								<div class="home_num new_num">
  									86
  								</div>
  							</div>
  							<div class="home_order">
  								<div class="home_name">
  									拣选单量
  								</div>
  								<div class="home_num jian_num">
  									0
  								</div>
  							</div>
  							<div class="home_order">
  								<div class="home_name">
  									质检单量
  								</div>
  								<div class="home_num zhi_num">
  									2
  								</div>
  							</div>
  							<div class="home_order">
  								<div class="home_name">
  									出库单量
  								</div>
  								<div class="home_num chu_num">
  									5
  								</div>
  							</div>
  						</div>
  						<div id="home_today"></div>
  						<!--今日作业趋势图-->
  					</div>
  					<div class="ship_order" id="ship_order"></div>
  					<!--货主订单执行情况-->
  				</div>
  				<div class="main_midd">
  					<div class="imple" id="imple"></div>
  					<!--订单执行情况-->
  					<div class="order_wait" >
  						<div class="commis">
  							<div class="comm_tit">
  								订单代办事项
  							</div>
  							<div class="comm_list">
  								<div class="comm_cont">
  									<span class="com_name">收货等待</span><span class="com_num">228</span>
  								</div>
  							</div>
  							<div class="comm_list">
  								<div class="comm_cont">
  									<span class="com_name">上架等待</span><span class="com_num">9</span>
  								</div>
  							</div>
  							<div class="comm_list">
  								<div class="comm_cont">
  									<span class="com_name">分配等待</span><span class="com_num">0</span>
  								</div>
  							</div>
  							<div class="comm_list">
  								<div class="comm_cont">
  									<span class="com_name">拣货等待</span><span class="com_num">0</span>
  								</div>
  							</div>
  							<div class="comm_list">
  								<div class="comm_cont">
  									<span class="com_name">复核等待</span><span class="com_num">6</span>
  								</div>
  							</div>
  							<div class="comm_list">
  								<div class="comm_cont">
  									<span class="com_name">发货等待</span><span class="com_num">0</span>
  								</div>
  							</div>
  							<div class="comm_list">
  								<div class="comm_cont">
  									<span class="com_name">异常等待</span><span class="com_num">0</span>
  								</div>
  							</div>
  						</div>
  						<!--订单代办事项-->
  						<div class="abort">
  							<div class="abot_tit">
  								截止时间出库率
  							</div>
  							<div class="abort_box">
  								<div class="abort_list">
  								  <div class="abort_use">
  								  	<div class="abort_cont">
  									  	<div class="abort_name">
  									  		货主1
  									  	</div>
  									  	<div class="abort_num">
  									  		90%
  									  	</div>
  									  </div>
  									  <div class="abort_cont">
  									  	<div class="abort_name">
  									  		货主2
  									  	</div>
  									  	<div class="abort_num">
  									  		90%
  									  	</div>
  									  </div>
  									  <div class="abort_cont">
  									  	<div class="abort_name">
  									  		货主3
  									  	</div>
  									  	<div class="abort_num">
  									  		90%
  									  	</div>
  									  </div>
  									  <div class="abort_cont">
  									  	<div class="abort_name">
  									  		货主4
  									  	</div>
  									  	<div class="abort_num">
  									  		90%
  									  	</div>
  									  </div>
  									  <div class="abort_cont">
  									  	<div class="abort_name">
  									  		货主5
  									  	</div>
  									  	<div class="abort_num">
  									  		90%
  									  	</div>
  									  </div>
  									  <div class="abort_cont">
  									  	<div class="abort_name">
  									  		货主6
  									  	</div>
  									  	<div class="abort_num">
  									  		90%
  									  	</div>
  									  </div>
  									  <div class="abort_cont">
  									  	<div class="abort_name">
  									  		货主4
  									  	</div>
  									  	<div class="abort_num">
  									  		90%
  									  	</div>
  									  </div>
  									  <div class="abort_cont">
  									  	<div class="abort_name">
  									  		货主5
  									  	</div>
  									  	<div class="abort_num">
  									  		90%
  									  	</div>
  									  </div>
  									  <div class="abort_cont">
  									  	<div class="abort_name">
  									  		货主6
  									  	</div>
  									  	<div class="abort_num">
  									  		90%
  									  	</div>
  									  </div>
  									  <div class="abort_cont">
  									  	<div class="abort_name">
  									  		货主4
  									  	</div>
  									  	<div class="abort_num">
  									  		90%
  									  	</div>
  									  </div>
  									  <div class="abort_cont">
  									  	<div class="abort_name">
  									  		货主5
  									  	</div>
  									  	<div class="abort_num">
  									  		90%
  									  	</div>
  									  </div>
  									  <div class="abort_cont">
  									  	<div class="abort_name">
  									  		货主6
  									  	</div>
  									  	<div class="abort_num">
  									  		90%
  									  	</div>
  									  </div>
  									  <div class="abort_cont">
  									  	<div class="abort_name">
  									  		货主7
  									  	</div>
  									  	<div class="abort_num">
  									  		90%
  									  	</div>
  									  </div>

  								  </div>

  								</div>
  							</div>
  						</div>
  						<!--截止时间出库率-->
  					</div>

  				</div>
  				<div class="main_rig">
  					 <div class="situ_tit">
  					 	上一小时作业情况
  					 </div>
  					 <div class="situ_use">
  					    <div class="situ_list">

  					 	    <ul>
  					 			<li>
  					 			 <div class="situ_top">
  					 			 	<span class="situ_name">货主1</span><span class="situ_time">(8点)</span>
  					 			 </div>
  					 			 <div class="lssl">
  					 			 	<div class="lsl_name">
  					 			 		出库量
  					 			 	</div>
  					 			 	<div class="lal_num">
  					 			 		138
  					 			 	</div>
  					 			 </div>
  					 			 <div class="lal_all"></div>
  					 			 <div class="quan">
  					 			 	<div class="quan_name">
  					 			 		接单量
  					 			 	</div>
  					 			 	<div class="quan_num">
  					 			 		99
  					 			 	</div>
  					 			 </div>
  					 			 <div class="quan_all"><div class="tity"></div></div>
  					 			</li>
  					 			<li>
  					 			 <div class="situ_top">
  					 			 	<span class="situ_name">货主2</span><span class="situ_time">(8点)</span>
  					 			 </div>
  					 			 <div class="lssl">
  					 			 	<div class="lsl_name">
  					 			 		出库量
  					 			 	</div>
  					 			 	<div class="lal_num">
  					 			 		57
  					 			 	</div>
  					 			 </div>
  					 			 <div class="lal_all"></div>
  					 			 <div class="quan">
  					 			 	<div class="quan_name">
  					 			 		接单量
  					 			 	</div>
  					 			 	<div class="quan_num">
  					 			 		23
  					 			 	</div>
  					 			 </div>
  					 			 <div class="quan_all"><div class="tity"></div></div>
  					 			</li>
  					 			<li>
  					 			 <div class="situ_top">
  					 			 	<span class="situ_name">货主3</span><span class="situ_time">(8点)</span>
  					 			 </div>
  					 			 <div class="lssl">
  					 			 	<div class="lsl_name">
  					 			 		出库量
  					 			 	</div>
  					 			 	<div class="lal_num">
  					 			 		80
  					 			 	</div>
  					 			 </div>
  					 			 <div class="lal_all"></div>
  					 			 <div class="quan">
  					 			 	<div class="quan_name">
  					 			 		接单量
  					 			 	</div>
  					 			 	<div class="quan_num">
  					 			 		40
  					 			 	</div>
  					 			 </div>
  					 			 <div class="quan_all"><div class="tity"></div></div>
  					 			</li>
  					 			<li>
  					 			 <div class="situ_top">
  					 			 	<span class="situ_name">货主4</span><span class="situ_time">(8点)</span>
  					 			 </div>
  					 			 <div class="lssl">
  					 			 	<div class="lsl_name">
  					 			 		出库量
  					 			 	</div>
  					 			 	<div class="lal_num">
  					 			 		400
  					 			 	</div>
  					 			 </div>
  					 			 <div class="lal_all"></div>
  					 			 <div class="quan">
  					 			 	<div class="quan_name">
  					 			 		接单量
  					 			 	</div>
  					 			 	<div class="quan_num">
  					 			 		300
  					 			 	</div>
  					 			 </div>
  					 			 <div class="quan_all"><div class="tity"></div></div>
  					 			</li>
  					 			<li>
  					 			 <div class="situ_top">
  					 			 	<span class="situ_name">货主5</span><span class="situ_time">(8点)</span>
  					 			 </div>
  					 			 <div class="lssl">
  					 			 	<div class="lsl_name">
  					 			 		出库量
  					 			 	</div>
  					 			 	<div class="lal_num">
  					 			 		57
  					 			 	</div>
  					 			 </div>
  					 			 <div class="lal_all"></div>
  					 			 <div class="quan">
  					 			 	<div class="quan_name">
  					 			 		接单量
  					 			 	</div>
  					 			 	<div class="quan_num">
  					 			 		45
  					 			 	</div>
  					 			 </div>
  					 			 <div class="quan_all"><div class="tity"></div></div>
  					 			</li>
  					 			<li>
  					 			 <div class="situ_top">
  					 			 	<span class="situ_name">货主6</span><span class="situ_time">(8点)</span>
  					 			 </div>
  					 			 <div class="lssl">
  					 			 	<div class="lsl_name">
  					 			 		出库量
  					 			 	</div>
  					 			 	<div class="lal_num">
  					 			 		57
  					 			 	</div>
  					 			 </div>
  					 			 <div class="lal_all"></div>
  					 			 <div class="quan">
  					 			 	<div class="quan_name">
  					 			 		接单量
  					 			 	</div>
  					 			 	<div class="quan_num">
  					 			 		30
  					 			 	</div>
  					 			 </div>
  					 			 <div class="quan_all"><div class="tity"></div></div>
  					 			</li>
  					 			<li>
  					 			 <div class="situ_top">
  					 			 	<span class="situ_name">货主7</span><span class="situ_time">(8点)</span>
  					 			 </div>
  					 			 <div class="lssl">
  					 			 	<div class="lsl_name">
  					 			 		出库量
  					 			 	</div>
  					 			 	<div class="lal_num">
  					 			 		57
  					 			 	</div>
  					 			 </div>
  					 			 <div class="lal_all"></div>
  					 			 <div class="quan">
  					 			 	<div class="quan_name">
  					 			 		接单量
  					 			 	</div>
  					 			 	<div class="quan_num">
  					 			 		40
  					 			 	</div>
  					 			 </div>
  					 			 <div class="quan_all"><div class="tity"></div></div>
  					 			</li>
  					 			<li>
  					 			 <div class="situ_top">
  					 			 	<span class="situ_name">货主8</span><span class="situ_time">(8点)</span>
  					 			 </div>
  					 			 <div class="lssl">
  					 			 	<div class="lsl_name">
  					 			 		出库量
  					 			 	</div>
  					 			 	<div class="lal_num">
  					 			 		57
  					 			 	</div>
  					 			 </div>
  					 			 <div class="lal_all"></div>
  					 			 <div class="quan">
  					 			 	<div class="quan_name">
  					 			 		接单量
  					 			 	</div>
  					 			 	<div class="quan_num">
  					 			 		50
  					 			 	</div>
  					 			 </div>
  					 			 <div class="quan_all"><div class="tity"></div></div>
  					 			</li>
  					 		</ul>
  					 	</div>
  					 </div>
  				</div>
  			</div>
  		</div>
</template>
<script  scoped>
  import echarts from 'echarts'
  import $ from 'jquery'



  export default {
      components:{

      },
      props:{

     },
      mounted() {

 $(".order_num").each(function(){
		var that=$(this);
		var text1=that.text();
		var text1_1=parseInt(text1);
        var te=formatNum(text1_1+"");
        that.text(te)
	})
	 function formatNum(str) {
	    var newStr = "";
	    var count = 0;
	   if (str.indexOf(".") == -1) {
	        for (var i = str.length - 1; i >= 0; i--) {
	            if (count % 3 == 0 && count != 0) {
	                newStr = str.charAt(i) + "," + newStr;
	            } else {
	                newStr = str.charAt(i) + newStr;
	            }
	            count++;
	        }
	        str = newStr;
	        return str;
	    }

	}
$(function(){
	$("body").click(function(){
		$(".depo_down").slideUp();
	})
	$(".depot").click(function(e){
		e.stopPropagation();
		if($(this).hasClass("active")){
			$(this).removeClass("active");
			$(".depo_down").slideUp();
		}else{
			$(this).addClass("active");
			$(".depo_down").slideDown();
		}
	})
	$(".depo_down li").click(function(){
		var tex=$(this).text();
		$(".depot input").val(tex);
	})
  })
let myChart1 =echarts.init(document.getElementById('home_today'));
	 let option1 = {
	 	backgroundColor: '#1b1e25',
	    title: {
	       text: ''
	    },

	    tooltip: {
	      enterable:true,
          trigger: 'axis'

		},
	    grid: {
	        left: '3%',
	        right: '3%',
	        top: '10%',
	        bottom:"2%",
	        containLabel: true
	    },
	    xAxis : [
	        {
        	   axisLine:{
                  lineStyle:{
                    color:'#3e4148',
                    width:1,//这里是为了突出显示加上的
                  }
               },
	            type : 'category',
	            boundaryGap : false,
	            data : ['0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23']
	        }
	    ],
	    yAxis : [
	        {
	        	splitLine:{
		            lineStyle:{
		                color: '#21242b',
		            }
		        },
	            type : 'value',
	            axisLine:{
                    lineStyle:{
                        color:'#43484e',
                        width:0,//这里是为了突出显示加上的
                    }
                }
	        }
	    ],
	    series : [
	        {
	            name:'新增单量',
	            type:'line',
	            symbol:'none',
	            data:[50, 132,40, 1500, 2000, 800, 210,100],
	            smooth: true,
	            itemStyle : {
                    normal : {
                        lineStyle:{
                            color:'#533d86'
                        }
                    }
                },
                areaStyle: {normal: { color: ['rgba(255,255,255,0.1)']}},

	        },
	        {
	            name:'拣选单量',
	            type:'line',
	            symbol:'none',
	            data:[2, 8, 500, 2000,200,100, 50,50],
	            smooth: true,
	            itemStyle : {
                    normal : {
                        lineStyle:{
                            color:'#60ba9e'
                        }
                    }
                },
                areaStyle: {normal: { color: ['rgba(255,255,255,0.1)']}},

	        },
	        {
	            name:'质检单量',
	            type:'line',
	             symbol:'none',
	            data:[150, 500, 530, 1500, 1000, 330, 410,60],
	            smooth: true,
	            itemStyle : {
                    normal : {
                        lineStyle:{
                            color:'#476d9e'
                        }
                    }
                },
                areaStyle: {normal: { color: ['rgba(255,255,255,0.1)']}},

	        },
	        {
	            name:'出库单量',
	            type:'line',
	             symbol:'none',
	            data:[800, 400, 1500, 1200, 800, 700, 600,200],
	            smooth: true,
	            itemStyle : {
                    normal : {
                        lineStyle:{
                            color:'#b1526a'
                        }
                    }
                },
	            areaStyle: {normal: { color: ['rgba(255,255,255,0.1)']}},
	        }
	    ]
	};

	let myChart2 =echarts.init(document.getElementById('ship_order'));
	let option2 = {
		backgroundColor: '#1b1e25',
		title: {
	       text: '货主订单执行情况',
	       textStyle:{ //设置主标题风格
			 color:'#ffffff',//设置主标题字体颜色
			 fontSize:'14px',

			},
			subtext: '货主1   货主2     货主3     货主4     货主5     货主6      货主7',
			subtextStyle: {
		        color: '#ffffff'  // 副标题文字颜色
		    }
	    },
	    color: ['#ed4b97', '#26a0c9', '#44cb90', '#d2bd7a'],
	      tooltip: {},
	    legend: {
	        data: ['未开始', '作业中', '出库', '拦截'],
	        textStyle: {
		        color: '#ffffff'
		    },
		    right: 10,
		    itemWidth: 10,
            itemHeight: 10
	    },

	    calculable: true,
	     grid: {
	        left: '3%',
	        right: '3%',
	        bottom:"20",
	        containLabel: true
	    },
	    xAxis: [
	        {
	            type: 'category',
	            axisTick: {show: false},
	            data: ['货主1', '货主2', '货主3', '货主4', '货主5','货主6','货主7'],
	            "axisLabel":{
		    		interval: 0
		    	},
		    	axisLine:{
                  lineStyle:{
                    color:'#ffffff',
                    width:1,//这里是为了突出显示加上的
                  }
               },

	        }
	    ],
	    dataZoom: [{
                     type: 'slider',
                     show: true, //flase直接隐藏图形
                     xAxisIndex: [0],
                     left: '9%', //滚动条靠左侧的百分比
                     bottom: -5,
                     height: 15,
                     start: 0,//滚动条的起始位置
                     end: 50
         }] ,
	    yAxis: [
	        {
	        	splitLine:{
		            lineStyle:{
		                color: '#21242b',
		            }
		        },
	            type: 'value',
	            axisLine:{
                    lineStyle:{
                        color:'#43484e',
                        width:0,//这里是为了突出显示加上的
                    }
                }
	        }
	    ],
	    series: [
	        {
	            name: '未开始',
	            type: 'bar',
	            barGap: 0.2,
	            data: [320, 332,310,200,222,40,300]
	        },
	        {
	            name: '作业中',
	            type: 'bar',
	            data: [130, 182,30,50,122,20,30]
	        },
	        {
	            name: '出库',
	            type: 'bar',
	            data: [320, 82,220,250,322,50,10]
	        },
	        {
	            name: '拦截',
	            type: 'bar',
	            data: [100, 182,120,100,22,100,30]
	        }
	    ]
	};
	let myChart3 =echarts.init(document.getElementById('imple'));
	let option3 = {
		grid: {
	        left: '3%',
	        right: '3%',
	        top: '10%',
	        bottom:"2%",
	        containLabel: true
	    },
		title: {
	       text: '订单执行情况',
	       textStyle:{ //设置主标题风格
			 color:'#90939a',//设置主标题字体颜色
			 fontSize:'14px',

			},
	    },
		backgroundColor: '#1b1e25',
	    tooltip: {
	        trigger: 'item',
	        formatter: " {b}:{d}%"
	    },
	    legend: {
	        orient: 'vertical',
	        right: 10,
            y:'center',
            textStyle: {
		        color: '#7c8081'
		    },
            itemWidth: 10,
            itemHeight: 10,
	        data:['未开始','波次','拣选','质检','拦截','出库'],
	        formatter: function (params) {
			   for (var i = 0; i < option3.series[0].data.length; i++) {
			       if (option3.series[0].data[i].name == params) {
			           return params +":"+ option3.series[0].data[i].value;
			       }
			   }
			}

	    },
	    series: [
	        {
	            name:'订单执行情况',
	            type:'pie',
	            radius: ['50%', '70%'],
	            avoidLabelOverlap: false,
	            label: {
	                normal: {
	                    show: false,
	                    position: 'center'
	                },
	                emphasis: {
	                    show: true,
	                    textStyle: {
	                        fontSize: '20',
	                        fontWeight: 'bold'
	                    }
	                }
	            },

	            labelLine: {
	                normal: {
	                    show: false
	                }
	            },
	            data:[
	                {value:734, name:'未开始'},
	                {value:260, name:'波次'},
	                {value:62, name:'拣选'},
	                {value:294, name:'质检'},
	                {value:5376, name:'拦截'},
	                {value:17672, name:'出库'}
	            ],
			    itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                     },
                    normal:{
                        color:function(params) {
                        //自定义颜色
                        var colorList = [
                                '#74529e', '#da8f3c', '#447cb7', '#be4868', '#4dc892', '#efbb43',
                            ];
                            return colorList[params.dataIndex]
                         }
                    }
              }
	        }
	    ]
	};
  myChart1.setOption(option1);//今日作业趋势
  myChart2.setOption(option2);//货主订单执行情况
  myChart3.setOption(option3);//订单执行情况
      },
      data() {
        return {

        }
      },
      methods: {

      }
    }
</script>
<style scoped lang="scss">/*大屏*/
#container{height: 99%;background: #15181d;overflow: hidden;position: relative;padding: 0 2%;color: #ffffff;}
.page_top{height: 13%;display: flex; flex-wrap: nowrap;justify-content: space-between;align-items:center;}
.top_left{display: flex;justify-content:flex-start;align-items: center;}
.top_time{float: right;display: flex;}
.logo{display: flex;}
.wms_name{display: flex;position: relative;font-size: 36px;color: #777985;margin-left: 5px;margin-right: 45px;}
.wms_name em{position: absolute;display: block;background: #3c7cc6; right:-30px;top:10px;width: 27px;height: 15px;line-height: 15px;font-size: 12px;color: #FFFFFF;text-align: center;}
.depot{display: flex;width:76px;height: 22px;background: #7a7a78;position: relative;justify-content:center;}
.depot input{display: block;text-align: center; width: 100%;height: 22px;background: transparent;cursor: pointer;color: #5a9d67;font-weight: 900;box-sizing: border-box;line-height: 22px;}
.depot input::-webkit-input-placeholder {color:#5a9d67;}
.depot input:-moz-placeholder {color:#5a9d67;}
.depot input::-moz-placeholder {color:#5a9d67;}
.depot input:-ms-input-placeholder {color:#5a9d67;}
.depo_down{position: absolute;width: 100%;left: 0;top: 22px;color: #FFFFFF;text-align: center;display: none;}
.depo_down li{cursor: pointer;background: #7a7a78;transition: all .3s ease-in;}
.depo_down li:hover{background: #6b6a6d;}
.depo_down li+li{border-top: 1px dashed #b0b0b0;line-height: 26px;}
.top_time{display: flex;justify-content:flex-end;height: 100%;align-items: center;}
.top_time input{width: 140px;height: 22px;line-height: 22px;text-align: center;background: #2d313c;color: #FFFFFF;font-size: 14px;cursor: pointer;}
.top_time span{margin: 0 5px;font-size: 12px;}
.top_time .layui-laydate .layui-this{background-color:#7a7a78 !important;}
/*top*/
.order_list{height: 12.5%;display: flex;justify-content: space-between;align-items:center;}
.order{height: 100%;background: #1b1e25;display: flex; flex-direction:column;padding-top: 5px; justify-content: center;align-items: flex-start;width:19.2%;padding-left: 1.2%;box-sizing: border-box;}
.order_name{font-size: 14px;color: #989399;line-height: 26px;}
.order_num{font-family: "黑体"; height: 100%;display: flex;justify-content:flex-start;align-items:center ;font-size: 32px;font-weight: 900;}
.maina{height: 568px;background: #0c111d;margin-top: 1%;display: flex;justify-content:space-between;align-items:center;}
.main_left{display: flex; width:48%;height: 100%;flex-direction: column;justify-content:center;align-items:center;}
.main_midd{display: flex; width:35%;height: 100%;flex-direction: column;justify-content:space-between;align-items:flex-start;}
.home_today{width: 100%;height: 49%;display: flex;background: #1b1e25;flex-direction: column;justify-content:flex-start;align-items:flex-start; margin-bottom: 2%;padding-top: 2%;box-sizing: border-box;}
.home_tit{flex-grow:0;flex-shrink:0;display: flex;font-size: 14px;color: #797c85;padding-left: 3%;box-sizing: border-box;}
.home_list{flex-grow:0;flex-shrink:0;padding-left: 2%;box-sizing: border-box;margin-top: 10px; display: flex;flex-direction: row ;width: 100%; justify-content: space-between;align-items:flex-start;}
.home_order{width: 25%; display: flex;flex-direction: column;justify-content:flex-start;align-items:flex-start;}
.home_name{font-size: 12px;color: #aca9b0;}
.home_num{font-size: 18px;}
.new_num{color: #533d86;}
.jian_num{color: #60ba9e;}
.zhi_num{color: #476d9e;}
.chu_num{color: #b1526a;}
.ship_order{width: 100%;height: 49%;display: flex;background: #1b1e25;}
#home_today{width: 100%;display: flex;height: 100%;flex-direction: column;justify-content:flex-start;align-items:flex-start;}
#ship_order{padding-top:10px;box-sizing: border-box;}
.imple{width: 100%;height: 49%;padding-right: 20px;box-sizing: border-box; display: flex;background: #1b1e25;flex-direction: column;justify-content:flex-start;align-items:flex-start; margin-bottom: 2%;padding-top: 2%;box-sizing: border-box;}
.order_wait{width: 100%;height: 49%;display: flex;justify-content:space-between;align-items:flex-start; box-sizing: border-box;}
.commis{display: flex; width:49%;height: 100%;flex-direction: column;justify-content:center;align-items:flex-start;background: #1b1e25;padding:0 10px;box-sizing: border-box;}
.comm_tit{font-size: 14px;color: #979b9e; padding-left: 17px;box-sizing: border-box;padding-top: 5px; line-height: 28px;}
.comm_list{display: flex;height: 100%;width: 100%; flex-direction: column;justify-content: center;align-items: center;}
.comm_cont{border-bottom: 2px solid #1e2225; display: flex;width: 100%;justify-content: space-between;align-items: center;}
.com_name{display: flex;background: #d4d6d5;color: #2e2e2c;padding: 0 5px;}
.com_num{display: flex;}
.abort{display: flex; width:49%;height: 100%;flex-direction: column;padding-bottom: 10px;box-sizing: border-box; justify-content:flex-start;align-items:flex-start;background: #1b1e25;}
.abot_tit{font-size: 14px;color: #e0e1e3;padding-left: 17px;box-sizing: border-box;padding-top: 5px;line-height: 28px;}
.abort_box{display: flex;width: 100%;height: 100%;overflow: hidden;flex-direction: column;justify-content:flex-start;align-items:flex-start;}
.abort_list{font-size: 14px;color: #e0e1e3;padding:0 10px;box-sizing: border-box; display: flex;width: 100%;height: 100%;overflow-y: scroll;flex-direction: column;justify-content:flex-start;align-items:flex-start;}
.abort_cont{line-height:30px; display: flex;width: 100%;justify-content: space-between;align-items: center;}
.abort_name{display: flex;width: 50%;justify-content:flex-start;align-items: center;}
.abort_num{display: flex;width: 50%;justify-content:flex-start;align-items: center;}
.abort_use{width: 100%;height: auto;}
/*截止时间出库率*/
.main_rig{display: flex;background: #1b1e25; width:15%;height: 100%;flex-direction: column;justify-content:flex-start;align-items:flex-start;padding: 10px;box-sizing: border-box;}
.situ_tit{display: flex; font-size: 14px;color: #979b9e;line-height: 20px;padding-top: 5px;}
.situ_use {display: flex;width: 100%;height: 100%;overflow: hidden;flex-direction: column;justify-content: flex-start;align-items: flex-start;}
.situ_list{font-size: 14px;color: #e0e1e3;padding:0 10px;box-sizing: border-box; display: flex;width: 100%;height: 100%;overflow-y: scroll;flex-direction: column;justify-content:flex-start;align-items:flex-start;}
.situ_use{width: 100%;height: 100%;}
.situ_top span{vertical-align: middle;}
.situ_name{display: inline-block;height: 20px;line-height: 20px;background: #d1d2d4;padding: 0 10px;color: #454b4b;}
.situ_use ul{height: auto;width: 100%;}
.situ_time{margin-left: 2px;}
.situ_use li{margin-top: 10px;}
.lssl{display: flex;justify-content: space-between;align-items: center;width: 100%;margin-top: 5px;}
.lsl_name{display: flex;color: #898e94;}
.lsl_num{display: flex;color: #dfe0e5;}
.lal_all{width: 100%;height: 5px;background: #704fba;}
.quan{display: flex;justify-content: space-between;align-items: center;width: 100%;margin-top: 5px;}
.quan_name{display: flex;color: #898e94;}
.quan_num{display: flex;color: #dfe0e5;}
.quan_all{width: 100%;height: 5px;background: #1f2326;margin-top: 2px;position: relative;}
.tity{width: 20%;height: 5px;position: absolute;left: 0;top: 0;background: #4983d4;}
/*大屏*/

 h1, h2, h3, h4, h5, h6, hr, p, blockquote, dl, dt, dd, ul, ol, li, pre, form, fieldset, legend, button, input, textarea, th, td, img{border:medium none;margin: 0;padding: 0;font-size: 100%;}
button, input, select, textarea{font-size: 14px;line-height: 1.5;font-family: Arial, 'Microsoft Yahei';}
h1, h2, h3, h4, h5, h6{font-weight: normal;}
em{font-style:normal;}
ul, ol{list-style: none;}
input[type="text"],
input[type="password"],
button{background: none;border: none;outline: none;-webkit-appearance: none;}
textarea{resize: none;}
a{text-decoration: none;color:#333;}
a:hover{text-decoration: none;
		color:#008ccb;
		-moz-transition: all 0.3s ease-in;
		-webkit-transition: all 0.3s ease-in;
		-o-transition: all 0.3s ease-in;
		transition: all 0.3s ease-in;
}
img{border:0px;  outline-width:0px;  vertical-align:top;}
.clearfix { *zoom: 1; }
.clearfix:before, .clearfix:after {  display: table; line-height: 0; content: ""; }
.clearfix:after { clear: both; }
.fl { float:left;}
.fr { float:right;}
.hide { display:none !important;}
.show { display:block !important;}


/* Loader container */
.shcl {
    position: relative;
    width: 100px;
    height: 100px;
    margin: 0 auto;
}


/* Progress status */
.shcl > span {
    font-family: Verdana, Tahoma, Arial, sans-serif;
    font-size: 14px;
    color: black;
}

/* Loader dots */
.shcl > div {
    position: absolute;
    visibility: hidden;
    width: 10px;
    height: 10px;
    background: transparent;
    box-shadow: 0 0 10px black;

    -webkit-border-radius: 5px;
    -webkit-animation-name: shcl_bounce;
    -webkit-animation-duration: 1s;
    -webkit-animation-iteration-count: infinite;
    -webkit-animation-direction: linear;

    -moz-border-radius: 5px;
    -moz-animation-name: shcl_bounce;
    -moz-animation-duration: 1s;
    -moz-animation-iteration-count: infinite;
    -moz-animation-direction: linear;

    -o-border-radius: 5px;
    -o-animation-name: shcl_bounce;
    -o-animation-duration: 1s;
    -o-animation-iteration-count: infinite;
    -o-animation-direction: linear;

    -ms-border-radius: 5px;
    -ms-animation-name: shcl_bounce;
    -ms-animation-duration: 1s;
    -ms-animation-iteration-count: infinite;
    -ms-animation-direction: linear;

    border-radius: 5px;
    animation-name: shcl_bounce;
    animation-duration: 1s;
    animation-iteration-count: infinite;
    animation-direction: linear;
}

/* Animation keyframes */

@-webkit-keyframes shcl_bounce {
    0% {-webkit-transform: scale(1);}
    80% {-webkit-transform: scale(.3);}
    100% {-webkit-transform: scale(1);}
}

@-moz-keyframes shcl_bounce {
    0% {-moz-transform: scale(1);}
    80% {-moz-transform: scale(.3);}
    100% {-moz-transform: scale(1);}
}

@-o-keyframes shcl_bounce {
    0% {-o-transform: scale(1);}
    80% {-o-transform: scale(.3);}
    100% {-o-transform: scale(1);}
}

@-ms-keyframes shcl_bounce {
    0% {-ms-transform: scale(1);}
    80% {-ms-transform: scale(.3);}
    100% {-ms-transform: scale(1);}
}

@keyframes shcl_bounce {
    0% {transform: scale(1);}
    80% {transform: scale(.3);}
    100% {transform: scale(1);}
}

#loader{
	width: 80px;
	height: 80px;
	position: absolute;
	top: 50%;
	left: 50%;
	margin: -40px 0 0 -40px;
	z-index: 1000;
}





</style>
