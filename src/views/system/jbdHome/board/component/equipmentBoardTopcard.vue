<template>
  <div id="top-bar" style="width:100%;height:100%">
    <div class="content">
      <!-- <div class="title">设备信息情况</div> -->
      <div class="bar">
        <div v-for="(item, index) in topBarData" :key="index" class="item">
          <div v-for="(v, i) in item.children" :key="i" class="box1" >
            <div class="label" style="text-align: center; ">{{ v.label }}</div>
            <div class="count" style="display: flex;justify-content: center;">
              <div v-if=" v.label.includes('计划')||v.label.includes('申请')" :style="{color:'#9966FF'}" style="font-weight:bold;font-size: 27px;">{{v.value}}</div>
              <div v-else-if="v.label.includes('报废/停用')" :style="{color:'#FF0066'}" style="font-weight:bold;font-size: 27px;">{{v.value}}</div>
              <div v-else-if="v.label.includes('受限')" :style="{color:'#CCFF33'}" style="font-weight:bold;font-size: 27px;">{{v.value}}</div>
              <div v-else-if="v.label.includes('已')||v.label.includes('完成')||v.label.includes('正常')||v.label.includes('率')" :style="{color:'#00b56a'}" style="font-weight:bold;font-size: 27px;">{{v.value}}</div>
              <div v-else :style="{color:'#66CCCC'}" style="font-weight:bold;font-size: 27px;">{{v.value}}</div>
              <div class="unit" style="line-height: 34px;">{{ v.unit }}</div>
            </div>
          </div>  
        </div>
      </div>
    </div>
    <dv-decoration-10 />
  </div>
</template>
<script>
import color from '@/store/modules/ibps/modules/color';

export default {
  name: "topBar",
  props: {
    info: {
      type: Array,
      default: [],
    },
  },
  components: {},
  watch: {
    info(v) {
      this.update();
    },
  },
  data() {
    return {
      topBarData: [],
      fontColor: [
        "#d20962",
        "#f47721",
        "#7ac143",
        "#00a78e",
        "#00bce4",
        "#7d3f98",
        "#037ef3",
        "#f85a40",
        "#00c16e",
        "#ffd900",
        "#0cb9c1",
        "#7552cc",
      ],
    };
  },
  created() {
    this.update();
  },
  methods: {
    //随机颜色
    getRandom(minNum, maxNum) {
      if (arguments.length === 1) {
        return parseInt(Math.random() * minNum + 1, 10);
      } else {
        return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
      }
    },
    // 数据更新
    update() {
      this.info.forEach((item) => {
        item.children.forEach((i) => {
          i.data = {
            number: [i.value],
            content: "{nt}",
            toFixed: 1,
            textAlign: "center",
            style: {
              fill: this.fontColor[this.getRandom(0, 11)],
              //  formatter
            },
          };
          i.unit = i.danwei;
        });
      });
      this.topBarData = JSON.parse(JSON.stringify(this.info));
      // console.log(this.topBarData);
    },
  },
};
</script>

<style lang="scss" scoped>
.content{
  height: 100%;
  width: 100%;
  min-height: 0px
  // background-color: rgba(6, 30, 93, 0.5);
  // .title{
  //   // width: 100%;
  //   margin: 20px 2%;
    
  // }
}
.bar {
  position: relative;
  margin: 20px 2%;
  width: 96%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgba(6, 30, 93, 0.5);
  .item {
    width: 20%;
    // width: calc(100% / 13);
    height: 60%;
    padding: 6px 6px;
    border-left: 5px solid rgb(6, 30, 93);
    &:first-child {
      width: 30%;
      display: flex;
      justify-content: space-around;
      align-items: center;
      box-sizing: border-box;
      .box1 {
          width: 20%;
      }
    }
    &:nth-child(2) {
      width: 15%;
      display: flex;
      justify-content: space-around;
      align-items: center;
      box-sizing: border-box;
      .box1 {
        width: 50%;
      }
    }
    &:nth-child(3) {
      width: 16%;
      display: flex;
      justify-content: space-around;
      align-items: center;
      box-sizing: border-box;
      .box1 {
        width: 50%;
      }
    }
    &:nth-child(4) {
      width: 15%;
      display: flex;
      justify-content: space-around;
      align-items: center;
      box-sizing: border-box;
      .box1 {
        width: 50%;
      }
    }
    &:last-child {
      width: 24%;
      display: flex;
      justify-content: space-around;
      align-items: center;
      box-sizing: border-box;
      .box1 {
        width: 33%;
      }
    }
    .title {
      text-align: center;
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 20px;
    }
    .box {
      display: inline-block;
      width: 33%;
      .label {
        text-align: center;
        font-size: 14px;
      }
      .count {
        display: flex;
        align-items: center;
        justify-content: center;
        .flop {
          width: 60px;
          height: 40px;
          font-size: 18px;
        }
        .flops{
          width: 180px;
          height: 40px;
          font-size: 10px;
        }
        .unit {
          margin-left: 10px;
          font-size: 18px;
          line-height: 27px;
          box-sizing: border-box;
        }
      }
    }
  }
}

#top-bar {
  height: 90%;
  width: 100%;
}
.dv-decoration-10 {
  width: 96%;
  margin: 7px 2% 0;
  height: 10%;
}
</style>
