package com.admin.modules.sys.service.impl;

import com.admin.common.utils.PageUtils;
import com.admin.common.utils.Query;
import com.admin.common.utils.R;
import com.admin.common.utils.Tools;
import com.admin.modules.sys.dao.SiteDao;
import com.admin.modules.sys.entity.SiteEntity;
import com.admin.modules.sys.entity.vo.SiteEntityVo;
import com.admin.modules.sys.service.SiteService;
import com.baomidou.mybatisplus.mapper.EntityWrapper;
import com.baomidou.mybatisplus.plugins.Page;
import com.baomidou.mybatisplus.service.impl.ServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service("siteService")
public class SiteServiceImpl extends ServiceImpl<SiteDao, SiteEntity> implements SiteService {

    @Autowired
    private SiteDao dao;

    @Override
    public PageUtils queryPage(Map<String, Object> params) {
//        Page<SiteEntity> page = this.selectPage(
//                new Query<SiteEntity>(params).getPage(),
//                new EntityWrapper<SiteEntity>()
//        );

        SiteEntity entity = new SiteEntity();
        Page page = new Query<SiteEntity>(params).getPage();
        if (params.get("name") != null && Tools.notEmpty(params.get("name").toString()))
            entity.setName(params.get("name").toString());
        if (params.get("companyId") != null && Tools.notEmpty(params.get("companyId").toString()))
            entity.setCompanyId(Integer.parseInt(params.get("companyId").toString()));
        if (params.get("areaId") != null && Tools.notEmpty(params.get("areaId").toString()))
            entity.setAreaId(Integer.parseInt(params.get("areaId").toString()));
        if (params.get("cityId") != null && Tools.notEmpty(params.get("cityId").toString()))
            entity.setCityId(Integer.parseInt(params.get("cityId").toString()));
        List<SiteEntityVo> list = dao.getSiteList(page,entity);
        page.setRecords(list);
        return new PageUtils(page);
    }

    /**
     * 获取所有有效的站点(不带分页)
     *
     * @return
     */
    @Override
    public R listAll() {
        return R.ok().put("list", this.selectList(new EntityWrapper<SiteEntity>()));
    }

}
