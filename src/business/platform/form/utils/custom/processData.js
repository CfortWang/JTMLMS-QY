export const startNode = {
    "node_name": "开始",
    "node_type": "start",
    "id": "",
    "parentId": null,
    "scripts": {
        "start": ""
    },
    "buttons": [],
    "attributes": {
        "allowPromoterStop": false,
        "hideOpinion": false,
        "jumpType": "common",
        "rejectSection": "",
        "hidePath": true,
        "prevHandler": "",
        "allowExecutorEmpty": false,
        "notifyType": "",
        "parentDefKey": "local_",
        "skipExecutorEmpty": false,
        "rejectType": "all",
        "postHandler": "",
        "buttonInitialized": true,
        "nodeId": ""
    }
}

export const endNode = {
    "node_name": "结束",
    "node_type": "end",
    "id": "",
    "parentId": null,
    "scripts": {
        "end": ""
    }
}

export const normalNode = {
    "node_name": "",
    "node_type": "userTask",
    "id": "",
    "parentId": null,
    "users": [
        {
            "parentFlowKey": "local_",
            "condition": "",
            "conditionMode": "",
            "name": "",
            "description": "",
            "groupNo": 1,
            "calcs": [
                {
                    "nodeName": "",
                    "extract": "extract",
                    "pluginName": "",
                    "fullName": "",
                    "logicCal": "or",
                    "source": "var",
                    "executorVar": {
                        "executorType": "user",
                        "valType": "userId",
                        "name": "",
                        "source": "boVar",
                        "value": "",
                        "party": false
                    },
                    "nodeId": "",
                    "account": "",
                    "pluginType": "cusers",
                    "description": ""
                }
            ]
        }
    ],
    "form": {
        "type": "inner",
        "version": null,
        "mobileVersion": 0,
        "formValue": "",
        "mobileValue": "",
        "name": "",
        "mobileName": "",
        "editUrl": "",
        "editFormRights": null,
        "mobileUrl": "",
        "templateId": "",
        "templateName": ""
    },
    "scripts": {
        "complete": "",
        "create": ""
    },
    "buttons": [],
    "jumpRules": [],
    "reminders": [],
    "trigerFlows": [],
    "procNotify": [],
    "withOutGateway": false,
    "attributes": {
        "allowPromoterStop": false,
        "hideOpinion": false,
        "jumpType": "common",
        "rejectSection": "",
        "hidePath": true,
        "prevHandler": "",
        "allowExecutorEmpty": false,
        "notifyType": "inner",
        "parentDefKey": "local_",
        "skipExecutorEmpty": false,
        "rejectType": "all",
        "postHandler": "",
        "buttonInitialized": true,
        "nodeId": ""
    }
}

export const btn = {
    "aliasName": "",
    "supportScript": false,
    "afterScript": "",
    "code": "",
    "name": "",
    "alias": "",
    "beforeScript": ""
}

export const btnType = {
    start: {
        aliasName: '启动',
        name: '提交',
        alias: 'startFlow'
    },
    end: {
        aliasName: '同意',
        name: '同意并结束',
        alias: 'agree'
    },
    startSave: {
        aliasName: '保存草稿',
        name: '暂存',
        alias: 'saveDraft'
    },
    agree: {
        aliasName: '同意',
        name: '提交',
        alias: 'agree'
    },
    save: {
        aliasName: '保存',
        name: '暂存',
        alias: 'save'
    },
    reject: {
        aliasName: '驳回发起人',
        name: '退回',
        alias: 'rejectToStart'
    },
    flow: {
        aliasName: '流程图',
        name: '流程图',
        alias: 'flowImage'
    }
}

export const processData = {
    "global": {
        "id": "",
        "bo": {
            "saveMode": "table",
            "code": "",
            "name": "",
            "version": 1
        },
        "form": {
            "type": "inner",
            "version": 0,
            "mobileVersion": null,
            "formValue": "",
            "mobileValue": "",
            "name": "",
            "mobileName": "",
            "editUrl": "",
            "editFormRights": null,
            "mobileUrl": "",
            "templateId": "",
            "templateName": "",
            "prevHandler": null,
            "postHandler": null
        },
        "instForm": {
            "type": "inner",
            "version": null,
            "mobileVersion": null,
            "formValue": "",
            "mobileValue": "",
            "name": "",
            "mobileName": "",
            "editUrl": "",
            "editFormRights": null,
            "mobileUrl": "",
            "templateId": "",
            "templateName": ""
        },
        "formOpinions": {},
        "attributes": {
            "subjectRule": "{流程标题:title}",
            "archiveNotifyType": "inner",
            "allowTransTo": false,
            "prevHandler": "",
            "allowExecutorEmpty": false,
            "description": "",
            "firstNodeUserAssign": false,
            "startNotifyType": "inner",
            "notifyType": "inner",
            "skipExecutorEmpty": false,
            "testNotifyType": "inner",
            "allowCopyTo": false,
            "testStatus": "test",
            "skipSameUser": false,
            "allowRefCounts": 5,
            "postHandler": "",
            "skipFirstNode": false,
            "allowReference": false,
            "status": "deploy"
        },
        "variables": [],
        "procNotify": []
    },
    "nodes": []
}