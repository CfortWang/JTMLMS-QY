# ✅ ExcelJS 导出 Excel 使用文档（参数结构说明）

---

## 一、核心函数签名

```ts
exportExcel({
  meta: { title, header, merges },
  layout: { nameKey, labelKey, columns, rowHeights, cellStyles },
  data: [...],
  defaults: { font, border, alignment, fill, format, width, height }
})
```

---

## 二、参数说明

### `meta`：报表元信息

| 参数      | 类型   | 必填 | 示例                                              | 说明                  |
| -------- | ------ | --- | ------------------------------------------------ | -------------------- |
| `title`  | String | 是  | `'销售报表'`                                       | 导出文件名（不含扩展名） |
| `header` | Object | 否  | `{ value: '2025年度报表', font, alignment, fill }` | 顶部标题行配置         |
| `merges` | Array  | 否  | `[['A1','E1']]` 或 `{s,e}`                        | 合并单元格配置         |

---

### `layout`：布局配置

| 参数          | 类型   | 示例                       | 说明                        |
| ------------ | ------ | ------------------------- | -------------------------- |
| `nameKey`    | String | `'prop'`                  | 数据字段名的键（默认）         |
| `labelKey`   | String | `'label'`                 | 列标题键名（默认）            |
| `columns`    | Array  | 见下方 columns 示例        | 表头列配置                   |
| `rowHeights` | Object | `{ 1: { height: 30 } }`   | 指定数据行的高度（行号从1开始） |
| `cellStyles` | Object | `{1: {2: {font: {...}}}}` | 指定单元格样式（覆盖列配置）   |

---

### `data`：表格数据

* 类型：Array<Object>
* 示例：

```js
[
  { id: 1001, amount: 12345, date: new Date() },
  { id: 1002, amount: 5678, date: new Date() }
]
```

---

### `defaults`：默认样式配置

| 属性         | 类型   | 示例                                             | 说明                                |
| ----------- | ------ | ----------------------------------------------- | ---------------------------------- |
| `font`      | Object | `{ name: '微软雅黑', size: 11, color: '333' }`   | 所有单元格默认字体样式                 |
| `alignment` | Object | `{ vertical: 'middle', wrapText: true }`       | 所有单元格默认对齐方式                  |
| `border`    | Object | `{ top: { style: 'thin', color: 'DDD' }, ...}` | 所有单元格默认边框样式                  |
| `fill`      | Object | `{ fgColor: 'FFF' }`                           | 默认填充样式（单色）                    |
| `format`    | String | `'@'` 或 `'0.00'`                               | 默认数字/文本格式（numFmt）            |
| `width`     | Number | `15`                                           | 所有列的默认宽度（被列配置覆盖）          |
| `height`    | Number | `22`                                           | 所有数据行默认行高（被 rowHeights 覆盖） |

---

## 三、columns 配置项详解

```js
columns: [
  {
    prop: 'id',
    label: '订单编号',
    width: 20,
    format: '0',
    font: { name: '微软雅黑', size: 12, bold: true, color: 'FF0000' },
    alignment: { horizontal: 'center', vertical: 'middle' },
    border: {
      top: { style: 'thin', color: '000' },
      bottom: { style: 'thin', color: '000' }
    },
    fill: {
      fgColor: 'FFFF00',
      pattern: 'solid'
    }
  },
  {
    prop: 'amount',
    label: '金额',
    format: '#,##0.00'
  }
]

columns: [
  {
    prop: 'id',              // 数据字段名（必须）
    label: '订单编号',        // 列头显示名称（必须）
    width: 20,               // 列宽（字符单位，默认使用 defaults.width）
    hidden: false,           // 是否隐藏列（默认 false）

    format: '0.00',          // 单元格格式，如数字、百分比、日期，参考 format 表

    // 样式配置（可省略，默认继承 defaults）
    font: {
      name: '微软雅黑',       // 字体
      size: 12,              // 字号
      bold: true,            // 加粗
      italic: true,          // 斜体
      underline: true,       // 下划线
      strike: false,         // 删除线
      color: 'F00'           // 支持简写，会自动转为 ARGB
    },

    alignment: {
      horizontal: 'center',  // left | center | right
      vertical: 'middle',    // top | middle | bottom
      wrapText: true,        // 自动换行
      indent: 1              // 缩进级别
    },

    border: {
      top:    { style: 'thin', color: 'CCC' },
      bottom: { style: 'thin', color: 'CCC' },
      left:   { style: 'thin', color: 'CCC' },
      right:  { style: 'thin', color: 'CCC' }
    },

    fill: {
      fgColor: 'FFFF00',     // 背景色（前景色），支持简写
      pattern: 'solid'       // 填充样式，目前仅支持 solid
    }
  }
]

```

---

## 四、样式说明

### 1. 字体 `font`

| 字段        | 类型           | 示例                           | 说明             |
| ----------- | ------------- | ----------------------------- | --------------- |
| `name`      | String        | `'微软雅黑'`                      | 字体名称       |
| `size`      | Number        | `11`                          | 字号             |
| `bold`      | Boolean       | `true`                        | 加粗             |
| `italic`    | Boolean       | `true`                        | 斜体             |
| `strike`    | Boolean       | `true`                        | 删除线           |
| `underline` | Boolean       | `true`                        | 下划线           |
| `color`     | String/Object | `'CCC'` / `{ rgb: 'FF0000' }` | 自动转为合法 ARGB |

---

### 2. 对齐方式 `alignment`

| 字段          | 示例       | 说明                          |
| ------------ | ---------- | ---------------------------- |
| `horizontal` | `'center'` | 水平对齐方式：left/center/right |
| `vertical`   | `'middle'` | 垂直对齐方式：top/middle/bottom |
| `wrapText`   | `true`     | 是否自动换行                   |
| `indent`     | `1`        | 缩进量                        |

---

### 3. 边框 `border`

```js
border: {
  top: { style: 'thin', color: '000000' },
  bottom: { style: 'thin', color: '000000' },
  left: { style: 'thin', color: '000000' },
  right: { style: 'thin', color: '000000' }
}
```

* 支持样式：`thin`, `medium`, `thick`, `dashed`
* color 可为 `'DDD'` 或 `{ rgb: 'CCCCCC' }`

---

### 4. 填充 `fill`

```js
fill: {
  type: 'pattern',
  pattern: 'solid',
  fgColor: 'FFFF00'
}
```

* `type` 固定为 `'pattern'` 纯色填充（渐变填充 `'gradient'` 支持不完整）
* `pattern` 固定为 `'solid'`
* `fgColor` 可为简写或 RGB/ARGB 对象

---

## 五、数字格式（format / numFmt）

| 格式代码      | 示例          | 说明         |
| ------------ | ------------ | ----------- |
| `0`          | `123`        | 整数         |
| `0.00`       | `123.45`     | 两位小数      |
| `#,##0.00`   | `1,234.56`   | 千位分隔带小数 |
| `0%`         | `56%`        | 百分比       |
| `0.00%`      | `56.78%`     | 精确百分比    |
| `yyyy-mm-dd` | `2023-06-01` | 日期         |
| `hh:mm:ss`   | `14:30:00`   | 时间         |
| `@`          | `文本`        | 文本格式     |

---

## 六、合并单元格配置 `merges`

```js
merges: [
  ['A1', 'E1'],  // 简写方式
  { s: { r: 4, c: 1 }, e: { r: 4, c: 3 } } // 对象方式（0基）
]
```

---

## 七、样式优先级与索引说明

### ✅ 样式优先级：

```
cellStyles > columns > defaults
```

### ✅ 行列索引规则：
#### 行高 `rowHeight`
* **数据行索引**：从 `0` 开始（含标题行和表头行）

```
rowHeights: {
  0: { height: 45 }, // 标题行
  1: { height: 35 }, // 表头行
  2: { height: 28 }, // 数据第1行
  3: { height: 58 }, // 数据第2行
  4: { height: 28 } // 数据第3行
}
```

#### 单元格样式 `cellStyles`
* **列索引**：从 `0` 开始（0为第一列）
* **数据行索引**：从 `0` 开始（不含标题行和表头行，0代表数据第 1 行）

| Excel 实际行 | 内容          | 对应索引（cellStyles 中的 rowIndex） | 样式设置方法          |
| ----------- | ------------- | -------------------------------- | -------------------- |
| 第 1 行     | 标题（header）  | ❌ 不支持通过 `cellStyles` 配置    | `meta.header`        |
| 第 2 行     | 表头（columns） | ❌ 不支持通过 `cellStyles` 配置    | `layout.columns[i]`  |
| 第 3 行     | 数据第 1 行     | ✅ `0`                           | `cellStyles[0][col]` |
| 第 4 行     | 数据第 2 行     | ✅ `1`                           | `cellStyles[1][col]` |
| 第 5 行     | 数据第 3 行     | ✅ `2`                           | `cellStyles[2][col]` |


---

## 八、注意事项

1. 所有颜色支持缩写（如 `'CCC'`、`'#DDD'`），将被自动转换为合法 ARGB 格式。
2. 所有未配置的边框会自动使用 `defaults.border` 指定的默认灰色细线。
3. 自动换行（`wrapText`）需要手动设置合适 `row.height` 以防内容被遮挡。
4. 所有日期字段必须为原生 `Date` 对象。
5. `defaults` 中的 `width`, `height`, `format` 可统一设置默认列宽、行高、单元格格式。

---

## 九、示例调用

```js
exportExcel({
    meta: {
        title: '2023年度销售报表',
        header: {
            value: 'XX公司销售数据（机密）',
            font: { name: '微软雅黑', size: 16, bold: true, color: '333' },
            alignment: { horizontal: 'center', vertical: 'middle' },
            fill: { fgColor: 'D9E1F2' }
        },
        merges: [
            ['E4', 'E5'] // 合并备注列第1、2条记录
        ]
    },

    layout: {
        nameKey: 'prop',
        labelKey: 'label',

        columns: [
            {
                prop: 'id',
                label: '订单ID',
                format: '0',
                width: 15,
                font: {
                    name: '微软雅黑',
                    size: 12,
                    bold: true,
                    color: 'F00'
                },
                alignment: {
                    horizontal: 'center',
                    vertical: 'middle'
                },
                border: {
                    top: { style: 'thin', color: '000' },
                    bottom: { style: 'thin', color: '000' }
                },
                fill: {
                    fgColor: 'FFFF00',
                    pattern: 'solid'
                }
            },
            {
                prop: 'amount',
                label: '金额',
                format: '#,##0.00',
                width: 18,
                font: { name: 'Calibri', size: 11, italic: true },
                alignment: { horizontal: 'right' }
            },
            {
                prop: 'date',
                label: '订单日期',
                format: 'yyyy-mm-dd',
                width: 40,
                font: { name: '宋体', size: 11, color: '0000FF' },
                alignment: { horizontal: 'center' }
            },
            {
                prop: 'progress',
                label: '完成率',
                format: '0.00%',
                width: 15,
                fill: {
                    fgColor: 'CCFFCC',
                    pattern: 'solid'
                }
            },
            {
                prop: 'notes',
                label: '备注',
                width: 30,
                alignment: { wrapText: true },
                fill: {
                    fgColor: 'FFF2CC',
                    pattern: 'solid'
                }
            }
        ],

        rowHeights: {
            0: { height: 45 }, // 标题行
            1: { height: 35 }, // 表头行（index=1）
            2: { height: 28 }, // 数据第1行
            3: { height: 58 }, // 数据第2行
            4: { height: 28 } // 数据第3行
        },

        cellStyles: {
            1: {
                2: {
                    font: {
                        color: '0088CC',
                        italic: true,
                        strike: true
                    }
                },
                4: {
                    fill: {
                        fgColor: 'FFCCCC',
                        pattern: 'solid'
                    }
                }
            }
        }
    },

    data: [
        {
            id: 1001,
            amount: 12345.678,
            date: new Date('2023-01-15'),
            progress: 0.8567,
            notes: '紧急订单，优先处理'
        },
        {
            id: 1002,
            amount: 9876.5,
            date: new Date('2023-02-20'),
            progress: 0.5,
            notes: '常规订单\n分批发货'
        },
        {
            id: 1003,
            amount: 4321.5,
            date: new Date('2023-03-11'),
            progress: 1,
            notes: '已完成'
        }
    ],

    defaults: {
        font: { name: '微软雅黑', size: 11, color: '666' },
        alignment: { vertical: 'middle', wrapText: true },
        border: {
            top: { style: 'thin', color: 'DDD' },
            bottom: { style: 'thin', color: 'DDD' },
            left: { style: 'thin', color: 'DDD' },
            right: { style: 'thin', color: 'DDD' }
        },
        fill: { fgColor: 'FFFFFF' },
        format: '@', // 默认文本格式
        width: 14, // 所有列默认宽度
        height: 26 // 所有数据行默认行高（被 rowHeights 覆盖）
    }
})
```

---
