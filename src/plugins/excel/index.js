import papa from 'papaparse'
import ExcelJS from 'exceljs'

const ibpsExcel = {
    // 导入 CSV（保持原逻辑不变）
    csv (file) {
        return new Promise((resolve, reject) => {
            papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                complete: (results) => resolve(results),
                error: (err) => reject(err)
            })
        })
    },

    // 导入 Excel（支持图片）
    async xlsx (file, options = { raw: false }) {
        const reader = new FileReader()
        return new Promise((resolve, reject) => {
            reader.onload = async (e) => {
                try {
                    const buffer = new Uint8Array(e.target.result)
                    const workbook = new ExcelJS.Workbook()
                    await workbook.xlsx.load(buffer)

                    const worksheet = workbook.worksheets[0]
                    const { header, imagesMap } = this.processSheetMeta(workbook, worksheet)
                    const results = this.processSheetData(worksheet, header, imagesMap, options)
                    resolve({ header, results })
                } catch (error) {
                    reject(error)
                }
            }
            reader.readAsArrayBuffer(file)
        })
    },

    // 处理工作表元数据（表头+图片）
    processSheetMeta (workbook, worksheet) {
    // 处理表头
        const header = []
        worksheet.getRow(1).eachCell({ includeEmpty: true }, (cell, colNumber) => {
            header[colNumber - 1] = cell.text?.trim() || `列${colNumber}`
        })

        // 处理图片映射
        const imagesMap = new Map()
        worksheet.getImages().forEach((img, index) => {
            const { tl } = img.range
            const image = workbook.getImage(img.imageId)
            // console.log(img, image)

            // 检查图片数据是否存在
            if (!image || !image.buffer) {
                console.warn(`图片数据不存在或未正确加载，图片ID: ${img.imageId}`)
                return
            }

            // 只处理数据行（行号 >= 2）
            const rowIndex = Math.floor(tl.row) - 1 // 转换为结果数组索引
            if (rowIndex < 0) return

            // 生成唯一键：行索引_列索引_图片索引（避免 imageId 重复）
            const colIndex = Math.floor(tl.col)
            const mapKey = `${rowIndex}_${colIndex}_${index}`

            // 转换图片为 base64
            const base64 = this.arrayBufferToBase64(image.buffer)
            const imageData = {
                name: image.name,
                type: image.type,
                ext: image.extension,
                dimensions: image.size,
                data: `data:${this.getMimeType(image)};base64,${base64}`
            }

            imagesMap.set(mapKey, imageData)
        })

        return { header, imagesMap }
    },

    // 处理工作表数据
    processSheetData (worksheet, header, imagesMap, options) {
        const results = []
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) return // 跳过表头

            const rowData = { _images: {}}

            // 遍历所有列，确保每列都有属性值
            header.forEach((colName, colIndex) => {
                const cell = row.getCell(colIndex + 1) // 列索引从 1 开始
                const key = colName

                // 处理单元格值
                rowData[key] = options.raw ? cell.value : cell.text || '' // 为空时赋默认值

                // 处理关联图片
                const mapKeyPrefix = `${rowNumber - 2}_${colIndex}`
                for (const [mapKey, imageData] of imagesMap.entries()) {
                    if (mapKey.startsWith(mapKeyPrefix)) {
                        rowData._images[key] = imageData
                    }
                }
            })

            results.push(rowData)
        })
        return results
    },

    // ArrayBuffer 转 Base64
    arrayBufferToBase64 (buffer) {
        let binary = ''
        new Uint8Array(buffer).forEach(byte => {
            binary += String.fromCharCode(byte)
        })
        return btoa(binary)
    },

    // 获取图片 MIME 类型
    getMimeType (image) {
        const types = {
            png: 'image/png',
            jpeg: 'image/jpeg',
            gif: 'image/gif',
            bmp: 'image/bmp'
        }
        return types[image.extension] || 'application/octet-stream'
    }
}

export default ibpsExcel
