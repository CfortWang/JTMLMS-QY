<template>
  <div
    class="pdf"
    :style="{
      height: height
    }"
  >
    <iframe v-if="pdfUrl" :src="pdfUrl" frameborder="0" style="width: 100%; height: 100%" />
  </div>
</template>
<script>
export default {
  data() {
    return {
      pdfUrl: null,
      height: '450px'
    }
  },
  mounted() {
    this.height = this.getDialogHeightHeight()
    window.addEventListener('resize', this.handleDialogHeightResize)
  },
  methods: {
    load(url) {
      this.pdfUrl = null
      url = encodeURIComponent(url)
      this.pdfUrl = `${this.$baseUrl}lib/pdfjs-dist/web/viewer.html?file=${url}`
    },
    loadData(data) {
      this.pdfUrl = null
      this.pdfUrl = `${this.$baseUrl}lib/pdfjs-dist/web/viewer.html?file=${data}`
    },
    handleDialogHeightResize() {
      this.height = this.getDialogHeightHeight()
    },
    getDialogHeightHeight() {
      return ((document.documentElement.clientHeight || document.body.clientHeight) - 60) + 'px'
    }
  }
}
</script>
