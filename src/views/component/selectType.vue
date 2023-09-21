<template>
  <el-cascader ref="cascader"
               :props="props"
               @change="handleChange">
  </el-cascader>
</template>
  
  <script>
import curdPost from "@/business/platform/form/utils/custom/joinCURD.js";
export default {
  data() {
    const { first } = this.$store.getters.level
    return {
      props: {
        lazy: true,
        lazyLoad(node, resolve) {
          const { level, value } = node;
          let sqlString1 = "";
          if (level == 0) {
            // 286814138233389367 是文件分类标识的id，在ibps_cat_category
            sqlString1 = "select *FROM `ibps_cat_type` WHERE parent_id_='286814138233389367' ORDER BY sn_ ASC";
          } else {
            sqlString1 = `select *FROM ibps_cat_type WHERE parent_id_ in (select id_ from ibps_cat_type where ID_= '${value}'  AND category_key_ ='FILE_TYPE') ORDER BY sn_ ASC`;
          }
          curdPost("sql", sqlString1).then((res1) => {
            let datas1 = res1.variables.data;
            setTimeout(() => {
              let nodes = datas1.map(item => ({
                value: item.ID_,
                label: item.name_,
                authority: item.AUTHORITY_NAME
              }));
              // 通过调用resolve将子节点数据返回，通知组件数据加载完成
              resolve(nodes);
            }, 100);
          })
        }
      },
      first
    };
  },
  mounted() {
  },
  methods: {
    handleChange(v) {
      let nodesInfo = this.$refs['cascader'].getCheckedNodes()[0]
      let xilei = []
      let authorityBuMen = []
      const authority = JSON.parse(nodesInfo.data.authority)
      for (var i of nodesInfo.pathNodes) {
        xilei.push(i.label)
      }
      this.$emit("change-data", "wenJianLeiXing", nodesInfo.pathNodes[0].label)
      this.$emit("change-data", "wenJianXiLei", xilei.join(' / '))
      this.$emit("change-data", "xiLeiId", nodesInfo.value);
      this.$emit("change-data", "quanXianLeiXing", authority.chaYue);
      for (var i of authority.buMen) {
        if (i[0] == this.first) {
          authorityBuMen.push(i[i.length - 1])
        }
      }
      this.$emit("change-data", "quanXianXinXi", authorityBuMen.join(','));
      this.$emit("change-data", "zhuanYeBuMen", authorityBuMen.join(','));
      this.$emit("change-data", "guiShu", authorityBuMen.join(','));
    },

  },
  watch: {

  },
};
</script>
  
<style lang="scss" scoped>
</style>