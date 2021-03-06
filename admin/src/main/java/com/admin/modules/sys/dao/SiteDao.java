package com.admin.modules.sys.dao;

import com.admin.modules.sys.entity.SiteEntity;
import com.admin.modules.sys.entity.vo.SiteEntityVo;
import com.baomidou.mybatisplus.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.session.RowBounds;

import java.util.List;

/**
 * 站点表
 * 
 * @author lxj
 * @email sunlightcs@gmail.com
 * @date 2018-12-26 10:19:10
 */
public interface SiteDao extends BaseMapper<SiteEntity> {

    List<SiteEntityVo> getSiteList(RowBounds var1, SiteEntity params);

    int deleteSiteById(@Param("id") Integer id);

    /**
     * 根据站点名称获取站点id
     * @param siteName
     * @param companyId
     * @return
     */
    Integer getOneByName(@Param("siteName") String siteName, @Param("companyId") Integer companyId);
}
