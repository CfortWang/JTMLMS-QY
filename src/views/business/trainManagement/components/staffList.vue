<template>
    <div style="height:100%">
        <div class="mb10 fontS">个人培训次数排名</div>
        <div class="box mt10"  style="height:100%">
            <div style="height:100%">
                <dv-scroll-board
                    :config="provinceConfirmedCountBoardConfig"
                    style="width: 100%; height: 100%"
                />
            </div>
        </div>
    </div>
  
</template>

<script>
const initProvinceConfirmedCountBoardConfig = (resultList = []) => {
  return {
    columnWidth: [100, 240, 160],
    data: resultList,
    align: ["center"],
    rowNum: 5,
    headerBGC: "",
    oddRowBGC: "",
    evenRowBGC: "",
    carousel: "single",
  };
};
export default {
    props: {
        value: {
            type: Array,
        },
    },
    data () {
        return {
        provinceConfirmedCountBoardConfig:
            initProvinceConfirmedCountBoardConfig(),
        }
    },

  created () {
    this.getBizBoardFn()
  },

  methods: {
    // 当前最新作业
    getBizBoardFn () {
      this.queryProvinceDataList(this.value)
    },
    queryProvinceDataList (arr) {
      this.setProvinceComfirmedCountBoardData(arr)
    },
    setProvinceComfirmedCountBoardData (areaList) {
      if (areaList && areaList.length > 0) {
        let resultList = areaList.map((item,i) => {
            let mid = i > 2 ? `<span class="circleOption" >${i+1}</span>` : `<span class="circleOption indexStyle">${i+1}</span>`
            return [
                mid,
                item.name,
                `<div style="width:100%;text-align: right;">${item.num}</div>`,
            ]
        })
        this.provinceConfirmedCountBoardConfig =
          initProvinceConfirmedCountBoardConfig(resultList);
      } else {
        this.provinceConfirmedCountBoardConfig =
          initProvinceConfirmedCountBoardConfig([])
      }
    },
  }
}
</script>

<style scoped  lang="scss">
.box {
  padding: 20px;
  box-sizing: border-box;
//   background-color: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}
.fontS{
    font-size: 20px;
    font-weight: 600;
}
//修改的是下拉框选项内容上方的尖角
::v-deep .el-popper .popper__arrow,
.el-popper .popper__arrow::after {
  display: none;
}
::v-deep .dv-scroll-board .header {
  background: transparent !important;
//   border-bottom: 2px solid #9ca3b3 !important;
  border-radius: 0;
}
::v-deep .rows .ceil{
    display: flex;
    align-items: center;
}
::v-deep .indexStyle {
    background-color: #fff;
    color: #A3A3A3 !important;
}
::v-deep .circleOption{ 
    align-items: center;
    border-radius: 100%;
    border: 1px solid;
    cursor: pointer;
    display: flex;
    font-size: 14px;
    font-weight: 400;
    height: 20px;
    justify-content: center;
    line-height: 25px;
    // margin: 0 20px 30px;
    position: relative;
    width: 20px;
    border-color: #FAFAFA;
    color: #fff;
}
</style>