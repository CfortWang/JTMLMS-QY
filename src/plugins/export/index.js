import Csv from './_csv'
import ExportCsv from './_export-csv'
import FileSaver from 'file-saver'
import * as Excel from './_export2Excel'

const IbpsExport = {
    // 导出 csv
    csv (params) {
        return new Promise((resolve, reject) => {
            // 默认值
            const paramsDefault = {
                columns: [],
                data: [],
                title: 'table',
                noHeader: false
            }
            // 合并参数
            const _params = Object.assign({}, paramsDefault, params)
            // 生成数据
            const data = Csv(_params.columns, _params.data, params, _params.noHeader)
            // 下载数据
            ExportCsv.download(_params.title, data)
            // 完成
            resolve()
        })
    },
    // 导出 excel
    excel (params) {
        return new Promise((resolve, reject) => {
            // 默认值
            const paramsDefault = {
                columns: [],
                data: [],
                title: 'table',
                nameKey: 'prop',
                labelKey: 'label',
                header: null,
                merges: [],
                columnStyles: {},
                cellStyles: {}
            }
            // 合并参数
            const _params = Object.assign({}, paramsDefault, params)
            // 从参数中派生数据
            const header = _params.columns.map(col => col[_params.labelKey])
            const data = _params.data.map(row => _params.columns.map(col => row[col[_params.nameKey]]))
            /**
             * 定义列格式。单元格格式可能值：
             * '0'：整数格式，例如 123。
             * '0.00'：小数格式，例如 123.45。
             * '#,##0'：带千位分隔符的整数格式，例如 1,234。
             * '#,##0.00'：带千位分隔符的小数格式，例如 1,234.56。
             * '0%'：百分比格式，例如 12.34%。
             * '0.00%'：带小数的百分比格式，例如 12.34%。
             * '$#,##0.00'：货币格式，例如 $1,234.56。
             * 'yyyy-mm-dd'：日期格式，例如 2023-05-15。
             * 'hh:mm'：时间格式，例如 15:30。
             * 'yyyy-mm-dd hh:mm:ss'：日期时间格式，例如 2023-05-15 15:30:00。
             * '@'：文本格式，单元格内容会被视为文本而不是数字。
             */
            const columnStyles = {}
            const colIndexMap = {} // prop -> column index
            _params.columns.forEach((col, index) => {
                colIndexMap[col[_params.nameKey]] = index
                columnStyles[index] = {
                    width: col.width,
                    wpx: col.wpx,
                    hidden: col.hidden,
                    numFmt: col.format,
                    alignment: col.alignment,
                    font: col.font,
                    border: col.border,
                    fill: col.fill
                }
            })
            // 导出
            Excel.export_json_to_excel(header, data, _params.title, {
                merges: _params.merges,
                header: _params.header,
                columnStyles: {
                    ...columnStyles,
                    rows: _params.columnStyles.rows || {} // 保留行高配置
                },
                cellStyles: _params.cellStyles
            })
            // 完成
            resolve()
        })
    },
    // 导出 文本文档
    txt (params) {
        return new Promise((resolve, reject) => {
            // 默认值
            const paramsDefault = {
                text: '',
                title: '文本'
            }
            // 合并参数
            const _params = Object.assign({}, paramsDefault, params)
            // 导出
            const blob = new Blob([_params.text], { type: 'text/plain;charset=utf-8' })
            FileSaver.saveAs(blob, _params.title + '.txt')
            // 完成
            resolve()
        })
    }
}

export default IbpsExport
