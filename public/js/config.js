// var visoConfig = {
//   visoTemplate: {}
// }

// visoConfig.visoTemplate.playAudioNode = '<div class="pa" id="{{id}}" style="top:{{top}}px;left:{{left}}px"><a class="btn btn-success" href="#" role="button">放音</a></div>'
function makeStyle(flag) {
  let config = {};
  config.connectorPaintStyle = {
    lineWidth: 1,
    strokeStyle: flag == 'dim' ? '#a2a1a1' : 'black',
    joinstyle: 'round',
    outlineColor: '',
    outlineWidth: ''
  };

  // 鼠标悬浮在连接线上的样式
  config.connectorHoverStyle = {
    lineWidth: 2,
    strokeStyle: '#4caf50',
    outlineWidth: 10,
    outlineColor: ''
  };

  return {
    // 端点形状
    endpoint: ['Dot', {
      radius: 5,
      fill: flag == 'dim' ? '#a2a1a1' : 'black'
    }],
    // 连接线的样式
    connectorStyle: config.connectorPaintStyle,
    connectorHoverStyle: config.connectorHoverStyle,
    // 端点的样式
    paintStyle: {
      fillStyle: flag == 'dim' ? '#a2a1a1' : 'black',
      radius: 4
    },
    hoverPaintStyle: {
      fillStyle: '#4caf50',
      strokeStyle: '#4caf50'
    },
    isSource: true,
    connector: ['Straight', {
      gap: 0,
      cornerRadius: 5,
      alwaysRespectStubs: true
    }],
    isTarget: true,
    // 设置连接点最多可以链接几条线
    maxConnections: -1,
    connectorOverlays: [
      ['Arrow', {
        width: 8,
        length: 10,
        location: 1
      }]
    ]
  };
}

var visoConfig = {
  baseStyle: makeStyle('base'),
  dimStyle: makeStyle('dim')
};

visoConfig.baseArchors = ['RightMiddle', 'LeftMiddle'];
