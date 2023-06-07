<template>
   <div class="main1">
  		<div id="layer02" class="layer" style="height:15%;">
  			<div id="layer02_01" style="width:20%;">
  				<div class="layer02-data" style="curor:pointer;" onclick="location.href='https://shop188702750.taobao.com/search.htm?spm=a1z10.1-c.0.0.1221421cqgmNaI&search=y'">
  					<span style="font-size:26px;cursor:pointer;">400000</span>
  					<span style="font-size:16px;">台</span>
  				</div>
  				<canvas width="200" height="100"></canvas>
  			</div>
  			<div id="layer02_02" style="width:20%;curor:pointer;">
  				<div class="layer02-data" onclick="location.href='https://shop188702750.taobao.com/search.htm?spm=a1z10.1-c.0.0.1221421cqgmNaI&search=y'">
  					<span style="font-size:26px;curor:pointer;">300000</span>
  					<span style="font-size:16px;">KB</span>
  				</div>
  				<canvas width="200" height="100"></canvas>
  			</div>
  			<div id="layer02_03" style="width:21%;">
  				<div class="layer02-data" onclick="">
  					<span style="font-size:26px;curor:pointer;">31457280</span>
  					<span style="font-size:16px;">MB</span>
  				</div>
  				<canvas width="200" height="100"></canvas>
  			</div>
  			<div id="layer02_04" style="width:12%;">
  				<div class="layer02-data">
  					<span style="font-size:26px;">50</span>
  					<span style="font-size:16px;">PB</span>
  				</div>
  				<canvas width="120" height="100"></canvas>
  			</div>
  			<div id="layer02_05" style="width:12%;">
  				<div class="layer02-data">
  					<span style="font-size:26px;">25</span>
  					<span style="font-size:16px;">个</span>
  				</div>
  				<canvas width="120" height="100"></canvas>
  			</div>
  			<div id="layer02_06" style="width:12%;">
  				<div class="layer02-data">
  					<span style="font-size:26px;">5</span>
  					<span style="font-size:16px;">个</span>
  				</div>
  				<canvas width="120" height="100"></canvas>
  			</div>
  		</div>
  		<div id="layer03" class="layer" style="height:40%;">
  			<div id="layer03_left" style="width:48%;" class="layer03-panel">
  				<div id="layer03_left_label01" class="layer03-left-label">接入机型占比</div>
  				<!--
  				<div id="layer03_left_label02" class="layer03-left-label">(左)在线数量 (右)上线率</div>
  				-->
  				<div id="layer03_left_01" class="layer03-left-chart" style="width:16%;">
  					<canvas width="100" height="200" style="margin:30px 0 0 20px;"></canvas>
  				</div>

  				<div id="layer03_left_02" class="layer03-left-chart" style="width:80%;"></div>
  				<!--
  				<div id="layer03_left_03" class="layer03-left-chart" style="width:80%;"></div>
  				-->
  			</div>
  			<div id="layer03_right" style="width:50%;" class="layer03-panel">
  				<div id="layer03_right_label">存储</div>
  				<div id="layer03_right_chart01" class="layer03-right-chart">
  					<canvas width="130" height="150" style="margin:40px 0 0 20px;"></canvas>
  					<div class="layer03-right-chart-label">Hdfs</div>
  				</div>
  				<div id="layer03_right_chart02" class="layer03-right-chart">
  					<canvas width="130" height="150" style="margin:40px 0 0 20px;"></canvas>
  					<div class="layer03-right-chart-label">Rdbms</div>
  				</div>
  				<div id="layer03_right_chart03" class="layer03-right-chart">
  					<canvas width="130" height="150" style="margin:40px 0 0 20px;"></canvas>
  					<div class="layer03-right-chart-label">Rdies</div>
  				</div>
  			</div>
  		</div>
  		<div id="layer04" class="layer" style="height:30%;">
  			<div id="layer04_left" class="layer04-panel">
  				<div id="layer04_left_label" class="layer04-panel-label">30天日均线流量趋势</div>
  				<div id="layer04_left_chart" class="layer04-panel-chart"></div>
  			</div>
  			<div id="layer04_right" class="layer04-panel">
  				<div id="layer04_right_label" class="layer04-panel-label">
  					<span>集群性能/</span><span style="color:#00A09A;">近一个小时</span>
  				</div>
  				<div id="layer04_right_chart" class="layer04-panel-chart"></div>
  			</div>
  		</div>
  	</div>
</template>

 <script type="text/javascript">
   import echarts from 'echarts'
   import $ from 'jquery'
   //import myCanvas from 'vue-atom-canvas'

   var COLOR = {
   	MACHINE:{
   		TYPE_A:'#0175EE',
   		TYPE_B:'#D89446',
   		TYPE_C:'#373693',
   		TYPE_D:'#25AE4F',
   		TYPE_E:'#06B5C6',
   		TYPE_F:'#009E9A',
   		TYPE_G:'#AC266F'
   	}
   };
export default {
    components:{

    },
    props:{

   },
    mounted() {
      this.drawLayer02Label($("#layer02_01 canvas").get(0),"接入终端数量",80,200);
      this.drawLayer02Label($("#layer02_02 canvas").get(0),"今日接入数据数量",80,300);
      this.drawLayer02Label($("#layer02_03 canvas").get(0),"今日新增存储数据",80,400);
      this.drawLayer02Label($("#layer02_04 canvas").get(0),"总存储数据",50,200);
      this.drawLayer02Label($("#layer02_05 canvas").get(0),"当前任务个数",40,200);
      this.drawLayer02Label($("#layer02_06 canvas").get(0),"当前集群数",50,200);
      console.log(1)
      this.renderLegend();
console.log(2)
      //饼状图
      this.renderChartBar01();
      //renderChartBar02();
console.log(3)
      //存储
      this.renderLayer03Right();
console.log(4)
      //30天日均线流量趋势
      this.renderLayer04Left();
console.log(5)
      //集群性能
      this.renderLayer04Right();
      console.log(6)
    },
    data() {
      return {
         aa:''
      }
    },

    methods: {

       drawLayer02Label(canvasObj,text,textBeginX,lineEndX){
       	var colorValue = '#04918B';

       	var ctx = canvasObj.getContext("2d");

       	ctx.beginPath();
       	ctx.arc(35,55,2,0,2*Math.PI);
       	ctx.closePath();
       	ctx.fillStyle = colorValue;
       	ctx.fill();

       	ctx.moveTo(35,55);
       	ctx.lineTo(60,80);
       	ctx.lineTo(lineEndX,80);
       	ctx.lineWidth = 1;
       	ctx.strokeStyle = colorValue;
       	ctx.stroke();

       	ctx.font='12px Georgia';
       	ctx.fillStyle = colorValue;
       	ctx.fillText(text,textBeginX,92);
       },

       renderLegend(){

       	this.drawLegend(COLOR.MACHINE.TYPE_A,25,'A机型');
       	this.drawLegend(COLOR.MACHINE.TYPE_B,50,'B机型');
       	this.drawLegend(COLOR.MACHINE.TYPE_C,75,'C机型');
       	this.drawLegend(COLOR.MACHINE.TYPE_D,100,'D机型');
       	this.drawLegend(COLOR.MACHINE.TYPE_E,125,'E机型');
       	this.drawLegend(COLOR.MACHINE.TYPE_F,150,'F机型');
       	this.drawLegend(COLOR.MACHINE.TYPE_G,175,'G机型');
       },

       drawLegend(pointColor,pointY,text){
       	var ctx = $("#layer03_left_01 canvas").get(0).getContext("2d");
       	ctx.beginPath();
       	ctx.arc(20,pointY,6,0,2*Math.PI);
       	ctx.fillStyle = pointColor;
       	ctx.fill();
       	ctx.font='20px';
       	ctx.fillStyle = '#FEFFFE';
       	ctx.fillText(text,40,pointY+3);
       },


       //存储
       renderLayer03Right(){
       	this.drawLayer03Right($("#layer03_right_chart01 canvas").get(0),"#027825",0.66);
       	this.drawLayer03Right($("#layer03_right_chart02 canvas").get(0),"#006DD6",0.52);
       	this.drawLayer03Right($("#layer03_right_chart03 canvas").get(0),"#238681",0.34);
       },

       drawLayer03Right(canvasObj,colorValue,rate){
       	var ctx = canvasObj.getContext("2d");

       	var circle = {
               x : 65,    //圆心的x轴坐标值
               y : 80,    //圆心的y轴坐标值
               r : 60      //圆的半径
           };

       	//画扇形
       	//ctx.sector(circle.x,circle.y,circle.r,1.5*Math.PI,(1.5+rate*2)*Math.PI);
       	//ctx.fillStyle = colorValue;
       	//ctx.fill();

       	ctx.beginPath();
       	ctx.arc(circle.x,circle.y,circle.r,0,Math.PI*2)
       	ctx.lineWidth = 10;
       	ctx.strokeStyle = '#052639';
       	ctx.stroke();
       	ctx.closePath();

       	ctx.beginPath();
       	ctx.arc(circle.x,circle.y,circle.r,1.5*Math.PI,(1.5+rate*2)*Math.PI)
       	ctx.lineWidth = 10;
       	ctx.lineCap = 'round';
       	ctx.strokeStyle = colorValue;
       	ctx.stroke();
       	ctx.closePath();

       	ctx.fillStyle = 'white';
       	ctx.font = '20px Calibri';
       	ctx.fillText(rate*100+'%',circle.x-15,circle.y+10);

       },


       renderChartBar01(){
         console.log(echarts)
       	let myChart = echarts.init(document.getElementById("layer03_left_02"));
        console.log("1111")
       		myChart.setOption(
       					 {
       						title : {
       							text: '',
       							subtext: '',
       							x:'center'
       						},
       						tooltip : {
       							trigger: 'item',
       							formatter: "{b} : {c} ({d}%)"
       						},
       						legend: {
       							show:false,
       							x : 'center',
       							y : 'bottom',
       							data:['A机型','B机型','C机型','D机型','E机型','F机型','G机型']
       						},
       						toolbox: {
       						},
       						label:{
       							normal:{
       								show: true,
       								formatter: "{b} \n{d}%"
       							}
       						},
       						calculable : true,
       						color:[COLOR.MACHINE.TYPE_A,COLOR.MACHINE.TYPE_B,COLOR.MACHINE.TYPE_C,COLOR.MACHINE.TYPE_D,COLOR.MACHINE.TYPE_E,COLOR.MACHINE.TYPE_F,COLOR.MACHINE.TYPE_G],
       						series : [
       							{
       								name:'',
       								type:'pie',
       								radius : [40, 80],
       								center : ['50%', '50%'],
       								//roseType : 'area',
       								data:[
       									{value:4600, name:'A机型'},
       									{value:4600, name:'B机型'},
       									{value:15600, name:'C机型'},
       									{value:6600, name:'D机型'},
       									{value:5700, name:'E机型'},
       									{value:7600, name:'F机型'},
       									{value:3500, name:'G机型'}
       								]
       							}
       						]
       					}
       		);

       },

       renderLayer04Left(){
         console.log(1118)
         let myChart = echarts.init(document.getElementById("layer04_left_chart"));
         console.log(1112)
       	myChart.setOption(
       			{
       				title: {
       					text: ''
       				},
       				tooltip : {
       					trigger: 'axis'
       				},
       				legend: {
       					data:[]
       				},
       				grid: {
       					left: '3%',
       					right: '4%',
       					bottom: '5%',
       					top:'4%',
       					containLabel: true
       				},
       				xAxis :
       				{
       					type : 'category',
       					boundaryGap : false,
       					data : this.getLatestDays(31),
       					axisLabel:{
       						textStyle:{
       							color:"white", //刻度颜色
       							fontSize:8  //刻度大小
       						},
       						rotate:45,
       						interval:2
       					},
       					axisTick:{show:false},
       					axisLine:{
       						show:true,
       						lineStyle:{
       							color: '#0B3148',
       							width: 1,
       							type: 'solid'
       						}
       					}
       				},
       				yAxis :
       				{
       					type : 'value',
       					axisTick:{show:false},
       					axisLabel:{
       						textStyle:{
       							color:"white", //刻度颜色
       							fontSize:8  //刻度大小
       							}
       					},
       					axisLine:{
       						show:true,
       						lineStyle:{
       							color: '#0B3148',
       							width: 1,
       							type: 'solid'
       						}
       					},
       					splitLine:{
       						show:false
       					}
       				},
       				tooltip:{
       					formatter:'{c}',
       					backgroundColor:'#FE8501'
       				},
       				series : [
       					{
       						name:'',
       						type:'line',
       						smooth:true,
       						areaStyle:{
       							normal:{
       								color:new echarts.graphic.LinearGradient(0, 0, 0, 1, [{offset: 0, color: '#026B6F'}, {offset: 1, color: '#012138' }], false),
       								opacity:0.2
       							}
       						},
       						itemStyle : {
       	                            normal : {
       	                                  color:'#009991'
       	                            },
       								lineStyle:{
       									normal:{
       									color:'#009895',
       									opacity:1
       								}
       							}
       	                    },
       						symbol:'none',
       						data:[48, 52, 45, 46, 89, 120, 110,100,88,96,88,45,78,67,89,103,104,56,45,104,112,132,120,110,89,95,90,89,102,110,110]
       					}
       				]
       			}
       		);
        console.log(1114)
       },

       renderLayer04Right(){
       	let myChart = echarts.init(document.getElementById("layer04_right_chart"));
       	myChart.setOption({
       			title: {
       				text: ''
       			},
       			tooltip: {
       				trigger: 'axis'
       			},
       			legend: {
       				top:20,
       				right:5,
       				textStyle:{
       					color:'white'
       				},
       				orient:'vertical',
       				data:[
       						{name:'网络',icon:'circle'},
       						{name:'内存',icon:'circle'},
       						{name:'CPU',icon:'circle'}
       					]
       			},
       			grid: {
       				left: '3%',
       				right: '16%',
       				bottom: '3%',
       				top:'3%',
       				containLabel: true
       			},
       			xAxis: {
       				type: 'category',
       				boundaryGap: false,
       				axisTick:{show:false},
       				axisLabel:{
       					textStyle:{
       						color:"white", //刻度颜色
       						fontSize:8  //刻度大小
       						}
       				},
       				axisLine:{
       					show:true,
       					lineStyle:{
       						color: '#0B3148',
       						width: 1,
       						type: 'solid'
       					}
       				},
       				data: this.get10MinutesScale()
       			},
       			yAxis: {
       				type: 'value',
       				axisTick:{show:false},
       				axisLabel:{
       					textStyle:{
       						color:"white", //刻度颜色
       						fontSize:8  //刻度大小
       						}
       				},
       				axisLine:{
       					show:true,
       					lineStyle:{
       						color: '#0B3148',
       						width: 1,
       						type: 'solid'
       					}
       				},
       				splitLine:{
       					show:false
       				}
       			},
       			series: [
       						{
       							name:'网络',
       							type:'line',
       							itemStyle : {
       									normal : {
       									color:'#F3891B'
       								},
       								lineStyle:{
       									normal:{
       									color:'#F3891B',
       									opacity:1
       										}
       								}
       							},
       							data:[120, 132, 101, 134, 90, 230, 210]
       						},
       						{
       							name:'内存',
       							type:'line',
       							itemStyle : {
       									normal : {
       									color:'#006AD4'
       								},
       								lineStyle:{
       									normal:{
       									color:'#F3891B',
       									opacity:1
       										}
       								}
       							},
       							data:[220, 182, 191, 234, 290, 330, 310]
       						},
       						{
       							name:'CPU',
       							type:'line',
       							itemStyle : {
       									normal : {
       									color:'#009895'
       								},
       								lineStyle:{
       									normal:{
       									color:'#009895',
       									opacity:1
       										}
       								}
       							},
       							data:[150, 232, 201, 154, 190, 330, 410]
       						}
       					]
       		}
       	);
       },

       get10MinutesScale()
       {
       	var currDate = new Date();
       	var odd = currDate.getMinutes()%10;
       	var returnArr = new Array();
       	currDate.setMinutes(currDate.getMinutes()-odd);
       	for(var i = 0; i <7; i++){
       		returnArr.push(currDate.getHours()+":"+(currDate.getMinutes()<10?("0"+currDate.getMinutes()):currDate.getMinutes()));
       		currDate.setMinutes(currDate.getMinutes()-10);
       	}
       	return returnArr;
       },


       getLatestDays(num)
       {
       	var currentDay = new Date();
       	var returnDays = [];
       	for (var i = 0 ; i < num ; i++)
       	{
       		currentDay.setDate(currentDay.getDate() - 1);
       		returnDays.push((currentDay.getMonth()+1)+"/"+currentDay.getDate());
       	}
       	return returnDays;
       }
    }
  }

  </script>
 <style scoped>
	.main1{width:1024px;height:768px;position:relative;margin:auto;background-image: url(../../assets/images/charts/nybj.png);background-size:100% 100%;font-weight:bold;font-family:苹方;overflow: hidden;}
	.layer{position:relative;width:100%;}
	#layer01{}
	#layer01 img{text-align: center;display: block;height: 35px;padding-top: 35px;margin: auto;}
	#layer02 > div{height:100%;float:left;position:relative;}
	.layer02-data{position: absolute;width: auto;height: 100px;color: white;top: 45px;left: 65px;}
	.layer03-panel{height:100%;position:relative;float:left;}
	.layer03-left-label{position:absolute;}
	#layer03_left_label01{top:10px;left:10px;color:white;height:20px;width:200px;font-weight: bold;}
	#layer03_left_label02{right:10px;top:10px;color:#036769;height:20px;width:200px;}
	.layer03-left-chart{position:relative;float:left;height:100%;}
	#layer03_right_label{position:absolute;top:10px;left:10px;color:white;height:20px;width:100px;}
	.layer03-right-chart{position:relative;float:left;height:100%;width:32%;}
	.layer03-right-chart-label{color: white;text-align: center;position: absolute;bottom: 60px;width: 100%;}
	.layer04-panel{position:relative;float:left;height:100%;width:48%;}
	.layer04-panel-label{width:100%;height:15%;color:white;padding-top:5px;}
	.layer04-panel-chart{width:100%;height:85%;}
  </style>
