// 来源于网络 有细微改动

import './_blob'
import FileSaver from 'file-saver'
import * as XLSX from 'xlsx'

function generateArray (table) {
    var out = []
    var rows = table.querySelectorAll('tr')
    var ranges = []
    for (var R = 0; R < rows.length; ++R) {
        var outRow = []
        var row = rows[R]
        var columns = row.querySelectorAll('td')
        for (var C = 0; C < columns.length; ++C) {
            var cell = columns[C]
            var colspan = cell.getAttribute('colspan')
            var rowspan = cell.getAttribute('rowspan')
            var cellValue = cell.innerText
            if (cellValue !== '' && cellValue === +cellValue) cellValue = +cellValue

            // Skip ranges
            ranges.forEach(function (range) {
                if (R >= range.s.r && R <= range.e.r && outRow.length >= range.s.c && outRow.length <= range.e.c) {
                    for (var i = 0; i <= range.e.c - range.s.c; ++i) outRow.push(null)
                }
            })

            // Handle Row Span
            if (rowspan || colspan) {
                rowspan = rowspan || 1
                colspan = colspan || 1
                ranges.push({ s: { r: R, c: outRow.length }, e: { r: R + rowspan - 1, c: outRow.length + colspan - 1 }})
            }

            // Handle Value
            outRow.push(cellValue !== '' ? cellValue : null)

            // Handle Colspan
            if (colspan) for (var k = 0; k < colspan - 1; ++k) outRow.push(null)
        }
        out.push(outRow)
    }
    return [out, ranges]
}

function datenum (v, date1904) {
    if (date1904) v += 1462
    var epoch = Date.parse(v)
    return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000)
}

function normalizeColor (val) {
    if (typeof val === 'string') return { rgb: val }
    return val
}

function mergeStyles (base = {}, override = {}) {
    const deepMerge = (a = {}, b = {}) => ({ ...a, ...b })
    return {
        font: deepMerge(base.font, override.font),
        alignment: deepMerge(base.alignment, override.alignment),
        border: deepMerge(base.border, override.border),
        fill: deepMerge(base.fill, override.fill),
        numFmt: override.numFmt || base.numFmt
    }
}

function sheet_from_array_of_arrays (data, columnStyles = {}, cellStyles = {}) {
    const ws = {}
    const range = { s: { c: 10000000, r: 10000000 }, e: { c: 0, r: 0 }}

    // 处理行高（全局设置）
    ws['!rows'] = data.map((_, rowIndex) => ({
        hpx: columnStyles.rows && columnStyles.rows[rowIndex] ? columnStyles.rows[rowIndex].height : 20 // 默认行高20px
    }))

    // 列宽设置
    ws['!cols'] = data[0].map((_, colIndex) => {
        const col = columnStyles[colIndex] || {}
        return {
            wpx: col.wpx,
            width: col.width,
            hidden: col.hidden
        }
    })

    // 处理列样式
    // ws['!cols'] = data[0].map((_, colIndex) => {
    //     const style = columnStyles[colIndex] || {}
    //     return {
    //         width: style.width || 15, // 列宽（字符单位）
    //         wpx: style.wpx, // 列宽（像素单位）
    //         hidden: style.hidden, // 是否隐藏列
    //         level: style.level, // 大纲级别
    //         numFmt: style.numFmt || '@', // 数字格式
    //         style: {
    //             alignment: style.alignment || {
    //                 wrapText: style.wrapText || false, // 自动换行
    //                 vertical: style.vertical || 'top', // 垂直对齐(top/middle/bottom)
    //                 horizontal: style.horizontal || 'left' // 水平对齐(left/center/right)
    //             },
    //             font: style.font || {
    //                 name: '宋体',
    //                 sz: 11,
    //                 bold: false,
    //                 color: { rgb: '000000' }
    //             },
    //             border: style.border || {
    //                 top: { style: 'thin', color: { rgb: '000000' }},
    //                 bottom: { style: 'thin', color: { rgb: '000000' }},
    //                 left: { style: 'thin', color: { rgb: '000000' }},
    //                 right: { style: 'thin', color: { rgb: '000000' }}
    //             },
    //             fill: style.fill // 背景色
    //         }
    //     }
    // })

    for (let R = 0; R < data.length; ++R) {
        for (let C = 0; C < data[R].length; ++C) {
            // 1. 计算单元格范围
            if (range.s.r > R) range.s.r = R
            if (range.s.c > C) range.s.c = C
            if (range.e.r < R) range.e.r = R
            if (range.e.c < C) range.e.c = C

            // 2. 初始化单元格
            const cellValue = data[R][C]
            if (cellValue == null) continue

            // 3. 合并样式（优先级：单元格样式 > 列样式）
            const colStyle = columnStyles[C] || {}
            const cellStyle = cellStyles[R] && cellStyles[R][C] || {}
            const style = mergeStyles(colStyle.style || colStyle, cellStyle)

            if (style.font && style.font.color) style.font.color = normalizeColor(style.font.color)
            if (style.fill && style.fill.fgColor) style.fill.fgColor = normalizeColor(style.fill.fgColor)
            if (style.border) {
                for (const key of ['top', 'bottom', 'left', 'right']) {
                    if (style.border[key] && style.border[key].color) { style.border[key].color = normalizeColor(style.border[key].color) }
                }
            }
            const cell = { v: cellValue, s: style }

            // 4. 类型和格式处理（支持优先级）
            if (typeof cell.v === 'number') {
                cell.t = 'n'
                cell.z = style.numFmt || '0.00'
            } else if (typeof cell.v === 'boolean') {
                cell.t = 'b'
                cell.z = style.numFmt || 'BOOLEAN'
            } else if (cell.v instanceof Date) {
                cell.t = 'n'
                cell.z = style.numFmt || 'yyyy-mm-dd'
                cell.v = datenum(cell.v)
            } else {
                cell.t = 's'
                cell.z = style.numFmt || '@'
            }

            const cell_ref = XLSX.utils.encode_cell({ c: C, r: R })
            ws[cell_ref] = cell
        }
    }
    if (range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range)
    return ws
}

function Workbook () {
    if (!(this instanceof Workbook)) return new Workbook()
    this.SheetNames = []
    this.Sheets = {}
}

function s2ab (s) {
    var buf = new ArrayBuffer(s.length)
    var view = new Uint8Array(buf)
    for (var i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF
    return buf
}

export function export_table_to_excel (id) {
    var theTable = document.getElementById(id)
    console.log('a')
    var oo = generateArray(theTable)
    var ranges = oo[1]

    // original data
    var data = oo[0]
    var ws_name = 'SheetJS'
    console.log(data)

    var wb = new Workbook(); var ws = sheet_from_array_of_arrays(data)

    // add ranges to worksheet
    // ws['!cols'] = ['apple', 'banan'];
    ws['!merges'] = ranges

    // add worksheet to workbook
    wb.SheetNames.push(ws_name)
    wb.Sheets[ws_name] = ws

    var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: false, type: 'binary' })

    FileSaver.saveAs(new Blob([s2ab(wbout)], { type: 'application/octet-stream' }), 'test.xlsx')
}

// function formatJson(jsonData) {
//     console.log(jsonData)
// }
export function export_json_to_excel (th, jsonData, defaultTitle, options = { merges: [], header: null, columnStyles: {}, cellStyles: {}}) {
    // original data
    var data = jsonData
    data.unshift(th)
    if (options.header) data.unshift([options.header])
    var ws_name = defaultTitle || 'SheetJS'

    var wb = new Workbook()
    var ws = sheet_from_array_of_arrays(data, options.columnStyles, options.cellStyles)

    // add merges area to worksheet
    let { merges } = options
    if (typeof merges[0] === 'string' && merges.length === 2) merges = [merges] // just one # ['A1', 'C1'] = > [['A1', 'C1']]
    merges = merges.map(i => i instanceof Array ? { s: i[0], e: i[1] } : i) // be sort :) # ['A1', 'C1'] => { s: 'A1', e: 'C3' }
    ws['!merges'] = merges

    // add worksheet to workbook
    wb.SheetNames.push(ws_name)
    wb.Sheets[ws_name] = ws

    var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: false, type: 'binary' })
    var title = defaultTitle || '列表'
    FileSaver.saveAs(new Blob([s2ab(wbout)], { type: 'application/octet-stream' }), title + '.xlsx')
}
