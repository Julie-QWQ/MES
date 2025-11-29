export default {
  "panels": [{
    "index": 0,
    "height": 297,
    "width": 210,
    "paperHeader": 0,
    "paperFooter": 0,
    // "watermarkOptions": {
    //   "content": "vue-plugin-hiprint",
    //   "rotate": 25,
    //   "timestamp": true,
    //   "format": "YYYY-MM-DD HH:mm"
    // },
    "printElements": [{
      "options": {
        "left": 175.5,
        "top": 10.5,
        "height": 27,
        "width": 259,
        "title": "标签打印测试",
        "fontSize": 19,
        "fontWeight": "600",
        "textAlign": "center",
        "lineHeight": 26,
        "coordinateSync": true,
        "widthHeightSync": true,
        "draggable": true,
      }, "printElementType": {"title": "自定义文本", "type": "text"}
    }, {
      "options": {"left": 25.5, "top": 57, "height": 705, "width": 9, "fixed": true, "borderStyle": "dotted"},
      "printElementType": {"type": "vline"}
    }, {
      "options": {"left": 60, "top": 61.5, "height": 48, "width": 87, "src": "", "fit": "contain"},
      "printElementType": {"title": "图片", "type": "image"}
    },  {
      "options": {
        "left": 60,
        "top": 285,
        "height": 56,
        "width": 511.5,
        "field": "table",
        "tableFooterRepeat": "",
        "fields": [{"text":'id',"field":'id'},{"text":'姓名',"field":'name'},{"text":'性别',"field":'gender'},{"text":'数量',"field":'count'}],
        "columns": [[{"width": 85.25, "colspan": 1, "rowspan": 1, "checked": true}, {
          "title": "性别",
          "field": "gender",
          "width": 85.25,
          "colspan": 1,
          "rowspan": 1,
          "checked": false
        }, {
          "title": "姓名",
          "field": "name",
          "width": 85.25,
          "align": "center",
          "colspan": 1,
          "rowspan": 1,
          "checked": true,
          "tableSummary": "count"
        }, {
          "title": "数量",
          "field": "count",
          "width": 85.25,
          "align": "center",
          "colspan": 1,
          "rowspan": 1,
          "checked": true,
          "tableSummary": "sum"
		    }, {
          "width": 85.25,
          "colspan": 1,
          "rowspan": 1,
          "checked": true
        }, {"width": 85.25, "colspan": 1, "rowspan": 1, "checked": true}]]
      }, "printElementType": {
        "title": "表格", "type": "table",
        // editable: true,
        // columnDisplayEditable: true,//列显示是否能编辑
        // columnDisplayIndexEditable: true,//列顺序显示是否能编辑
        // columnTitleEditable: true,//列标题是否能编辑
        // columnResizable: true, //列宽是否能调整
        // columnAlignEditable: true,//列对齐是否调整
        // isEnableEditField: true, //编辑字段
        // isEnableContextMenu: true, //开启右键菜单 默认true
        // isEnableInsertRow: true, //插入行
        // isEnableDeleteRow: true, //删除行
        // isEnableInsertColumn: true, //插入列
        // isEnableDeleteColumn: true, //删除列
        // isEnableMergeCell: true, //合并单元格
      }
    },  {
      "options": {"left": 475.5, "top": 565.5, "height": 100, "width": 100},
      "printElementType": {"title": "矩形", "type": "rect"}
    }, {
      "options": {"left": 60, "top": 574.5, "height": 100, "width": 10},
      "printElementType": {"title": "竖线", "type": "vline"}
    },  {
      "options": {"left": 130.5, "top": 625.5, "height": 10, "width": 277},
      "printElementType": {"title": "横线", "type": "hline"}
    },  {
      "options": {"left": 12, "top": 786, "height": 49, "width": 49},
      "printElementType": {"title": "html", "type": "html"}
    }],
    //"paperNumberLeft": 565.5,
    //"paperNumberTop": 819
  }]
}
