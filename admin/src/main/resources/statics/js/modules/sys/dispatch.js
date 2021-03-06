$(function () {
    $("#jqGrid").jqGrid({
        url: baseURL + 'sys/dispatch/list',
        datatype: "json",
        colModel: [
            {
                label: '月份',
                name: 'month',
                index: 'month',
                width: 80
            },
            {
                label: '片区',
                name: 'areaName',
                index: 'area_name',
                width: 80
            },
            {
                label: '城市',
                name: 'cityName',
                index: 'city_name',
                width: 80
            },
            {
                label: '站点',
                name: 'siteName',
                index: 'site_name',
                width: 80
            },
            {
                label: 'ERP账号',
                name: 'erpNumber',
                index: 'erp_number',
                width: 80
            },
            {
                label: '姓名',
                name: 'courierName',
                index: 'courier_name',
                width: 80
            },
            {
                label: '身份证',
                name: 'cardId',
                index: 'card_id',
                width: 80
            },
            {
                label: '总单量',
                name: 'allOrderCount',
                index: 'all_order_count',
                width: 80
            },
            {
                label: '合计单量',
                name: 'totalOrderCount',
                index: 'total_order_count',
                width: 80
            },
            {
                label: '费用合计',
                name: 'totalMoney',
                index: 'total_money',
                width: 80
            },
            {
                label: '罚款合计',
                name: 'fineMoney',
                index: 'fine_money',
                width: 80
            },
            {
                label: '其他扣款',
                name: 'deductMoney',
                index: 'deduct_money',
                width: 80
            },
            {
                label: '工资',
                name: 'salary',
                index: 'salary',
                width: 80
            },
            {
                label: '备注',
                name: 'remark',
                index: 'remark',
                width: 80
            },
            {
                label: '操作',
                name: 'id',
                index: 'id',
                width: 120,
                formatter: function (value, options, row) {
                    return "<a onclick=\"vm.edit(" + value + ")\">编辑</a>" +
                        "&nbsp;&nbsp;&nbsp;<a onclick=\"vm.info(" + value + ")\">详情</a>";
                }
            }
        ],
        viewrecords: true,
        height: 385,
        rowNum: 10,
        rowList: [10, 30, 50],
        rownumbers: true,
        rownumWidth: 25,
        autowidth: true,
        multiselect: true,
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

    new AjaxUpload('#upload', {
        action: baseURL + "sys/dispatch/upload",
        name: 'file',
        autoSubmit: true,
        responseType: "json",
        onSubmit: function (file, extension) {
            if (!(extension && /^(xls|xlsx)$/.test(extension.toLowerCase()))) {
                alert('只支持xls, xlsx格式的文件！');
                return false;
            }
        },
        onComplete: function (file, r) {
            if (r.code == 0) {
                vm.initSearch();
                vm.reload();
            } else {
                alert(r.msg);
            }
        },
    });
});

var vm = new Vue({
    el: '#rrapp',
    data: {
        showList: true,
        disabled: false,
        title: null,
        q: {},
        dispatch: {},
        courier: {},
        companyList: [],
        areaList: [],
        cityList: [],
        siteList: [],
        erpList: [],
        courierList: []
    },
    computed: {
    },

    watch: {
    },
    methods: {
        query: function () {
            vm.reload();
        },
        search: function (erpNumber) {
            this.getCourier(erpNumber);
        },
        add: function () {
            vm.showList = false;
            vm.title = "新增";
            vm.dispatch = {};
        },
        edit: function (id) {
            vm.showList = false;
            vm.disabled = false;
            vm.title = "编辑运营数据";
            vm.getInfo(id);
            // vm.searchErpList();
        },

        /**********************************************************************
         * 营运数据详情
         * @author Wang Chinda
         **********************************************************************/
        info: function (id) {
            vm.showList = false;
            vm.disabled = true;
            vm.title = "配送员详情";
            vm.getInfo(id);
        },

        saveOrUpdate: function (event) {
            var url = vm.dispatch.id == null ? "sys/dispatch/save" : "sys/dispatch/update";
            if (this.validator()) {
                return;
            }
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.dispatch),
                success: function (r) {
                    if (r.code === 0) {
                        alert('操作成功', function (index) {
                            vm.initSearch();
                            vm.reload();
                        });
                    } else {
                        alert(r.msg);
                    }
                }
            });
        },
        del: function (event) {
            var ids = getSelectedRows();
            if (ids == null) {
                return;
            }

            confirm('确定要删除选中的记录？', function () {
                $.ajax({
                    type: "POST",
                    url: baseURL + "sys/dispatch/delete",
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
        },
        getInfo: function (id) {
            $.get(baseURL + "sys/dispatch/info/" + id, function (r) {
                vm.searchCourierList(r.dispatch.companyId,r.dispatch.erpId);
                vm.searchErpList2(r.dispatch.companyId,r.dispatch)
                // vm.dispatch = r.dispatch;

            });
        },
        reload: function (event) {
            vm.showList = true;
            var page = $("#jqGrid").jqGrid('getGridParam', 'page');
            $("#jqGrid").jqGrid('setGridParam', {
                postData: {
                    'courierName': vm.q.name,
                    'month': vm.q.month,
                    'cardId': vm.q.cardId,
                    'companyId': vm.q.companyId,
                    'status': vm.q.status,
                    'pactId': vm.q.pactId,
                    'cityId': vm.q.cityId,
                    'areaId': vm.q.areaId,
                    'siteId': vm.q.siteId
                },
                page: page
            }).trigger("reloadGrid");
        },

        /**********************************************************************
         * 初始化查询条件
         * @author Wang Chinda
         **********************************************************************/
        initSearch: function () {
            this.q.name = '';
            this.q.month = '';
            this.q.cardId = '';
            this.q.companyId = '';
            this.q.status = '';
            this.q.cityId = '';
            this.q.areaId = '';
            this.q.siteId = '';
        },

        /**********************************************************************
         * 初始化查询条件下拉列表
         * @author Wang Chinda
         **********************************************************************/
        initCondition: function () {
            // 查询公司信息
            this.searchCompany();
        },

        changeCompany: function (companyId, type) {
            // 搜索
            if (type == 1) {
                this.searchPact(companyId);
                this.searchArea(companyId);
                vm.q.areaId = '';
                vm.q.cityId = '';
                vm.q.siteId = '';
                vm.cityList = [];
                vm.siteList = [];
            }else{
                vm.dispatch.erpId = "";
                vm.erpList = [];
                vm.dispatch.courierId="";
                vm.courierList = [];
                if (companyId) {
                    this.searchErpList2(companyId);
                }
            }
        },

        changeArea: function (areaId, type) {
            // 搜索
            if (type == 1) {
                this.searchCity(areaId);
                vm.q.cityId = '';
                vm.q.siteId = '';
                vm.siteList = [];
            }
        },

        changeCity: function (cityId, type) {
            // 搜索
            if (type == 1) {
                this.searchSite(cityId);
                vm.q.siteId = '';
            }
        },

        /**********************************************************************
         * 查询公司信息
         * @author Wang Chinda
         **********************************************************************/
        searchCompany: function () {
            $.get(baseURL + "sys/company/getAllCompanyList", function (r) {
                vm.companyList = r.list;
            });
        },

        /**********************************************************************
         * 查询合同信息
         * @author Wang Chinda
         **********************************************************************/
        searchPact: function (companyId) {
            $.get(baseURL + "sys/pact/listAll?companyId=" + companyId, function (r) {
                vm.pactList = r.list;
            });
        },

        /**********************************************************************
         * 查询城市信息
         * @author Wang Chinda
         **********************************************************************/
        searchCity: function (areaId) {
            $.get(baseURL + "sys/city/listAll?areaId=" + areaId, function (r) {
                vm.cityList = r.list;
            });
        },

        /**********************************************************************
         * 查询区域信息
         * @author Wang Chinda
         **********************************************************************/
        searchArea: function (companyId) {
            $.get(baseURL + "sys/area/listAll?companyId=" + companyId, function (r) {
                vm.areaList = r.list;
            });
        },

        /**********************************************************************
         * 查询站点信息
         * @author Wang Chinda
         **********************************************************************/
        searchSite: function (cityId) {
            $.get(baseURL + "sys/site/listAll?cityId=" + cityId, function (r) {
                vm.siteList = r.list;
            });
        },

        /**********************************************************************
         * 查询Erp账户
         * @author Wang Chinda
         **********************************************************************/
        searchErpList: function () {
            $.get(baseURL + "sys/erp/listByCourier", function (r) {
                vm.erpList = r.list;
            });
        },
        /**
         * 根据公司id查询erp
         */
        searchErpList2: function (id,data) {
            $.get(baseURL + "sys/erp/listByCourier3?companyId="+id, function (r) {
                vm.erpList = r.list;
                if(data){
                    vm.dispatch = data;
                }
            });
        },
        /**
         * 查询能导入的配送员
         * @param companyId
         * @param erpId
         */
        searchCourierList: function(companyId,erpId){
            $.get(baseURL + "sys/courier/getCourierList?companyId="+companyId+"&erpId="+erpId, function (r) {
                vm.courierList = r.list;
            });
        },
        changeErp:function(id){
            // $.get(baseURL + "sys/courier/getCourier2?companyId="+vm.dispatch.companyId+"&erpId="+id, function (r) {
            //     vm.dispatch.areaName=r.courier.areaName;
            //     vm.dispatch.cityName=r.courier.cityName;
            //     vm.dispatch.siteName=r.courier.siteName;
            //     vm.dispatch.courierName=r.courier.name;
            //     vm.dispatch.cardId=r.courier.cardId;
            // });
            vm.dispatch.courierId = '';
            vm.dispatch.courierList = [];
            vm.searchCourierList(vm.dispatch.companyId,vm.dispatch.erpId);
        },
        changeCourier:function(id){
            $.get(baseURL + "sys/courier/getCourier2?id="+id, function (r) {
                vm.dispatch.areaName=r.courier.areaName;
                vm.dispatch.cityName=r.courier.cityName;
                vm.dispatch.siteName=r.courier.siteName;
                vm.dispatch.courierName=r.courier.name;
                vm.dispatch.cardId=r.courier.cardId;
            });
        },
        /**********************************************************************
         * 根据erpnumber获取配送员信息
         * @author Wang Chinda
         **********************************************************************/
        getCourier: function (erpNumber) {
            $.get(baseURL + "sys/courier/getCourier/" + erpNumber, function (r) {
                if (r.courier == null)  {
                    alert("ERP账号不存在!");
                    return;
                }
                vm.dispatch.companyName=r.courier.companyName;
                vm.dispatch.areaName=r.courier.areaName;
                vm.dispatch.cityName=r.courier.cityName;
                vm.dispatch.siteName=r.courier.siteName;
                vm.dispatch.courierName=r.courier.name;
                vm.dispatch.cardId=r.courier.cardId;
            });
        },

        /**********************************************************************
         * 导出配送员信息
         * @author Wang Chinda
         **********************************************************************/
        exportFile: function () {
            window.open(baseURL + "sys/dispatch/leadOut");
        },

        /**********************************************************************
         * 下载运营数据导入模板
         * @author Wang Chinda
         **********************************************************************/
        download: function () {
            location.href = encodeURI(baseURL + "statics/运营数据模板.xlsx");
        },

        /**********************************************************************
         * 表单校验
         * @author Wang Chinda
         **********************************************************************/
        validator: function () {
            console.log(vm.dispatch.month);
            if (!vm.dispatch.erpId){
                alert("erp账号不能为空");
                return true;
            }
            if (!vm.dispatch.courierId){
                alert("配送员不能为空");
                return true;
            }
            if (!(vm.dispatch.month != null && vm.dispatch.month.length != 0)) {
                alert("月份不能为空");
                return true;
            }
            if (!(vm.dispatch.allOrderCount != null && vm.dispatch.allOrderCount.length != 0)) {
                alert("总单量不能为空");
                return true;
            }
            if (!(vm.dispatch.totalOrderCount != null && vm.dispatch.totalOrderCount.length != 0)) {
                alert("合计单量不能为空");
                return true;
            }
            if (!(vm.dispatch.totalMoney != null && vm.dispatch.totalMoney.length != 0)) {
                alert("费用合计不能为空");
                return true;
            }
            if (!(vm.dispatch.small != null && vm.dispatch.small.length != 0)) {
                alert("小件不能为空");
                return true;
            }
            if (!(vm.dispatch.large != null && vm.dispatch.large.length != 0)) {
                alert("大件不能为空");
                return true;
            }
            if (!(vm.dispatch.thrIdentical != null && vm.dispatch.thrIdentical.length != 0)) {
                alert("三同不能为空");
                return true;
            }
            if (!(vm.dispatch.afterSaleCount != null && vm.dispatch.afterSaleCount.length != 0)) {
                alert("售后取件不能为空");
                return true;
            }
            if (!(vm.dispatch.firstCount != null && vm.dispatch.firstCount.length != 0)) {
                alert("接货首单量不能为空");
                return true;
            }
            if (!(vm.dispatch.againCount != null && vm.dispatch.againCount.length != 0)) {
                alert("接货续单量不能为空");
                return true;
            }
            if (!(vm.dispatch.otherCount != null && vm.dispatch.otherCount.length != 0)) {
                alert("其他单量不允许为空");
                return true;
            }
            if (!(vm.dispatch.badCount != null && vm.dispatch.badCount.length != 0)) {
                alert("差评不允许为空");
                return true;
            }
            if (!(vm.dispatch.complaintCount != null && vm.dispatch.complaintCount.length != 0)) {
                alert("投诉不允许为空");
                return true;
            }
            if (!(vm.dispatch.fineMoney != null && vm.dispatch.fineMoney.length != 0)) {
                alert("罚款合计不能为空");
                return true;
            }
            if (!(vm.dispatch.deductMoney != null && vm.dispatch.deductMoney.length != 0)) {
                alert("其他扣款不能为空");
                return true;
            }
            if (!(vm.dispatch.salary != null && vm.dispatch.salary.length != 0)) {
                alert("工资不能为空");
                return true;
            }
        }
    },

    created: function () {
        this.initSearch();
        this.initCondition();
    }
});