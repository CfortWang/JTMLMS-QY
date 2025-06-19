### 版本信息

- 版本：5.3.31
- 来源：https://mozilla.github.io/pdf.js/getting_started/#download
- 更新方法：
  1. 从官网下载指定版本
  2. 解压到本目录
  3. 更新 viewer.mjs 中的代码，增加按钮权限控制的逻辑，具体修改内容见下方
  4. 更新此README中的相关信息
   
### 变更记录
  
| 版本       | 更新日期    | 变更说明                 |
|:---------:|:----------:|--------------------------|
| v2.4.456  | / | 初始引入                |
| v5.3.31  | 2025-06-18 | 解决部分PDF文件预览内容缺失问题 |

### 修改内容：
- v2.4.456 → v5.3.31
```deff
// 找到defaultOptions对象的定义，增加属性hasRole，默认值为'0'
const defaultOptions = {
  + hasRole: {
  +   value: '0',
  +   kind: OptionKind.VIEWER
  + }
  其他属性
}

// 找到run函数的定义，增加获取属性hasRole及获取后的权限控制逻辑
async run(config) {
  await this.initialize(config);
  const {
    appConfig,
    eventBus
  } = this;
  let file;

  + let hasRole;

  const queryString = document.location.search.substring(1);
  const params = parseQueryString(queryString);
  file = params.get("file") ?? AppOptions.get("defaultUrl");

  + hasRole = params.get("hasrole") ?? AppOptions.get("hasRole");

  + // 取消文件同源校验
  + // validateFileURL(file);
  - validateFileURL(file);

  const fileInput = this._openFileInput = document.createElement("input");
  fileInput.id = "fileInput";
  fileInput.hidden = true;
  fileInput.type = "file";
  fileInput.value = null;
  document.body.append(fileInput);

  + // 权限判定，无权限用户隐藏部分功能按钮
  + if (hasRole !== '1') {
  +   appConfig.toolbar?.download.setAttribute("hidden", "true");
  +   appConfig.toolbar?.print.setAttribute("hidden", "true");
  +   appConfig.secondaryToolbar.downloadButton.setAttribute("hidden", "true");
  +   appConfig.secondaryToolbar.printButton.setAttribute("hidden", "true");
  +   appConfig.secondaryToolbar.openFileButton.setAttribute("hidden", "true");
  +   appConfig.secondaryToolbar.viewBookmarkButton.setAttribute("hidden", "true");
  + }

  // 其他代码  
}

```