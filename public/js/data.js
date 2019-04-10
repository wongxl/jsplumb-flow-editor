// var dataDic = {
//     "serviceCode":{"defaultValue": "A0001", "name": "serviceCode", "value": "", "desc": "服务编码"},
//     "document":{"defaultValue": "", "name": "document", "value": "", "desc": "文档（保存最初报文）"},
//     "output":{"defaultValue": "", "name": "output", "value": "", "desc": "输出"},
//     "result":{"defaultValue": "", "name": "result", "value": "", "desc": "结果"},
//     "paramList":{
//       "name": "paramList",
//       "content":[
//           {"name": "param10", "desc": "参数10"}
//       ],
//     "desc": "参数列表"
//     },
//     "param11":{ "defaultValue": null, "name": "param11",  "desc": "参数列表11"}
// };
var flowData = {
  'id': '4000',
  'name': '功能测试',
  'status': 'enable',
  'varList': [],
  'stepMap': {
    "startAction0": {
      'id': 'startAction0',
      'type': 'Root',
      'desc': '开始',
      'interCode': 'startAction',
      'paramsMap': {
        'serviceCodeField':{'name': 'serviceCodeField', 'defaultValue': '', 'value': '', 'desc': '服务编码存放域'}
      },
      'targetMap': [
        {'id': 'target0', 'value': 'addOperationAction0', 'condition': '#params2 == \'2\'', 'desc': '加数等于2'},
        {'id': 'target1', 'value': 'addOperationAction1', 'condition': '#params2 == \'5\'', 'desc': '加数等于5'}
      ],
      'top': 50,
      'left': 150
    },
    "addOperationAction1": {
      'id': 'addOperationAction1',
      'type': 'Action',
      'desc': '参数加5',
      'interCode': 'addOperationAction',
      'paramsMap': {
        'paramField1': {'name': 'paramField1', 'defaultValue': '', 'value': 'params1', 'desc': '加数存放域'},
        'paramField2': {'name': 'paramField2', 'defaultValue': '', 'value': 'params2', 'desc': '被加数存放域'},
        'resultField': {'name': 'resultField', 'defaultValue': '', 'value': 'result', 'desc': '结果存放域'}
      },
      'targetMap': [
        {'id': 'target0', 'value': 'endAction0', 'condition': '', 'desc': ''}
      ],
      'top': 178,
      'left': 400
    },
    "addOperationAction0": {
      'id': 'addOperationAction0',
      'type': 'Action',
      'desc': '参数加2',
      'interCode': 'addOperationAction',
      'paramsMap': {
        'paramField1': {'name': 'paramField1', 'defaultValue': '', 'value': 'params1', 'desc': '加数存放域'},
        'paramField2': {'name': 'paramField2', 'defaultValue': '', 'value': 'params2', 'desc': '被加数存放域'},
        'resultField': {'name': 'resultField', 'defaultValue': '', 'value': 'result', 'desc': '结果存放域'}
      },
      'targetMap': [
        {'id': 'target0', 'value': 'listOperationAction0', 'condition': '', 'desc': ''}
      ],
      'top': 178,
      'left': 150
    },

    "listOperationAction0": {
      'id': 'listOperationAction0',
      'type': 'Action',
      'desc': '数据列表处理',
      'interCode': 'listOperationAction',
      'paramsMap': {
        'dataListField': {'name': 'dataListField', 'value': 'dataList', 'desc': '列表名称'}
      },
      'targetMap': [
        {'id': 'target0', 'value': 'endAction0', 'condition': '', 'desc': ''}
      ],
      'top': 260,
      'left': 150
    },
    "endAction0": {
      'id': 'endAction0',
      'type': 'Exit',
      'desc': '结束',
      'interCode': 'endAction',
      'paramsMap': {
        'serviceCodeField':{'name': 'serviceCodeField', 'defaultValue': '', 'value': '', 'desc': '服务编码存放域'}
      },
      'top': 500,
      'left': 300
    }
  }
}
