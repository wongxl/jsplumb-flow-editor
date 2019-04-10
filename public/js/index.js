/* global $, visoConfig, Mustache, uuid, jsPlumb, graphlib */

(function () {
  var root = {};

  window.IVR = root;

  root.emit = function (event) {
    console.log(event)
  };

  var area = 'drop-bg';
  var areaId = '#' + area;
  var fixedNodeId = {
    begin: 'begin-node',
    end: 'end-node'
  };
  //============================================================
  var _selNodeId;
  var setting = {
    view: {
      dblClickExpand: false,
      showLine: false,
      selectedMulti: false
    },
    data: {
      simpleData: {
        enable:true,
        idKey: "id",
        pIdKey: "pId",
        rootPId: ""
      }
    },
    callback: {
      beforeClick: function(treeId, treeNode) {
        var zTree = $.fn.zTree.getZTreeObj("tree");
        if (treeNode.isParent) {
          zTree.expandNode(treeNode);
          return false;
        } else {
          console.log(treeNode);
          _selNodeId = treeNode.id;
          return true;
        }
      }
    }
  };

  var zNodes =[
    { id:"group", pId:0, name:"组件列表", open:true},
    { id:"group0", pId:"group", name:"系统组件", open:true},
    { id:"group1", pId:"group", name:"自定义组件", open:true},
    { id:"startAction", pId:"group0", name:"开始"},
    { id:"endAction", pId:"group0", name:"结束"},
    { id:"addOperationAction", pId:"group1", name:"加法处理器"},
    { id:"listOperationAction", pId:"group1", name:"列表处理器"}
  ];


  var t = $("#treeDemo");
  t = $.fn.zTree.init(t, setting, zNodes);

//=================================================================
  jsPlumb.ready(main);
  jsPlumb.importDefaults({
    ConnectionsDetachable: true
  });

  // 放入拖动节点
  function dropNode (name, position) {
    position.left -= $('#side-buttons').outerWidth();
    let index = 0;
    let action = actions[name];
    for (let key in flowData.stepMap) {
      let node = flowData.stepMap[key];
      if(node.interCode === action.id) {
        let temp = parseInt(node.id.substr(node.id.length-1,1));
        if (temp >= index) {
          index = temp + 1;
        }
      }
    }
    position.id = action.id + '' + index;
    position.generateId = uuid.v1();
    position.name = action.desc;
    position.actionId = action.id;
    var html = renderHtml("tpl-Action", position);

    $(areaId).append(html);

    initSetNode("tpl-Action", position)
  }

  // 初始化节点设置
  function initSetNode (template, position) {
    addDraggable(position.id);
    setEnterPoint(position.id);
    setExitPoint(position.id);
    setActionData(position);
  }

  function setActionData(position) {
    var action = actions[position.actionId];
    var actionNode = {};
    actionNode.id = position.id;
    actionNode.desc = action.desc;
    actionNode.type = 'Action';
    actionNode.interCode = action.id;
    actionNode.paramsMap = {};
    action.params.forEach(function (param) {
      actionNode.paramsMap[param.name] = param;
    });
    actionNode.top = position.top;
    actionNode.left = position.left;
    flowData.stepMap[actionNode.id] = actionNode;
  }

  // 设置入口点
  function setEnterPoint (id) {
    var config = getBaseNodeConfig();

    config.isSource = true;
    config.maxConnections = -1;
    config.allowLoopback = false ;//禁止回环
    jsPlumb.addEndpoint(id, {
      // anchors: ['Top'],
      anchor:'AutoDefault',
      uuid: id + '-in'
    }, config)
  }

  // 设置出口点
  function setExitPoint (id, position) {
    var config = getBaseNodeConfig();

    config.isTarget = true;
    config.maxConnections = -1;
    config.allowLoopback = false ;//禁止回环
    jsPlumb.addEndpoint(id, {
      // anchors: position || 'Bottom',
      anchor:'AutoDefault',
      uuid: id + '-out'
    }, config)
  }

  // 删除一个节点以及
  function emptyNode (id) {
    let edNode = flowData.stepMap[id];
    jsPlumb.getConnections().forEach(function (conn) {
      if (conn.target.id === edNode.id) {
        let tars = flowData.stepMap[conn.source.id].targetMap;
        let index = 0;
        tars.forEach(function (tarItem) {
          if (tarItem.value === conn.target.id) {
            flowData.stepMap[conn.source.id].targetMap.splice(index,1);
          }
          index ++;
        });
      }
    });
    delete flowData.stepMap[id];
    jsPlumb.remove(id)
  }

  // 让元素可拖动
  function addDraggable (id) {
    jsPlumb.draggable(id, {
      containment: 'parent'
    })
  }

  // 渲染html
  function renderHtml (type, position) {
    return Mustache.render($('#' + type).html(), position)
  }

  var _deNode;
  var _pdiv = $('#myflow_props');
  var _tb = _pdiv.find('table');


  function eventHandler (node,position) {
    if (node.type === 'deleteNode') {
      emptyNode(node.id)
    } else if (node.type === 'action') {
      if(_deNode) {
        $('#' + _deNode.id + " .panel-info").css('border-color', '#4ce8f1');
      }
       $('#'+ node.id + " .panel-info").css('border-color','#F12831');
      editAction(flowData.stepMap[node.id]);
    } else if (node.type === 'commit') {
      if(_deNode) {
        let stepNode = flowData.stepMap[_deNode.id];
        let actionNode = actions[stepNode.interCode];
        actionNode.params.forEach(function (param) {
          var value = _pdiv.find('#' + param.name).val();
          if(value === null || value === undefined || value.trim() === '') {
            stepNode.paramsMap[param.name].value = param.defaultValue;
          }
          stepNode.paramsMap[param.name].value = _pdiv.find('#' + param.name).val();
        });
        console.log(_deNode);
      }
    } else {
      if(_selNodeId) {
        dropNode(_selNodeId,position);
        _selNodeId = null;
      }
    }
  }


 function editAction(node) {
    if (_deNode && _deNode.id === node.id) {// 连续点击不刷新
      return;
    }
   _deNode = node;
    _tb.empty();
    _pdiv.show();
    var props = _deNode.paramsMap;
    for (var k in props) {
      var position = {};
      position.desc = props[k].desc;
      position.name = props[k].name;
      position.value = props[k].value;
      _tb.append(Mustache.render($('#tpl-tr').html(), position));
    }
  }

  // 主要入口
  function main () {
    // initAction();
    jsPlumb.setContainer('diagramContainer');

    $('#treeDemo').find("a").draggable({
      helper: 'clone',
      scope: 'ss'
    });

    _pdiv.hide();

    $(areaId).droppable({
        scope: 'ss',
      drop: function (event, ui) {
        dropNode(ui.draggable[0].dataset.template,ui.draggable[0].dataset.name, ui.position)
      }
    });

    $('#app').on('click', function (event) {
      event.stopPropagation();
      event.preventDefault();
      let position = {};
      position.left = event.pageX-$(this).offset().left;
      position.top = event.pageY-$(this).offset().top;
      eventHandler(event.target.dataset,position);
    });



    $(areaId).on('dblclick',function (event) {

      if (event.target.dataset.type === 'action') {
        let element = event.target;
        let oldhtml = $.trim(element.innerHTML);
        //如果已经双击过，内容已经存在input，不做任何操作
        if(oldhtml.indexOf('type="text"') > 0){
          return;
        }
        //创建新的input元素
        let newobj = document.createElement('input');
        //为新增元素添加类型
        newobj.type = 'text';
        //为新增元素添加value值
        newobj.value = oldhtml;

        newobj.style['color'] = 'black';
        //为新增元素添加光标离开事件
        newobj.onblur = function() {
          //当触发时判断新增元素值是否为空，为空则不修改，并返回原有值
          if(this.value && this.value.trim()!==""){
            element.innerHTML = this.value === oldhtml ? oldhtml : this.value;
            // let nodeId = element.dataset.id;
            let stepNode = flowData.stepMap[_deNode.id];
            stepNode.desc = element.innerHTML;
            jsPlumb.setSuspendDrawing(false,true);
            updateFlag = true;
          } else {
            element.innerHTML = oldhtml;
          }
        };
        //设置该标签的子节点为空
        element.innerHTML = '';
        //添加该标签的子节点，input对象
        element.appendChild(newobj);
        //设置选择文本的内容或设置光标位置（两个参数：start,end；start为开始位置，end为结束位置；如果开始位置和结束位置相同则就是光标位置）
        newobj.setSelectionRange(0, oldhtml.length);
        //设置获得光标
        newobj.focus();
      }
    });

    // 当链接建立
    jsPlumb.bind('beforeDrop', function (info) {
      return connectionBeforeDropCheck(info)
    });

    //删除节点
    $('#delete_node_button').off("click").click(function () {
      if(_deNode) {
        emptyNode(_deNode.id);
        _deNode = null;
        _pdiv.hide();
      }
    });

    //保存流程
    $('#save_flow_button').off("click").click(function () {
      //TODO 保存数据
      toastr.options.positionClass = 'toast-center-center';
      toastr.options.timeOut = 3000;
      toastr.success('提交数据成功');
    });


    jsPlumb.bind('dblclick', function (conn, originalEvent) {
      let node = flowData.stepMap[conn.sourceId];
      let targets = node.targetMap;
      let target;
      for (let i = 0; i < targets.length; i ++) {
        if(conn.id === targets[i].connId) {
          target = targets[i];
          break;
        }
      }

      let position = {};
      position.connId = conn.id;
      position.desc = target.desc;
      position.condition = target.condition;
      let modalHTML = Mustache.render($('#tpl-modal').html(), position);
      let cmode_div = $('#condition_mode');
      cmode_div.empty();
      cmode_div.append(modalHTML);
      $('#myModal').modal();
    });

    $("#condition_submit").off("click").click(function () {
      let connId = $('#txt_connId').val();
      let desc = $('#txt_desc').val();
      let condition = $('#txt_condition').val();
      let editConn;
      try {
        jsPlumb.getConnections().forEach(function (conn) {
          if (connId === conn.id) {
            editConn = conn;
            throw new Error();
          }
        });
      }catch (e) {}

      if (editConn) {
        let sourceId = editConn.sourceId;
        try {
          flowData.stepMap[sourceId].targetMap.forEach(function (item) {
            if (item.connId === connId) {
              item.desc = desc;
              item.condition = condition;
              throw new Error();
            }
          });
        }catch (e) {
          if (desc) {
            editConn.addOverlay(['Custom', {
              create: function (component) {
                return $('<span style="background-color: white; padding: 5px;">' + desc + '</span>');
              },
              location: 0.5
            }]);
          }
        }
      }
    });

    $("#connect_delete").off('click').click(function () {
      let connId = $('#txt_connId').val();
      let editConn;
      try {
        jsPlumb.getConnections().forEach(function (conn) {
          if (connId === conn.id) {
            editConn = conn;
            throw new Error();
          }
        });
      }catch (e) {
        if (confirm('确定删除所点击的链接吗？')) {
          if(editConn) {
            let sourceId = editConn.sourceId;
            try {
              let index = 0;
              flowData.stepMap[sourceId].targetMap.forEach(function (item) {
                if (item.connId === connId) {
                  flowData.stepMap[sourceId].targetMap.splice(index,1);
                  throw new Error();
                }
                index++;
              });
            }catch (e) {}
            jsPlumb.detach(editConn);
          }

        }
      }
    });

    DataDraw.draw(flowData.stepMap)
  }

  // 链接建立后的检查
  // 当出现自连接的情况后，要将链接断开
  function connectionBeforeDropCheck (info) {
    try {
      jsPlumb.getConnections().forEach(function (conn) {
        if ((conn.source.id === info.sourceId && conn.target.id === info.targetId) ||
            (conn.source.id === info.targetId && conn.target.id === info.sourceId)) {
          console.log(conn.source.id + "=====" + info.targetId);
          throw new Error("添加连线失败");
        }
      });
    }catch(e) {
      return false;
    }
    return true;
  }

  // 获取基本配置
  function getBaseNodeConfig () {
    return Object.assign({}, visoConfig.baseStyle)
  }

  // 初始化开始节点属性
  function initBeginNode (id) {
    var config = getBaseNodeConfig();

    config.isTarget = true;
    config.isSource = true;
    config.maxConnections = -1;
    config.allowLoopback = false ;//禁止回环
    jsPlumb.addEndpoint(id, {
      // anchors: ['Bottom'],
      anchor:'AutoDefault',
      uuid: id + '-out'
    }, config)
  }

  // 初始化结束节点属性
  function initEndNode (id) {
    var config = getBaseNodeConfig();

    config.isSource = true;
    config.isTarget = true;
    config.maxConnections = -1;
    config.allowLoopback = false ;//禁止回环
    jsPlumb.addEndpoint(id, {
      // anchors: 'Top',
      anchor:'AutoDefault',
      uuid: id + '-in'
    }, config)
  }


  var DataDraw = {

    draw: function (nodes) {
      let $container = $(areaId);
      let me = this;
      for(let key  in nodes) {
        let item = nodes[key];
        console.log(item);
        let data = {
          id: item.id,
          name: item.desc,
          top: item.top,
          left: item.left,
          choices:  []
        };

        let template = me.getTemplate(item);

        $container.append(Mustache.render(template, data));

        if (me['addEndpointOf' + item.type]) {
          me['addEndpointOf' + item.type](item)
        }
      }

      this.mainConnect(nodes)
    },
    connectEndpoint: function (from, to) {
      return jsPlumb.connect({ uuids: [from, to] });
    },
    mainConnect: function (nodes) {
      let me = this;
      for (let key in nodes) {
        let item = nodes[key];
        if (me['connectEndpointOf' + item.type]) {
          me['connectEndpointOf' + item.type](item)
        }
      }
    },
    getTemplate: function (node) {
      return $('#tpl-' + node.type).html() || $('#tpl-demo').html()
    },
    addEndpointOfRoot: function (node) {
      addDraggable(node.id);
      initBeginNode(node.id);
    },
    connectEndpointOfRoot: function (node) {
      var me = this;
      node.targetMap.forEach(function (target) {
        let conn = me.connectEndpoint(node.id + '-out', target.value + '-in');
        target.connId = conn.id;
        if (target.desc) {
          conn.addOverlay(['Custom', {
            create: function (component) {
              return $('<span style="background-color: white; padding: 5px;">' + target.desc + '</span>');
            },
            location: 0.5
          }]);
        }
      });
    },
    addEndpointOfAction: function (node) {
      addDraggable(node.id);
      setEnterPoint(node.id);
      initBeginNode(node.id);
    },
    connectEndpointOfAction: function (node) {
      let me = this;
      node.targetMap.forEach(function (target) {
        let conn = me.connectEndpoint(node.id + '-out', target.value + '-in');
        target.connId = conn.id;
        if (target.desc) {
          conn.addOverlay(['Custom', {
            create: function (component) {
              return $('<span style="background-color: white; padding: 5px;">' + target.desc + '</span>');
            },
            location: 0.5
          }]);
        }
      });
    },

    addEndpointOfExit: function (node) {
      addDraggable(node.id);
      initEndNode(node.id)
    }
  };

  // root.DataProcess = DataProcess
  root.DataDraw = DataDraw
})();
