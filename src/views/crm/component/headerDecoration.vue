<!--
 * @Author: cyy szjbdcyy@126.com
 * @Date: 2023-03-09 15:33:26
 * @LastEditors: cyy szjbdcyy@126.com
 * @LastEditTime: 2023-03-09 15:36:54
 * @FilePath: \lh_firm_former\src\views\statistics\headerDecoration.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div id="top">
    <dv-decoration-8 class="header-left-decoration" />
    <dv-decoration-5 class="header-center-decoration" />
   
    <dv-decoration-8 class="header-right-decoration" :reverse="true" />
    <div class="center-title">CRM看板</div></div>
    <!-- <span class="showTime">当前时间为:{{sendTime}}</span> -->
    
  </div>
</template>

<script>

export default {
  // props:['titleName'],
  data () {
    return {
      sendTime:''
      
	}
  },
  created(){
    this.currentTime()
  },
  methods:{
    currentTime() {
      setInterval(this.getNowTime, 500);
    },
    getNowTime(){
      const nowDate = new Date();
      const date = {
          year: nowDate.getFullYear(),
          month: nowDate.getMonth() + 1,
          day: nowDate.getDate(),
          hour: nowDate.getHours(),
          minute: nowDate.getMinutes(),
          second: nowDate.getSeconds()
      }
      this.sendTime = date.year + '年' + date.month + '月' + date.day + '日' +date.hour + '时' + date.minute + '分' + date.second + '秒'



    }
  }
}
</script>

<style lang="less">
#top {
  position: relative;
  width: 100%;
  height: 100px;
  display: flex;
  justify-content: space-between;
  flex-shrink: 0;
 
  .header-center-decoration {
    width: 40%;
    height: 60px;
    margin-top: 30px;
  }
  .header-left-decoration, .header-right-decoration {
    width: 25%;
    height: 60px;
  }
  .center-title {
    position: absolute;
    font-size: 30px;
    font-weight: bold;
    left: 50%;
    top: 15px;
    color: #fff;
    transform: translateX(-50%);
  }
}
</style>
