package com.admin.modules.sys.service.impl;

import com.admin.common.utils.PageUtils;
import com.admin.common.utils.Query;
import com.admin.common.utils.Tools;
import com.admin.modules.sys.dao.AreaDao;
import com.admin.modules.sys.dao.CompanyDao;
import com.admin.modules.sys.entity.CompanyEntity;
import com.admin.modules.sys.entity.vo.CompanyEntityVo;
import com.admin.modules.sys.service.CompanyService;
import com.baomidou.mybatisplus.plugins.Page;
import com.baomidou.mybatisplus.service.impl.ServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.MessageFormat;
import java.util.List;
import java.util.Map;


@Service("companyService")
public class CompanyServiceImpl extends ServiceImpl<CompanyDao, CompanyEntity> implements CompanyService {

    @Autowired
    private CompanyDao dao;
    @Autowired
    private AreaDao areaDao;

    @Override
    public PageUtils queryPage(Map<String, Object> params) {
//        Page<CompanyEntityVo> page = this.selectPage(
//                new Query<CompanyEntityVo>(params).getPage(),
//                new EntityWrapper<CompanyEntityVo>()
//        );
        CompanyEntity entity = new CompanyEntity();
        Page page = new Query<CompanyEntity>(params).getPage();
        if (params.get("name") != null && Tools.notEmpty(params.get("name").toString()))
            entity.setName(params.get("name").toString());
        List<CompanyEntityVo> list = dao.getComList(page,entity);
        page.setRecords(list);
        return new PageUtils(page);
    }

    /**
     * 获取所有有效的公司
     * @return
     */
    @Override
    public List<CompanyEntity> getAllCompanyList() {
        return dao.getAllCompanyList();
    }


    @Override
    public PageUtils getCompanyList(Map<String, Object> params,String path) {
        CompanyEntity entity = new CompanyEntity();
        Page page = new Query<CompanyEntityVo>(params).getPage();
        if (params.get("name") != null && Tools.notEmpty(params.get("name").toString()))
            entity.setName(params.get("name").toString());
        List<CompanyEntityVo> list = dao.getComList(page,entity);
        if (list.size() > 0){
            for (CompanyEntityVo info: list) {
                if (Tools.notEmpty(info.getBusinessFileid())){
                    info.setBusinessFileUrl(MessageFormat.format("{0}sys/company/getFile?fileId={1}&dbname={2}", path, info.getBusinessFileid(),"businessFile"));
                }
                if (Tools.notEmpty(info.getBusinessFileid())){
                    info.setCardFileUrl(MessageFormat.format("{0}sys/company/getFile?fileId={1}&dbname={2}", path, info.getCardFileid(),"cardFile"));
                }
            }
        }
        page.setRecords(list);
        return new PageUtils(page);
    }

    @Override
    public int deleteComById(Integer id) {
        //删除则校验该公司下面有无绑定的待生效、生效中的合同，如果有则提示：删除失败，该公司有待生效/生效中的合同。
        int pactcount = dao.getPactById(id);
        if (pactcount>0){
            throw new RuntimeException("删除失败，该公司有待生效/生效中的合同");
        }
        int count = dao.deleteComById(id);
        return count;
    }

    @Override
    public CompanyEntityVo getCompanyById(Integer id) {
        return dao.getCompanyById(id);
    }

    @Override
    public int getCount(CompanyEntity entity) {
        return dao.getCount(entity);
    }
}
