<template>
    <el-cascader
        ref="cascader"
        v-model="selectDatas"
        :options="options"
        :props="props"
        collapse-tags
        class="cascader"
        :clearable="false"
    />
</template>

<script>
import curdPost from '@/business/platform/form/utils/custom/joinCURD.js'
import TreeUtils from '@/utils/tree'

export default {
    props:{
        filterGroup: {
            type: Boolean,
            default: false
        }
    },
    data () {
        const { level, userId, userInfo } = this.$store.getters
        return {
            level,
            userId,
            userInfo,
            props: {
                children: 'children',
                label: 'NAME_',
                value: 'ID_',
                multiple: false,
                expandTrigger: 'hover',
                checkStrictly: true
            },
            sqlDatas: [],
            options: [],
            selectDatas: [],
            iniselectDatas: []
        }
    },
    watch: {
        selectDatas (v) {
            if (v.length == 0) {
                this.selectDatas = this.iniselectDatas
                this.$emit('handleFunc', this.iniselectDatas)
            } else {
                this.$emit('handleFunc', { v, i: this.sqlDatas })
            }
        }
    },
    mounted () {
        this.getPositionList()
    },
    methods: {
    // 获取本账户所在的部门
        getPositionList () {
            let positonsSql = ''
            // 金通账号id
            //   if (this.userId == "702117247933480960") {
            //     positonsSql = `select * FROM ibps_party_entity WHERE party_type_ = 'position'
            //             AND (
            //             DEPTH_ IN (1,2) OR (
            //             (DEPTH_=3 AND NAME_ = '检验科') OR  parent_id_ IN (SELECT id_ FROM ibps_party_entity WHERE DEPTH_=3 AND NAME_ = '检验科'  )  )
            //             )`;
            //   } else {
            //     // 所属医院的系统管理员
            //     let isAdmin = this.userInfo.role.some((so) => {
            //       return so.name == "系统管理角色";
            //     });
            //     if (isAdmin) {
            //       positonsSql = `select * from ibps_party_entity where party_type_ = 'position' and PATH_ like '%${this.level.first}%'
            //       AND (
            //             DEPTH_ IN (1,2) OR (
            //             (DEPTH_=3 AND NAME_ = '检验科') OR  parent_id_ IN (SELECT id_ FROM ibps_party_entity WHERE DEPTH_=3 AND NAME_ = '检验科'  )  )
            //             )`;
            //     } else {
            //       let allPositions = [];
            //       for (var i of this.userInfo.positions) {
            //         for (var item of i.path.split(".")) {
            //           if (item !== "") {
            //             allPositions.push(`id_ like '%${item}%'`);
            //           }
            //         }
            //       }
            //       allPositions = [...new Set(allPositions)];
            //       // 如果是单纯的是普通账户登录，就只显示所属部门的信息
            //       positonsSql = `select * from ibps_party_entity where ${allPositions.join(
            //         " or "
            //       )}`;
            //     }
            //   }
            // 所属医院的系统管理员
            const isAdmin = this.userInfo.role.some((so) => {
                return so.name == '系统管理角色'
            })
            //   if (isAdmin) {
            //     positonsSql = `select * from ibps_party_entity where party_type_ = 'position' and PATH_ like '%${this.level.first}%'
            //       AND (
            //             DEPTH_ not  IN (1,2) OR (
            //             (DEPTH_=3 AND NAME_ = '检验科') OR  parent_id_ IN (SELECT id_ FROM ibps_party_entity WHERE DEPTH_=3 AND NAME_ = '检验科'  )  )
            //             )`;
            //   } else {
            //     let allPositions = [];
            //     for (var i of this.userInfo.positions) {
            //       for (var item of i.path.split(".")) {
            //         if (item !== "") {
            //           allPositions.push(`id_ like '%${item}%'`);
            //         }
            //       }
            //     }
            //     allPositions = [...new Set(allPositions)];
            //     // 如果是单纯的是普通账户登录，就只显示所属部门的信息
            //     positonsSql = `select * from ibps_party_entity where (${allPositions.join(
            //       " or "
            //     )}) and DEPTH_ not  IN (1,2)`;
            //   }
            positonsSql = `select * from ibps_party_entity where party_type_ = 'position' and PATH_ like '%${this.level.first}%' 
          AND (
                DEPTH_ not  IN (1,2) OR (
                (DEPTH_=3 AND NAME_ = '检验科') OR  parent_id_ IN (SELECT id_ FROM ibps_party_entity WHERE DEPTH_=3 AND NAME_ = '检验科'  )  )
                )`
            curdPost('sql', positonsSql).then((res) => {
                if (res.state === 200) {
                    let datas = res.variables.data
                    this.sqlDatas = datas
                    const positionsValue = []
                    if (datas.length > 0) {
                        if(this.filterGroup){
                            datas = datas.filter(fil => {
                                console.log(datas)
                                return fil.ID_!=="1166373874003083264" && fil.NAME_.indexOf('综合')==-1
                            })
                        }
                        
                        this.options = this.toTree(datas)
                        // for (var i of this.options) {
                        //   //   if (i.children !== undefined) {
                        //   //   }
                        //   const getTail = (item) =>
                        //     item.children && item.children.length > 0
                        //       ? item.children.map((m) => getTail(m))
                        //       : [item];
                        //   let result = _.flattenDeep(i.children.map((m) => getTail(m)));
                        //   console.log('result', result)

                        //   for (var item of result) {
                        //     let itemArr = item.PATH_.split(".");
                        //     // console.log('itemArr', itemArr)

                        //     itemArr.splice(itemArr.length - 1, 1);
                        //     positionsValue.push(itemArr);
                        //   }
                        // }
                        for (var i of datas) {
                            console.log(i,datas)
                            
                            const itemArr = i.PATH_.split('.')
                            // 先删除前面部门的数据，比如："xxx医院/院本部/检验科....."，只保留"检验科....."
                            itemArr.splice(0, 2)
                            itemArr.splice(itemArr.length - 1, 1)
                            if(this.filterGroup&&(i.ID_==="1166373874003083264"||i.NAME_.indexOf('综合')!=-1)){
                                
                            }else{
                                positionsValue.push(itemArr)
                            }
                            
                        }
                        // this.selectDatas = positionsValue;
                        this.selectDatas = positionsValue.slice(0, 2).map(item => item[item.length - 1])
                        if (this.iniselectDatas.length == 0) {
                            this.iniselectDatas = positionsValue
                        }
                    }
                }
            })
        },
        toTree (data) {
            return TreeUtils.transformToTreeFormat(data, {
                idKey: 'ID_',
                pIdKey: 'PARENT_ID_',
                childrenKey: 'children'
            })
        }
    }
}
</script>
<style lang="less" scoped>
/deep/ .el-tag--info {
  color: #fcfcfc;
  background-color: #00083e;
}
/deep/.el-input__inner {
  background-color: #00083e;
  border: 1px solid #4ea5d6;
  color: #fff;
}
</style>
