const url = window.URL || window.webkitURL

if (!HTMLCanvasElement.prototype.toBlob) {
    Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
        value (cb, type, quality) {
            const s = atob(this.toDataURL(type, quality).split(',')[1])
            const n = s.length
            const r = new Uint8Array(n)

            for (let i = 0; i < n; i++) {
                r[i] = s.charCodeAt(i)
            }

            cb(new Blob([r], { type: 'image/jpeg' }))
        }
    })
}

export const compress = (file, maxWidth = 800, maxFileSize = 500 * 1024, quality = 0.8) => new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
        reject(new Error('File is not an image'))
        return
    }

    // GIF 文件不压缩
    if ((/^image\/gif$/).test(file.type)) {
        resolve(file)
        return
    }

    const img = new Image()
    img.src = url.createObjectURL(file)
    img.onerror = () => {
        url.revokeObjectURL(img.src)
        reject(new Error('Failed to load image'))
    }

    img.onload = () => {
        const [imgWidth, imgHeight] = [img.width, img.height]

        // 判断是否需要压缩：宽度超限 或 文件大小超限
        const needCompress = imgWidth > maxWidth || (maxFileSize > 0 && file.size > maxFileSize)

        if (!needCompress) {
            resolve(file)
            return
        }

        // 计算缩放后的尺寸（仅当宽度超限时才缩放）
        let targetWidth = imgWidth
        let targetHeight = imgHeight
        if (imgWidth > maxWidth) {
            targetWidth = maxWidth
            targetHeight = (imgHeight / imgWidth) * maxWidth
        }

        // 创建 Canvas
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        canvas.width = targetWidth
        canvas.height = targetHeight
        // canvas.setAttribute('width', maxWidth)
        // canvas.setAttribute('height', scaledHeight)

        // 绘制图片到 Canvas（仅在需要缩放时绘制）
        if (imgWidth > maxWidth) {
            ctx.drawImage(img, 0, 0, targetWidth, targetHeight)
        } else {
            ctx.drawImage(img, 0, 0)
        }

        // PNG图片背景透明压缩后变黑色处理。处理原理：将透明颜色的值强制改成白色255
        if ((/png/).test(file.type)) {
            const dt = ctx.getImageData(0, 0, targetWidth, targetHeight)

            for (let i = 0; i < dt.data.length; i += 4) {
                if (dt.data[i + 3] === 0) {
                    dt.data[i] = 255
                    dt.data[i + 1] = 255
                    dt.data[i + 2] = 255
                    dt.data[i + 3] = 255
                }
            }

            ctx.putImageData(dt, 0, 0)
        }

        const outputType = file.type === 'image/png' ? 'image/png' : 'image/jpeg'
        canvas.toBlob(blob => {
            url.revokeObjectURL(img.src)
            // 将 Blob 转换为 File 对象
            const compressedFile = new File([blob], file.name, {
                type: outputType,
                lastModified: Date.now()
            })
            resolve(compressedFile)
        }, outputType, quality)
    }
})
