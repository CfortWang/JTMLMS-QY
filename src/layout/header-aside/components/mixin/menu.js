import Utils from '@/utils/util'

export default {
  methods: {
    /**
     *  顶部菜单点击
     * @param {*} index
     * @param {*} indexPath
     */
    handleHeaderMenuSelect(index, indexPath) {
      let name = null;
      let icon = null;
      for(let i in this.$store.getters.menus){
         if(this.$store.getters.menus[i].id==index){
           name = this.$store.getters.menus[i].title
           icon =this.$store.getters.menus[i].icon
         }
      }
      this.$router.push({path:"/blank",
           query:{
                name:name,
                icon:icon
                }
      })
      this.$emit('pageChange','change');
    return this.$store.dispatch('ibps/menu/activeHeaderSet', { activeHeader: index,vm: this })
    },
    /**
     * 其他菜单点击
     * @param {*} index
     * @param {*} indexPath
     */
    handleMenuSelect(index, indexPath) {
      if (/^ibps-menu-empty-\d+$/.test(index) || index === undefined) {
        this.$message.closeAll()
        this.$message.warning('临时菜单')
      } else if (/^https:\/\/|http:\/\//.test(index)) {
        Utils.open(index)
      } else {
        this.$router.push({
          path: index
        })
      }
    }
  }
}
