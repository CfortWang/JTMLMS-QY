<template>
  <div id="paramList" style="height: 100%;" >
    <div  v-for="item in links">
      <a href="#"  @click="myLink(item.param)">{{item.name}}</a><br>
    </div>
    </div>
</template>

<script>
  import $dialog from '@/utils/dialog'
  import store from '@/store'
  import { mapState, mapGetters, mapActions } from 'vuex'
  import curdPost from '@/business/platform/form/utils/custom/joinCURD.js'

  export default {
    name: "paramList",
    props: {
      form: {
        type: Object,
        default () {
          return {}
        }
      },
      formData: {
        type: Object,
        default () {
          return {}
        }
      },
    },
    computed: {
     ...mapState('ibps/param', {
       myform: state => state.myform
     }),
    },
    methods: {
      closePopo(){
        this.visible = false
        this.myform.dialogTemplate = null
      },
      openDataTemplateParamDialog(form, { type }) {
          $dialog({
             components:{
            //    templateList: () => import ('@/views/detection/jtsjpz/view.vue'),
               },
            data() {
              return {
                type:type
              }
            },
            template: `<div style="height:600px;">

                            <template-list location="absolute" />

                      </div>`
          }, {
            dialog: {
              appendToBody: true,
              width: '60%'
            }
          }, (tpl) => {

            form.dialogTemplate = tpl

          }).catch((_this) => {
            _this.visible = false
        // 关掉弹窗
            form.dialogTemplate = null
          })

        },
      myLink(val) {
        this.openDataTemplateParamDialog(this.myform, {
          type:'param'
        })
      },
      display(){
        let that = this
        let weiTuoDanHao = that.formData.weiTuoDanHao
        let sql = "select jian_ce_dui_x_id_ FROM t_gdyrqcwt a1 WHERE wei_tuo_dan_hao_='"+weiTuoDanHao+"'"

            curdPost('sql',sql).then(response => {
                 let dbData = response.variables.data
                 if(dbData[0].jian_ce_dui_x_id_){
                   let ids = dbData[0].jian_ce_dui_x_id_.split(",")
                   let idsVal = "'"+ids[0]+"'"
                   ids.forEach(function(e,ind){
                     if(ind>0){
                       idsVal += ",'"+e+"'"
                     }
                   })
                   sql = "select id_,xiang_mu_can_shu_ FROM t_sysjtsjpz a1 WHERE id_ in("+idsVal+")"
                   curdPost('sql',sql).then(response => {
                        let dbData = response.variables.data
                        that.links=[]
                        if(dbData){
                          dbData.forEach(function(e){
                             that.links.push({name:e.xiang_mu_can_shu_,param:e.id_})
                          })
                        }
                   })
                 }
            })
      }
    },
    mounted() {
      this.$nextTick(() => {
        setTimeout(() => {
          this.display();
        }, 0)
      })
    },

    data(){
      return {
         links:[]
      }
    },
    created() {

    },
  }
</script>
<style scoped>
  #paramList {
    width: 300px;
    height: 30px;
  }
</style>
