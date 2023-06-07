import { startNode, endNode, normalNode, btn, btnType, processData } from './processData'
import { processPermission } from './processPermission'

// 创建流程所需所有key类型
const typeList = {
    box: 'Definitions',
    process: 'Process',
    start: 'StartEvent',
    activity: 'Activity',
    flow: 'Flow',
    over: 'Event',
    desc: 'Association',
    text: 'TextAnnotation',
    bpmnd: 'BPMNDiagram',
    bpmnp: 'BPMNPlane'
}

// 默认参数
const defaultData = {
    // 流程名称
    name: '',
    // 开始节点描述
    desc: '',
    activity: [
        {
            name: '数据输入',
            desc: '检测员'
        },
        {
            name: '数据校验',
            desc: '复核员'
        }
    ]
}

// 流程绑定的表单信息,渲染有变动时更改此处对应数据
const formData = {
    // 数据表名
    boName: '检测汇总表',
    // 数据表key
    boKey: 'lhjczb',
    // 流程节点绑定的表单key
    formKey: ['xjzjjcydzjjzpyfsjsr', 'xjzjjcydzjjzpyfsjxy'],
    // 表单审批意见组件key
    formOpinions: ['approval_opinion_1frszdl', 'approval_opinion_1s3sgtf'],
    // 开始节点按钮
    startBtn: ['start', 'startSave', 'flow'],
    // 中间节点流程按钮
    btnList: [
        ['agree', 'save', 'flow'],
        ['end', 'reject', 'flow']
    ],
    // 流程执行人数据
    executor: [
        {
            desc1: '【用户】人员变量【jchzb.jianCeYuan】（或） ;　',
            desc2: '人员变量[lhjczb.jianCeYuan]',
            name: 'lhjczb.jianCeYuan'
        },
        {
            desc1: '【用户】人员变量【jchzb.fuHeYuan】（或） ;　',
            desc2: '人员变量[lhjczb.fuHeYuan]',
            name: 'lhjczb.fuHeYuan'
        }
    ]
}

// 获取随机key
const getRandomKey = (type) => {
    let randomNum = parseInt(Math.random() * 12) + 1
    let key = `${typeList[type]}_${(parseInt(Math.random().toFixed(randomNum).split('.')[1]) + Date.now()).toString(36).split('.')[0]}`
    return key
}

// 组装xml数据文件
const getXml = (data, keyList) => {
    let part1 = `<?xml version="1.0" encoding="UTF-8"?>
    <definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="${keyList.box}" targetNamespace="http://bpmn.io/schema/bpmn" xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd">`
    let part2 = ''
    let part3 = ''
    let part8 = ``
    const actX = 270
    data.activity.forEach((item, index) => {
        let start = index === 0 ? `<process id="${keyList.process}" name="${data.name}" isExecutable="false"><startEvent id="${keyList.start}" name="开始"><outgoing>${keyList.flow[index]}</outgoing></startEvent><userTask id="${keyList.activity[index]}" name="${item.name}"><incoming>${keyList.flow[index]}</incoming><outgoing>${keyList.flow[index + 1]}</outgoing></userTask><sequenceFlow id="${keyList.flow[index]}" sourceRef="${keyList.start}" targetRef="${keyList.activity[index]}" />` : ''
        let processItem = index !== 0 ? `<userTask id="${keyList.activity[index]}" name="${item.name}"><incoming>${keyList.flow[index]}</incoming><outgoing>${keyList.flow[index + 1]}</outgoing></userTask><sequenceFlow id="${keyList.flow[index]}" sourceRef="${keyList.activity[index - 1]}" targetRef="${keyList.activity[index]}" />` : ''
        let end = index === data.activity.length - 1 ? `<endEvent id="${keyList.over}" name="结束"><incoming>${keyList.flow[index + 1]}</incoming></endEvent><sequenceFlow id="${keyList.flow[index + 1]}" sourceRef="${keyList.activity[index]}" targetRef="${keyList.over}" /><textAnnotation id="${keyList.text[0]}"><text>${data.desc}</text></textAnnotation><association id="${keyList.desc[0]}" sourceRef="${keyList.start}" targetRef="${keyList.text[0]}" />` : ''
        part2 = start + part2 + processItem + end
        let textItem = `<textAnnotation id="${keyList.text[index + 1]}"><text>${item.desc}</text></textAnnotation><association id="${keyList.desc[index + 1]}" sourceRef="${keyList.activity[index]}" targetRef="${keyList.text[index + 1]}" />`
        part3 += textItem
        let act = `<bpmndi:BPMNShape id="${keyList.activity[index]}_di" bpmnElement="${keyList.activity[index]}"><dc:Bounds x="${actX + 160 * index}" y="218" width="100" height="80" /></bpmndi:BPMNShape>`
        part8 += act
    })
    
    let part4 = `</process><bpmndi:BPMNDiagram id="${keyList.bpmnd}"><bpmndi:BPMNPlane id="${keyList.bpmnp}" bpmnElement="${keyList.process}">`
    let part5 = ''
    let part6 = ''
    let part10 = ''
    const textX = 110
    const flowX = 210
    const assX = 160
    keyList.flow.forEach((item, index) => {
        let text = `<bpmndi:BPMNShape id="${keyList.text[index]}_di" bpmnElement="${keyList.text[index]}"><dc:Bounds x="${index ? textX + 160 * index : 148}" y="${index ? 130 : 120}" width="100" height="${index ? 30 : 50}" /></bpmndi:BPMNShape>`
        let flow = `<bpmndi:BPMNEdge id="${keyList.flow[index]}_di" bpmnElement="${keyList.flow[index]}"><di:waypoint x="${flowX + 160 * index}" y="258" /><di:waypoint x="${flowX + 160 * index + 60}" y="258" /></bpmndi:BPMNEdge>`
        let ass = `<bpmndi:BPMNEdge id="${keyList.desc[index]}_di" bpmnElement="${keyList.desc[index]}"><di:waypoint x="${index ? assX + 160 * index : 198}" y="${index ? 218 : 240}" /><di:waypoint x="${index ? assX + 160 * index : 198}" y="${index ? 160 : 170}" /></bpmndi:BPMNEdge>`
        part5 += text
        part6 += flow
        part10 += ass
    })

    let part7 = `<bpmndi:BPMNShape id="_BPMNShape_${keyList.start}" bpmnElement="${keyList.start}"><dc:Bounds x="180" y="240" width="36" height="36" /><bpmndi:BPMNLabel><dc:Bounds x="187" y="283" width="22" height="14" /></bpmndi:BPMNLabel></bpmndi:BPMNShape>`
    // 三流程节点时，结束节点流程线的x值分别为750，759，俩流程节点时，结束节点流程线的x值分别为592，601
    let part9 = `<bpmndi:BPMNShape id="${keyList.over}_di" bpmnElement="${keyList.over}"><dc:Bounds x="592" y="240" width="36" height="36" /><bpmndi:BPMNLabel><dc:Bounds x="601" y="283" width="22" height="14" /></bpmndi:BPMNLabel></bpmndi:BPMNShape>`
    return part1 + part2 + part3 + part4 + part5 + part6 + part7 + part8 + part9 + part10 + `</bpmndi:BPMNPlane></bpmndi:BPMNDiagram></definitions>`
}

export const processCreate = projectName => {
    defaultData.name = projectName
    defaultData.desc = projectName

    const typeCount = {
        activity: defaultData.activity.length,
        flow: defaultData.activity.length + 1,
        desc: defaultData.activity.length + 1,
        text: defaultData.activity.length + 1
    }

    // 获取key
    let keys = {}
    Object.keys(typeList).forEach(key => {
        if (typeCount[key]) {
            keys[key] = []
            for (let i = 0; i <typeCount[key]; i++) {
                keys[key].push(getRandomKey(key))
            }
        } else {
            keys[key] = getRandomKey(key)
        }
    })
    let customParams = {
        keys,
        projectData: defaultData
    }

    return {
        deploy: true,
        newDeploy: false,
        typeId: '',
        defId: '',
        defXml: getXml(defaultData, keys),
        customParams
    }
}

export const processEdit = params => {
    const { keys, projectData, id } = params
    // 初始化节点数组
    processData.nodes = []
    // 填充全局配置数据
    processData.global.id = keys.process
    processData.global.bo.code = formData.boKey
    processData.global.bo.name = formData.boName

    processData.global.form.formValue = formData.formKey[0]
    processData.global.instForm.formValue = formData.formKey[0]

    let formOpinions = {}
    formData.formOpinions.forEach((item, index) => {
        formOpinions[item] = {
            nodeId: [keys.activity[index]],
            bpmOpinionHide: true
        }
    })

    processData.global.formOpinions = formOpinions
    
    // 填充开始和结束节点数据
    endNode.id = keys.over
    startNode.id = keys.start
    startNode.attributes.nodeId = keys.start
    
    let startBtnList = []
    formData.startBtn.forEach(item => {
        let obj = JSON.parse(JSON.stringify(btn))
        obj.aliasName = btnType[item].aliasName
        obj.name = btnType[item].name
        obj.alias = btnType[item].alias
        startBtnList.push(obj)
    })
    startNode.buttons = startBtnList

    // 填充中间节点数据
    let nodeList = []
    projectData.activity.forEach((item, index) => {
        let node = JSON.parse(JSON.stringify(normalNode))
        let nodeBtnList = []
        node.node_name = item.name
        node.id = keys.activity[index]
        // 填充节点执行人信息
        node.users[0].description = formData.executor[index].desc1
        node.users[0].calcs[0].description = formData.executor[index].desc2
        node.users[0].calcs[0].executorVar.name = formData.executor[index].name
        node.form.formValue = formData.formKey[index]
        // 填充权限信息 -> 改为由表单统一限制
        // processPermission[index].formKey = formData.formKey[index]
        // processPermission[index].flowKey = keys.process
        // processPermission[index].nodeId = keys.activity[index]
        // node.form.editFormRights = processPermission[index]

        node.attributes.nodeId = keys.activity[index]
        // 填充节点操作按钮
        formData.btnList[index].forEach(i => {
            let b = JSON.parse(JSON.stringify(btn))
            b.aliasName = btnType[i].aliasName
            b.name = btnType[i].name
            b.alias = btnType[i].alias
            nodeBtnList.push(b)
        })
        node.buttons = nodeBtnList

        nodeList.push(node)
    })

    processData.nodes.push(startNode, ...nodeList, endNode)
    // console.log(processData)

    return {
        defId: id,
        data: JSON.stringify(processData)
    }
}