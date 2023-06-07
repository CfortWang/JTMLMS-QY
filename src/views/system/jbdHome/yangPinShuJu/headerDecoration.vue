<template>
  <div id="top">
    <dv-decoration-8 class="header-left-decoration" />
    <dv-decoration-5 class="header-center-decoration" />
   
    <dv-decoration-8 class="header-right-decoration" :reverse="true" />
    <div class="center-title">{{titleName}}</div>
    <!-- <span class="showTime">当前时间为:{{sendTime}}</span> -->
    
  </div>
</template>

<script>

export default {
  props:['titleName'],
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


      // var date  = new Date()
      // var yy = date.getFullYear()
      // var mm = date.getMonth() + 1
      // var dd = date.getDate()
      // var hh = date.getHours()
      // var mm = date.getMinutes()
      // var ss = date.getSeconds()
      // document.querySelector(".showTime").innerHTML = "当前时间为" + yy + '年' + mm + '月' + dd + '日' + ss + '时' + mm + '分' + ss + '秒'


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
    transform: translateX(-50%);
  }
}
</style>
