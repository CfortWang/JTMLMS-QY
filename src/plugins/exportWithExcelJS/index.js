import ExcelJS from 'exceljs'
import FileSaver from 'file-saver'

// 颜色字符串（如 'CCC'）格式标准化为 ARGB
function normalizeColor (val) {
    if (!val) return undefined
    if (typeof val === 'object') {
        if (val.argb) return { argb: formatARGB(val.argb) }
        if (val.rgb) return { argb: formatARGB(val.rgb) }
        return val
    }
    return { argb: formatARGB(val) }
}

// 字符串格式化为 ARGB
function formatARGB (colorStr) {
    if (!colorStr) return undefined
    let hex = colorStr.replace(/^#/, '').toUpperCase()
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('')
    if (hex.length === 6) return 'FF' + hex
    if (hex.length === 8) return hex
    return 'FFCCCCCC'
}

// 填充样式标准化
function normalizeFill (fill) {
    if (!fill || !fill.fgColor) return undefined
    return {
        // 固定为纯色填充，渐变填充 gradient exceljs支持不完整
        type: 'pattern',
        pattern: fill.pattern || 'solid',
        fgColor: normalizeColor(fill.fgColor),
        bgColor: fill.bgColor ? normalizeColor(fill.bgColor) : undefined
    }
}

// 边框标准化
function normalizeBorder (border, fallback) {
    const result = border && Object.keys(border).length ? { ...border } : { ...fallback }
    for (const side of ['top', 'bottom', 'left', 'right']) {
        if (result[side]) {
            result[side] = {
                style: result[side].style || 'thin',
                color: normalizeColor(result[side].color)
            }
        }
    }
    return result
}

// 样式合并
function mergeStyles (base = {}, override = {}, defaultBorder) {
    const deepMerge = (a = {}, b = {}) => ({ ...a, ...b })
    const merged = {
        font: deepMerge(base.font, override.font),
        alignment: deepMerge(base.alignment, override.alignment),
        border: deepMerge(base.border, override.border),
        fill: deepMerge(base.fill, override.fill),
        numFmt: override.numFmt || base.numFmt
    }
    merged.border = normalizeBorder(merged.border, defaultBorder)
    return merged
}

export async function exportExcel (config) {
    const {
        meta = {},
        layout = {},
        data = [],
        defaults = {}
    } = config

    const {
        title = 'Excel导出',
        header,
        merges = []
    } = meta

    const {
        columns = [],
        rowHeights = {},
        cellStyles = {},
        nameKey = 'prop',
        labelKey = 'label'
    } = layout

    // 默认边框，与Excel基础样式一致
    const defaultBorder = normalizeBorder(undefined, defaults.border || {
        top: { style: 'thin', color: 'D4D4D4' },
        bottom: { style: 'thin', color: 'D4D4D4' },
        left: { style: 'thin', color: 'D4D4D4' },
        right: { style: 'thin', color: 'D4D4D4' }
    })

    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('Sheet1')
    let currentRow = 1

    // 顶部标题行
    if (header && typeof header === 'object' && header.value) {
        worksheet.mergeCells(currentRow, 1, currentRow, columns.length)
        const cell = worksheet.getRow(currentRow).getCell(1)
        cell.value = header.value

        const headerStyle = {
            font: header.font || { name: '微软雅黑', size: 16, bold: true },
            alignment: header.alignment || { horizontal: 'center', vertical: 'middle' },
            fill: header.fill
        }

        if (headerStyle.font) cell.font = { ...headerStyle.font, color: normalizeColor(headerStyle.font.color) }
        if (headerStyle.alignment) cell.alignment = headerStyle.alignment
        const fill = normalizeFill(headerStyle.fill)
        if (fill) cell.fill = fill

        if (rowHeights[0]) worksheet.getRow(currentRow).height = rowHeights[0].height
        currentRow++
    }

    // 表头行
    const headerRow = worksheet.getRow(currentRow)
    columns.forEach((col, idx) => {
        const cell = headerRow.getCell(idx + 1)
        cell.value = col[labelKey]

        const style = mergeStyles(defaults, col, defaultBorder)
        if (style.font) cell.font = { ...style.font, color: normalizeColor(style.font.color) }
        if (style.alignment) cell.alignment = style.alignment
        const fill = normalizeFill(style.fill)
        if (fill) cell.fill = fill
        if (style.border) cell.border = style.border
    })

    if (rowHeights[currentRow - 1]) {
        worksheet.getRow(currentRow).height = rowHeights[currentRow - 1].height
    }
    currentRow++

    // 设置列宽等
    worksheet.columns = columns.map(col => ({
        key: col[nameKey],
        width: col.width || defaults.width || 15,
        hidden: col.hidden
    }))

    // 数据区域
    data.forEach((rowData, i) => {
        const row = worksheet.getRow(currentRow + i)
        columns.forEach((col, j) => {
            const cell = row.getCell(j + 1)
            cell.value = rowData[col[nameKey]]

            // 设置格式
            const format = col.format || defaults.format
            if (typeof cell.value === 'number' && format) cell.numFmt = format
            if (cell.value instanceof Date && format) cell.numFmt = format

            // 合并样式（默认 → 列 → 特殊单元格）
            const baseStyle = mergeStyles(defaults, col, defaultBorder)
            const overrideStyle = cellStyles[i]?.[j] || {}
            const style = mergeStyles(baseStyle, overrideStyle, defaultBorder)

            if (style.font) cell.font = { ...style.font, color: normalizeColor(style.font.color) }
            if (style.alignment) cell.alignment = style.alignment
            const fill = normalizeFill(style.fill)
            if (fill) cell.fill = fill
            if (style.border) cell.border = style.border
        })

        // 行高处理
        row.height = rowHeights[currentRow + i]?.height || defaults.height
    })

    // 合并单元格
    merges.forEach(m => {
        if (Array.isArray(m)) {
            worksheet.mergeCells(`${m[0]}:${m[1]}`)
        } else {
            worksheet.mergeCells(m.s.r + 1, m.s.c + 1, m.e.r + 1, m.e.c + 1)
        }
    })

    // 输出文件
    const buffer = await workbook.xlsx.writeBuffer()
    FileSaver.saveAs(new Blob([buffer], { type: 'application/octet-stream' }), `${title}.xlsx`)
}

export default exportExcel
