export const paperTypeOptions = [
    {
        label: '专业组考试',
        value: '专业组考试'
    },
    {
        label: '职能岗位考题',
        value: '职能岗位考题'
    },
    {
        label: 'ISO15189相关考试',
        value: 'ISO15189相关考试'
    }
    // {
    //     label: '数学题库',
    //     value: '数学题库'
    // }
]

export const examTypeOptions = [
    {
        label: '培训考试',
        value: '培训考试'
    },
    {
        label: '自主考核',
        value: '自主考核'
    },
    {
        label: '常规',
        value: '常规'
    }
]

export const scoringType = [
    {
        label: '平均分',
        value: '平均分'
    },
    {
        label: '最高分',
        value: '最高分'
    },
    {
        label: '最近得分',
        value: '最近得分'
    }
]

export const questionType = [
    {
        label: '单选题',
        value: '单选题'
    },
    {
        label: '多选题',
        value: '多选题'
    },
    {
        label: '判断题',
        value: '判断题'
    },
    {
        label: '填空题',
        value: '填空题'
    },
    {
        label: '简答题',
        value: '简答题'
    }
]

export const surveyQuestionType = [
    {
        label: '单选题',
        value: '单选题'
    },
    {
        label: '多选题',
        value: '多选题'
    },
    {
        label: '问答题',
        value: '问答题'
    }
]

export const rateType = {
    '单选题': '自动',
    '多选题': '自动',
    '判断题': '自动',
    '填空题': '手动',
    '简答题': '手动'
}

export const defaultOptions = [
    {
        value: 'A',
        radio: 'A',
        checkbox: [],
        content: ''
    },
    {
        value: 'B',
        radio: '',
        checkbox: [],
        content: ''
    },
    {
        value: 'C',
        radio: '',
        checkbox: [],
        content: ''
    },
    {
        value: 'D',
        radio: '',
        checkbox: [],
        content: ''
    }
]

export const surveyDefaultOptions = [
    {
        value: 'A',
        content: ''
    },
    {
        value: 'B',
        content: ''
    },
    {
        value: 'C',
        content: ''
    },
    {
        value: 'D',
        content: ''
    }
]

export const statusOption = [
    {
        label: '未发布',
        value: '未发布',
        type: 'info'
    },
    {
        label: '已取消',
        value: '已取消',
        type: 'warning'
    },
    {
        label: '已发布',
        value: '已发布',
        type: 'primary'
    }
    // {
    //     label: '已结束',
    //     value: '已结束',
    //     type: 'success'
    // }
]

const qualifiedType = [
    {
        label: '达标',
        value: '达标',
        type: 'success'
    },
    {
        label: '未达标',
        value: '未达标',
        type: 'danger'
    },
    {
        label: '考试未结束',
        value: '考试未结束',
        type: 'warning'
    }
]

export const basicColumn = [
    { prop: 'examName', label: '考试名称', minWidth: 200 },
    { prop: 'examType', label: '考试类型', width: 90 },
    { prop: 'bankName', label: '考试题库', width: 160 },
    { prop: 'trainId', label: '关联培训', width: 160 },
    { prop: 'examState', label: '状态', width: 80, tags: statusOption },
    { prop: 'totalScore', label: '总分', width: 65 }
]

export const infoColumn = [
    { prop: 'questionCount', label: '题数', width: 65 },
    { prop: 'duration', label: '考试时长', slotName: 'examTime', width: 85 },
    { prop: 'limitCount', label: '限考次数', width: 85 },
    { prop: 'limitDate', label: '限考时间', width: 120 },
    { prop: 'isRand', label: '是否随机', slotName: 'isRand', width: 65 },
    { prop: 'randWay', label: '随机方式', slotName: 'randWay', width: 90 }
]

export const resultColumn = [
    { prop: 'qualifiedRadio', label: '达标分值占比', width: 75 },
    { prop: 'scoringType', label: '计分方式', width: 85 },
    { prop: 'examineeCount', label: '考试人数', width: 65 },
    { prop: 'examFinishCount', label: '完考人数', width: 65 },
    { prop: 'maxScore', label: '最高分 ', width: 70 },
    { prop: 'minScore', label: '最低分', width: 70 },
    { prop: 'avgScore', label: '平均分', width: 70 },
    { prop: 'passRate', label: '达标率', width: 70 }
]
