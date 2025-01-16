/**
 * 提示说明
 */
export default {
    // =====================表单属性=====================
    formVerify: {
        title: '关于表单提交校验',
        content: '表单提交时候对一系列条件进行有效性校验。'
    },
    formRule: {
        title: '关于表单规则',
        content: `您可以为某个字段(文本框、单项选择、下拉框等)设定一些规则：</br>
            在填写者填写或选择某选项后，触发显示（隐藏、必填、非必填、置空等）位于该字段之后的其他字段。`
    },
    formScript: {
        title: '关于表单脚本',
        content: '表单脚本可以扩展自定义的脚本。满足表单不能实现的功能。'
    },
    formSubmit: {
        title: '关于表单提交后端验证校验',
        content: `提交设置是表单提交动作限制。</br>
    开启后端验证：表单后端的验证就会进行验证，避免绕过前端验证，出现无效数据。</br>
    开启提交冲突提示：开启冲突提示避免重复提交表单，后端采用乐观锁进行处理。`
    },
    formSuffix: {
        title: '关于表单域标签的后缀',
        content: `此属性用于设置字段是否显示后缀。开启后默认为“：”，可自定义显示`
    },
    formAsterisk: {
        title: '关于隐藏必填的星号',
        content: `此属性用于设置表单标签是否显示必填旁边的红色星号`
    },
    descPosition: {
        title: '关于标签描述位置',
        content: `此属性用于设置表单标签的描述为准。</br>
      标签图标：在标签后有个提示图标；</br>
      底部一行：在表单字段底部一行。`
    },
    // =====================字段基本属性=====================
    label: {
        title: '关于标签文本',
        content: `此属性用于告诉填写者应该在该字段中输入什么样的内容。</br>
            通常是一两个简短的词语，也可以是一个问题。`
    },
    name: {
        title: '关于对象属性',
        content: '此属性用于绑定业务对象属性,用于提交数据绑定对象名称。'
    },
    key: {
        title: '关于属性key',
        content: '此属性用于绑定业务对象属性Key,标识是否权限属性。'
    },
    datefmt: {
        title: '关于日期格式',
        content: `此属性用于指定该字段填写的日期格式</br>
    有默认格式，也可以自定义格式.</br>
    格式参考如下：</br>
    格式代码 | 说明 | 返回值例子</br>
    yyyy&nbsp;&nbsp;四位数字的年份 eg：2014或2000</br>
    yy &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;两位数字的年份 eg：14 或 98</br>
    MM &nbsp;&nbsp;&nbsp;&nbsp;月份,有前导零 01到12</br>
    M &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;月份,没有前导零 1到12</br>
    dd &nbsp;&nbsp;&nbsp;&nbsp;天数,有前导零 01到31</br>
    d&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;天数,没有前导零 1到31</br>
    HH &nbsp;&nbsp;&nbsp;&nbsp;小时,24小时制，有前导零 00到23</br>
    H &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;小时,24小时制，无前导零 0到23</br>
    mm &nbsp;&nbsp;&nbsp;&nbsp;分钟,有前导零 00到59</br>
    m &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;分钟,没有前导零 0到59</br>
    ss &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;秒,有前导零 01到59</br>
    s &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;秒,没有前导零 1到59`
    },
    defaultValue: {
        title: '关于默认值',
        content: `设置后，此值将作为默认值显示在该字段的初始化值。  <br>
        如果不需要设置默认值，请将此处留空。<br>
        默认值类型支持固定值、动态脚本、数据联动、公式计算等。`
    },
    units: {
        title: '关于单位',
        content: '此属性用于指定对该字段单位描述，比如货币：元，万元，百分比：%等。'
    },
    placeholder: {
        title: '关于占位符',
        content: `此属性用于指定对该字段进行文字提示，在文本内部进行提示。</br>
          一般是“请输入”、”请选择”等，建议不超过200个字符。`
    },
    desc: {
        title: '关于描述信息',
        content: '此属性用于指定对该字段进行一些附加说明，一般用来指导填写者输入。'
    },
    contentPosition: {
        title: '关于标题位置',
        content: '此属性用于指定对该字段分割线标题的位置。'
    },
    displayColumn: {
        title: '关于显示字段',
        content: '此属性用于子表展示做为展示列展示【弹窗模式下有效】。'
    },
    isPk: {
        title: '关于是否主键',
        content: '此属性用于标识主键字段，作为唯一标识。'
    },
    // =====================校验=====================
    required: {
        title: '关于必填校验',
        content: `勾选后，该字段将不允许为空，在字段名称前会有红色的星号（<span class="red">*</span>）标出。</br>
    如果填写者在提交表单时必填字段没有输入，系统将会给出相关错误提示，表单将无法提交。</br>
    该属性常用于需要强制填写者必须输入的字段。`
    },
    uncheck: {
        title: '关于是否可取消勾选校验',
        content: `勾选后，该字段将允许不选择任何选项。`
    },
    minLength: {
        title: '关于最少填写字符',
        content: '系统会限制填写者填写此字段的最少字符。'
    },
    maxLength: {
        title: '关于最多填写字符',
        content: '系统会限制填写者填写此字段的最多字符。'
    },
    min: {
        title: '关于最小值',
        content: '系统会限制填写者填写此字段的最小值。'
    },
    max: {
        title: '关于最大值',
        content: '系统会限制填写者填写此字段的最大值。'
    },
    minItem: {
        title: '关于最少项',
        content: '系统会限制填写者勾选此字段最少允许的选择项。'
    },
    maxItem: {
        title: '关于最多项',
        content: '系统会限制填写者勾选此字段最多允许的选择项。'
    },
    integer: {
        title: '关于整数',
        content: `勾选后，系统会限制填写者填写此字段为整数值。</br>
      注意:这个小数位是冲突的，如果俩个都勾选，以小数位为准。`
    },
    decimal: {
        title: '关于小数位',
        content: '输入小数位，系统会限定小位的后几位，将对数值有效性进行校验，超出位数将提示。'
    },
    startDate: {
        title: '关于起始日期',
        content: `系统会限制填写者填写此字段的当天起始日期范围（包含该日期）。</br>
              该功能不做有效性验证，请自行保证：特定日期，填写跟日期格式一致的日期；其他类型填写数字。`
    },
    endDate: {
        title: '关于结束日期',
        content: `系统会限制填写者填写此字段的截至日期范围（包含该日期）。</br>
              该功能不做有效性验证，请自行保证：特定日期，填写跟日期格式一致的日期，其他类型填写数字。`
    },
    dataFormat: {
        title: '关于数据格式',
        content: '系统会限制填写者填写此字段的指定的格式，也可以自定义正则表达式。'
    },
    // =====================个性参数属性=====================
    multiple: {
        title: '关于多选',
        content: '此属性用于限制填写可以选择多个值，还是只能选中一个值。'
    },
    allowCreate: {
        title: '关于可添加',
        content: '此属性用于限制是否支持搜索和允许用户添加新选项，仅数据来源为静态数据时生效'
    },
    allowCreategl: {
        title: '关于可添加',
        content: '此属性用于限制是否支持搜索和允许用户自行输入'
    },
    datasource: {
        title: '关于选项数据值来源',
        content: `此属性用于设置选项数据值来源是自定义固定的选项值/标签【静态数据】，还是通过【数据模版】的【值来源】类型。`
    },
    valueSource: {
        title: '关于值来源',
        content: '【值来源】的数据来源是“数据模版管理”中，模版类型为“值来源”信息。'
    },
    scope: {
        title: '关于存储形式',
        content: `此属性用于选择器存储数据格式.
    JSON：数据存储json格式,
    如[{id:'xxxx',name:'张三'}]；`
    },
    // =====================流程实例设置=====================
    bpmDefScope: {
        title: '流程范围',
        content: '此属性用于限定选择流程范围。'
    },
    starterScope: {
        title: '发起人范围',
        content: `此属性用于限定选择流程发起人范围。`
    },
    // =====================流程关联设置=====================
    bpmLinkType: {
        title: '关联类型',
        content: '此属性用于限定选择流程类型。'
    },
    bpmLinkCount: {
        title: '显示数量',
        content: '此属性用于限定当关联类型为当前流程的时候显示流程的数量。'
    },

    // =====================关联数据设置=====================
    relevancyData: {
        title: '关于关联数据',
        content: '关联数据来源是“数据模版管理”中，模版类型为“值来源”信息。'
    },
    linkConfig: {
        title: '关于设置关联配置',
        content: '需要配置唯一标识和展示值，唯一标识是该字段存储数据库的唯一标识（不一定是id或者主键，可以是编号等唯一标识），展示值是作为展示的字段。'
    },
    dynamicCondition: {
        title: '关于动态参数',
        content: '需要配置通过表单的动态参数获取数据，可以做多级联动。'
    },
    linkData: {
        title: '关于联动数据',
        content: '配置联动数据控件引用其他表单的某字段，该值改变且会跟随关联表单对应的字段值进行变化。改变的字段会存储当前的值，不会实时变化。注意返回的字段类型要匹配。'
    },
    linkAttr: {
        title: '关于关联属性',
        content: '配置关联属性控件引用其他表单的某字段，且会跟随关联表单对应的字段值实时变化。设置字段的字段类型必须是【文本】。'
    },
    // =====================个性参数属性-数据字典=====================
    dictionary: {
        title: '关于数据字典',
        content: '此属性用于绑定数据字典。'
    },
    selectMode: {
        title: '关于选值模式',
        content: '此属性用于限制填写者只能选择叶子节点还是任意节点。'
    },
    displayMode: {
        title: '关于显示模式',
        content: '此属性用于展示数据的时候是完整路径还是只展示选择的节点名称。'
    },
    split: {
        title: '关于分隔符',
        content: `此属性用于展示数据显示完整路径的分隔符，默认为'/'。`
    },
    identity: {
        title: '关于流水号',
        content: '此属性用于绑定流水号，通过流水号字段即可轻松实现编码的自动生成。'
    },
    identityInit: {
        title: '关于初始化生成编号',
        content: '此属性用于自动编号是否进入界面初始化生成编号，还是提交后台后生成编号。'
    },
    // =====================个性参数属性-附件上传=====================
    fileQuantity: {
        title: '关于最大上传文件数量',
        content: `此属性用于限制填写者最大上传文件数量，不填写数量则默认为不限制。`
    },
    fileSize: {
        title: '关于单个文件大小',
        content: `此属性用于限制填写者单个文件大小，单位为M。</br>
          可根据需要收集的文件类型做选择，例如1张照片大约3MB，1首3分钟mp3音频大约5MB。`
    },
    fileType: {
        title: '关于文件上传类型',
        content: ` 此属性用于限制填写者文件上传类型.</br>
            文档类：txt、pdf、doc、docx、xls、xlsx、ppt、pptx、wps、htm、html、rtf、hlp。</br>
            图片类：jpg、jpeg、png、gif、bmp、psd、tif。</br>
            视频类：mkv、mp4、avi、swf、wmv、rmvb、mov、mpg。</br>
            音频类：mp3、flac、ape、wma、wav、aac、m4a、au、ram、mmf、aif。</br>
            压缩包：rar、zip、7z、gz、arj、z。</br>
            盖章文件：pdf、docx。</br>
            如以上格式限制不满足需求，建议选择[自定义]文件上传类型。</br>
            [自定义]的文件扩展名，多个请用逗号隔开，如: txt, pdf, mp3等。</br>`
    },
    fileStore: {
        title: '关于存储数据格式',
        content: ` 此属性用于附件存储数据格式。</br>
            【仅存ID】：数据存储只存储id，但展示是name；</br>
            【JSON格式】：数据存储json格式,如[{id:'xxxx',fileName:'abc.doc'}]；</br>
            【路径】：数据存储是文件的路径。`
    },
    uploadType: {
        title: '关于上传方式',
        content: `【直接上传】：直接弹出选择文件框,选择本地的文件；</br>
              【附件上传】：弹出有本地上传和已在上传，可以选择本地，也可以选择自己已上传的。`
    },
    // =====================个性参数属性-图片上传=====================
    imageType: {
        title: '关于图片上传格式',
        content: ` 此属性用于图片上传格式。</br>
    【注意】自定义格式时，格式为'.'+自定义的文件后缀</br>
            【类型】：.jpg,.jpeg,.png,.bmp等。</br>`
    },
    imageSize: {
        title: '关于图片大小',
        content: ` 此属性用于限制图片大小。</br>
            【单位】：M </br>`
    },
    imageWidthAndHeight: {
        title: '关于图片宽高尺寸',
        content: ` 此属性用于设置图片宽和高。</br>
            【单位】：px </br>`
    },
    imageLimit: {
        title: '关于图片数量限制',
        content: ` 此属性用于限制图片最大上传数量。`
    },
    imagePlaceholder: {
        title: '关于提示信息',
        content: ` 此属性用于设置选中图片中显示的信息。`
    },

    // =====================个性参数属性-选择器=====================
    selectorType: {
        title: '关于选择器类型',
        content: `此属性用于选择器类型。</br>目前支持用户、组织、岗位、角色选择器。`
    },
    selectorStore: {
        title: '关于存储数据格式',
        content: ` 此属性用于选择器存储数据格式。</br>
              【仅存ID】：数据存储只存储id，但展示是name；</br>
              【JSON格式】：数据存储json格式,如[{id:'xxxx',name:'张三'}]；</br>
              【绑定标识】：存储2个值，一个id和name`
    },
    checkScope: {
        title: '选择范围',
        content: ` 【选择范围】：此属性用于限定选择范围。`
    },
    bind: {
        title: '绑定值',
        content: ` 【绑定值】：选择需要存储得值，id或者account`
    },
    bindOther: {
        title: '绑定值',
        content: ` 【绑定值】：选择需要存储得值，id或者alias`
    },
    bindFiled: {
        title: '存储字段',
        content: `【存储账号】：设置存储得表单字段`
    },
    // 【绑定标识】：存储2个值，一个标识字段和展示字段，该字段数据存储是展示字段，绑定字段存的是标识字段。
    // =====================个性参数属性-自定义对话框=====================
    icon: {
        title: '关于自定义图标',
        content: `此属性展示的图标`
    },
    customDialogType: {
        title: '关于自定义对话框类型',
        content: `此属性自定义对话框类型。</br>。
            【自定义对话框】：通过选择【数据模版】=》类型为‘对话框’类型的模版；</br>
            【url对话框】：自定义一个url；</br>`
    },
    customDialog: {
        title: '关于自定义对话框',
        content: `此属性配置自定义对话框。</br>。
               通过选择【数据模版】=》类型为‘对话框’类型的模版</br>`
    },
    customDialogStore: {
        title: '关于存储数据格式',
        content: ` 此属性用于存储数据格式。</br>
              【仅存ID】：数据存储只存储id，但展示是name；</br>
              【JSON格式】：数据存储json格式,如[{id:'xxxx',name:'张三'}]；</br>`
    },

    // =====================个性参数属性-地址=====================
    addressTop: {
        title: '关于最大区域',
        content: ` 此属性用于设置地址选择最大区域。`
    },
    addressLevel: {
        title: '关于最小区域',
        content: ` 此属性用于设置地址选择最小区域。`
    },
    addressTopval: {
        title: '关于最大区域值',
        content: ` 此属性用于设置地址选择最大区域上一个范围的值。`
    },
    // =====================个性参数属性-链接=====================
    hyperlinkText: {
        title: '关于文本',
        content: '设置后，此值将作为默认值显示在该字段的初始化值。</br> 默认值类型支持固定值、动态脚本'
    },
    hyperlinkScriptType: {
        title: '关于脚本类型',
        content: '点击事件的脚本类型，后触发的动作。'
    },
    // =====================个性参数属性-步骤条=====================
    stepsSpace: {
        title: '关于间距',
        content: '每个 step 的间距，支持百分比,不填写将自适应间距。'
    },
    stepsSimple: {
        title: '关于简洁风格',
        content: '设置简洁风格，该条件下 居中对齐 / 描述 / 间距 / 显示方向 都将失效。'
    },
    componentName: {
        title: '关于组件名',
        content: '标识组件应用的代码。遵循vue的风格字母全小写且必须包含一个连字符,这会帮助你避免和当前以及未来的 HTML 元素相冲突。'
    },
    componentUrl: {
        title: '关于组件路径',
        content: '组件路径，是views路径下文件。'
    },
    // =====================字段权限=====================
    hide: {
        title: '关于隐藏',
        content: '勾选后，该字段将隐藏，但如果动态赋值，可以对该字段进行赋值。'
    },
    read: {
        title: '关于只读',
        content: '勾选后该字段将只读，如果不勾选则该字段默认是可写的。'
    },
    // =====================布局=====================
    width: {
        title: '关于控件宽度',
        content: '控件的宽度，例如 \'200px\'。'
    },
    hideLabel: {
        title: '关于控件隐藏标签',
        content: '表单域标签是否隐藏。'
    },
    labelWidth: {
        title: '关于控件标签宽度',
        content: '表单域标签的宽度，例如 \'50px\'。作为 Form 直接子元素的 form-item 会继承该值。'
    },
    rows: {
        title: '关于行数',
        content: '多行文本框展示的行数。'
    },
    autosize: {
        title: '关于自适应内容',
        content: `通过设置[自适应内容] 属性可以使得文本域的高度能够根据文本内容自动进行调整，并且 [自适应内容]  还可以设定为一个对象，指定最小行数和最大行数。`
    },
    height: {
        title: '关于高度',
        content: '系统会根据设置的高度,进行设置，默认高度是150px。'
    },
    arrangement: {
        title: '关于排列方式',
        content: `你可以设置该字段的选项，是横向排序还是纵向排序。</br>
          横向排序可以更节省表单空间，使排版更为紧凑；</br>
          纵向排序更适合选项字数较多的场景。`
    },
    gridsToOccupy: {
        title: '关于宽度占比',
        content: '可以定义该字段在填写页面占用的页面宽度为多少。系统采用栅格布局24 分栏。'
    },
    customClass: {
        title: '关于自定义class',
        content: '可自定义子表单的表头宽度。'
    },
    index: {
        title: '关于序号',
        content: '可以定义显示列表的序号。'
    },
    summary: {
        title: '关于表尾合计行',
        content: '表尾合计行就会在表格尾部展示合计行。默认情况下，对于合计行，第一列不进行数据求合操作，而是显示「合计」二字（可通过合计描述配置），其余列会将本列所有数值进行求合操作，并显示出来。当然，你也可以定义自己的合计逻辑（可以求和、平均值等）。'
    },
    summaryMethod: {
        title: '关于表尾合计行自定义方法',
        content: '表尾合计行自定义方法必须通过[表单脚本],编写代码'
    },
    tableMode: {
        title: '关于子表编辑模式',
        content: '子表编辑模式,表内编辑模版、块模式、弹窗模式。'
    },
    clearable: {
        title: '关于可清空',
        content: '是否可清空字段填写的内容。'
    },
    mobile: {
        title: '关于移动端显示',
        content: '移动端会根据该属性是否进行展示。'
    }

}
