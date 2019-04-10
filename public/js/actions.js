var groups = {
    "group0" : {
        "id":"group0",
        "name":"系统组件"
    },
    "group1" : {
        "id":"group1",
        "name":"自定义组件"
    }
};
var actions = {
        "startAction": {
            "id": "startAction",
            "desc": "开始",
            "group":"group0",
            "type":"Root",
            "params": [
                {"name": "serviceCodeField", "defaultValue": "", "desc": "服务码存放域"}
            ]
        },
        "addOperationAction": {
            "id": "addOperationAction",
            "desc": "加法计算器",
            "group":"group1",
            "type":"Action",
            "params": [
                {'name': 'paramField1', 'defaultValue': '', 'desc': '加数存放域'},
                {'name': 'paramField2', 'defaultValue': '', 'desc': '被加数存放域'},
                {'name': 'resultField', 'defaultValue': '', 'desc': '结果存放域'}
            ]
        },
        "listOperationAction": {
            "id": "listOperationAction",
            "desc": "列表处理器",
            "group":"group1",
            "type":"Action",
            "params": [
                {'name': 'dataListField', 'desc': '列表名称'}
            ]
        },
        "endAction": {
            "id": "endAction",
            "desc": "结束",
            "group":"group0",
            "type":"Exit",
            "params": [
                {"name": "serviceCodeField", "defaultValue": "", "desc": "服务码存放域"}
            ]
        }

};