export default {
  props: {
    data: {
      type: Object,
    },
    width:{
      type:String,
      default:"20%"
    },
    height:{
      type:String,
      default: window.screen.height/4+"px"
    },
    id:{
      type:String,
      default:"gongZheng"
    },
    click:{
      type:String,
      default:'true'
    },
  },
  }
