package com.admin.modules.sys.dao;

import com.admin.modules.sys.entity.CompanyEntity;
import com.baomidou.mybatisplus.mapper.BaseMapper;

import java.io.Serializable;
import java.util.Collection;
import java.util.List;

/**
 * 公司信息表
 * 
 * @author lxj
 * @email sunlightcs@gmail.com
 * @date 2018-12-26 10:55:09
 */
public interface CompanyDao extends BaseMapper<CompanyEntity> {
    /**
     * 获取所有有效的公司
     * @return
     */
    List<CompanyEntity> getAllCompanyList();
}
