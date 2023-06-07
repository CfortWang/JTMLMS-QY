import Ids from 'ids'
class waterMark {
  constructor(opt = {}) {
    this.CONTAINERID = opt.id || new Ids([32, 36, 1]).next()
    this.drawCanvas = this.drawCanvas.bind(this)
    this.parentObserver = this.parentObserver.bind(this)
    this.isOberserve = false
    this.repaint(opt)
    this.parentObserver()
  }

  init(opt) {
    this.option = {
      text: opt.text || '深圳市金源信通科技有限公司',
      font: opt.font || '30px 黑体',
      canvasWidth: opt.canvasWidth || 500,
      canvasHeight: opt.canvasHeight || 200,
      textAlign: opt.textAlign || 'center',
      textStyle: opt.textStyle || 'rgba(100,100,100,0.15)',
      degree: opt.degree || -20
    }
  }

  drawCanvas() {
    this.isOberserve = true
    const divContainer = document.createElement('div')
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    divContainer.id = this.CONTAINERID

    canvas.width = this.option.canvasWidth
    canvas.height = this.option.canvasHeight
    context.font = this.option.font
    context.textAlign = this.option.textAlign
    context.fillStyle = this.option.textStyle
    context.translate(canvas.width / 2, canvas.height / 2)
    context.rotate(this.option.degree * Math.PI / 180)
    context.fillText(this.option.text, 0, 0)

    const backgroundUrl = canvas.toDataURL('image/png')
    this.styleStr = `
            position:fixed;
            top:0;
            left:0;
            width:100%;
            height:100%;
            z-index:9999;
            pointer-events:none;
            background-repeat:repeat;
            background-image:url('${backgroundUrl}')`
    divContainer.setAttribute('style', this.styleStr)
    document.body.appendChild(divContainer)
    this.wmObserver(divContainer)
    this.isOberserve = false
  }

  wmObserver(divContainer) {
    const wmConf = { attributes: true, childList: true, characterData: true }
    const wmObserver = new MutationObserver((mo) => {
      if (!this.isOberserve) {
        const _obj = mo[0].target
        _obj.setAttribute('style', this.styleStr)
        _obj.setAttribute('id', this.CONTAINERID)
        wmObserver.takeRecords()
      }
    })
    wmObserver.observe(divContainer, wmConf)
  }

  parentObserver() {
    const bodyObserver = new MutationObserver(() => {
      if (!this.isOberserve) {
        const __wm = document.querySelector(`#${this.CONTAINERID}`)
        if (!__wm) {
          this.drawCanvas()
        } else if (__wm.getAttribute('style') !== this.styleStr) {
          __wm.setAttribute('style', this.styleStr)
        }
      }
    })
    bodyObserver.observe(document.querySelector(`#${this.CONTAINERID}`).parentNode, { childList: true })
  }
  /**
   * 重画
   * @param {*} opt
   */
  repaint(opt = {}) {
    this.isOberserve = true
    this.init(opt)
    const _wm = document.querySelector(`#${this.CONTAINERID}`)
    if (_wm) {
      _wm.parentNode.removeChild(_wm)
    }
    this.drawCanvas()
  }
}
export default waterMark
