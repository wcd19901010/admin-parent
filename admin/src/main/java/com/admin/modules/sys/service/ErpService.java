package com.admin.modules.sys.service;

import com.admin.common.utils.PageUtils;
import com.admin.common.utils.R;
import com.admin.modules.sys.entity.ErpEntity;
import com.baomidou.mybatisplus.service.IService;

import javax.servlet.http.HttpServletResponse;
import java.util.Map;

/**
 * erp账号表
 *
 * @author lxj
 * @email sunlightcs@gmail.com
 * @date 2018-12-26 10:19:10
 */
public interface ErpService extends IService<ErpEntity> {

    PageUtils queryPage(Map<String, Object> params);

    /**
     * 查询未绑定在职员工的ERP账号
     * @return
     */
    R getErpList();

    /**
     * 查询ERP账号列表
     * @param params
     * @return
     */
    R queryPageErpList(Map<String, Object> params);

    /**
     * 保存ERP账户
     * @param erp
     * @return
     */
    R save(ErpEntity erp);

    /**
     * 编辑ERP账户
     * @param erp
     * @return
     */
    R update(ErpEntity erp);

    /**
     * 导出excel
     * @param res
     */
    void leadOut(HttpServletResponse res);
}

