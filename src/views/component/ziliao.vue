<template>

  <el-form :rules="rules" :model="rulesForm" status-icon ref="ruleForm">
    <div class="form-wrap">
      <!--      <input type="text" v-model="formMess.id" /> -->
      <!--    <h2>{{ formMess.id }}</h2> -->
      <el-row>

        <el-form-item label="" prop="name" v-if="formMess.isShow" rules="rules">
          <el-input class="input" type="text" placeholder="请输入姓名" v-model="formMess.account"></el-input>
        </el-form-item>
        <el-form-item label="" prop="password" v-if="formMess.isShow" rules="rules">
          <el-input class="input" type="text" placeholder="请输入手机号" v-model="formMess.phone">
          </el-input>
        </el-form-item>

        <div class="cen">
          <el-form-item class="btn">
            <el-button type="success" @click="onSubmits()" v-if="formMess.Shows">注册并签到</el-button>
          </el-form-item>
          <el-form-item class="btn"  >
            <el-button type="success" @click="onSubmit()" v-if="formMess.Show">签  到</el-button>
          </el-form-item>
        </div>
      </el-row>
      <div v-if="ok" class="success">
        <img class="ok-img" src="../../assets/images/qrcode/ok.png" alt="">
      </div>


    </div>
  </el-form>

</template>
<script>
  import {
    get
  } from "@/api/detection/wx.js";
  import {
    adduser
  } from "@/api/detection/wx.js";
  export default {
    name: "from",
    data() {
      return {
        ok: false, // 判断是否签到成功
        formMess: {
          account: "",
          phone: "",
          message: "",
          isShow: false,
          openid: "666",
          Show: true,
          Shows: false,
          code: "",
          // "id": this.$route.params.id // 配置路由 path:'/ziliao/:id'
          id: this.$route.query.id, //2
        },
      };
    },

    created() {
      // // let url = "https://www.baidu.com?name=jimmy&age=18&height=1.88"
      // // queryString 为 window.location.search
      // const queryString = "?name=jimmy&age=18&height=1.88";
      // const queryParams = new URLSearchParams(queryString);
      // const paramObj = Object.fromEntries(queryParams);
      // console.log(paramObj); // { name: 'jimmy', age: '18', height: '1.88' }

      // let queryString=window.location.search
      //let queryString=window.location.href
      //let queryString = window.location.hash.split("?")[1];

      var queryString = window.location.search;
      queryString = queryString.substring(1, queryString.length);
      var targetPageId = queryString.split("&")[0].split("=")[1];
      var state = queryString.split("&")[1].split("=")[1];
      console.log(queryString.split("&"));
      console.log("state", state);
      console.log("queryString", queryString);
      console.log("targetPageId", targetPageId)


      let queryParams = new URLSearchParams(targetPageId);
      let paramObj = Object.fromEntries(queryParams);
      console.log("paramObj", paramObj);
      console.log("paramObj.code", paramObj.code);
      this.formMess.code = targetPageId;
      this.formMess.state = state;
    },
    methods: {
      onSubmit() {
        let that = this;
        let params = {
          code: that.formMess.code,
          state: that.formMess.state,
        };
        get(params).then((response) => {
          if (response.message == "未注册") {
            console.log("rep", response)
            that.formMess.openid = response.variables.openid;
            that.formMess.isShow = true;
            that.formMess.Show = false;
            that.formMess.Shows = true;
          } else {
            that.ok = true, // 判断是否签到成功
              that.formMess.Show = false,
              alert("签到成功！");
          }
        });
      },
      onSubmits() {
        let thiss = this;
        let data = {
          state: thiss.formMess.state,
          openid: thiss.formMess.openid,
          name: thiss.formMess.account,
          mobile: thiss.formMess.phone,
        };
        console.log("data", data.name);
        let params = JSON.stringify(data);
        if (data.name && data.mobile != '') {
          adduser(params).then((response) => {
            console.log("params", params)
            console.log("response1", response)
            thiss.ok = true
            thiss.formMess.isShow = false
            thiss.formMess.Shows = false
          });
        }
      },
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .ok-img {
    width: 200px;
    height: 200px;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  .app {
    width: 100%;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 30px;

  }

  .form-wrap,
  .success {
    max-width: 800px;
    height: 600px;
    width: 100%;
    height: calc(100vh - 50vh);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    border-radius: 10px;
    background-color: #ffffff;
    padding: 15px;
    padding-top: 40px;
    //box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, .1);
  }

  .btn {
    margin-top: 20px;
    min-width: 230px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    // padding: 8px 30px;
    border-radius: 4px;
    background-color: #85ce61;
    color: #fff;
    border: 0;
    font-size: 15px;
    transition: transform .2s ease-in-out;
    text-align: center;
    /deep/ .el-form-item__content button{
      min-width: 230px !important;
      line-height:40px
    }
  }

  .input {
    // min-width: 230px;
    padding: 10px 48px;
    // border: 1px solid #85ce61;
    // border-radius: 50px;
    // color: #333;
  }

  .cen {
    text-align: center;
     min-width: 230px;
  }

  // .btn:hover {
  //           transform: scale(0.98);
  //       }

  // .from_box {
  //   form {
  //     width: 90%;
  //     margin: auto;
  //     // border: .01rem solid gray;
  //     display: flex;
  //     flex-wrap: wrap;

  //     input {
  //       width: 80%;
  //       height: 0.5rem;
  //       margin-bottom: 0.2rem;
  //       border: 0.01rem solid black;
  //       height: 0.5rem;
  //     }
  //   }

  //   .but {
  //     font-size: 0.14rem;
  //     margin-left: 5%;
  //   }
  // }


  //label-width="100px"
</style>
