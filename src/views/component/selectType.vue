<template>
  <el-cascader :props="props"
               @change="handleChange">
  </el-cascader>
</template>
  
  <script>
import curdPost from "@/business/platform/form/utils/custom/joinCURD.js";
export default {
  data() {
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
            sqlString1 = `select *FROM ibps_cat_type WHERE parent_id_ in (select id_ from ibps_cat_type where NAME_= '${value}'  AND category_key_ ='FILE_TYPE') ORDER BY sn_ ASC`;
          }
          curdPost("sql", sqlString1).then((res1) => {
            let datas1 = res1.variables.data;
            setTimeout(() => {
              let nodes = datas1.map(item => ({
                value: item.NAME_,
                label: item.NAME_,
              }));
              // 通过调用resolve将子节点数据返回，通知组件数据加载完成
              resolve(nodes);
            }, 100);
          })
        }
      }
    };
  },
  mounted() {
  },
  methods: {
    handleChange(v) {
      const name = "wenJianLeiXing"; // 文件类型
      const value = v; //字段的值
      this.$emit("change-data", name, value);
    },

  },
  watch: {

  },
};
</script>
  
<style lang="scss" scoped>
</style>