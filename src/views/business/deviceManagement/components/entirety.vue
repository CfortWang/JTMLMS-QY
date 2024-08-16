<template>
  <div class="statisticsPage" :style="{width:width,height:height}">
    <div class="titleSty">{{title}}</div>
    <div class="bodySty">
      <div class="valueSty" v-for="(m,n) in value" :key="'value'+n">
        <div class="itemSty" v-for="(item, i) in m" :key="'m'+i">
          <div class="sumSty" v-if="i=='sum'">
            <div>
              <div class="circleSty">
                <svg t="1723529040934" class="icon" viewBox="0 0 1024 1024" version="1.1" p-id="17522" width="30" height="30"><path d="M784 128H240C152 128 80 200 80 288v448c0 88 72 160 160 160h544c88 0 160-72 160-160V288c0-88-72-160-160-160z m96 480H592c-52.8 0-96-43.2-96-96s43.2-96 96-96h288v192zM592 352c-88 0-160 72-160 160s72 160 160 160h288v64c0 52.8-43.2 96-96 96H240c-52.8 0-96-43.2-96-96V288c0-52.8 43.2-96 96-96h544c52.8 0 96 43.2 96 96v64H592z" fill="#ffffff" p-id="17523"></path><path d="M592 512m-32 0a32 32 0 1 0 64 0 32 32 0 1 0-64 0Z" fill="#ffffff" p-id="17524"></path></svg>
              </div>
            </div>
            <div>
              <div>{{captionArr[n]}}</div>
              <div style="font-size:28px;">{{item}}</div>
            </div>
          </div>
          <div class="mySty" v-else>
            <div>{{captionArr[i]}}</div>
            <div v-for="(t, e) in item" :key="'item'+e">{{captionArr[e]}}{{t}}</div>
          </div>
        </div>
      </div>
    </div>
    
  </div>
</template>

<script>
  export default {
    props: {
      value: {
        type: Object,
      },
      width:{
        type:String,
        default:"100%"
      },
      height:{
        type:String,
        default: "100%"
      },
      id:{
        type:Number,
        default:0
      },
      click:{
        type:String,
        default:'true'
      },
      colorw:{
        type:String,
        default:'#fff'
      },
      title:{
        type: String
      }
    },
    data () {
      return {
        captionArr:{
          totality: '当前设备总数',
          calibrate: '校准设备数',
          upkeep: '保养设备数',
          month: '本月',
          year: '本年',
          add: '新增',
          outService: '停用',
          scrap: '报废',
          calibrateNum: '已校准',
          upkeep: '已保养',
          unUpkeep: '未保养'
        }
      }
    },
    watch: {
        value: {
            handler () {
                // this.drawLine()
            },
            deep: true
        }
    },
    mounted(){
    },
  }
</script>
<style lang="scss" scoped>
  .statisticsPage{
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      padding: 1%;
      .titleSty{
        width: 100%;
        height: 15%;
        font-size: 24px;
        font-weight: 600;
      }
      .bodySty{
        width: 100%;
        height: 80%;
        display: flex;
        .valueSty{
          width: 33%;
          margin: 1%;
          padding: 1%;
          border: solid 1px rgb(233, 233, 233);
          border-radius: 10px;
          display: flex;
          flex-flow: column;
          .itemSty{
            display: flex;
          }
          .itemSty:first-child{
            height: 50%;
          }
          .itemSty:nth-child(2){
            height: 25%;
          }
          .itemSty:nth-child(3){
            height: 25%;
          }
          .sumSty{
            width: 100%;
            display: flex;
            justify-content: space-evenly;
            align-items: center;
            .circleSty{
              display: flex;
              align-items: center;
              justify-content: center;
              border-radius: 200px;
              padding: 15px;
              background-color: rgb(16, 142, 255);
            }
          }
          .mySty{
            width: 100%;
            display: flex;
            justify-content: space-between;
          }
        }
      }
      padding: 1%;
      /* background-color: rgba(6, 30, 93, 0.5); */
  }
</style>
