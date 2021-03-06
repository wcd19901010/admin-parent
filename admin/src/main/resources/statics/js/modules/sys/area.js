$(function () {
    $("#jqGrid").jqGrid({
        url: baseURL + 'sys/area/list',
        datatype: "json",
        colModel: [
                    // {
                    //     label: 'id',
                    //     name: 'id',
                    //     index: 'id',
                    //     width: 50,
                    //     key: true
                    // },
                    {
                        label: '片区',
                        name: 'name',
                        index: 'name',
                        width: 80
                    }, 
                    {
                        label: '公司',
                        name: 'companyName',
                        index: 'company_name',
                        width: 80
                    },
                    {
                        label:'操作',
                        name:'id',
                        index:'id',
                        align:'center',
                        width:50,
                        // edittype:"button",
                        formatter:cmgStateFormat
                    }
                            ],
        viewrecords: true,
        height: 385,
        rowNum: 10,
        rowList: [10, 30, 50],
        rownumbers: true,
        rownumWidth: 25,
        autowidth: true,
        multiselect: false,
        pager: "#jqGridPager",
        jsonReader: {
            root: "page.list",
            page: "page.currPage",
            total: "page.totalPage",
            records: "page.totalCount"
        },
        prmNames: {
            page: "page",
            rows: "limit",
            order: "order"
        },
        gridComplete: function () {
            //隐藏grid底部滚动条
            $("#jqGrid").closest(".ui-jqgrid-bdiv").css({"overflow-x": "hidden"});
        }
    });
    $.ajax({
        type: "POST",
        url: baseURL + "sys/company/getAllCompanyList",
        contentType: "application/json",
        success: function (r) {
            if (r.code == 0) {
                vm.companylist = r.list
            } else {
                alert(r.msg);
            }
        }
    });
    //格式化操作列
    function cmgStateFormat(cellValue) {
        return "<a onclick=\"editArea("+ cellValue + ")\">编辑</a>"+
        "&nbsp;&nbsp;&nbsp;<a onclick=\"deleteArea("+ cellValue + ")\">删除</a>";
    }
});
//编辑
function editArea(id) {
    vm.showList = false;
    vm.title = "修改";
    vm.getInfo(id);
}
//删除
function deleteArea(id) {
    confirm('确定要删除选中的记录？', function () {
        var data = {id: id}
        $.ajax({
            type: "POST",
            url: baseURL + "sys/area/delete",
            dataType: "json",
            data:{id: id},
            success: function (r) {
                if (r.code == 0) {
                    alert('操作成功', function (index) {
                        $("#jqGrid").trigger("reloadGrid");
                    });
                } else {
                    alert(r.msg);
                }
            }
        });
    });
}
var vm = new Vue({
    el: '#rrapp',
    data: {
        showList: true,
        title: null,
        area: {
        },
        companylist: [],
        q:{
            name:null,
            companyId:""
        }
    },
methods: {
    query: function () {
        vm.reload();
    }
,
    add: function () {
        vm.showList = false;
        vm.title = "新增";
        vm.area = {
            companyId:""
        };
    }
,
    update: function (event) {
        var id =
        getSelectedRow();
        if (id== null
    )
        {
            return;
        }
        vm.showList = false;
        vm.title = "修改";

        vm.getInfo(id)
    }
,
    saveOrUpdate: function (event) {
        var url = vm
    .area.id ==
        null ? "sys/area/save" : "sys/area/update";
        $.ajax({
            type: "POST",
            url: baseURL + url,
            contentType: "application/json",
            data: JSON.stringify(vm.area),
            success: function (r) {
                if (r.code === 0) {
                    alert('操作成功', function (index) {
                        vm.reload();
                    });
                } else {
                    alert(r.msg);
                }
            }
        });
    }
,
    del: function (event) {
        var ids = getSelectedRows();
        if (ids == null) {
            return;
        }

        confirm('确定要删除选中的记录？', function () {
            $.ajax({
                type: "POST",
                url: baseURL + "sys/area/delete",
                contentType: "application/json",
                data: JSON.stringify(ids),
                success: function (r) {
                    if (r.code == 0) {
                        alert('操作成功', function (index) {
                            $("#jqGrid").trigger("reloadGrid");
                        });
                    } else {
                        alert(r.msg);
                    }
                }
            });
        });
    }
,
    getInfo: function (id) {
        $.get(baseURL + "sys/area/info/" +id, function (r) {
            vm.area = r.area;
        });
    }
,
    reload: function (event) {
        vm.showList = true;
        var page = $("#jqGrid").jqGrid('getGridParam', 'page');
        $("#jqGrid").jqGrid('setGridParam', {
            postData:{'name': vm.q.name,'companyId':vm.q.companyId},
            page: page
        }).trigger("reloadGrid");
    }
}
});