<template>
    <div class="statisticsPageEntirety" :style="{width:width,height:height}">
        <div class="titleSty">{{ title }}</div>
        <div v-show="show" class="bodySty">
            <div v-for="(m,n) in value" :key="'value'+n" class="valueSty">
                <div v-for="(item, i) in m" v-if="i==='sum' || n==='upKeep'" :key="'m'+i" class="itemSty">
                    <div v-if="i==='sum'" class="sumSty">
                        <div>
                            <div class="circleSty">
                                <img :src="es" width="50" height="50">
                                <!-- <svg t="1723771326890" class="icon" viewBox="0 0 1024 1024" version="1.1" p-id="1227" width="50" height="50"><path d="M512 512m-512 0a512 512 0 1 0 1024 0 512 512 0 1 0-1024 0Z" fill="#1990FF" opacity=".2" p-id="1228"></path><path d="M512 512m-409.6 0a409.6 409.6 0 1 0 819.2 0 409.6 409.6 0 1 0-819.2 0Z" fill="#1990FF" p-id="1229"></path><path d="M47.786667 75.093333m-47.786667 0a47.786667 47.786667 0 1 0 95.573333 0 47.786667 47.786667 0 1 0-95.573333 0Z" fill="#1990FF" p-id="1230"></path><path d="M1003.52 921.6m-20.48 0a20.48 20.48 0 1 0 40.96 0 20.48 20.48 0 1 0-40.96 0Z" fill="#1990FF" p-id="1231"></path><path d="M161.792 326.0416v425.506133a76.3904 76.3904 0 0 0 76.458667 76.458667h547.498666a76.3904 76.3904 0 0 0 76.458667-76.458667V326.0416z" fill="#FFFFFF" p-id="1232"></path><path d="M862.208 272.452267a76.3904 76.3904 0 0 0-76.458667-76.458667H238.250667a76.3904 76.3904 0 0 0-76.458667 76.458667v53.589333h700.416zM587.9808 711.68c-30.993067 0-60.6208-14.7456-88.337067-43.895467-32.3584-34.133333-68.949333-51.6096-108.7488-52.497066h-3.140266c-75.093333 0-138.0352 59.528533-138.6496 60.142933a8.942933 8.942933 0 1 1-12.356267-12.9024c2.730667-2.6624 68.266667-65.1264 150.9376-65.1264h3.4816c44.782933 0.955733 85.6064 20.48 121.378133 58.026667 26.760533 28.125867 54.613333 40.96 83.7632 37.888 60.962133-6.3488 106.973867-79.530667 107.451734-80.2816a8.942933 8.942933 0 1 1 15.223466 9.352533c-2.116267 3.345067-51.2 81.5104-120.832 88.746667-3.413333 0.341333-6.826667 0.546133-10.171733 0.546133z" fill="#70CAFF" p-id="1233"></path><path d="M630.715733 396.151467m27.306667 0l129.706667 0q27.306667 0 27.306666 27.306666l0 307.2q0 27.306667-27.306666 27.306667l-129.706667 0q-27.306667 0-27.306667-27.306667l0-307.2q0-27.306667 27.306667-27.306666Z" fill="#70CAFF" opacity=".2" p-id="1234"></path><path d="M699.460267 380.654933H411.306667a27.306667 27.306667 0 0 0-27.306667 27.306667v126.020267a27.306667 27.306667 0 0 0 27.306667 27.306666h102.4L546.542933 593.92a12.4928 12.4928 0 0 0 17.6128 0l33.041067-32.836267h102.4a27.306667 27.306667 0 0 0 27.306667-27.306666V407.825067a27.306667 27.306667 0 0 0-27.4432-27.170134z" fill="#5BC1F4" p-id="1235"></path><path d="M719.4624 261.051733m-13.653333 0a13.653333 13.653333 0 1 0 27.306666 0 13.653333 13.653333 0 1 0-27.306666 0Z" fill="#FFFFFF" p-id="1236"></path><path d="M760.4224 261.051733m-13.653333 0a13.653333 13.653333 0 1 0 27.306666 0 13.653333 13.653333 0 1 0-27.306666 0Z" fill="#FFFFFF" p-id="1237"></path><path d="M801.3824 261.051733m-13.653333 0a13.653333 13.653333 0 1 0 27.306666 0 13.653333 13.653333 0 1 0-27.306666 0Z" fill="#FFFFFF" p-id="1238"></path><path d="M418.816 419.4304m14.472533 0l244.1216 0q14.472533 0 14.472534 14.472533l0 12.014934q0 14.472533-14.472534 14.472533l-244.1216 0q-14.472533 0-14.472533-14.472533l0-12.014934q0-14.472533 14.472533-14.472533Z" fill="#FF9600" p-id="1239"></path><path d="M418.816 475.7504m11.6736 0l154.146133 0q11.6736 0 11.6736 11.6736l0 17.6128q0 11.6736-11.6736 11.6736l-154.146133 0q-11.6736 0-11.6736-11.6736l0-17.6128q0-11.6736 11.6736-11.6736Z" fill="#FF9600" p-id="1240"></path></svg> -->
                                <!-- <svg t="1723771143126" class="icon" viewBox="0 0 1024 1024" version="1.1" p-id="1211" width="30" height="30"><path d="M0.061225 0m170.655672 0l682.622688 0q170.655672 0 170.655672 170.655672l0 682.622688q0 170.655672-170.655672 170.655672l-682.622688 0q-170.655672 0-170.655672-170.655672l0-682.622688q0-170.655672 170.655672-170.655672Z" fill="#CCE1FF" p-id="1212"></path><path d="M393.849188 1004.30863a19.625402 19.625402 0 0 0 19.682288 19.682287h196.908203a20.25114 20.25114 0 0 0 7.537292-1.507458 19.454747 19.454747 0 0 0 10.637537-10.637537 19.739173 19.739173 0 0 0 1.507458-7.537292V632.848117a19.284091 19.284091 0 0 0-5.11967-13.225815 18.885894 18.885894 0 0 0-3.669097-3.128687l-196.908203-131.291097a20.108927 20.108927 0 0 0-9.954914-3.299343 19.739173 19.739173 0 0 0-20.649336 19.682288l0.028442 502.723167z m354.451831 0a19.625402 19.625402 0 0 0 19.682288 19.682287h98.468322a152.253302 152.253302 0 0 0 23.123844-1.706556 150.233877 150.233877 0 0 0 15.159912-3.014917 146.763878 146.763878 0 0 0 14.790158-4.493933 171.139196 171.139196 0 0 0 14.278192-5.916063 159.96125 159.96125 0 0 0 26.508514-15.870978 163.914773 163.914773 0 0 0 17.549092-15.131469 189.001157 189.001157 0 0 0 10.381553-11.462373 166.303952 166.303952 0 0 0 13.339585-18.94278 157.372972 157.372972 0 0 0 21.644828-65.56022 149.494369 149.494369 0 0 0 0.76795-15.444339v-540.409628a19.881386 19.881386 0 0 0-7.793275-15.728764 19.739173 19.739173 0 0 0-22.75409-0.711065 18.999665 18.999665 0 0 0-4.46549 4.067293L752.681181 606.112062a19.369419 19.369419 0 0 0-4.380162 12.372536V1004.30863z" fill="#004BBC" p-id="1213"></path><path d="M138.007893 423.794919h-11.377044c-3.81131 0-6.627129-0.967049-8.532784-2.844261a34.131134 34.131134 0 0 1-8.532784-5.688523 33.192528 33.192528 0 0 1-5.688522-8.532783c-1.877212 0-2.844261-0.967049-2.844261-2.844262-1.934098 0-2.844261-0.967049-2.844261-2.844261 0-1.905655-0.967049-2.872704-2.844262-2.872704v-5.688522-2.844261-5.688523-2.844261-5.688522-2.844261-2.844262c1.877212-1.877212 2.844261-3.782867 2.844262-5.688522s0.910164-2.844261 2.844261-2.844261v-2.844261c1.905655-1.877212 2.844261-3.782867 2.844261-5.688523 1.905655 0 2.844261-0.938606 2.844261-2.844261 1.877212 0 3.782867-0.938606 5.688523-2.844261l210.475328-156.434366c3.754425-3.782867 7.594177-5.688522 11.377045-5.688523 3.782867-1.877212 8.532784-2.844261 14.221306-2.844261 7.62262 0 14.221306 1.905655 19.909829 5.688523l261.67203 142.21306 170.655672-159.278628c1.905655 0 2.844261-0.938606 2.844261-2.844261 1.877212 0 2.844261-0.938606 2.844261-2.844261h5.688523c0-1.905655 0.967049-2.844261 2.844261-2.844261h2.844261c1.877212 0 3.782867-0.938606 5.688523-2.844261h11.377044c1.877212 0 3.754425 0.967049 5.688523 2.844261h2.844261c1.905655 0 3.782867 0.938606 5.688522 2.844261h2.844262c0 1.905655 0.910164 2.844261 2.844261 2.844261l2.844261 2.844261c1.905655 0 2.844261 0.967049 2.844261 2.844262l2.844261 2.844261 2.844262 2.844261c1.934098 1.905655 2.844261 3.81131 2.844261 5.688522v2.844262l2.844261 2.844261v25.598351l-2.844261 2.844261c0 1.905655-0.910164 3.81131-2.844261 5.688522V227.540896l-2.844262 2.844261-2.844261 2.844261-193.409761 179.188456-5.688523 5.688522c-1.877212 1.905655-3.782867 2.844261-5.688522 2.844262-1.934098 1.905655-3.81131 2.844261-5.688523 2.844261h-8.532783c-1.934098 1.905655-3.81131 1.905655-5.688523 0h-14.221306c-1.905655-1.877212-3.782867-2.844261-5.688522-2.844261l-264.516292-145.057322-187.721239 142.21306c-3.782867 1.905655-8.532784 3.81131-14.221306 5.688523h-11.377045z" fill="#EC532B" p-id="1214" data-spm-anchor-id="a313x.collections_detail.0.i4.21cd3a81bzm1dS" class="selected"></path><path d="M6.119502 749.007744a19.568517 19.568517 0 0 0-6.115162 14.221306v103.132912a157.230759 157.230759 0 0 0 31.002447 93.860619 157.429857 157.429857 0 0 0 66.271286 51.680226 163.77256 163.77256 0 0 0 21.986139 7.281309 170.285918 170.285918 0 0 0 15.159912 3.014917 151.314696 151.314696 0 0 0 15.387453 1.507458c2.559835 0.142213 5.148113 0.199098 7.736391 0.199098h98.468323a19.966714 19.966714 0 0 0 10.950405-3.327785 19.995156 19.995156 0 0 0 8.362128-12.514749 19.653845 19.653845 0 0 0 0.369754-3.839753V538.219547a19.483189 19.483189 0 0 0-7.08221-15.074584 19.625402 19.625402 0 0 0-26.195646 0.853278L6.119502 749.036187z" fill="#5D9CF9" p-id="1215"></path></svg> -->
                                <!-- <svg t="1723529040934" class="icon" viewBox="0 0 1024 1024" version="1.1" p-id="17522" width="30" height="30"><path d="M784 128H240C152 128 80 200 80 288v448c0 88 72 160 160 160h544c88 0 160-72 160-160V288c0-88-72-160-160-160z m96 480H592c-52.8 0-96-43.2-96-96s43.2-96 96-96h288v192zM592 352c-88 0-160 72-160 160s72 160 160 160h288v64c0 52.8-43.2 96-96 96H240c-52.8 0-96-43.2-96-96V288c0-52.8 43.2-96 96-96h544c52.8 0 96 43.2 96 96v64H592z" fill="#108eff" p-id="17523"></path><path d="M592 512m-32 0a32 32 0 1 0 64 0 32 32 0 1 0-64 0Z" fill="#108eff" p-id="17524"></path></svg> -->
                            </div>
                        </div>
                        <div>
                            <div style="font-size:1.0625em;font-weight:600;">{{ captionArr[n] }}</div>
                            <div style="font-weight:600;font-size:1.75em;color: rgb(255,255,0);margin-top: 1vh;text-align: center;">{{ item }}</div>
                        </div>
                    </div>
                    <div v-else-if="i!=='sum'&&n==='upKeep'" class="mySty">
                        <div class="textAlign">{{ captionArr[i] }}</div>
                        <div class="styFlex">
                            <div v-for="(t, e) in item" :key="'item'+e">
                                <div>{{ captionArr[e] }}</div>
                                <div style="color: rgb(255,255,0);font-weight:600;margin-top: 1vh;text-align: center;">{{ t }}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="n==='totality'" class="totaSty">
                    <div v-for="(item, i) in m" v-if="i!=='sum'" :key="'m2'+i" class="itemSty">
                        <div class="mySty styWidth">
                            <div class="textAlign">{{ captionArr[i] }}</div>
                            <div style="color: rgb(255,255,0);font-weight:600;margin-top: 1vh;text-align: center;">{{ m[i] }}</div>
                        </div>
                    </div>
                </div>
                <div v-else-if="n==='calibrate'" class="caliSty">
                    <div style="text-align: center">{{ captionArr['month'] }}</div>
                    <div class="totaSty flexCaliSty">
                        <div class="styWidth">
                            <div class="textAlign">{{ captionArr['monthAldyNum'] }}</div>
                            <div style="color: rgb(255,255,0);font-weight:600;margin-top: 1vh;text-align: center;">{{ m['monthAldyNum'] }}</div>
                        </div>
                        <div class="styWidth">
                            <div class="textAlign">{{ captionArr['monthPlanNum'] }}</div>
                            <div style="color: rgb(255,255,0);font-weight:600;margin-top: 1vh;text-align: center;">{{ m['monthPlanNum'] }}</div>
                        </div>
                    </div>
                    <div>
                        <div class="mySty totaSty flexCaliSty">
                            <div class="textAlign">{{ captionArr['nextMonthPlanNum'] }}</div>
                            <div style="color: rgb(255,255,0);font-weight:600;">{{ m['nextMonthPlanNum'] }}</div>
                        </div>
                    </div>
                    <div>
                        <div class="mySty totaSty flexCaliSty">
                            <div class="textAlign">{{ captionArr['yearPlanNum'] }}</div>
                            <div style="color: rgb(255,255,0);font-weight:600;">{{ m['yearPlanNum'] }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-show="!show" :style="{height:'80%'}"><div class="nullShow">暂无数据</div></div>
    </div>
</template>

<script>
import es from '@/assets/images/charts/es.png'

export default {
    props: {
        value: {
            type: Object
        },
        width: {
            type: String,
            default: '100%'
        },
        height: {
            type: String,
            default: '100%'
        },
        id: {
            type: Number,
            default: 0
        },
        click: {
            type: String,
            default: 'true'
        },
        colorw: {
            type: String,
            default: '#fff'
        },
        title: {
            type: String
        }
    },
    data () {
        return {
            es: es,
            captionArr: {
                totality: '当前设备总数',
                calibrate: '校准设备数',
                upkeep: '保养设备数',
                month: '本月',
                year: '本年',
                add: '新增',
                outService: '停用',
                scrap: '报废',
                calibrateNum: '已校准',
                upKeep: '已保养',
                upkeep: '已保养',
                unUpkeep: '未保养',
                monthAldyNum: '已校准',
                monthPlanNum: '计划校准',
                nextMonthPlanNum: '下月计划校准数',
                yearPlanNum: '本年计划校准数',
                stop: '停用设备数',
                use: '使用设备数'
            },
            show: false
        }
    },
    watch: {
        value: {
            handler (newVal) {
                this.show = true
            },
            deep: true
        }
    },
    mounted () {
    }
}
</script>
<style lang="scss" scoped>
  .statisticsPageEntirety{
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      padding: 1%;
      .titleSty{
        width: 100%;
        height: 15%;
        font-size: 1.5em;
        font-weight: 600;
      }
      .bodySty{
        width: 100%;
        height: 80%;
        display: flex;
        justify-content: space-evenly;
        .valueSty{
          width: 40%;
          margin: 1%;
          padding: 1%;
          // border: solid 1px rgb(233, 233, 233);
          background-color: rgba(14, 34, 93, 0.9);
          border-radius: 0.625em;
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
              border-radius: 12.5em;
              padding: 0.975em;
              // background-color: rgb(16, 142, 255);
            }
          }
          .totaSty{
            display: flex;
            font-size: small;
            justify-content: space-around;
          }
          .caliSty{
            font-size: small;
          }
          .mySty{
            width: 100%;
            font-size: small;
            .textAlign{
              text-align: center;
            }
            .styFlex{
              display: flex;
              justify-content: space-around;
            }
          }
          .styWidth{
            display: inline-block;
            // width: 50%;
          }
          .flexCaliSty{
            margin-top: 5%;
          }
        }
      }
      padding: 1%;
      /* background-color: rgba(6, 30, 93, 0.5); */
      .nullShow{
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.125em;
        height: 92%;
      }
  }
</style>
