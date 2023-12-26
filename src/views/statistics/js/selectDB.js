import en from "@/locales/bpmn-js/en"

/* 统计的合格率配置信息，  如公正性，  一年需要完成4次， 当前完成2次的话，则为50%完成率。 */
export const getConfig = (begin,end)=>{
  return "select * FROM t_glps"

}
export const getJiaoYanObj = (end,info)=>{
  return "select COUNT(t_mjsbjdxzjhzb.id_) as num from t_mjsbjdxzjhzb JOIN t_mjsbjdxzjh on t_mjsbjdxzjhzb.parent_id_ = t_mjsbjdxzjh.id_ where FIND_IN_SET(t_mjsbjdxzjh.bian_zhi_bu_men_,'"+info+"') and t_mjsbjdxzjh.bian_zhi_shi_jian BETWEEN '"+end[0]+"' and '"+end[1]+"' union all select COUNT(t_mjsbjdxzjhzb.id_) as num from t_mjsbjdxzjhzb JOIN t_mjsbjdxzjh on t_mjsbjdxzjhzb.parent_id_ = t_mjsbjdxzjh.id_ where FIND_IN_SET(t_mjsbjdxzjh.bian_zhi_bu_men_,'"+info+"') and t_mjsbjdxzjh.shi_fou_guo_shen_ = '已完成' and t_mjsbjdxzjh.bian_zhi_shi_jian BETWEEN '"+end[0]+"' and '"+end[1]+"' "
}
export const getJiaoYanObjFB = (end,info)=>{
  return "select ibps_party_entity.NAME_,c.numA,c.num,if(c.numA=0,0,ROUND((c.num/c.numA)*100,2)) as chu from(select a.bian_zhi_bu_men_,a.numA as numA,IFNULL(b.num,0) as num from (select t_mjsbjdxzjh.bian_zhi_bu_men_,COUNT(t_mjsbjdxzjhzb.id_) as numA from t_mjsbjdxzjhzb JOIN t_mjsbjdxzjh on t_mjsbjdxzjhzb.parent_id_ = t_mjsbjdxzjh.id_ where FIND_IN_SET(t_mjsbjdxzjh.bian_zhi_bu_men_,'"+info+"') and t_mjsbjdxzjh.bian_zhi_shi_jian BETWEEN '"+end[0]+"' and '"+end[1]+"' GROUP BY t_mjsbjdxzjh.bian_zhi_bu_men_) a LEFT JOIN (select t_mjsbjdxzjh.bian_zhi_bu_men_,COUNT(t_mjsbjdxzjhzb.id_) as num from t_mjsbjdxzjhzb JOIN t_mjsbjdxzjh on t_mjsbjdxzjhzb.parent_id_ = t_mjsbjdxzjh.id_ where FIND_IN_SET(t_mjsbjdxzjh.bian_zhi_bu_men_,'"+info+"') and t_mjsbjdxzjh.shi_fou_guo_shen_ = '已完成' and t_mjsbjdxzjh.bian_zhi_shi_jian BETWEEN '"+end[0]+"' and '"+end[1]+"' GROUP BY t_mjsbjdxzjh.bian_zhi_bu_men_) b on a.bian_zhi_bu_men_=b.bian_zhi_bu_men_) c LEFT JOIN ibps_party_entity on c.bian_zhi_bu_men_ = ibps_party_entity.id_"
}
export const getJiaoYanMGObj = (end,info)=>{
  return "select a.mz,IFNULL(a.num,0) as num ,IFNULL(b.num,0) as wnum from (select t_mjsbjdxzjhzb.bian_hao_zhong_we,concat(t_mjsbjdxzjhzb.bian_hao_zhong_we,t_mjsbjdxzjhzb.she_bei_ming_chen) as mz,COUNT(t_mjsbjdxzjhzb.id_) as num from t_mjsbjdxzjhzb JOIN t_mjsbjdxzjh on t_mjsbjdxzjhzb.parent_id_ = t_mjsbjdxzjh.id_ where FIND_IN_SET(t_mjsbjdxzjh.bian_zhi_bu_men_,'"+info+"') and t_mjsbjdxzjh.bian_zhi_shi_jian BETWEEN '"+end[0]+"' and '"+end[1]+"' GROUP BY t_mjsbjdxzjhzb.bian_hao_zhong_we) as a LEFT JOIN (select t_mjsbjdxzjhzb.bian_hao_zhong_we, COUNT(t_mjsbjdxzjhzb.id_) as num from t_mjsbjdxzjhzb JOIN t_mjsbjdxzjh on t_mjsbjdxzjhzb.parent_id_ = t_mjsbjdxzjh.id_ where FIND_IN_SET(t_mjsbjdxzjh.bian_zhi_bu_men_,'"+info+"') and t_mjsbjdxzjh.shi_fou_guo_shen_ = '已完成' and t_mjsbjdxzjh.bian_zhi_shi_jian BETWEEN '"+end[0]+"' and '"+end[1]+"' GROUP BY t_mjsbjdxzjhzb.bian_hao_zhong_we) as b on a.bian_hao_zhong_we=b.bian_hao_zhong_we"
}
export const gethechaObj = (end,info)=>{
  return "select COUNT(t_mjsbwhjhzb.id_) as num from t_mjsbwhjhzb JOIN t_mjsbwhjhb on t_mjsbwhjhzb.parent_id_ = t_mjsbwhjhb.id_ where FIND_IN_SET(t_mjsbwhjhb.bian_zhi_bu_men_,'"+info+"') and t_mjsbwhjhb.shi_fou_guo_shen_ = '已完成' and t_mjsbwhjhb.bian_zhi_shi_jian BETWEEN '"+end[0]+"' and '"+end[1]+"' UNION All select COUNT(t_mjsbwhbyjlby.id_) as num from t_mjsbwhbyjlby JOIN t_mjsbwhjhb on t_mjsbwhbyjlby.ji_hua_zong_wai_j = t_mjsbwhjhb.id_ where FIND_IN_SET(t_mjsbwhjhb.bian_zhi_bu_men_,'"+info+"') and t_mjsbwhbyjlby.shi_fou_guo_shen_ = '已完成' and t_mjsbwhjhb.shi_fou_guo_shen_ = '已完成' and t_mjsbwhjhb.bian_zhi_shi_jian BETWEEN '"+end[0]+"' and '"+end[1]+"'"
}
export const gethechaObjFB = (end,info)=>{
  return "select ibps_party_entity.NAME_,c.numA,c.num,if(c.numA=0,0,ROUND((c.num/c.numA)*100,2)) as chu from (select a.bian_zhi_bu_men_,a.numA as numA,IFNULL(b.num,0) as num from (select t_mjsbwhjhb.bian_zhi_bu_men_,COUNT(t_mjsbwhjhzb.id_) as numA from t_mjsbwhjhzb JOIN t_mjsbwhjhb on t_mjsbwhjhzb.parent_id_ = t_mjsbwhjhb.id_ where FIND_IN_SET(t_mjsbwhjhb.bian_zhi_bu_men_,'"+info+"') and t_mjsbwhjhb.shi_fou_guo_shen_ = '已完成' and t_mjsbwhjhb.bian_zhi_shi_jian BETWEEN '"+end[0]+"' and '"+end[1]+"' GROUP BY t_mjsbwhjhb.bian_zhi_bu_men_) a LEFT JOIN (select t_mjsbwhjhb.bian_zhi_bu_men_,COUNT(t_mjsbwhbyjlby.id_) as num from t_mjsbwhbyjlby JOIN t_mjsbwhjhb on t_mjsbwhbyjlby.ji_hua_zong_wai_j = t_mjsbwhjhb.id_ where FIND_IN_SET(t_mjsbwhjhb.bian_zhi_bu_men_,'"+info+"') and t_mjsbwhbyjlby.shi_fou_guo_shen_ = '已完成' and t_mjsbwhjhb.shi_fou_guo_shen_ = '已完成' and t_mjsbwhjhb.bian_zhi_shi_jian BETWEEN '"+end[0]+"' and '"+end[1]+"' GROUP BY t_mjsbwhjhb.bian_zhi_bu_men_) b on a.bian_zhi_bu_men_=b.bian_zhi_bu_men_) c LEFT JOIN ibps_party_entity on c.bian_zhi_bu_men_ = ibps_party_entity.id_"
}
export const gethechaMGObj = (end,info)=>{
  return "select a.mz,IFNULL(a.num,0) as num,IFNULL(b.wnum,0) as wnum from (select t_mjsbwhjhzb.bian_hao_zhong_we,concat(t_mjsbwhjhzb.bian_hao_zhong_we,t_mjsbwhjhzb.she_bei_ming_chen) as mz,COUNT(t_mjsbwhjhzb.id_) as num from t_mjsbwhjhzb JOIN t_mjsbwhjhb on t_mjsbwhjhzb.parent_id_ = t_mjsbwhjhb.id_ where FIND_IN_SET(t_mjsbwhjhb.bian_zhi_bu_men_,'"+info+"') and t_mjsbwhjhb.shi_fou_guo_shen_ = '已完成' and t_mjsbwhjhb.bian_zhi_shi_jian BETWEEN '"+end[0]+"' and '"+end[1]+"' GROUP BY t_mjsbwhjhzb.bian_hao_zhong_we) as a LEFT JOIN (select t_mjsbwhbyjlby.ri_qi_,COUNT(t_mjsbwhbyjlby.id_) as wnum from t_mjsbwhbyjlby JOIN t_mjsbwhjhb on t_mjsbwhbyjlby.ji_hua_zong_wai_j = t_mjsbwhjhb.id_ where FIND_IN_SET(t_mjsbwhjhb.bian_zhi_bu_men_,'"+info+"') and t_mjsbwhbyjlby.shi_fou_guo_shen_ = '已完成' and t_mjsbwhjhb.shi_fou_guo_shen_ = '已完成' and t_mjsbwhjhb.bian_zhi_shi_jian BETWEEN '"+end[0]+"' and '"+end[1]+"'GROUP BY t_mjsbwhbyjlby.ri_qi_) as b on a.bian_hao_zhong_we= b.ri_qi_"
}
// export const getnengliObj = (end)=>{
//   return "select COUNT(t_ndnlyzsysjbdjhzb.id_) as num from t_ndnlyzsysjbdjhzb LEFT JOIN t_nlyzsysjbdhdsyxhcb on t_ndnlyzsysjbdjhzb.id_=t_nlyzsysjbdhdsyxhcb.xiang_mu_ming_che WHERE t_nlyzsysjbdhdsyxhcb.shi_fou_guo_shen_ = '1' and  YEAR(t_ndnlyzsysjbdjhzb.create_time_)= "+end+" UNION all select COUNT(id_) as snum from t_ndnlyzsysjbdjhzb where  YEAR(create_time_)="+end
// }
export const getyangPinCaiJiObj = (end,info)=>{
  return "select t_zlzbpjzb.*,ROUND(IF(FIND_IN_SET( '项', t_zlzbpjzb.zhi_biao_xian_zhi ) > 0 	AND FIND_IN_SET( '次', t_zlzbpjzb.zhi_biao_xian_zhi ) > 0,SUM( t_zlzbpjzb.shi_ji_shu_zhi_ ),AVG( t_zlzbpjzb.shi_ji_shu_zhi_ )),2) AS location,t_zlzbpjb.bian_zhi_bu_men_ AS bzbm,DATE_FORMAT( t_zlzbpjb.bian_zhi_shi_jian, '%Y-%m' ) AS bzsj FROM	t_zlzbpjzb	LEFT JOIN t_zlzbpjb ON t_zlzbpjzb.parent_id_ = t_zlzbpjb.id_ WHERE	FIND_IN_SET( t_zlzbpjb.bian_zhi_bu_men_, '"+info+"' ) 	AND t_zlzbpjb.shi_fou_guo_shen_ = '已完成' 	AND t_zlzbpjb.bian_zhi_shi_jian BETWEEN '"+end[0]+"' 	AND '"+end[1]+"' GROUP BY	t_zlzbpjb.bian_zhi_bu_men_,	t_zlzbpjzb.zhi_liang_mu_biao ORDER BY	t_zlzbpjb.bian_zhi_bu_men_,	t_zlzbpjzb.zhi_liang_mu_biao"
}
export const getzongZLMBObj = (end,info)=>{
  return "select t_zlzbpjzb.*,IF(FIND_IN_SET('项', t_zlzbpjzb.zhi_biao_xian_zhi) > 0 AND FIND_IN_SET('次', t_zlzbpjzb.zhi_biao_xian_zhi) > 0,  SUM(t_zlzbpjzb.shi_ji_shu_zhi_),AVG(t_zlzbpjzb.shi_ji_shu_zhi_)) AS location,t_zlzbpjb.bian_zhi_bu_men_ as bzbm,DATE_FORMAT(t_zlzbpjb.bian_zhi_shi_jian, '%Y-%m')as bzsj from t_zlzbpjzb LEFT JOIN t_zlzbpjb on t_zlzbpjzb.parent_id_ = t_zlzbpjb.id_ where FIND_IN_SET(t_zlzbpjb.bian_zhi_bu_men_,'"+info+"') and t_zlzbpjb.shi_fou_guo_shen_ = '已完成' and t_zlzbpjb.bian_zhi_shi_jian BETWEEN '"+end[0]+"' and '"+end[1]+"' GROUP BY t_zlzbpjzb.zhi_liang_mu_biao"
}
export const getzhiliangmubiaotitleObj = (end,info)=>{
  return "select distinct t_zlzbpjzb.zhi_liang_mu_biao,t_zlzbpjzb.zhi_biao_xian_zhi from t_zlzbpjzb LEFT JOIN t_zlzbpjb on t_zlzbpjzb.parent_id_ = t_zlzbpjb.id_ where FIND_IN_SET(t_zlzbpjb.bian_zhi_bu_men_,'"+info+"') and t_zlzbpjb.shi_fou_guo_shen_ = '已完成' and t_zlzbpjb.bian_zhi_shi_jian BETWEEN '"+end[0]+"' and '"+end[1]+"' GROUP BY t_zlzbpjb.bian_zhi_bu_men_,t_zlzbpjzb.zhi_liang_mu_biao ORDER BY t_zlzbpjzb.zhi_liang_mu_biao"
}
export const getzhiliangzhibiaotitleObj = (end,info)=>{
  return "select distinct t_zlzbpjzb.zhi_liang_zhi_bia,t_zlzbpjzb.zhi_biao_xian_zhi,CONCAT(t_zlzbpjzb.zhi_liang_zhi_bia,t_zlzbpjzb.zhi_biao_xian_zhi,'') as allt from t_zlzbpjzb LEFT JOIN t_zlzbpjb on t_zlzbpjzb.parent_id_ = t_zlzbpjb.id_ where FIND_IN_SET(t_zlzbpjb.bian_zhi_bu_men_,'"+info+"') and t_zlzbpjb.shi_fou_guo_shen_ = '已完成' and t_zlzbpjb.bian_zhi_shi_jian BETWEEN '"+end[0]+"' and '"+end[1]+"' GROUP BY t_zlzbpjb.bian_zhi_bu_men_,t_zlzbpjzb.zhi_liang_zhi_bia ORDER BY t_zlzbpjzb.zhi_liang_zhi_bia"
}
export const getfenzuZLZBObj = (end,info)=>{
  return "select t_zlzbpjzb.*,ROUND(IF(FIND_IN_SET('项', t_zlzbpjzb.zhi_biao_xian_zhi) > 0 AND FIND_IN_SET('次', t_zlzbpjzb.zhi_biao_xian_zhi) > 0,  SUM(t_zlzbpjzb.shi_ji_shu_zhi_),AVG(t_zlzbpjzb.shi_ji_shu_zhi_)),2) AS location,t_zlzbpjb.bian_zhi_bu_men_ as bzbm,DATE_FORMAT(t_zlzbpjb.bian_zhi_shi_jian, '%Y-%m')as bzsj from t_zlzbpjzb LEFT JOIN t_zlzbpjb on t_zlzbpjzb.parent_id_ = t_zlzbpjb.id_ where FIND_IN_SET(t_zlzbpjb.bian_zhi_bu_men_,'"+info+"') and t_zlzbpjb.shi_fou_guo_shen_ = '已完成' and t_zlzbpjb.bian_zhi_shi_jian BETWEEN '"+end[0]+"' and '"+end[1]+"' GROUP BY bzsj,bzbm, t_zlzbpjzb.zhi_liang_zhi_bia ORDER BY t_zlzbpjzb.zhi_liang_zhi_bia"
}


export const getzaigangrenyuanObj = (end,info)=>{
  return "select COUNT(t_ndrypxjhzb.id_) as num from t_ndrypxjhzb JOIN t_lhndrypxjh on t_ndrypxjhzb.parent_id_ = t_lhndrypxjh.id_ where FIND_IN_SET(t_lhndrypxjh.bian_zhi_bu_men_,'"+info+"') and t_lhndrypxjh.shi_fou_guo_shen_ = '已完成' and t_lhndrypxjh.bian_zhi_shi_jian BETWEEN '"+end[0]+"' and '"+end[1]+"' UNION ALL select COUNT(t_lhrypxjlb.id_) as num from t_lhrypxjlb JOIN t_lhndrypxjh on t_lhrypxjlb.ji_hua_zong_wai_j = t_lhndrypxjh.id_ where FIND_IN_SET(t_lhndrypxjh.bian_zhi_bu_men_,'"+info+"') and t_lhrypxjlb.shi_fou_guo_shen_ = '已完成' and t_lhndrypxjh.shi_fou_guo_shen_ = '已完成' and t_lhndrypxjh.bian_zhi_shi_jian BETWEEN '"+end[0]+"' and '"+end[1]+"'"
}
export const getzaigangrenyuanFBObj = (end,info)=>{
  return "select ibps_party_entity.NAME_,c.numA,c.num,if(c.numA=0,0,ROUND((c.num/c.numA)*100,2)) as chu from (select a.bian_zhi_bu_men_,a.num as numA,IFNULL(b.num,0) as num  from (select t_lhndrypxjh.bian_zhi_bu_men_,COUNT(t_ndrypxjhzb.id_) as num from t_ndrypxjhzb JOIN t_lhndrypxjh on t_ndrypxjhzb.parent_id_ = t_lhndrypxjh.id_ where FIND_IN_SET(t_lhndrypxjh.bian_zhi_bu_men_,'"+info+"') and t_lhndrypxjh.shi_fou_guo_shen_ = '已完成' and t_lhndrypxjh.bian_zhi_shi_jian BETWEEN '"+end[0]+"' and '"+end[1]+"'  GROUP BY t_lhndrypxjh.bian_zhi_bu_men_) a LEFT JOIN (select t_lhndrypxjh.bian_zhi_bu_men_, COUNT(t_lhrypxjlb.id_) as num from t_lhrypxjlb JOIN t_lhndrypxjh on t_lhrypxjlb.ji_hua_zong_wai_j = t_lhndrypxjh.id_ where FIND_IN_SET(t_lhndrypxjh.bian_zhi_bu_men_,'"+info+"') and t_lhrypxjlb.shi_fou_guo_shen_ = '已完成' and t_lhndrypxjh.shi_fou_guo_shen_ = '已完成' and t_lhndrypxjh.bian_zhi_shi_jian BETWEEN '"+end[0]+"' and '"+end[1]+"' GROUP BY t_lhndrypxjh.bian_zhi_bu_men_) b on a.bian_zhi_bu_men_ = b.bian_zhi_bu_men_) c LEFT JOIN ibps_party_entity on c.bian_zhi_bu_men_ = ibps_party_entity.id_"
}
export const getgangqianpeixunObj = (end,info)=>{
  return "select COUNT(t_lhgqpxjhzb.id_) as num from t_lhgqpxjhzb JOIN t_lhgqpxjh on t_lhgqpxjhzb.parent_id_ = t_lhgqpxjh.id_ where FIND_IN_SET(t_lhgqpxjh.bian_zhi_bu_men_,'"+info+"') and t_lhgqpxjh.shi_fou_guo_shen_ = '已完成' and t_lhgqpxjh.bian_zhi_shi_jian BETWEEN '"+end[0]+"' and '"+end[1]+"' UNION ALL select COUNT(t_lhrypxjlb.id_) as num from t_lhrypxjlb JOIN t_lhgqpxjh on t_lhrypxjlb.ji_hua_zong_wai_j = t_lhgqpxjh.id_ where FIND_IN_SET(t_lhgqpxjh.bian_zhi_bu_men_,'"+info+"') and t_lhrypxjlb.shi_fou_guo_shen_ = '已完成' and t_lhgqpxjh.shi_fou_guo_shen_ = '已完成' and t_lhgqpxjh.bian_zhi_shi_jian BETWEEN '"+end[0]+"' and '"+end[1]+"'"
}
export const getgangqianpeixunFBObj = (end,info)=>{
  return "select ibps_party_entity.NAME_,c.numA,c.num,if(c.numA=0,0,ROUND((c.num/c.numA)*100,2)) as chu from (select a.bian_zhi_bu_men_,a.numA as numA,IFNULL(b.num,0) as num from (select t_lhgqpxjh.bian_zhi_bu_men_,COUNT(t_lhgqpxjhzb.id_) as numA from t_lhgqpxjhzb JOIN t_lhgqpxjh on t_lhgqpxjhzb.parent_id_ = t_lhgqpxjh.id_ where FIND_IN_SET(t_lhgqpxjh.bian_zhi_bu_men_,'"+info+"') and t_lhgqpxjh.shi_fou_guo_shen_ = '已完成' and t_lhgqpxjh.bian_zhi_shi_jian BETWEEN '"+end[0]+"' and '"+end[1]+"'  GROUP BY t_lhgqpxjh.bian_zhi_bu_men_) a LEFT JOIN (select t_lhgqpxjh.bian_zhi_bu_men_,COUNT(t_lhrypxjlb.id_) as num from t_lhrypxjlb JOIN t_lhgqpxjh on t_lhrypxjlb.ji_hua_zong_wai_j = t_lhgqpxjh.id_ where FIND_IN_SET(t_lhgqpxjh.bian_zhi_bu_men_,'"+info+"') and t_lhrypxjlb.shi_fou_guo_shen_ = '已完成' and t_lhgqpxjh.shi_fou_guo_shen_ = '已完成' and t_lhgqpxjh.bian_zhi_shi_jian BETWEEN '"+end[0]+"' and '"+end[1]+"'  GROUP BY t_lhgqpxjh.bian_zhi_bu_men_) b on a.bian_zhi_bu_men_ = b.bian_zhi_bu_men_) c LEFT JOIN ibps_party_entity on c.bian_zhi_bu_men_ = ibps_party_entity.id_"
}

export const getwaibuObj = (end,info)=>{
  return "select COUNT(t_cjwbzlpjhdjhxqb.id_) as num from t_cjwbzlpjhdjhxqb JOIN t_cjwbzlpjhdjhb on t_cjwbzlpjhdjhxqb.parent_id_ = t_cjwbzlpjhdjhb.id_ where FIND_IN_SET(t_cjwbzlpjhdjhb.bu_men_,'"+info+"') and t_cjwbzlpjhdjhb.shi_fou_guo_shen_ = '已完成' and t_cjwbzlpjhdjhb.bian_zhi_shi_jian BETWEEN '"+end[0]+"' and '"+end[1]+"' UNION All select COUNT(t_sjzpjgpjb.id_) as num from t_sjzpjgpjb JOIN t_cjwbzlpjhdjhb on t_sjzpjgpjb.shi_jian_zhi_ping = t_cjwbzlpjhdjhb.id_ where FIND_IN_SET(t_cjwbzlpjhdjhb.bu_men_,'"+info+"') and t_sjzpjgpjb.shi_fou_guo_shen_ = '已完成' and t_cjwbzlpjhdjhb.shi_fou_guo_shen_ = '已完成' and t_cjwbzlpjhdjhb.bian_zhi_shi_jian BETWEEN '"+end[0]+"' and '"+end[1]+"'"
}
export const getwaibuObjFB = (end,info)=>{
  return "select ibps_party_entity.NAME_,c.numA,c.num,if(c.numA=0,0,ROUND((c.num/c.numA)*100,2)) as chu from(select a.bu_men_,a.numA as numA,IFNULL(b.num,0) as num from (select t_cjwbzlpjhdjhb.bu_men_,COUNT(t_cjwbzlpjhdjhxqb.id_) as numA from t_cjwbzlpjhdjhxqb JOIN t_cjwbzlpjhdjhb on t_cjwbzlpjhdjhxqb.parent_id_ = t_cjwbzlpjhdjhb.id_ where FIND_IN_SET(t_cjwbzlpjhdjhb.bu_men_,'"+info+"') and t_cjwbzlpjhdjhb.shi_fou_guo_shen_ = '已完成' and t_cjwbzlpjhdjhb.bian_zhi_shi_jian BETWEEN '"+end[0]+"' and '"+end[1]+"' GROUP BY t_cjwbzlpjhdjhb.bu_men_) a LEFT JOIN (select t_cjwbzlpjhdjhb.bu_men_,COUNT(t_sjzpjgpjb.id_) as num from t_sjzpjgpjb JOIN t_cjwbzlpjhdjhb on t_sjzpjgpjb.shi_jian_zhi_ping = t_cjwbzlpjhdjhb.id_ where FIND_IN_SET(t_cjwbzlpjhdjhb.bu_men_,'"+info+"') and t_sjzpjgpjb.shi_fou_guo_shen_ = '已完成' and t_cjwbzlpjhdjhb.shi_fou_guo_shen_ = '已完成' and t_cjwbzlpjhdjhb.bian_zhi_shi_jian BETWEEN '"+end[0]+"' and '"+end[1]+"' GROUP BY t_cjwbzlpjhdjhb.bu_men_) b on a.bu_men_=b.bu_men_) c LEFT JOIN ibps_party_entity on c.bu_men_ = ibps_party_entity.id_"
}
export const getneibuObj = (end,info)=>{
  return "select COUNT(t_nbbdsyjhzb.id_) as num from t_nbbdsyjhzb JOIN t_nbbdsyjh on t_nbbdsyjhzb.parent_id_ = t_nbbdsyjh.id_ where FIND_IN_SET(t_nbbdsyjh.bian_zhi_bu_men_,'"+info+"') and t_nbbdsyjh.shi_fou_guo_shen_ = '已完成' and t_nbbdsyjh.bian_zhi_shi_jian BETWEEN '"+end[0]+"' and '"+end[1]+"' UNION All select COUNT(t_nbbdsy.id_) as num from t_nbbdsy JOIN t_nbbdsyjh on t_nbbdsy.ji_hua_id_ = t_nbbdsyjh.id_ where FIND_IN_SET(t_nbbdsyjh.bian_zhi_bu_men_,'"+info+"') and t_nbbdsy.shi_fou_guo_shen_ = '已完成' and t_nbbdsyjh.shi_fou_guo_shen_ = '已完成' and t_nbbdsyjh.bian_zhi_shi_jian BETWEEN '"+end[0]+"' and '"+end[1]+"'"
}
export const getneibuObjFB = (end,info)=>{
  return "select ibps_party_entity.NAME_,c.numA,c.num,if(c.numA=0,0,ROUND((c.num/c.numA)*100,2)) as chu from(select a.bian_zhi_bu_men_,a.numA as numA,IFNULL(b.num,0) as num from (select t_nbbdsyjh.bian_zhi_bu_men_,COUNT(t_nbbdsyjhzb.id_) as numA from t_nbbdsyjhzb JOIN t_nbbdsyjh on t_nbbdsyjhzb.parent_id_ = t_nbbdsyjh.id_ where FIND_IN_SET(t_nbbdsyjh.bian_zhi_bu_men_,'"+info+"') and t_nbbdsyjh.shi_fou_guo_shen_ = '已完成' and t_nbbdsyjh.bian_zhi_shi_jian BETWEEN '"+end[0]+"' and '"+end[1]+"' GROUP BY t_nbbdsyjh.bian_zhi_bu_men_) a LEFT JOIN (select t_nbbdsyjh.bian_zhi_bu_men_,COUNT(t_nbbdsy.id_) as num from t_nbbdsy JOIN t_nbbdsyjh on t_nbbdsy.ji_hua_id_ = t_nbbdsyjh.id_ where FIND_IN_SET(t_nbbdsyjh.bian_zhi_bu_men_,'"+info+"') and t_nbbdsy.shi_fou_guo_shen_ = '已完成' and t_nbbdsyjh.shi_fou_guo_shen_ = '已完成' and t_nbbdsyjh.bian_zhi_shi_jian BETWEEN '"+end[0]+"' and '"+end[1]+"'  GROUP BY t_nbbdsyjh.bian_zhi_bu_men_) b on a.bian_zhi_bu_men_=b.bian_zhi_bu_men_) c LEFT JOIN ibps_party_entity on c.bian_zhi_bu_men_ = ibps_party_entity.id_"
}
export const getyingjiObj = (end,info)=>{
  return "select COUNT(t_lisxttjyjyayljhzb.id_) as num from t_lisxttjyjyayljhzb JOIN t_lisxttjyjyayljh on t_lisxttjyjyayljhzb.parent_id_ = t_lisxttjyjyayljh.id_ where FIND_IN_SET(t_lisxttjyjyayljh.bian_zhi_bu_men_,'"+info+"') and t_lisxttjyjyayljh.shi_fou_guo_shen_ = '已完成' and t_lisxttjyjyayljh.bian_zhi_shi_jian BETWEEN '"+end[0]+"' and '"+end[1]+"' UNION ALL	select COUNT(t_lisxtgzyjylssjlb.id_) as num from t_lisxtgzyjylssjlb JOIN t_lisxttjyjyayljh on t_lisxtgzyjylssjlb.xuan_ze_ji_hua_= t_lisxttjyjyayljh.id_ where FIND_IN_SET(t_lisxttjyjyayljh.bian_zhi_bu_men_,'"+info+"') and t_lisxtgzyjylssjlb.shi_fou_guo_shen_ = '已完成' and t_lisxttjyjyayljh.shi_fou_guo_shen_ = '已完成' and t_lisxttjyjyayljh.bian_zhi_shi_jian BETWEEN '"+end[0]+"' and '"+end[1]+"'"
}
export const getyingjiObjFB = (end,info)=>{
  return "select ibps_party_entity.NAME_,c.numA,c.num,if(c.numA=0,0,ROUND((c.num/c.numA)*100,2)) as chu from (select a.bian_zhi_bu_men_,a.numA as numA,IFNULL(b.num,0) as num from (select t_lisxttjyjyayljh.bian_zhi_bu_men_,COUNT(t_lisxttjyjyayljhzb.id_) as numA from t_lisxttjyjyayljhzb JOIN t_lisxttjyjyayljh on t_lisxttjyjyayljhzb.parent_id_ = t_lisxttjyjyayljh.id_ where FIND_IN_SET(t_lisxttjyjyayljh.bian_zhi_bu_men_,'"+info+"') and t_lisxttjyjyayljh.shi_fou_guo_shen_ = '已完成' and t_lisxttjyjyayljh.bian_zhi_shi_jian BETWEEN '"+end[0]+"' and '"+end[1]+"' GROUP BY t_lisxttjyjyayljh.bian_zhi_bu_men_) a LEFT JOIN	(select t_lisxttjyjyayljh.bian_zhi_bu_men_,COUNT(t_lisxtgzyjylssjlb.id_) as num from t_lisxtgzyjylssjlb JOIN t_lisxttjyjyayljh on t_lisxtgzyjylssjlb.xuan_ze_ji_hua_= t_lisxttjyjyayljh.id_ where FIND_IN_SET(t_lisxttjyjyayljh.bian_zhi_bu_men_,'"+info+"') and t_lisxtgzyjylssjlb.shi_fou_guo_shen_ = '已完成' and t_lisxttjyjyayljh.shi_fou_guo_shen_ = '已完成' and t_lisxttjyjyayljh.bian_zhi_shi_jian BETWEEN '"+end[0]+"' and '"+end[1]+"' GROUP BY t_lisxttjyjyayljh.bian_zhi_bu_men_) b on a.bian_zhi_bu_men_=b.bian_zhi_bu_men_) c LEFT JOIN ibps_party_entity on c.bian_zhi_bu_men_ = ibps_party_entity.id_"
}
export const getfengxianObj = (end,info)=>{
  return "select COUNT(t_mjsyshdfxsbykzjhxb.id_) as num from t_mjsyshdfxsbykzjhxb JOIN t_mjsyshdfxsbykzjhb on t_mjsyshdfxsbykzjhxb.parent_id_ = t_mjsyshdfxsbykzjhb.id_ where FIND_IN_SET(t_mjsyshdfxsbykzjhb.bian_zhi_bu_men_,'"+info+"') and t_mjsyshdfxsbykzjhb.shi_fou_guo_shen_ = '已完成' and t_mjsyshdfxsbykzjhb.bian_zhi_shi_jian BETWEEN '"+end[0]+"' and '"+end[1]+"' UNION ALL select COUNT(t_mjsyshdfxkzypjjlb.id_) as num from t_mjsyshdfxkzypjjlb JOIN t_mjsyshdfxsbykzjhb on t_mjsyshdfxkzypjjlb.ji_hua_zong_wai_j = t_mjsyshdfxsbykzjhb.id_ where FIND_IN_SET(t_mjsyshdfxsbykzjhb.bian_zhi_bu_men_,'"+info+"') and t_mjsyshdfxkzypjjlb.shi_fou_guo_shen_ = '已完成' and t_mjsyshdfxsbykzjhb.shi_fou_guo_shen_ = '已完成' and t_mjsyshdfxsbykzjhb.bian_zhi_shi_jian BETWEEN '"+end[0]+"' and '"+end[1]+"'"
}
export const getfengxianObjFB = (end,info)=>{
  return "select ibps_party_entity.NAME_,c.numA,c.num,if(c.numA=0,0,ROUND((c.num/c.numA)*100,2)) as chu from (select a.bian_zhi_bu_men_,a.numA as numA,IFNULL(b.num,0) as num from (select t_mjsyshdfxsbykzjhb.bian_zhi_bu_men_,COUNT(t_mjsyshdfxsbykzjhxb.id_) as numA from t_mjsyshdfxsbykzjhxb JOIN t_mjsyshdfxsbykzjhb on t_mjsyshdfxsbykzjhxb.parent_id_ = t_mjsyshdfxsbykzjhb.id_ where FIND_IN_SET(t_mjsyshdfxsbykzjhb.bian_zhi_bu_men_,'"+info+"') and t_mjsyshdfxsbykzjhb.shi_fou_guo_shen_ = '已完成' and t_mjsyshdfxsbykzjhb.bian_zhi_shi_jian BETWEEN '"+end[0]+"' and '"+end[1]+"' GROUP BY t_mjsyshdfxsbykzjhb.bian_zhi_bu_men_) a LEFT JOIN	(select t_mjsyshdfxsbykzjhb.bian_zhi_bu_men_,COUNT(t_mjsyshdfxkzypjjlb.id_) as num from t_mjsyshdfxkzypjjlb JOIN t_mjsyshdfxsbykzjhb on t_mjsyshdfxkzypjjlb.ji_hua_zong_wai_j = t_mjsyshdfxsbykzjhb.id_ where FIND_IN_SET(t_mjsyshdfxsbykzjhb.bian_zhi_bu_men_,'"+info+"') and t_mjsyshdfxkzypjjlb.shi_fou_guo_shen_ = '已完成' and t_mjsyshdfxsbykzjhb.shi_fou_guo_shen_ = '已完成' and t_mjsyshdfxsbykzjhb.bian_zhi_shi_jian BETWEEN '"+end[0]+"' and '"+end[1]+"' GROUP BY t_mjsyshdfxsbykzjhb.bian_zhi_bu_men_) b on a.bian_zhi_bu_men_=b.bian_zhi_bu_men_) c LEFT JOIN ibps_party_entity on c.bian_zhi_bu_men_ = ibps_party_entity.id_"
}
export const getneishenObj = (end,info)=>{
  return "select COUNT(t_nsjh.id_) as num from t_nsjh where FIND_IN_SET(t_nsjh.bian_zhi_bu_men_,'"+info+"') and t_nsjh.shi_fou_guo_shen_ = '已完成' and t_nsjh.bian_zhi_shi_jian BETWEEN '"+end[0]+"' and '"+end[1]+"' UNION ALL select COUNT(t_nbshbgb.id_) as num from t_nbshbgb JOIN (select t_nbss.id_,t_nbss.shi_fou_guo_shen_ from t_nsjh join t_nbss on t_nbss.ji_hua_zong_wai_j = t_nsjh.id_ where FIND_IN_SET(t_nsjh.bian_zhi_bu_men_,'"+info+"') and t_nsjh.shi_fou_guo_shen_ = '已完成' and t_nsjh.bian_zhi_shi_jian BETWEEN '"+end[0]+"' and '"+end[1]+"' ) as a on t_nbshbgb.ji_hua_zong_wai_j = a.id_ where t_nbshbgb.shi_fou_guo_shen_ = '已完成' and a.shi_fou_guo_shen_ = '已完成' "
}
export const getneishenObjFB = (end,info)=>{
  return "select ibps_party_entity.NAME_,c.numA,c.num,if(c.numA=0,0,ROUND((c.num/c.numA)*100,2)) as chu from (select d.bian_zhi_bu_men_,d.numA as numA,IFNULL(b.num,0) as num from (select t_nsjh.bian_zhi_bu_men_,COUNT(t_nsjh.id_) as numA from t_nsjh where FIND_IN_SET(t_nsjh.bian_zhi_bu_men_,'"+info+"') and t_nsjh.shi_fou_guo_shen_ = '已完成' and t_nsjh.bian_zhi_shi_jian BETWEEN '"+end[0]+"' and '"+end[1]+"' GROUP BY t_nsjh.bian_zhi_bu_men_) d LEFT JOIN (select a.bian_zhi_bu_men_,COUNT(t_nbshbgb.id_) as num from t_nbshbgb JOIN (select t_nbss.id_,t_nbss.shi_fou_guo_shen_,t_nsjh.bian_zhi_bu_men_ from t_nsjh join t_nbss on t_nbss.ji_hua_zong_wai_j = t_nsjh.id_ where FIND_IN_SET(t_nsjh.bian_zhi_bu_men_,'"+info+"') and t_nsjh.shi_fou_guo_shen_ = '已完成' and t_nsjh.bian_zhi_shi_jian BETWEEN '"+end[0]+"' and '"+end[1]+"' ) as a on t_nbshbgb.ji_hua_zong_wai_j = a.id_ where t_nbshbgb.shi_fou_guo_shen_ = '已完成' and a.shi_fou_guo_shen_ = '已完成' GROUP BY a.bian_zhi_bu_men_) b on d.bian_zhi_bu_men_=b.bian_zhi_bu_men_) c LEFT JOIN ibps_party_entity on c.bian_zhi_bu_men_ = ibps_party_entity.id_"
}
export const getguanshenObj = (end,info)=>{
  return "select COUNT(t_gglpsjhx.id_) as num from t_gglpsjhx where FIND_IN_SET(t_gglpsjhx.bian_zhi_bu_men_,'"+info+"') and t_gglpsjhx.shi_fou_guo_shen_ = '已完成' and t_gglpsjhx.bian_zhi_shi_jian BETWEEN '"+end[0]+"' and '"+end[1]+"' UNION ALL select COUNT(t_gsbgb.id_) as num from t_gsbgb JOIN t_gglpsjhx on t_gsbgb.zong_wai_jian_ = t_gglpsjhx.id_ where t_gsbgb.shi_fou_guo_shen_ = '已完成' and t_gglpsjhx.shi_fou_guo_shen_ = '已完成' and FIND_IN_SET(t_gglpsjhx.bian_zhi_bu_men_,'"+info+"')  and t_gglpsjhx.bian_zhi_shi_jian BETWEEN '"+end[0]+"' and '"+end[1]+"'"
}
export const getguanshenObjFB = (end,info)=>{
  return "select ibps_party_entity.NAME_,c.numA,c.num,if(c.numA=0,0,ROUND((c.num/c.numA)*100,2)) as chu from (select a.bian_zhi_bu_men_,a.numA as numA,IFNULL(b.num,0) as num from (select t_gglpsjhx.bian_zhi_bu_men_,COUNT(t_gglpsjhx.id_) as numA from t_gglpsjhx where FIND_IN_SET(t_gglpsjhx.bian_zhi_bu_men_,'"+info+"') and t_gglpsjhx.shi_fou_guo_shen_ = '已完成' and t_gglpsjhx.bian_zhi_shi_jian BETWEEN '"+end[0]+"' and '"+end[1]+"' GROUP BY t_gglpsjhx.bian_zhi_bu_men_) a LEFT JOIN (select t_gglpsjhx.bian_zhi_bu_men_,COUNT(t_gsbgb.id_) as num from t_gsbgb JOIN t_gglpsjhx on t_gsbgb.zong_wai_jian_ = t_gglpsjhx.id_ where t_gsbgb.shi_fou_guo_shen_ = '已完成' and t_gglpsjhx.shi_fou_guo_shen_ = '已完成' and FIND_IN_SET(t_gglpsjhx.bian_zhi_bu_men_,'"+info+"')  and t_gglpsjhx.bian_zhi_shi_jian BETWEEN '"+end[0]+"' and '"+end[1]+"' GROUP BY t_gglpsjhx.bian_zhi_bu_men_) b on a.bian_zhi_bu_men_=b.bian_zhi_bu_men_) c LEFT JOIN ibps_party_entity on c.bian_zhi_bu_men_ = ibps_party_entity.id_"
}
export const getbufuheObj = (end,info)=>{
  return "select ibps_party_entity.NAME_,c.numA,c.num,if(c.numA=0,0,ROUND((c.num/c.numA)*100,2)) as chu from (select a.bian_zhi_bu_men_,IFNULL(a.num,0) as num,IFNULL(b.numA,0) as numA from (select t_bfhhjzcsjlb.bian_zhi_bu_men_,COUNT(t_bfhhjzcsjlb.id_) as num from t_bfhhjzcsjlb where FIND_IN_SET(t_bfhhjzcsjlb.bian_zhi_bu_men_,'"+info+"') and t_bfhhjzcsjlb.shi_fou_guo_shen_ = '已完成' and t_bfhhjzcsjlb.bian_zhi_shi_jian BETWEEN '"+end[0]+"' and '"+end[1]+"' GROUP BY t_bfhhjzcsjlb.bian_zhi_bu_men_) as a LEFT JOIN (select t_bfhhjzcsjlb.bian_zhi_bu_men_,COUNT(t_bfhhjzcsjlb.id_) as numA from t_bfhhjzcsjlb where FIND_IN_SET(t_bfhhjzcsjlb.bian_zhi_bu_men_,'"+info+"') and t_bfhhjzcsjlb.bian_zhi_shi_jian BETWEEN '"+end[0]+"' and '"+end[1]+"' GROUP BY t_bfhhjzcsjlb.bian_zhi_bu_men_) as b on a.bian_zhi_bu_men_=b.bian_zhi_bu_men_) c LEFT JOIN ibps_party_entity on c.bian_zhi_bu_men_ = ibps_party_entity.id_"
}
export const getgaijinxiangObj = (end,info)=>{
  return "select ibps_party_entity.NAME_,c.numA,c.num,if(c.numA=0,0,ROUND((c.num/c.numA)*100,2)) as chu from (select a.bian_zhi_bu_men_,IFNULL(a.num,0) as num,IFNULL(b.numA,0) as numA from (select t_glpsjhb.bian_zhi_bu_men_,COUNT(t_glpsjhb.id_) as num from t_glpsjhb where FIND_IN_SET(t_glpsjhb.bian_zhi_bu_men_,'"+info+"') and t_glpsjhb.shi_fou_guo_shen_ = '已完成' and t_glpsjhb.bian_zhi_shi_jian BETWEEN '"+end[0]+"' and '"+end[1]+"' GROUP BY t_glpsjhb.bian_zhi_bu_men_) as a LEFT JOIN (select t_glpsjhb.bian_zhi_bu_men_,COUNT(t_glpsjhb.id_) as numA from t_glpsjhb where FIND_IN_SET(t_glpsjhb.bian_zhi_bu_men_,'"+info+"') and t_glpsjhb.bian_zhi_shi_jian BETWEEN '"+end[0]+"' and '"+end[1]+"' GROUP BY t_glpsjhb.bian_zhi_bu_men_) as b on a.bian_zhi_bu_men_ = b.bian_zhi_bu_men_) c LEFT JOIN ibps_party_entity on c.bian_zhi_bu_men_ = ibps_party_entity.id_"
}
// export const getbiaozhunTObj = (end)=>{
//   return "select MONTH(shi_shi_shi_jian_) as time from t_bzwzqjhcjhzb where YEAR(shi_shi_shi_jian_) ="+end+" ORDER BY shi_shi_shi_jian_ ASC LIMIT 1"
// }
// export const getbzJunZhuObj = (end)=>{
//   return "select a.name as name, a.num ,IFNULL(b.numS,0) as numS from(select wu_liao_bian_ma_, zhuan_huan_ as name, COUNT(wu_liao_bian_ma_) as num from t_bzjzhcjhzb where YEAR(create_time_)="+end+" GROUP BY wu_liao_bian_ma_ HAVING COUNT(wu_liao_bian_ma_)>=1) as a LEFT JOIN (select wu_liao_bian_ma_, zhuan_huan_ as name, COUNT(wu_liao_bian_ma_) as numS from t_bzjzqjhcjl as d where YEAR(create_time_)="+end+" and d.shi_fou_guo_shen_='1' GROUP BY wu_liao_bian_ma_ HAVING COUNT(wu_liao_bian_ma_)>=1) as b on a.wu_liao_bian_ma_ = b.wu_liao_bian_ma_"
// }
// export const getbzJunZhuTObj = (end)=>{
//  return "select MONTH(shi_shi_shi_jian_) as time from t_bzjzhcjhzb where YEAR(shi_shi_shi_jian_) ="+end+" ORDER BY shi_shi_shi_jian_ ASC LIMIT 1"
// }
// export const getbzXiBaoObj = (end)=>{
//   return "select a.name as name, a.num ,IFNULL(b.numS,0) as numS from(select zhuan_huan_ as name, COUNT(zhuan_huan_) as num from t_bzxbqjhcjhzbn where YEAR(create_time_)="+end+" GROUP BY zhuan_huan_ HAVING COUNT(zhuan_huan_)>=1) as a LEFT JOIN (select c.zhuan_huan_ as name, COUNT(c.zhuan_huan_) as numS from t_bzxbqjhcjhzbn as c LEFT JOIN t_bzxbqjhcjh as d on c.parent_id_ = d.id_ where YEAR(c.create_time_)="+end+" and d.shi_fou_guo_shen_='1' GROUP BY c.zhuan_huan_ HAVING COUNT(c.zhuan_huan_)>=1) as b on a.name = b.name"
// }
// export const getbzXiBaoTObj = (end)=>{
//  return "select MONTH(shi_shi_shi_jian_) as time from t_bzxbqjhcjhzbn where YEAR(shi_shi_shi_jian_) ="+end+" ORDER BY shi_shi_shi_jian_ ASC LIMIT 1"
// }
// export const DBData = (begin,end,scope)=>{
 
//   return "select tt.* "+
//   " FROM("+s1jianCe(begin,end)+
//   " join "+s1renwu(begin,end,scope)+
//   " join "+s2jianCe(begin,end)+
//   " join "+s2manYiDu(begin,end,scope)+
//   " join "+s3tousu(begin,end,scope)+
//   " join "+s4renYuanPeiXun(begin,end,scope)+
//   " join "+s5renYuanJianDu(begin,end,scope)+
//   " join "+s9neiBu(begin,end,scope)+
//   " join "+s12fengXian(begin,end,scope)+
//   " join "+s14bufuhexiang(begin,end,scope)+
//   // " join "+s6sheBeiWeiHu(begin,end)+
//   // " join "+s7sheBeiJiaoZhun(begin,end)+
//   // " join "+s8sheBeiHeCha(begin,end)+
//   ") tt"
// }
// /* 拼接通用条件，选用 */
// function PAT(val){
//   return "shi_fou_guo_shen_ = '1' AND YEAR ( create_time_ ) = '" + val+"'"
// }
// function PAT_SATISFACTION(val){
//   return "man_yi_du_ = '满意' AND YEAR ( create_time_ ) = '" + val+"'"
// }
// function PAT_YEAR(val){
//   return " YEAR ( create_time_ ) = '" + val+"'"
// }
// function PAT_TASK(val,choose){
  
//   return choose?"shi_fou_guo_shen_ = '1' AND YEAR( create_time_ ) = '"+val+"' AND DATE(update_time_) BETWEEN DATE( create_time_ ) and DATE( qi_wang_wan_cheng ) ":"shi_fou_guo_shen_ = '1' AND YEAR( create_time_ ) = '"+val+"'"
// }
// function PAT_CHOOSE(val,choose){
//   return choose + " AND YEAR( create_time_ ) = '"+val+"'"

// }
// /* 工具函数参数
// 1、时间条件
// 2、表名
// 3、where条件
// 4、连接与连接条件
//   (0) on 1=1 JOIN  非结束的sql语句
//   (1) on 1=1  仅被连接， 如当前方法最后一个sql语句
//    */
// function tool(val,tableName,where,join){
//   let alias = tableName+val //别名
//  return "( SELECT COUNT( id_ ) AS "
//  +alias
//  +" FROM "
//  +tableName
//  +" WHERE "
//  +where
//  +" ) "
//  +alias
//  + (join==0?" on 1=1 JOIN ":" on 1=1 ")
// }
// function toolTask(val,tableName,where,join){
//   let alias = tableName+val //别名
//  return "( SELECT COUNT( id_ ) AS "
//  +alias
//  +" FROM "
//  +tableName
//  +" WHERE "
//  +where
//  +" ) "
//  +alias
//  + (join==0?" on 1=1 JOIN ":" on 1=1 ")
// }
// function toolSame(val,tableName,where,join){
//   let alias = tableName+'S'+val //别名
//  return "( SELECT COUNT( id_ ) AS "
//  +alias
//  +" FROM "
//  +tableName
//  +" WHERE "
//  +where
//  +" ) "
//  +alias
//  + (join==0?" on 1=1 JOIN ":" on 1=1 ")
// }
// /* 任务完成 */
// function s1renwu(begin,end,scope){
//   return "( SELECT COUNT( id_ ) AS t_lhjczb"+end+" FROM t_lhjczb "+ "WHERE zhuang_tai_ = '已完成' and shi_fou_ji_shi_ = '是' AND YEAR( create_time_ ) = "+end+") s1renwu1  JOIN"+
//   "( SELECT COUNT( id_ ) AS t_lhjcz"+end+" FROM t_lhjczb "+ "WHERE zhuang_tai_ = '已完成' and shi_fou_ji_shi_ = '否' AND YEAR( create_time_ ) = "+end+") s1renwu2  JOIN"+
//   "( SELECT COUNT( id_ ) AS t_lhjc"+end+" FROM t_lhjczb "+ "WHERE (zhuang_tai_ != '已完成' or shi_fou_ji_shi_ ='' or shi_fou_ji_shi_ is null)  AND YEAR( create_time_ ) = "+end+") s1renwu3  JOIN"+
//   "( SELECT COUNT( id_ ) AS t_lhjczbS"+end+" FROM t_lhjczb WHERE YEAR ( create_time_ ) = "+end+" ) s1renwu4  "
 
//   }
// /* 检测 */
// function s1jianCe(begin,end){
//   // 委托检测数
//   return "SELECT *  FROM (select COUNT( id_ ) AS t_gdyrqcwt"+end+" from t_gdyrgpjc WHERE YEAR( create_time_ ) = "+end+" union all select id_ from t_gdyrqcjc WHERE YEAR( create_time_ ) = "+end+") s1jianCe1  JOIN "+
//   "( select count(id_) AS t_gdyrqcwt6"+end+" from t_gdyrgpjc where qi_wang_wan_cheng>fa_fang_biao_zhi_ and wei_tuo_id_ in (select id_ from t_gdyrqcwt where YEAR( create_time_ ) = '"+end+"')  ) s1jianCe12 on 1=1"
//   }
//   /* 检测 */
// function s2jianCe(begin,end){
//   //v3
//   return "( SELECT COUNT( id_ ) AS t_mjjcbg"+end+" FROM t_bgffdjb "+ "WHERE bao_gao_xiu_gai_j = '有' AND YEAR( create_time_ ) = "+end+" ) s2jianCe1 JOIN"+
//   "( SELECT COUNT( id_ ) AS t_mjjcbgS"+end+" FROM t_bgffdjb WHERE  YEAR ( create_time_ ) = "+end+" ) s2jianCe2 "

//   }
//  /* 满意度 */
//  function s2manYiDu(begin,end,scope){
//   return "( SELECT COUNT(id_) as t_khmydtjbnum"+end+",sum(ping_fen_1_)+sum(ping_fen_2_)+sum(ping_fen_3_)+sum(ping_fen_4_)+sum(ping_fen_5_)  AS t_khmydtjb"+end+" FROM t_khmyddcb WHERE YEAR( create_time_ ) = "+end+" ) s2manYiDu1  JOIN"+
//   "( SELECT COUNT( id_ ) AS t_khmydtjbS"+end+" FROM t_khmydtjb WHERE  YEAR ( create_time_ ) = "+end+" ) s2manYiDu2 "
// }
// /* 投诉 */
// function s3tousu(begin,end,scope){
//   return "( SELECT COUNT( id_ ) AS t_complaint"+end+" FROM t_complaint WHERE you_wu_you_xiao_ = '有效投诉' and YEAR ( create_time_ ) = "+end+" ) s3tousu1  JOIN "+
//   "( SELECT COUNT( id_ ) AS t_complaintS"+end+" FROM t_complaint WHERE you_wu_you_xiao_ = '有效投诉' and chu_li_shi_jian_='<48h' and shi_fou_tong_yi_='同意' and YEAR ( create_time_ ) = "+end+" ) s3tousu2  JOIN "+
//   "( SELECT COUNT( id_ ) AS t_complainS"+end+" FROM t_complaint WHERE you_wu_you_xiao_ = '有效投诉' and chu_li_jie_guo_sh='已通知' and YEAR ( create_time_ ) = "+end+" ) s3tousu3  JOIN "+
//   "( SELECT COUNT( id_ ) AS t_mjwtsqb"+end+" FROM t_lhjczb WHERE  YEAR ( create_time_ ) = "+end+" ) s3weituo1"
//  }
//  /* 人员培训 */
// function s4renYuanPeiXun(begin,end,scope){
//   return "( SELECT COUNT( id_ ) AS t_ryywpxjl"+end+" FROM t_lhrypxjlb WHERE pei_xun_lei_xing_!='' and shi_fou_guo_shen_ = '1' AND YEAR ( bian_zhi_shi_jian ) = "+end+" ) s4renYuanPeiXun1  JOIN "+
//   "( SELECT COUNT( id_ ) AS t_ryywpxjlS"+end+" FROM t_lhrypxjlb WHERE pei_xun_lei_xing_!='' and YEAR ( bian_zhi_shi_jian ) = "+end+" ) s4renYuanPeiXun2"
//  }
//  /* 人员监督 */
// function s5renYuanJianDu(begin,end, scope){
//   return "( SELECT COUNT( id_ ) AS t_zljd"+end+" FROM t_lhryjdjlb WHERE shi_fou_guo_shen_= '1' AND YEAR ( bian_zhi_shi_jian ) = "+end+" ) s5renYuanJianDu1  JOIN "+
//   "( SELECT COUNT( id_ ) AS t_zljdS"+end+" FROM t_lhryjdjlb WHERE  YEAR ( bian_zhi_shi_jian ) = "+end+" ) s5renYuanJianDu2"
//  }
// /* 设备维护 */
// function s6sheBeiWeiHu(begin,end){
//  return "( SELECT COUNT( id_ ) AS t_yqsbwhjhxmt"+begin+" FROM t_yqsbwhjhxmt WHERE YEAR( create_time_ ) = "+begin+" ) s6sheBeiWeiHu1  JOIN "+
//   tool(end,"t_yqsbwhjhxmt",PAT_YEAR(end),1)+" JOIN "+
//   "( SELECT COUNT( id_ ) AS t_whbyxx"+begin+" FROM t_whbyxx WHERE YEAR ( create_time_ ) = "+begin+" ) s6sheBeiWeiHu2  JOIN "+
//   tool(end,"t_whbyxx",PAT_YEAR(end),1)+" JOIN "+
//   "( SELECT COUNT( id_ ) AS t_yqsbwhjhxmz"+begin+" FROM t_yqsbwhjhxmz WHERE YEAR( create_time_ ) = "+begin+" ) s6sheBeiWeiHu3  JOIN "+
//   tool(end,"t_yqsbwhjhxmz",PAT_YEAR(end),1)+" JOIN "+
//   "( SELECT COUNT( id_ ) AS t_whbyxmxxmz"+begin+" FROM t_whbyxmxxmz WHERE YEAR ( create_time_ ) = "+begin+" ) s6sheBeiWeiHu4  JOIN "+
//   tool(end,"t_whbyxmxxmz",PAT_YEAR(end),1)+" JOIN "+
//   "( SELECT COUNT( id_ ) AS t_yqsbwhjhxmy"+begin+" FROM t_yqsbwhjhxmy WHERE YEAR( create_time_ ) = "+begin+" ) s6sheBeiWeiHu5  JOIN "+
//   tool(end,"t_yqsbwhjhxmy",PAT_YEAR(end),1)+" JOIN "+
//   "( SELECT COUNT( id_ ) AS t_whbyxxmy"+begin+" FROM t_whbyxxmy WHERE YEAR ( create_time_ ) = "+begin+" ) s6sheBeiWeiHu6  JOIN "+
//   tool(end,"t_whbyxxmy",PAT_YEAR(end),1)+" JOIN "+
//   "( SELECT COUNT( id_ ) AS t_yqsbwhjhfb"+begin+" FROM t_yqsbwhjhfb WHERE (shi_fou_guo_shen_ like '%同意%' or shi_fou_guo_shen_='1') and  YEAR ( create_time_ ) = "+begin+" ) s6sheBeiWeiHu7  JOIN "+
//   tool(end,"t_yqsbwhjhfb",PAT(end),1)+" JOIN "+
//   "( SELECT COUNT( id_ ) AS t_yqsbwhjlfb"+begin+" FROM t_yqsbwhjlfb WHERE (shi_fou_guo_shen_ like '%同意%' or shi_fou_guo_shen_='1') and  YEAR ( create_time_ ) = "+begin+" ) s6sheBeiWeiHu8  JOIN "+
//   tool(end,"t_yqsbwhjlfb",PAT(end),1)
// }
// /* 设备校准 */
// function s7sheBeiJiaoZhun(begin,end){
//   //v3
//   return "(SELECT she_bei_ming_chen as t_mjsbjdxzjhzbName, COUNT(she_bei_ming_chen) as t_mjsbjdxzjhzb"+end+" FROM t_mjsbjdxzjhzb WHERE YEAR( create_time_ ) = "+end+" GROUP BY she_bei_ming_chen HAVING COUNT(she_bei_ming_chen)>=1 ORDER BY she_bei_ming_chen) s7sheBeiJiaoZhun1  JOIN " +
//   "(SELECT she_bei_ming_chen as t_mjsbjdxzjhzbSName, COUNT(she_bei_ming_chen) as t_mjsbjdxzjhzbS"+end+" FROM t_mjsbjdxzjhzb WHERE YEAR( create_time_ ) = "+end+" AND DATE(yi_jian_xiao_ri_q) >= DATE(ji_hua_ri_qi_) GROUP BY she_bei_ming_chen HAVING COUNT(she_bei_ming_chen)>=1 ORDER BY she_bei_ming_chen) s7sheBeiJiaoZhun12 "
//  }
//  /* 设备核查 */
// function s8sheBeiHeCha(begin,end){
//   return "( SELECT COUNT( id_ ) AS t_sbhcjh"+begin+" FROM t_sbhcjh WHERE shi_fou_guo_shen_ = '1' and YEAR( create_time_ ) = "+begin+" ) s8sheBeiHeCha1  JOIN "+
//    tool(end,"t_sbhcjh",PAT(end),1)+" JOIN "+
//    "( SELECT COUNT( id_ ) AS t_sbhcjlb"+begin+" FROM t_sbhcjlb WHERE shi_fou_guo_shen_ = '1' and  YEAR ( create_time_ ) = "+begin+" ) s8sheBeiHeCha2  JOIN "+
//    tool(end,"t_sbhcjlb",PAT(end),1)
//  }
//  /* 内部质量控制 */
// function s9neiBu(begin,end,scope){
//   return "( SELECT COUNT( id_ ) AS t_mjzlkzxb"+end+" FROM t_mjzlkzxb WHERE YEAR ( create_time_ ) = "+end+" ) s9neibu1  JOIN "+
//   "(SELECT COUNT( t_mjzlkzxb.id_ ) AS t_mjzlkzxbS"+end+" FROM t_mjzlkzxb , t_zlkzjlb WHERE t_mjzlkzxb.xiang_mu_=t_zlkzjlb.zhi_kong_xiang_mu AND t_mjzlkzxb.shi_shi_shi_jian_ = t_zlkzjlb.ji_hua_ri_qi_  and t_zlkzjlb.shi_fou_guo_shen_='1' AND YEAR ( t_mjzlkzxb.create_time_ ) = "+end+" ) s9neibu2 join"+
//   "( SELECT COUNT( id_ ) AS t_mjzlkzjlb"+end+" FROM t_mjzlkzjlb WHERE length(shi_fou_guo_shen_) >0 AND YEAR ( create_time_ ) = "+end+" ) s9neibu3 join" +
//   "( SELECT COUNT( id_ ) AS t_mjzlkzjlbS"+end+" FROM t_mjzlkzjlb WHERE shi_fou_guo_shen_=1 AND YEAR ( create_time_ ) = "+end+" ) s9neibu4"

//  }
//  function s12fengXian(begin,end,scope){
//   return "(select COUNT(t_mjsyshdfxsbykzjhxb.id_) as t_mjsyshdfxsbykzjhxb"+end+" from t_mjsyshdfxsbykzjhxb INNER JOIN t_mjsyshdfxsbykzjhb on t_mjsyshdfxsbykzjhxb.parent_id_ = t_mjsyshdfxsbykzjhb.id_  where YEAR(t_mjsyshdfxsbykzjhxb.shi_shi_ri_qi_)="+end+") s12fengxian1  JOIN " +
//   "(select COUNT(id_) as t_mjsyshdfxsbykzjhxbS"+end+" from t_mjsyshdfxkzypjjlb where shi_fou_guo_shen_ = '1' and YEAR ( create_time_ ) = "+end+") s12fengxian2 "

//  }
//  function s14bufuhexiang(begin,end,scope){
//   return "(select COUNT(t_bfhxbgyjzcsjlbx.id_) as t_bfhxbgyjzcsjlbx"+end+" from t_bfhxbgyjzcsjlbx where YEAR(t_bfhxbgyjzcsjlbx.create_time_)="+end+") s14bufuhexiang1  JOIN " +
//   "(select COUNT(t_bfhxbgyjzcsjlbx.id_) as t_bfhxbgyjzcsjlbxS"+end+" from t_bfhxbgyjzcsjlbx where t_bfhxbgyjzcsjlbx.shi_fou_guo_shen_ = '1' and YEAR(t_bfhxbgyjzcsjlbx.create_time_)="+end+") s14buhexiang2 "

//  }

