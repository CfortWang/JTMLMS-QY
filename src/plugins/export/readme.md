## 导出Excel配置文档

---

### **一、核心导出函数参数**
#### 1. `export_json_to_excel(th, jsonData, defaultTitle, options)`
| 参数 | 类型 | 必填 | 可能值/示例 | 说明 |
|------|------|------|------------|------|
| `th` | Array | 是 | `['姓名', '年龄']` | 表头数组，定义列标题 |
| `jsonData` | Array | 是 | `[{name: '张三', age: 25}]` | 数据数组，每项为一行数据 |
| `defaultTitle` | String | 否 | `'员工表'` | 导出文件名（不含扩展名） |
| `options` | Object | 否 | 见下方options详解 | 高级配置项 |

---

### **二、Options配置项**
#### `options = { merges, header, columnStyles, cellStyles }`
| 参数 | 类型 | 默认值 | 示例 | 说明 |
|------|------|-------|------|------|
| `merges` | Array | `[]` | `[['A1', 'B1']]` | 合并单元格配置，支持字符串或对象格式 |
| `header` | String | `null` | `'2023年度报表'` | 顶部标题（跨列居中） |
| `columnStyles` | Object | `{}` | 见下方列样式 | 按列索引配置样式 |
| `cellStyles` | Object | `{}` | 见下方单元格样式 | 按行列坐标配置样式 |

---

### **三、样式配置详解**
#### 1. 列样式 `columnStyles`
```javascript
{
    0: { // 第1列配置
        width: 20,          // 列宽（字符单位）
        wpx: 120,           // 列宽（像素单位，优先级高于width）
        hidden: false,      // 是否隐藏列
        numFmt: '0.00',     // 数字格式
        style: {            // 单元格样式
            font: { ... },
            alignment: { ... },
            border: { ... },
            fill: { ... }
        }
    },
    rows: { // 行高配置
        0: { height: 30 }   // 第1行高度（像素）
    }
}
```

#### 2. 单元格样式 `cellStyles`
```javascript
{
    1: { // 第2行（数据行，跳过表头）
        0: { // 第1列单元格
            numFmt: '@',    // 覆盖列格式
            font: { bold: true, color: 'FF0000' }
        }
    }
}
```

---

### **四、样式属性详细说明**
#### 1. 字体样式 `font`
| 属性 | 类型 | 示例 | 说明 |
|------|------|------|------|
| `name` | String | `'宋体'` | 字体名称 |
| `sz` | Number | `11` | 字号 |
| `bold` | Boolean | `true` | 加粗 |
| `color` | String | `'FF0000'` | RGB颜色值 |
| `italic` | Boolean | `true` | 斜体 |

#### 2. 对齐方式 `alignment`
| 属性 | 类型 | 示例 | 说明 |
|------|------|------|------|
| `horizontal` | String | `'center'` | 水平对齐（left/center/right） |
| `vertical` | String | `'middle'` | 垂直对齐（top/middle/bottom） |
| `wrapText` | Boolean | `true` | 自动换行 |
| `indent` | Number | `1` | 缩进量 |

#### 3. 边框样式 `border`
```javascript
{
    top: { style: 'thin', color: '000000' }, // 上边框
    // 支持 left/right/bottom 同结构
}
```
边框样式可选值：`'thin'`, `'medium'`, `'thick'`, `'dashed'`

#### 4. 背景填充 `fill`
```javascript
{
    fgColor: 'FFFF00',  // 前景色（填充色）
    patternType: 'solid' // 填充模式
}
```

---

### **五、数字格式（numFmt）参考**
| 格式代码 | 示例 | 说明 |
|----------|------|------|
| `0` | `123` | 整数 |
| `0.00` | `123.45` | 两位小数 |
| `#,##0` | `1,234` | 千位分隔 |
| `0%` | `12%` | 百分比 |
| `yyyy-mm-dd` | `2023-01-01` | ISO日期 |
| `hh:mm:ss` | `14:30:00` | 时间 |
| `@` | `文本` | 强制文本格式 |

---

### **六、合并单元格配置**
#### 1. 字符串格式（简写）
```javascript
merges: [
    ['A1', 'B1'] // 合并A1到B1
]
```

#### 2. 对象格式（精确控制）
```javascript
merges: [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 1 } } // 合并第1行第1列到第1行第2列
]
```

---

### **七、注意事项**
1. **行列索引规则**：
   - 列索引从0开始（0=第1列）
   - 行索引从0开始（0=数据第一行，不含表头）

2. **样式优先级**：
   ```
   单元格样式 > 列样式 > 全局默认
   ```

3. **日期处理**：
   - 必须使用JavaScript Date对象
   - 会自动转换为Excel序列值


---