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

function sheet_from_array_of_arrays (data, columnStyles = {}) {
    var ws = {}
    var range = { s: { c: 10000000, r: 10000000 }, e: { c: 0, r: 0 }}
    for (var R = 0; R !== data.length; ++R) {
        for (var C = 0; C !== data[R].length; ++C) {
            if (range.s.r > R) range.s.r = R
            if (range.s.c > C) range.s.c = C
            if (range.e.r < R) range.e.r = R
            if (range.e.c < C) range.e.c = C
            var cell = { v: data[R][C] }
            if (cell.v == null) continue
            var cell_ref = XLSX.utils.encode_cell({ c: C, r: R })
            var style = columnStyles[C] || {}
            if (typeof cell.v === 'number') {
                cell.t = 'n'
                if (style.numFmt) cell.z = style.numFmt
            } else if (typeof cell.v === 'boolean') {
                cell.t = 'b'
            } else if (cell.v instanceof Date) {
                cell.t = 'n'
                cell.z = style.numFmt || XLSX.SSF._table[14]
                cell.v = datenum(cell.v)
            } else {
                cell.t = 's'
                cell.z = '@'
            }

            if (style.font) cell.s = { font: style.font }
            if (style.alignment) cell.s = { ...(cell.s || {}), alignment: style.alignment }
            if (style.border) cell.s = { ...(cell.s || {}), border: style.border }
            if (style.fill) cell.s = { ...(cell.s || {}), fill: style.fill }

            ws[cell_ref] = cell
        }
    }
    // 设置整列样式
    ws['!cols'] = data[0].map((_, index) => {
        return {
            width: 15, // 列宽，单位为字符
            numFmt: '', // 数字格式
            style: {
                font: style.font, // 字体样式
                alignment: style.alignment, // 对齐方式
                border: style.border, // 边框样式
                fill: style.fill // 填充样式
            }
        }
    })
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
export function export_json_to_excel (th, jsonData, defaultTitle, options = { merges: [], header: null, columnStyles: {}}) {
    // original data
    var data = jsonData
    data.unshift(th)
    if (options.header) data.unshift([options.header])
    var ws_name = defaultTitle || 'SheetJS'

    var wb = new Workbook()
    var ws = sheet_from_array_of_arrays(data, options.columnStyles)

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
