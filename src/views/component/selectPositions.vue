<template>
  <el-cascader ref="cascader"
               v-model="selectDatas"
               :options="options"
               :props="props"
               :collapse-tags="true"
               class="cascader">
  </el-cascader>
</template>
  
  <script>
import curdPost from "@/business/platform/form/utils/custom/joinCURD.js";
import TreeUtils from "@/utils/tree";

export default {
  data() {
    const { level, userId, userInfo } = this.$store.getters;
    return {
      level,
      userId,
      userInfo,
      props: {
        children: "children",
        label: "NAME_",
        value: "ID_",
        multiple: true,
        expandTrigger: "hover",
      },
      options: [],
      selectDatas: [],
      iniselectDatas: [],
    };
  },
  mounted() {
    this.getPositionList();
  },
  methods: {
    // 获取本账户所在的部门
    getPositionList() {
      let positonsSql = "";
      // 金通账号id
      if (this.userId == "702117247933480960") {
        positonsSql = `select * from ibps_party_entity where party_type_ = 'position' `;
      } else {
        // 所属医院的系统管理员
        let isAdmin = this.userInfo.role.some((so) => {
          return so.name == "系统管理角色";
        });
        if (isAdmin) {
          positonsSql = `select * from ibps_party_entity where party_type_ = 'position' and PATH_ like '%${this.level.first}%'  `;
        } else {
          let allPositions = [];
          for (var i of this.userInfo.positions) {
            for (var item of i.path.split(".")) {
              if (item !== "") {
                allPositions.push(`id_ like '%${item}%'`);
              }
            }
          }
          allPositions = [...new Set(allPositions)];
          // 如果是单纯的是普通账户登录，就只显示所属部门的信息
          positonsSql = `select * from ibps_party_entity where ${allPositions.join(
            " or "
          )}`;
        }
      }
      curdPost("sql", positonsSql).then((res) => {
        if (res.state === 200) {
          const datas = res.variables.data;
          let positionsValue = [];
          if (datas.length > 0) {
            this.options = this.toTree(datas);
            for (var i of this.options) {
              if (i.children !== undefined) {
                const getTail = (item) =>
                  item.children && item.children.length > 0
                    ? item.children.map((m) => getTail(m))
                    : [item];
                let result = _.flattenDeep(i.children.map((m) => getTail(m)));
                for (var item of result) {
                  let itemArr = item.PATH_.split(".");
                  itemArr.splice(itemArr.length - 1, 1);
                  positionsValue.push(itemArr);
                }
              }
            }
            this.selectDatas = positionsValue;
            if (this.iniselectDatas.length == 0) {
              this.iniselectDatas = positionsValue;
            }
          }
        }
      });
    },
    toTree(data) {
      return TreeUtils.transformToTreeFormat(data, {
        idKey: "ID_",
        pIdKey: "PARENT_ID_",
        childrenKey: "children",
      });
    },
  },
  watch: {
    selectDatas(v) {
      if (v.length == 0) {
        this.selectDatas = this.iniselectDatas;
        this.$emit("handleFunc", this.iniselectDatas);
      } else {
        this.$emit("handleFunc", v);
      }
    },
  },
};
</script>
<style lang="less" scoped>
/deep/ .el-tag--info {
  color: #fcfcfc;
  background-color: #00083e;
}
/deep/.el-input__inner {
  background-color: #00083e;
  border: 1px solid #4ea5d6;
}
</style>