package com.admin.modules.sys.dao;

import com.admin.modules.sys.entity.CityInfoEntity;
import com.baomidou.mybatisplus.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

/**
 * 城市信息表
 * 
 * @author chenshun
 * @email sunlightcs@gmail.com
 * @date 2018-12-15 12:06:08
 */
public interface CityInfoDao extends BaseMapper<CityInfoEntity> {

    /**
     * 根据cityId获取CityName
     * @param id
     * @return
     */
    String getCityNameById(@Param("id") Object id);

    Integer getIdByCityName(@Param("cityName") Object cityName);

    Integer getCityId(@Param("siteId") Integer siteId, @Param("companyId") Integer companyId);
}
