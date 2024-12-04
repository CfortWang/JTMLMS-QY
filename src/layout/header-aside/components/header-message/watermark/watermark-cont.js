const watermark = {}

const setWatermark = (str = null, str1 = null) => { // 传入多个str 或者传入一个对象
    const id = '1.23452384164.123412415'

    if (document.getElementById(id) !== null) {
        document.body.removeChild(document.getElementById(id))
    }

    const can = document.createElement('canvas')
    can.width = 420
    can.height = 300

    const cans = can.getContext('2d')
    cans.rotate(-20 * Math.PI / 180)
    cans.font = '22px Vedana'
    cans.fillStyle = '#E7ECF0'
    cans.textAlign = 'left'
    cans.textBaseline = 'Middle'
    cans.fillText(str, can.width / 20, can.height / 1.5)
    cans.fillText(str1, can.width / 20, can.height / 1.3) // 这里渲染多行就可以展示多行，具体效果看上图，这里要调整高度的比例就可以做到换行的效果

    const div = document.createElement('div')
    div.id = id
    div.style.pointerEvents = 'none'
    div.style.top = '80px'
    div.style.left = '150px'
    div.style.position = 'fixed'
    div.style.zIndex = '-100000' // 这里设置层级 设为负值可以在页面下层
    div.style.width = document.documentElement.clientWidth - 100 + 'px'
    div.style.height = document.documentElement.clientHeight - 100 + 'px'
    div.style.background = 'url(' + can.toDataURL('image/png') + ') left top repeat'
    document.body.appendChild(div)
    return id
}

// 该方法只允许调用一次
watermark.set = (str, str1) => { // 这里要把传入的参数传进来
    let id = setWatermark(str, str1)
    setInterval(() => {
        if (document.getElementById(id) === null) {
            id = setWatermark(str, str1)
        }
    }, 500)
    window.onresize = () => {
        setWatermark(str, str1)
    }
}

export default watermark
