import en from "@/locales/bpmn-js/en"

/* 统计的合格率配置信息，  如公正性，  一年需要完成4次， 当前完成2次的话，则为50%完成率。 */
export const getConfig = (begin,end)=>{
  return "select * FROM t_tjpzb"

}
export const getJiaoYanObj = (end)=>{
  // return "select a.t_mjsbjdxzjhzbName,a.t_mjsbjdxzjhzb,b.t_mjsbjdxzjhzbS FROM (select she_bei_ming_chen as t_mjsbjdxzjhzbName, COUNT(she_bei_ming_chen) as t_mjsbjdxzjhzb from t_mjsbjdxzjhzb where YEAR(create_time_)='2022' GROUP BY she_bei_ming_chen HAVING COUNT(she_bei_ming_chen)>=1) as a left join  (select she_bei_ming_chen, COUNT(she_bei_ming_chen) as t_mjsbjdxzjhzbS from t_mjsbjdxzjhzb where YEAR(create_time_)= '2022' AND DATE(yi_jian_xiao_ri_q) >= DATE(ji_hua_ri_qi_) GROUP BY she_bei_ming_chen HAVING COUNT(she_bei_ming_chen)>=1 )as b on a.t_mjsbjdxzjhzbName=b.she_bei_ming_chen"
  return "select a.t_mjsbjdxzjhzbZhName, a.t_mjsbjdxzjhzbName,a.t_mjsbjdxzjhzb,ifnull(b.t_mjsbjdxzjhzbS,0) as t_mjsbjdxzjhzbS FROM (select t_sbdj.she_bei_shi_bie_h as t_mjsbjdxzjhzbZhName, t_mjsbjdxzjhzb.she_bei_ming_chen as t_mjsbjdxzjhzbName, COUNT(t_mjsbjdxzjhzb.she_bei_ming_chen) as t_mjsbjdxzjhzb from t_mjsbjdxzjhzb LEFT JOIN t_sbdj on t_mjsbjdxzjhzb.she_bei_bian_hao_ = t_sbdj.id_ where YEAR(t_mjsbjdxzjhzb.create_time_)="+end+" GROUP BY t_mjsbjdxzjhzb.she_bei_ming_chen HAVING COUNT(t_mjsbjdxzjhzb.she_bei_ming_chen)>=1) as a left join  (select she_bei_ming_chen, COUNT(she_bei_ming_chen) as t_mjsbjdxzjhzbS from t_mjsbjdxzjhzb where YEAR(create_time_)= "+end+" AND DATE(yi_jian_xiao_ri_q) >= DATE(ji_hua_ri_qi_) GROUP BY she_bei_ming_chen HAVING COUNT(she_bei_ming_chen)>=1 )as b on a.t_mjsbjdxzjhzbName=b.she_bei_ming_chen"
}
export const gethechaObj = (end)=>{
  // return "select a.t_mjsbjdxzjhzbName,a.t_mjsbjdxzjhzb,b.t_mjsbjdxzjhzbS FROM (select she_bei_ming_chen as t_mjsbjdxzjhzbName, COUNT(she_bei_ming_chen) as t_mjsbjdxzjhzb from t_mjsbjdxzjhzb where YEAR(create_time_)='2022' GROUP BY she_bei_ming_chen HAVING COUNT(she_bei_ming_chen)>=1) as a left join  (select she_bei_ming_chen, COUNT(she_bei_ming_chen) as t_mjsbjdxzjhzbS from t_mjsbjdxzjhzb where YEAR(create_time_)= '2022' AND DATE(yi_jian_xiao_ri_q) >= DATE(ji_hua_ri_qi_) GROUP BY she_bei_ming_chen HAVING COUNT(she_bei_ming_chen)>=1 )as b on a.t_mjsbjdxzjhzbName=b.she_bei_ming_chen"
  return "select	a.t_sbhcjlbZhname,	a.t_sbhcjlbName,	a.t_sbhcjlb,	ifnull( b.t_sbhcjlbS, 0 ) AS t_sbhcjlbS FROM	(	SELECT	t_sbdj.she_bei_ming_cheng_ AS t_sbhcjlbZhname,	t_sbdj.she_bei_shi_bie_h AS t_sbhcjlbName,	COUNT( t_yqsbhcjh.yi_qi_she_bei_min ) AS t_sbhcjlb 	FROM	t_yqsbhcjh	LEFT JOIN t_sbdj ON t_yqsbhcjh.yi_qi_she_bei_min = t_sbdj.id_ 	WHERE	YEAR ( t_yqsbhcjh.he_cha_pin_lv_ )= "+end+"	GROUP BY	t_yqsbhcjh.yi_qi_she_bei_min 	HAVING	COUNT( t_yqsbhcjh.yi_qi_she_bei_min )>= 1 	) AS a	LEFT JOIN ( SELECT shi_bie_hao_, COUNT( shi_bie_hao_ ) AS t_sbhcjlbS FROM t_sbhcjlb WHERE YEAR ( he_cha_ri_qi_ )= "+end+" GROUP BY shi_bie_hao_ HAVING COUNT( shi_bie_hao_ )>= 1 ) AS b ON a.t_sbhcjlbName = b.shi_bie_hao_ UNION SELECT	t_sbdj.she_bei_ming_cheng_ AS t_sbhcjlbZhname,	t_sbhcjlb.shi_bie_hao_ AS t_sbhcjlbName,IF	( t_sbhcjlb.id_, 0, 1 ) AS t_sbhcjlb,IF	(	YEAR ( t_sbhcjlb.he_cha_ri_qi_ )= YEAR ( t_sbhcjlb.xia_ci_he_cha_ri_ ),	COUNT( t_sbhcjlb.shi_bie_hao_ )+ 1,	COUNT( t_sbhcjlb.shi_bie_hao_ )) AS t_sbhcjlbS FROM	t_sbhcjlb	LEFT JOIN t_sbdj ON t_sbhcjlb.shi_bie_hao_ = t_sbdj.she_bei_shi_bie_h WHERE	YEAR ( t_sbhcjlb.he_cha_ri_qi_ )= "+end+" GROUP BY	t_sbhcjlb.shi_bie_hao_ HAVING	COUNT( t_sbhcjlb.shi_bie_hao_ )>=1"
}
// export const getnengliObj = (end)=>{
//   // return "select a.t_mjsbjdxzjhzbName,a.t_mjsbjdxzjhzb,b.t_mjsbjdxzjhzbS FROM (select she_bei_ming_chen as t_mjsbjdxzjhzbName, COUNT(she_bei_ming_chen) as t_mjsbjdxzjhzb from t_mjsbjdxzjhzb where YEAR(create_time_)='2022' GROUP BY she_bei_ming_chen HAVING COUNT(she_bei_ming_chen)>=1) as a left join  (select she_bei_ming_chen, COUNT(she_bei_ming_chen) as t_mjsbjdxzjhzbS from t_mjsbjdxzjhzb where YEAR(create_time_)= '2022' AND DATE(yi_jian_xiao_ri_q) >= DATE(ji_hua_ri_qi_) GROUP BY she_bei_ming_chen HAVING COUNT(she_bei_ming_chen)>=1 )as b on a.t_mjsbjdxzjhzbName=b.she_bei_ming_chen"
//   return "select a.enname,ifnull(a.num,0) as num,  ifnull(b.num,0) as numS from(select xiang_mu_ as enname, COUNT(jian_ce_biao_zhun) as num from t_ndnlyzsysjbdjhzb where YEAR(yu_ji_shi_jian_)="+end+" GROUP BY jian_ce_biao_zhun HAVING COUNT(jian_ce_biao_zhun)>=1) as a LEFT JOIN (select jian_ce_biao_zhun as enname, COUNT(jian_ce_biao_zhun) as num from t_ndnlyzsysjbdjhzb as c LEFT JOIN t_ndnlyzsysjbdjhb as d on c.parent_id_ = d.id_ where YEAR(c.create_time_)="+end+" and d.shi_fou_guo_shen_='1' GROUP BY jian_ce_biao_zhun HAVING COUNT(jian_ce_biao_zhun)>=1) as b on a.enname = b.enname"
// }
export const getnengliObj = (end)=>{
  // return "select a.t_mjsbjdxzjhzbName,a.t_mjsbjdxzjhzb,b.t_mjsbjdxzjhzbS FROM (select she_bei_ming_chen as t_mjsbjdxzjhzbName, COUNT(she_bei_ming_chen) as t_mjsbjdxzjhzb from t_mjsbjdxzjhzb where YEAR(create_time_)='2022' GROUP BY she_bei_ming_chen HAVING COUNT(she_bei_ming_chen)>=1) as a left join  (select she_bei_ming_chen, COUNT(she_bei_ming_chen) as t_mjsbjdxzjhzbS from t_mjsbjdxzjhzb where YEAR(create_time_)= '2022' AND DATE(yi_jian_xiao_ri_q) >= DATE(ji_hua_ri_qi_) GROUP BY she_bei_ming_chen HAVING COUNT(she_bei_ming_chen)>=1 )as b on a.t_mjsbjdxzjhzbName=b.she_bei_ming_chen"
  return "select COUNT(id_) as num from t_ndnlyzsysjbdjhb WHERE shi_fou_guo_shen_ = '1' and  YEAR(create_time_)= "+end+"  UNION all select COUNT(id_) as snum from t_ndnlyzsysjbdjhb where  YEAR(create_time_)= "+end
}
export const getbiaozhunObj = (end)=>{
  // return "select a.t_mjsbjdxzjhzbName,a.t_mjsbjdxzjhzb,b.t_mjsbjdxzjhzbS FROM (select she_bei_ming_chen as t_mjsbjdxzjhzbName, COUNT(she_bei_ming_chen) as t_mjsbjdxzjhzb from t_mjsbjdxzjhzb where YEAR(create_time_)='2022' GROUP BY she_bei_ming_chen HAVING COUNT(she_bei_ming_chen)>=1) as a left join  (select she_bei_ming_chen, COUNT(she_bei_ming_chen) as t_mjsbjdxzjhzbS from t_mjsbjdxzjhzb where YEAR(create_time_)= '2022' AND DATE(yi_jian_xiao_ri_q) >= DATE(ji_hua_ri_qi_) GROUP BY she_bei_ming_chen HAVING COUNT(she_bei_ming_chen)>=1 )as b on a.t_mjsbjdxzjhzbName=b.she_bei_ming_chen"
  return "select a.name as name, a.num ,IFNULL(b.numS,0) as numS from(select zhuan_huan_ as name, COUNT(zhuan_huan_) as num from t_bzwzqjhcjhzb where YEAR(create_time_)="+end+" GROUP BY zhuan_huan_ HAVING COUNT(zhuan_huan_)>=1) as a LEFT JOIN (select zhuan_huan_ as name, COUNT(zhuan_huan_) as numS from t_bzwzqjhcjhzb as c LEFT JOIN t_bzwzqjhcjhb as d on c.parent_id_ = d.id_ where YEAR(c.create_time_)="+end+" and d.shi_fou_guo_shen_='1' GROUP BY zhuan_huan_ HAVING COUNT(zhuan_huan_)>=1) as b on a.name = b.name"
}
export const getbiaozhunTObj = (end)=>{
  // return "select a.t_mjsbjdxzjhzbName,a.t_mjsbjdxzjhzb,b.t_mjsbjdxzjhzbS FROM (select she_bei_ming_chen as t_mjsbjdxzjhzbName, COUNT(she_bei_ming_chen) as t_mjsbjdxzjhzb from t_mjsbjdxzjhzb where YEAR(create_time_)='2022' GROUP BY she_bei_ming_chen HAVING COUNT(she_bei_ming_chen)>=1) as a left join  (select she_bei_ming_chen, COUNT(she_bei_ming_chen) as t_mjsbjdxzjhzbS from t_mjsbjdxzjhzb where YEAR(create_time_)= '2022' AND DATE(yi_jian_xiao_ri_q) >= DATE(ji_hua_ri_qi_) GROUP BY she_bei_ming_chen HAVING COUNT(she_bei_ming_chen)>=1 )as b on a.t_mjsbjdxzjhzbName=b.she_bei_ming_chen"
  return "select MONTH(shi_shi_shi_jian_) as time from t_bzwzqjhcjhzb where YEAR(shi_shi_shi_jian_) ="+end+" ORDER BY shi_shi_shi_jian_ ASC LIMIT 1"
}
export const getbzJunZhuObj = (end)=>{
  // return "select a.t_mjsbjdxzjhzbName,a.t_mjsbjdxzjhzb,b.t_mjsbjdxzjhzbS FROM (select she_bei_ming_chen as t_mjsbjdxzjhzbName, COUNT(she_bei_ming_chen) as t_mjsbjdxzjhzb from t_mjsbjdxzjhzb where YEAR(create_time_)='2022' GROUP BY she_bei_ming_chen HAVING COUNT(she_bei_ming_chen)>=1) as a left join  (select she_bei_ming_chen, COUNT(she_bei_ming_chen) as t_mjsbjdxzjhzbS from t_mjsbjdxzjhzb where YEAR(create_time_)= '2022' AND DATE(yi_jian_xiao_ri_q) >= DATE(ji_hua_ri_qi_) GROUP BY she_bei_ming_chen HAVING COUNT(she_bei_ming_chen)>=1 )as b on a.t_mjsbjdxzjhzbName=b.she_bei_ming_chen"
  return "select a.name as name, a.num ,IFNULL(b.numS,0) as numS from(select zhuan_huan_ as name, COUNT(zhuan_huan_) as num from t_bzjzhcjhzb where YEAR(create_time_)="+end+" GROUP BY zhuan_huan_ HAVING COUNT(zhuan_huan_)>=1) as a LEFT JOIN (select zhuan_huan_ as name, COUNT(zhuan_huan_) as numS from t_bzjzhcjhzb as c LEFT JOIN t_bzjzhcjhb as d on c.parent_id_ = d.id_ where YEAR(c.create_time_)="+end+" and d.shi_fou_guo_shen_='1' GROUP BY zhuan_huan_ HAVING COUNT(zhuan_huan_)>=1) as b on a.name = b.name"
}
export const getbzJunZhuTObj = (end)=>{
  // return "select a.t_mjsbjdxzjhzbName,a.t_mjsbjdxzjhzb,b.t_mjsbjdxzjhzbS FROM (select she_bei_ming_chen as t_mjsbjdxzjhzbName, COUNT(she_bei_ming_chen) as t_mjsbjdxzjhzb from t_mjsbjdxzjhzb where YEAR(create_time_)='2022' GROUP BY she_bei_ming_chen HAVING COUNT(she_bei_ming_chen)>=1) as a left join  (select she_bei_ming_chen, COUNT(she_bei_ming_chen) as t_mjsbjdxzjhzbS from t_mjsbjdxzjhzb where YEAR(create_time_)= '2022' AND DATE(yi_jian_xiao_ri_q) >= DATE(ji_hua_ri_qi_) GROUP BY she_bei_ming_chen HAVING COUNT(she_bei_ming_chen)>=1 )as b on a.t_mjsbjdxzjhzbName=b.she_bei_ming_chen"
  return "select MONTH(shi_shi_shi_jian_) as time from t_bzjzhcjhzb where YEAR(shi_shi_shi_jian_) ="+end+" ORDER BY shi_shi_shi_jian_ ASC LIMIT 1"
}
export const getbzXiBaoObj = (end)=>{
  // return "select a.t_mjsbjdxzjhzbName,a.t_mjsbjdxzjhzb,b.t_mjsbjdxzjhzbS FROM (select she_bei_ming_chen as t_mjsbjdxzjhzbName, COUNT(she_bei_ming_chen) as t_mjsbjdxzjhzb from t_mjsbjdxzjhzb where YEAR(create_time_)='2022' GROUP BY she_bei_ming_chen HAVING COUNT(she_bei_ming_chen)>=1) as a left join  (select she_bei_ming_chen, COUNT(she_bei_ming_chen) as t_mjsbjdxzjhzbS from t_mjsbjdxzjhzb where YEAR(create_time_)= '2022' AND DATE(yi_jian_xiao_ri_q) >= DATE(ji_hua_ri_qi_) GROUP BY she_bei_ming_chen HAVING COUNT(she_bei_ming_chen)>=1 )as b on a.t_mjsbjdxzjhzbName=b.she_bei_ming_chen"
  return "select a.name as name, a.num ,IFNULL(b.numS,0) as numS from(select zhuan_huan_ as name, COUNT(zhuan_huan_) as num from t_bzxbqjhcjhzbn where YEAR(create_time_)="+end+" GROUP BY zhuan_huan_ HAVING COUNT(zhuan_huan_)>=1) as a LEFT JOIN (select c.zhuan_huan_ as name, COUNT(c.zhuan_huan_) as numS from t_bzxbqjhcjhzbn as c LEFT JOIN t_bzxbqjhcjh as d on c.parent_id_ = d.id_ where YEAR(c.create_time_)="+end+" and d.shi_fou_guo_shen_='1' GROUP BY c.zhuan_huan_ HAVING COUNT(c.zhuan_huan_)>=1) as b on a.name = b.name"
}
export const getbzXiBaoTObj = (end)=>{
  // return "select a.t_mjsbjdxzjhzbName,a.t_mjsbjdxzjhzb,b.t_mjsbjdxzjhzbS FROM (select she_bei_ming_chen as t_mjsbjdxzjhzbName, COUNT(she_bei_ming_chen) as t_mjsbjdxzjhzb from t_mjsbjdxzjhzb where YEAR(create_time_)='2022' GROUP BY she_bei_ming_chen HAVING COUNT(she_bei_ming_chen)>=1) as a left join  (select she_bei_ming_chen, COUNT(she_bei_ming_chen) as t_mjsbjdxzjhzbS from t_mjsbjdxzjhzb where YEAR(create_time_)= '2022' AND DATE(yi_jian_xiao_ri_q) >= DATE(ji_hua_ri_qi_) GROUP BY she_bei_ming_chen HAVING COUNT(she_bei_ming_chen)>=1 )as b on a.t_mjsbjdxzjhzbName=b.she_bei_ming_chen"
  return "select MONTH(shi_shi_shi_jian_) as time from t_bzxbqjhcjhzbn where YEAR(shi_shi_shi_jian_) ="+end+" ORDER BY shi_shi_shi_jian_ ASC LIMIT 1"
}
export const DBData = (begin,end,scope)=>{
  // return "select tt.*,cast(1-(t_gdyrqcwt4"+begin+"/t_gdyrqcwt"+begin+")  AS decimal(32,2)) as t_gdyrqcwt6"+begin+
  // return "select tt.* "+

  // // ",cast(1-(t_gdyrqcwt4"+end+"/t_gdyrqcwt"+end+") AS decimal(32,2)) as t_gdyrqcwt6"+end+
  // // ",cast(1-(t_gdyrqcwt50"+begin+"/t_gdyrqcwt"+begin+") AS decimal(32,2)) as t_gdyrqcwt5"+begin+",cast(1-(t_gdyrqcwt50"+end+"/t_gdyrqcwt"+end+") AS decimal(32,2)) as t_gdyrqcwt5"+end+
  // // ",cast(ifnull(1-(t_gdyrqcwt2"+begin+"/t_gdyrqcwt"+begin+"),0)+0.01 AS decimal(32,2)) as t_myddc5"+begin+",cast(ifnull(1-(t_gdyrqcwt2"+end+"/t_gdyrqcwt"+end+"),0)+0.01 AS decimal(32,2)) as t_myddc5"+end+
  // // ",cast(ifnull(1-(t_gdyrqcwt3"+begin+"/t_gdyrqcwt"+begin+"),0)+0.01 AS decimal(32,2)) as t_myddc6"+begin+",cast(ifnull(1-(t_gdyrqcwt3"+end+"/t_gdyrqcwt"+end+"),0)+0.01 AS decimal(32,2)) as t_myddc6"+end+
  // // ",cast(ifnull((t_gdyrqcwt50"+begin+"/t_gdyrqcwt"+begin+"),0)+0.01 AS decimal(32,2)) as t_myddc4"+begin+",cast(ifnull((t_gdyrqcwt50"+end+"/t_gdyrqcwt"+end+"),0)+0.01 AS decimal(32,2)) as t_myddc4"+end+
  // " FROM("+s1jianCe(begin,end)+
  // " join "+s1renwu(begin,end,scope)+
  // " join "+s2jianCe(begin,end)+
  // " join "+s2manYiDu(begin,end,scope)+
  // " join "+s3tousu(begin,end,scope)+
  // " join "+s4renYuanPeiXun(begin,end,scope)+
  // " join "+s5renYuanJianDu(begin,end,scope)+
  // " join "+s6sheBeiWeiHu(begin,end)+
  // " join "+s7sheBeiJiaoZhun(begin,end)+
  // " join "+s8sheBeiHeCha(begin,end)+
  // ") tt"
  return "select tt.* "+
  " FROM("+s1jianCe(begin,end)+
  " join "+s1renwu(begin,end,scope)+
  " join "+s2jianCe(begin,end)+
  " join "+s2manYiDu(begin,end,scope)+
  " join "+s3tousu(begin,end,scope)+
  " join "+s4renYuanPeiXun(begin,end,scope)+
  " join "+s5renYuanJianDu(begin,end,scope)+
  " join "+s9neiBu(begin,end,scope)+
  " join "+s12fengXian(begin,end,scope)+
  " join "+s14bufuhexiang(begin,end,scope)+
  // " join "+s6sheBeiWeiHu(begin,end)+
  // " join "+s7sheBeiJiaoZhun(begin,end)+
  // " join "+s8sheBeiHeCha(begin,end)+
  ") tt"
}
/* 拼接通用条件，选用 */
function PAT(val){
  return "shi_fou_guo_shen_ = '1' AND YEAR ( create_time_ ) = '" + val+"'"
}
function PAT_SATISFACTION(val){
  return "man_yi_du_ = '满意' AND YEAR ( create_time_ ) = '" + val+"'"
}
function PAT_YEAR(val){
  return " YEAR ( create_time_ ) = '" + val+"'"
}
function PAT_TASK(val,choose){
  
  return choose?"shi_fou_guo_shen_ = '1' AND YEAR( create_time_ ) = '"+val+"' AND DATE(update_time_) BETWEEN DATE( create_time_ ) and DATE( qi_wang_wan_cheng ) ":"shi_fou_guo_shen_ = '1' AND YEAR( create_time_ ) = '"+val+"'"
}
function PAT_CHOOSE(val,choose){
  return choose + " AND YEAR( create_time_ ) = '"+val+"'"
  // return "zhuang_tai_ = '已完成' AND YEAR ( create_time_ ) = '" + val+"'"

}
/* 工具函数参数
1、时间条件
2、表名
3、where条件
4、连接与连接条件
  (0) on 1=1 JOIN  非结束的sql语句
  (1) on 1=1  仅被连接， 如当前方法最后一个sql语句
   */
function tool(val,tableName,where,join){
  let alias = tableName+val //别名
 return "( SELECT COUNT( id_ ) AS "
 +alias
 +" FROM "
 +tableName
 +" WHERE "
 +where
 +" ) "
 +alias
 + (join==0?" on 1=1 JOIN ":" on 1=1 ")
}
function toolTask(val,tableName,where,join){
  let alias = tableName+val //别名
 return "( SELECT COUNT( id_ ) AS "
 +alias
 +" FROM "
 +tableName
 +" WHERE "
 +where
 +" ) "
 +alias
 + (join==0?" on 1=1 JOIN ":" on 1=1 ")
}
function toolSame(val,tableName,where,join){
  let alias = tableName+'S'+val //别名
 return "( SELECT COUNT( id_ ) AS "
 +alias
 +" FROM "
 +tableName
 +" WHERE "
 +where
 +" ) "
 +alias
 + (join==0?" on 1=1 JOIN ":" on 1=1 ")
}
/* 任务完成 */
function s1renwu(begin,end,scope){
  return "( SELECT COUNT( id_ ) AS t_lhjczb"+end+" FROM t_lhjczb "+ "WHERE zhuang_tai_ = '已完成' AND YEAR( create_time_ ) = "+end+") s1renwu1  JOIN"+
  "( SELECT COUNT( id_ ) AS t_lhjczbS"+end+" FROM t_lhjczb WHERE YEAR ( create_time_ ) = "+end+" ) s1renwu2  "
 
  }
/* 检测 */
function s1jianCe(begin,end){
  // //v3
  // return "( SELECT COUNT( id_ ) AS t_mjjcbg"+end+" FROM t_mjjcbg "+ "WHERE shi_fou_guo_shen_ = '已退回' AND YEAR( create_time_ ) = "+end+" ) s1jianCe1 JOIN"+
  // "( SELECT COUNT( id_ ) AS t_mjjcbgS"+end+" FROM t_mjjcbg WHERE  YEAR ( create_time_ ) = "+end+" ) s1jianCe2 "
  // 委托检测数
  return "SELECT *  FROM (select COUNT( id_ ) AS t_gdyrqcwt"+end+" from t_gdyrgpjc WHERE YEAR( create_time_ ) = "+end+" union all select id_ from t_gdyrqcjc WHERE YEAR( create_time_ ) = "+end+") s1jianCe1  JOIN "+
  // "(SELECT COUNT( id_ ) AS t_gdyrqcwt"+end+" FROM (select id_ from t_gdyrgpjc WHERE YEAR( create_time_ ) = '"+end+"' union all select id_ from t_gdyrqcjc WHERE YEAR( create_time_ ) = '"+end+"') a0) s1jianCe2 on 1=1 join "+
  // //按期完成检测件数
  // "(select count(id_) as t_gdyrqcwt2"+begin+" from(select id_   from t_gdyrgpjc where qi_wang_wan_cheng>fa_fang_biao_zhi_ and wei_tuo_id_ in (select id_ from t_gdyrqcwt where YEAR( create_time_ ) = "+begin+") union all select id_ from t_gdyrqcjc where qi_wang_wan_cheng>fa_fang_biao_zhi_ and wei_tuo_id_ in (select id_ from t_gdyrqcwt where YEAR( create_time_ ) = "+begin+")) a) s1jianCe3 on 1=1 JOIN "+
  // "(select count(id_) as t_gdyrqcwt2"+end+" from(select id_  from t_gdyrgpjc where qi_wang_wan_cheng>fa_fang_biao_zhi_ and wei_tuo_id_ in (select id_ from t_gdyrqcwt where YEAR( create_time_ ) = "+end+") union all select id_ from t_gdyrqcjc where qi_wang_wan_cheng>fa_fang_biao_zhi_ and wei_tuo_id_ in (select id_ from t_gdyrqcwt where YEAR( create_time_ ) = "+end+")) a) s1jianCe4 on 1=1 join "+
  // //出具报告数
  // "(select count(id_) as t_gdyrqcwt3"+begin+" from(select id_   from t_gdyrgpjc where fa_fang_biao_zhi_ is not null and wei_tuo_id_ in (select id_ from t_gdyrqcwt where YEAR( create_time_ ) = "+begin+") union all select id_ from t_gdyrqcjc where fa_fang_biao_zhi_ is not null and wei_tuo_id_ in (select id_ from t_gdyrqcwt where YEAR( create_time_ ) = "+begin+")) a) s1jianCe5 on 1=1 JOIN "+
  // "(select count(id_) as t_gdyrqcwt3"+end+" from(select id_  from t_gdyrgpjc where fa_fang_biao_zhi_ is not null and wei_tuo_id_ in (select id_ from t_gdyrqcwt where YEAR( create_time_ ) = "+end+") union all select id_ from t_gdyrqcjc where fa_fang_biao_zhi_ is not null and wei_tuo_id_ in (select id_ from t_gdyrqcwt where YEAR( create_time_ ) = "+end+")) a) s1jianCe6 on 1=1 join "+
  // //逾期未完成数
  // "(select count(id_) as t_gdyrqcwt4"+begin+" from(select id_   from t_gdyrgpjc where (qi_wang_wan_cheng<fa_fang_biao_zhi_ or fa_fang_biao_zhi_ is null) and wei_tuo_id_ in (select id_ from t_gdyrqcwt where YEAR( create_time_ ) = "+begin+") union all select id_ from t_gdyrqcjc where (qi_wang_wan_cheng<fa_fang_biao_zhi_ or fa_fang_biao_zhi_ is null) and wei_tuo_id_ in (select id_ from t_gdyrqcwt where YEAR( create_time_ ) = "+begin+")) a) s1jianCe7 on 1=1 JOIN "+
  // "(select count(id_) as t_gdyrqcwt4"+end+" from(select id_  from t_gdyrgpjc where (qi_wang_wan_cheng<fa_fang_biao_zhi_ or fa_fang_biao_zhi_ is null) and wei_tuo_id_ in (select id_ from t_gdyrqcwt where YEAR( create_time_ ) = "+end+") union all select id_ from t_gdyrqcjc where (qi_wang_wan_cheng<fa_fang_biao_zhi_ or fa_fang_biao_zhi_ is null) and wei_tuo_id_ in (select id_ from t_gdyrqcwt where YEAR( create_time_ ) = "+end+")) a) s1jianCe8 on 1=1 JOIN " +
  // //检测结果准确率
  // "(select count(wei_tuo_id_) as t_gdyrqcwt50"+begin+" from(select wei_tuo_id_   from t_gdyrgpjc where (qi_wang_wan_cheng<fa_fang_biao_zhi_ or fa_fang_biao_zhi_ is null) and wei_tuo_id_ in (select id_ from t_gdyrqcwt where YEAR( create_time_ ) = "+begin+" ) group by wei_tuo_id_ having count(1)=1 union all select wei_tuo_id_ from t_gdyrqcjc where (qi_wang_wan_cheng<fa_fang_biao_zhi_ or fa_fang_biao_zhi_ is null) and wei_tuo_id_ in (select id_ from t_gdyrqcwt where YEAR( create_time_ ) = "+begin+")  group by wei_tuo_id_ having count(1)=1 ) a) s1jianCe9 on 1=1 JOIN "+
  // "(select count(wei_tuo_id_) as t_gdyrqcwt50"+end+" from(select wei_tuo_id_  from t_gdyrgpjc where (qi_wang_wan_cheng<fa_fang_biao_zhi_ or fa_fang_biao_zhi_ is null) and wei_tuo_id_ in (select id_ from t_gdyrqcwt where YEAR( create_time_ ) = "+end+" ) group by wei_tuo_id_ having count(1)=1 union all select wei_tuo_id_ from t_gdyrqcjc where (qi_wang_wan_cheng<fa_fang_biao_zhi_ or fa_fang_biao_zhi_ is null) and wei_tuo_id_ in (select id_ from t_gdyrqcwt where YEAR( create_time_ ) = "+end+"  ) group by wei_tuo_id_ having count(1)=1 ) a) s1jianCe10 on 1=1 "
  // // 按时完成率
  // "( select select count(id_) AS t_gdyrqcwt6"+begin+" from t_gdyrgpjc where (qi_wang_wan_cheng<fa_fang_biao_zhi_ or fa_fang_biao_zhi_ is null) and wei_tuo_id_ in (select id_ from t_gdyrqcwt where YEAR( create_time_ ) = "+begin+"))) s1jianCe11 on 1=1 JOIN "+
  "( select count(id_) AS t_gdyrqcwt6"+end+" from t_gdyrgpjc where qi_wang_wan_cheng>fa_fang_biao_zhi_ and wei_tuo_id_ in (select id_ from t_gdyrqcwt where YEAR( create_time_ ) = '"+end+"')  ) s1jianCe12 on 1=1"
  }
  /* 检测 */
function s2jianCe(begin,end){
  //v3
  return "( SELECT COUNT( id_ ) AS t_mjjcbg"+end+" FROM t_lhjcbgb "+ "WHERE trim(tui_hui_ci_shu_) != '' AND YEAR( create_time_ ) = "+end+" ) s2jianCe1 JOIN"+
  "( SELECT COUNT( id_ ) AS t_mjjcbgS"+end+" FROM t_lhjcbgb WHERE  YEAR ( create_time_ ) = "+end+" ) s2jianCe2 "
  //委托检测数
  // return "SELECT *  FROM (select COUNT( id_ ) AS t_gdyrqcwt"+begin+" from t_gdyrgpjc WHERE YEAR( create_time_ ) = "+begin+" union all select id_ from t_gdyrqcjc WHERE YEAR( create_time_ ) = "+begin+") s1jianCe1  JOIN "+
  // "(SELECT COUNT( id_ ) AS t_gdyrqcwt"+end+" FROM (select id_ from t_gdyrgpjc WHERE YEAR( create_time_ ) = '"+end+"' union all select id_ from t_gdyrqcjc WHERE YEAR( create_time_ ) = '"+end+"') a0) s1jianCe2 on 1=1 join "+
  // //按期完成检测件数
  // "(select count(id_) as t_gdyrqcwt2"+begin+" from(select id_   from t_gdyrgpjc where qi_wang_wan_cheng>fa_fang_biao_zhi_ and wei_tuo_id_ in (select id_ from t_gdyrqcwt where YEAR( create_time_ ) = "+begin+") union all select id_ from t_gdyrqcjc where qi_wang_wan_cheng>fa_fang_biao_zhi_ and wei_tuo_id_ in (select id_ from t_gdyrqcwt where YEAR( create_time_ ) = "+begin+")) a) s1jianCe3 on 1=1 JOIN "+
  // "(select count(id_) as t_gdyrqcwt2"+end+" from(select id_  from t_gdyrgpjc where qi_wang_wan_cheng>fa_fang_biao_zhi_ and wei_tuo_id_ in (select id_ from t_gdyrqcwt where YEAR( create_time_ ) = "+end+") union all select id_ from t_gdyrqcjc where qi_wang_wan_cheng>fa_fang_biao_zhi_ and wei_tuo_id_ in (select id_ from t_gdyrqcwt where YEAR( create_time_ ) = "+end+")) a) s1jianCe4 on 1=1 join "+
  // //出具报告数
  // "(select count(id_) as t_gdyrqcwt3"+begin+" from(select id_   from t_gdyrgpjc where fa_fang_biao_zhi_ is not null and wei_tuo_id_ in (select id_ from t_gdyrqcwt where YEAR( create_time_ ) = "+begin+") union all select id_ from t_gdyrqcjc where fa_fang_biao_zhi_ is not null and wei_tuo_id_ in (select id_ from t_gdyrqcwt where YEAR( create_time_ ) = "+begin+")) a) s1jianCe5 on 1=1 JOIN "+
  // "(select count(id_) as t_gdyrqcwt3"+end+" from(select id_  from t_gdyrgpjc where fa_fang_biao_zhi_ is not null and wei_tuo_id_ in (select id_ from t_gdyrqcwt where YEAR( create_time_ ) = "+end+") union all select id_ from t_gdyrqcjc where fa_fang_biao_zhi_ is not null and wei_tuo_id_ in (select id_ from t_gdyrqcwt where YEAR( create_time_ ) = "+end+")) a) s1jianCe6 on 1=1 join "+
  // //逾期未完成数
  // "(select count(id_) as t_gdyrqcwt4"+begin+" from(select id_   from t_gdyrgpjc where (qi_wang_wan_cheng<fa_fang_biao_zhi_ or fa_fang_biao_zhi_ is null) and wei_tuo_id_ in (select id_ from t_gdyrqcwt where YEAR( create_time_ ) = "+begin+") union all select id_ from t_gdyrqcjc where (qi_wang_wan_cheng<fa_fang_biao_zhi_ or fa_fang_biao_zhi_ is null) and wei_tuo_id_ in (select id_ from t_gdyrqcwt where YEAR( create_time_ ) = "+begin+")) a) s1jianCe7 on 1=1 JOIN "+
  // "(select count(id_) as t_gdyrqcwt4"+end+" from(select id_  from t_gdyrgpjc where (qi_wang_wan_cheng<fa_fang_biao_zhi_ or fa_fang_biao_zhi_ is null) and wei_tuo_id_ in (select id_ from t_gdyrqcwt where YEAR( create_time_ ) = "+end+") union all select id_ from t_gdyrqcjc where (qi_wang_wan_cheng<fa_fang_biao_zhi_ or fa_fang_biao_zhi_ is null) and wei_tuo_id_ in (select id_ from t_gdyrqcwt where YEAR( create_time_ ) = "+end+")) a) s1jianCe8 on 1=1 JOIN " +
  // //检测结果准确率
  // "(select count(wei_tuo_id_) as t_gdyrqcwt50"+begin+" from(select wei_tuo_id_   from t_gdyrgpjc where (qi_wang_wan_cheng<fa_fang_biao_zhi_ or fa_fang_biao_zhi_ is null) and wei_tuo_id_ in (select id_ from t_gdyrqcwt where YEAR( create_time_ ) = "+begin+" ) group by wei_tuo_id_ having count(1)=1 union all select wei_tuo_id_ from t_gdyrqcjc where (qi_wang_wan_cheng<fa_fang_biao_zhi_ or fa_fang_biao_zhi_ is null) and wei_tuo_id_ in (select id_ from t_gdyrqcwt where YEAR( create_time_ ) = "+begin+")  group by wei_tuo_id_ having count(1)=1 ) a) s1jianCe9 on 1=1 JOIN "+
  // "(select count(wei_tuo_id_) as t_gdyrqcwt50"+end+" from(select wei_tuo_id_  from t_gdyrgpjc where (qi_wang_wan_cheng<fa_fang_biao_zhi_ or fa_fang_biao_zhi_ is null) and wei_tuo_id_ in (select id_ from t_gdyrqcwt where YEAR( create_time_ ) = "+end+" ) group by wei_tuo_id_ having count(1)=1 union all select wei_tuo_id_ from t_gdyrqcjc where (qi_wang_wan_cheng<fa_fang_biao_zhi_ or fa_fang_biao_zhi_ is null) and wei_tuo_id_ in (select id_ from t_gdyrqcwt where YEAR( create_time_ ) = "+end+"  ) group by wei_tuo_id_ having count(1)=1 ) a) s1jianCe10 on 1=1 "
  //按时完成率
  //"( select select count(id_) AS t_gdyrqcwt6"+begin+" from t_gdyrgpjc where (qi_wang_wan_cheng<fa_fang_biao_zhi_ or fa_fang_biao_zhi_ is null) and wei_tuo_id_ in (select id_ from t_gdyrqcwt where YEAR( create_time_ ) = "+begin+"))) s1jianCe11 on 1=1 JOIN "+
  //"( select count(id_) AS t_gdyrqcwt6"+end+" from t_gdyrgpjc where qi_wang_wan_cheng>fa_fang_biao_zhi_ and wei_tuo_id_ in (select id_ from t_gdyrqcwt where YEAR( create_time_ ) = '"+end+"')  ) s1jianCe12 on 1=1"
  }
 /* 满意度 */
 function s2manYiDu(begin,end,scope){
  // let sql = "( SELECT COUNT( id_ ) AS t_khmydtjb"+begin+" FROM t_khmydtjb "+ "WHERE man_yi_du_ = '满意' AND YEAR( create_time_ ) = "+begin+" ) s2manYiDu1  JOIN"
  // for (let i = 1; i < scope.length; i++) {
  //   if(i === scope.length - 1){
  //     sql = sql + tool(scope[i],"t_khmydtjb",PAT_SATISFACTION(scope[i]),1)
  //   }else{
  //     sql = sql + tool(scope[i],"t_khmydtjb",PAT_SATISFACTION(scope[i]),0)
  //   }
  // }
  // let sql1 = " JOIN ( SELECT COUNT( id_ ) AS t_khmydtjbS"+begin+" FROM t_khmydtjb WHERE  YEAR ( create_time_ ) = "+begin+" ) s2manYiDu2  JOIN "
  // for (let i = 1; i < scope.length; i++) {
  //   if(i === scope.length - 1){
  //     sql1 = sql1 + toolSame(scope[i],"t_khmydtjb",PAT_YEAR(scope[i]),1)
  //   }else{
  //     sql1 = sql1 + toolSame(scope[i],"t_khmydtjb",PAT_YEAR(scope[i]),0)
  //   }
  // }
  // let sqlAll = sql + sql1
  // return sqlAll
  return "( SELECT COUNT(id_) as t_khmydtjbnum"+end+",sum(ping_fen_1_)+sum(ping_fen_2_)+sum(ping_fen_3_)+sum(ping_fen_4_)+sum(ping_fen_5_)  AS t_khmydtjb"+end+" FROM t_khmyddcb WHERE YEAR( create_time_ ) = "+end+" ) s2manYiDu1  JOIN"+
  "( SELECT COUNT( id_ ) AS t_khmydtjbS"+end+" FROM t_khmydtjb WHERE  YEAR ( create_time_ ) = "+end+" ) s2manYiDu2 "
   //调查表总数
  // return "( SELECT COUNT( id_ ) AS t_myddc"+begin+" FROM t_myddc "+ "WHERE YEAR( create_time_ ) = "+begin+" ) s2manYiDu1  JOIN "+
  //   "( SELECT COUNT( id_ ) AS t_myddc"+end+" FROM t_myddc "+ "WHERE YEAR( create_time_ ) = '"+end+"' ) s2manYiDu2 on 1=1 JOIN "+
  //   //技术水平
  //   "( SELECT sum(case when dang_nin_dui_jian='满意' then 1 else 0 end)/sum(1)+0.01 AS t_myddc1"+begin+" FROM t_myddc "+ "WHERE YEAR( create_time_ ) = '"+begin+"' ) s2manYiDu3 on 1=1 JOIN "+
  //   "( SELECT sum(case when dang_nin_dui_jian='满意' then 1 else 0 end)/sum(1)+0.01 AS t_myddc1"+end+" FROM t_myddc "+ "WHERE YEAR( create_time_ ) = '"+end+"' ) s2manYiDu4 on 1=1 JOIN "+
  //   //检测效率满意度
  //   "( SELECT sum(case when nin_dui_jian_yan_='满意' then 1 else 0 end)/sum(1)+0.01 AS t_myddc2"+begin+" FROM t_myddc "+ "WHERE YEAR( create_time_ ) = '"+begin+"' ) s2manYiDu5 on 1=1 JOIN "+
  //   "( SELECT sum(case when nin_dui_jian_yan_='满意' then 1 else 0 end)/sum(1)+0.01 AS t_myddc2"+end+" FROM t_myddc "+ "WHERE YEAR( create_time_ ) = '"+end+"' ) s2manYiDu6 on 1=1 JOIN "+
  //   //工作态度
  //   "( SELECT sum(case when nin_dui_jian_ce_r='满意' then 1 else 0 end)/sum(1)+0.01 AS t_myddc3"+begin+" FROM t_myddc "+ "WHERE YEAR( create_time_ ) = '"+begin+"' ) s2manYiDu7 on 1=1 JOIN "+
  //   "( SELECT sum(case when nin_dui_jian_ce_r='满意' then 1 else 0 end)/sum(1)+0.01 AS t_myddc3"+end+" FROM t_myddc "+ "WHERE YEAR( create_time_ ) = '"+end+"' ) s2manYiDu8 on 1=1 "
    //检测准确性，参照s1的准确率
    // "( SELECT sum(case when nin_dui_jian_ce_r='满意' then 1 else 0 end) AS t_myddc4"+begin+" FROM t_myddc "+ "WHERE YEAR( create_time_ ) = '"+begin+"' ) s2manYiDu9 on 1=1 JOIN "+
    // "( SELECT sum(case when nin_dui_jian_ce_r='满意' then 1 else 0 end) AS t_myddc4"+end+" FROM t_myddc "+ "WHERE YEAR( create_time_ ) = '"+end+"' ) s2manYiDu10 on 1=1 "
    //报告完成率,外层汇总，此处不计算
    // "( SELECT sum(case when nin_dui_jian_ce_r='满意' then 1 else 0 end) AS t_myddc5"+begin+" FROM t_myddc "+ "WHERE YEAR( create_time_ ) = '"+begin+"' ) s2manYiDu11 on 1=1 JOIN "+
    // "( SELECT sum(case when nin_dui_jian_ce_r='满意' then 1 else 0 end) AS t_myddc5"+end+" FROM t_myddc "+ "WHERE YEAR( create_time_ ) = '"+end+"' ) s2manYiDu12 on 1=1 JOIN"
    //检测效率,外层汇总，此处不计算
    // "( SELECT sum(case when nin_dui_jian_yan_='满意' then 1 else 0 end) AS t_myddc6"+begin+" FROM t_myddc "+ "WHERE YEAR( create_time_ ) = '"+begin+"' ) s2manYiDu13 on 1=1 JOIN "+
    // "( SELECT sum(case when nin_dui_jian_yan_='满意' then 1 else 0 end) AS t_myddc6"+end+" FROM t_myddc "+ "WHERE YEAR( create_time_ ) = '"+end+"' ) s2manYiDu14 on 1=1 "

}
/* 投诉 */
function s3tousu(begin,end,scope){
  return "( SELECT COUNT( id_ ) AS t_complaint"+end+" FROM t_complaint WHERE you_wu_you_xiao_ = '有效投诉' and YEAR ( create_time_ ) = "+end+" ) s3tousu1  JOIN "+
  "( SELECT COUNT( id_ ) AS t_complaintS"+end+" FROM t_complaint WHERE you_wu_you_xiao_ = '有效投诉' and chu_li_shi_jian_='<48h' and shi_fou_tong_yi_='同意' and YEAR ( create_time_ ) = "+end+" ) s3tousu2  JOIN "+
  "( SELECT COUNT( id_ ) AS t_complainS"+end+" FROM t_complaint WHERE you_wu_you_xiao_ = '有效投诉' and chu_li_jie_guo_sh='已通知' and YEAR ( create_time_ ) = "+end+" ) s3tousu3  JOIN "+
  "( SELECT COUNT( id_ ) AS t_mjwtsqb"+end+" FROM t_lhjczb WHERE  YEAR ( create_time_ ) = "+end+" ) s3weituo1"
  // let sql = "( SELECT COUNT( id_ ) AS t_complaint"+begin+" FROM t_complaint WHERE YEAR ( create_time_ ) = "+begin+" ) s3tousu1  JOIN "
  // for (let i = 1; i < scope.length; i++) {
  //   if(i === scope.length - 1){
  //     sql = sql + tool(scope[i],"t_complaint",PAT_YEAR(scope[i]),1)
  //   }else{
  //     sql = sql + tool(scope[i],"t_complaint",PAT_YEAR(scope[i]),0)
  //   }
  // }
  // let sql1 = " JOIN ( SELECT COUNT( id_ ) AS t_mjwtsqb"+begin+" FROM t_mjwtsqb WHERE  YEAR ( create_time_ ) = "+begin+" ) s3weituo1  JOIN "
  // for (let i = 1; i < scope.length; i++) {
  //   if(i === scope.length - 1){
  //     sql1 = sql1 + tool(scope[i],"t_mjwtsqb",PAT_YEAR(scope[i]),1)
  //   }else{
  //     sql1 = sql1 + tool(scope[i],"t_mjwtsqb",PAT_YEAR(scope[i]),0)
  //   }
  // }
  // let sqlAll = sql + sql1
  // return sqlAll
  // return "( SELECT COUNT( id_ ) AS t_complaint"+begin+" FROM t_complaint WHERE YEAR ( create_time_ ) = "+begin+" ) s3tousu1  JOIN "+
  //  tool(end,"t_complaint",PAT_YEAR(end),1)+" JOIN "+
  //  "( SELECT COUNT( id_ ) AS t_mjwtsqb"+begin+" FROM t_mjwtsqb WHERE  YEAR ( create_time_ ) = "+begin+" ) s3weituo1  JOIN "+
  //  tool(end,"t_mjwtsqb",PAT(end),1)
  // return "( SELECT COUNT( id_ ) AS t_complaint"+begin+" FROM t_complaint WHERE  YEAR ( create_time_ ) BETWEEN "+begin+" and "+end+") s3tousu1 on 1=1" 
 }
 /* 人员培训 */
function s4renYuanPeiXun(begin,end,scope){
  return "( SELECT COUNT( id_ ) AS t_ryywpxjl"+end+" FROM t_lhrypxjlb WHERE shi_fou_guo_shen_ = '1' AND YEAR ( create_time_ ) = "+end+" ) s4renYuanPeiXun1  JOIN "+
  "( SELECT COUNT( id_ ) AS t_ryywpxjlS"+end+" FROM t_lhrypxjlb WHERE  YEAR ( create_time_ ) = "+end+" ) s4renYuanPeiXun2"
  // let sql = "( SELECT COUNT( id_ ) AS t_ryywpxjl"+begin+" FROM t_ryywpxjl WHERE zhuang_tai_ = '已完成' AND YEAR ( create_time_ ) = "+begin+" ) s4renYuanPeiXun1  JOIN "
  // for (let i = 1; i < scope.length; i++) {
  //   if(i === scope.length - 1){
  //     sql = sql + tool(scope[i],"t_ryywpxjl",PAT_CHOOSE(scope[i],"zhuang_tai_ = '已完成'"),1)
  //   }else{
  //     sql = sql + tool(scope[i],"t_ryywpxjl",PAT_CHOOSE(scope[i],"zhuang_tai_ = '已完成'"),0)
  //   }
  // }
  // let sql1 = " JOIN ( SELECT COUNT( id_ ) AS t_ryywpxjlS"+begin+" FROM t_ryywpxjl WHERE  YEAR ( create_time_ ) = "+begin+" ) s4renYuanPeiXun2  JOIN "
  // for (let i = 1; i < scope.length; i++) {
  //   if(i === scope.length - 1){
  //     sql1 = sql1 + toolSame(scope[i],"t_ryywpxjl",PAT_YEAR(scope[i]),1)
  //   }else{
  //     sql1 = sql1 + toolSame(scope[i],"t_ryywpxjl",PAT_YEAR(scope[i]),0)
  //   }
  // }
  // let sqlAll = sql + sql1
  // return sqlAll
  // return "( SELECT COUNT( id_ ) AS t_ryndpxjh"+begin+" FROM t_ryndpxjh WHERE shi_fou_guo_shen_ = '1' and YEAR( create_time_ ) = "+begin+" ) s4renYuanPeiXun1  JOIN "+
  //  tool(end,"t_ryndpxjh",PAT(end),1)+" JOIN "+
  //  "( SELECT COUNT( id_ ) AS t_rypxjlnk"+begin+" FROM t_rypxjlnk WHERE shi_fou_guo_shen_ = '1' and  YEAR ( create_time_ ) = "+begin+" ) s4renYuanPeiXun2  JOIN "+
  //  tool(end,"t_rypxjlnk",PAT(end),1)
 }
 /* 人员监督 */
function s5renYuanJianDu(begin,end, scope){
  return "( SELECT COUNT( id_ ) AS t_zljd"+end+" FROM t_lhryjdjlb WHERE shi_fou_guo_shen_= '1' AND YEAR ( create_time_ ) = "+end+" ) s5renYuanJianDu1  JOIN "+
  "( SELECT COUNT( id_ ) AS t_zljdS"+end+" FROM t_lhryjdjlb WHERE  YEAR ( create_time_ ) = "+end+" ) s5renYuanJianDu2"
  // let sql = "( SELECT COUNT( id_ ) AS t_zljd"+begin+" FROM t_zljd WHERE shi_fou_guo_shen_= '1' AND YEAR ( create_time_ ) = "+begin+" ) s5renYuanJianDu1  JOIN "
  // for (let i = 1; i < scope.length; i++) {
  //   if(i === scope.length - 1){
  //     sql = sql + tool(scope[i],"t_zljd",PAT_CHOOSE(scope[i],"shi_fou_guo_shen_= '1'"),1)
  //   }else{
  //     sql = sql + tool(scope[i],"t_zljd",PAT_CHOOSE(scope[i],"shi_fou_guo_shen_= '1'"),0)
  //   }
  // }
  // let sql1 = " JOIN ( SELECT COUNT( id_ ) AS t_zljdS"+begin+" FROM t_zljd WHERE  YEAR ( create_time_ ) = "+begin+" ) s5renYuanJianDu2  JOIN "
  // for (let i = 1; i < scope.length; i++) {
  //   if(i === scope.length - 1){
  //     sql1 = sql1 + toolSame(scope[i],"t_zljd",PAT_YEAR(scope[i]),1)
  //   }else{
  //     sql1 = sql1 + toolSame(scope[i],"t_zljd",PAT_YEAR(scope[i]),0)
  //   }
  // }
  // let sqlAll = sql + sql1
  // return sqlAll
  // return "( SELECT COUNT( id_ ) AS t_zljd"+begin+" FROM t_zljd WHERE shi_fou_guo_shen_ = '1' and YEAR( create_time_ ) = "+begin+" ) s5renYuanJianDu1  JOIN "+
  //  tool(end,"t_zljd",PAT(end),1)+" JOIN "+
  //  "( SELECT COUNT( id_ ) AS t_zljdss"+begin+" FROM t_zljdss WHERE shi_fou_guo_shen_ = '1' and  YEAR ( create_time_ ) = "+begin+" ) s5renYuanJianDu2  JOIN "+
  //  tool(end,"t_zljdss",PAT(end),1)
 }
/* 设备维护 */
function s6sheBeiWeiHu(begin,end){
 return "( SELECT COUNT( id_ ) AS t_yqsbwhjhxmt"+begin+" FROM t_yqsbwhjhxmt WHERE YEAR( create_time_ ) = "+begin+" ) s6sheBeiWeiHu1  JOIN "+
  tool(end,"t_yqsbwhjhxmt",PAT_YEAR(end),1)+" JOIN "+
  "( SELECT COUNT( id_ ) AS t_whbyxx"+begin+" FROM t_whbyxx WHERE YEAR ( create_time_ ) = "+begin+" ) s6sheBeiWeiHu2  JOIN "+
  tool(end,"t_whbyxx",PAT_YEAR(end),1)+" JOIN "+
  "( SELECT COUNT( id_ ) AS t_yqsbwhjhxmz"+begin+" FROM t_yqsbwhjhxmz WHERE YEAR( create_time_ ) = "+begin+" ) s6sheBeiWeiHu3  JOIN "+
  tool(end,"t_yqsbwhjhxmz",PAT_YEAR(end),1)+" JOIN "+
  "( SELECT COUNT( id_ ) AS t_whbyxmxxmz"+begin+" FROM t_whbyxmxxmz WHERE YEAR ( create_time_ ) = "+begin+" ) s6sheBeiWeiHu4  JOIN "+
  tool(end,"t_whbyxmxxmz",PAT_YEAR(end),1)+" JOIN "+
  "( SELECT COUNT( id_ ) AS t_yqsbwhjhxmy"+begin+" FROM t_yqsbwhjhxmy WHERE YEAR( create_time_ ) = "+begin+" ) s6sheBeiWeiHu5  JOIN "+
  tool(end,"t_yqsbwhjhxmy",PAT_YEAR(end),1)+" JOIN "+
  "( SELECT COUNT( id_ ) AS t_whbyxxmy"+begin+" FROM t_whbyxxmy WHERE YEAR ( create_time_ ) = "+begin+" ) s6sheBeiWeiHu6  JOIN "+
  tool(end,"t_whbyxxmy",PAT_YEAR(end),1)+" JOIN "+
  "( SELECT COUNT( id_ ) AS t_yqsbwhjhfb"+begin+" FROM t_yqsbwhjhfb WHERE (shi_fou_guo_shen_ like '%同意%' or shi_fou_guo_shen_='1') and  YEAR ( create_time_ ) = "+begin+" ) s6sheBeiWeiHu7  JOIN "+
  tool(end,"t_yqsbwhjhfb",PAT(end),1)+" JOIN "+
  "( SELECT COUNT( id_ ) AS t_yqsbwhjlfb"+begin+" FROM t_yqsbwhjlfb WHERE (shi_fou_guo_shen_ like '%同意%' or shi_fou_guo_shen_='1') and  YEAR ( create_time_ ) = "+begin+" ) s6sheBeiWeiHu8  JOIN "+
  tool(end,"t_yqsbwhjlfb",PAT(end),1)
}
/* 设备校准 */
function s7sheBeiJiaoZhun(begin,end){
  //v3
  return "(SELECT she_bei_ming_chen as t_mjsbjdxzjhzbName, COUNT(she_bei_ming_chen) as t_mjsbjdxzjhzb"+end+" FROM t_mjsbjdxzjhzb WHERE YEAR( create_time_ ) = "+end+" GROUP BY she_bei_ming_chen HAVING COUNT(she_bei_ming_chen)>=1 ORDER BY she_bei_ming_chen) s7sheBeiJiaoZhun1  JOIN " +
  "(SELECT she_bei_ming_chen as t_mjsbjdxzjhzbSName, COUNT(she_bei_ming_chen) as t_mjsbjdxzjhzbS"+end+" FROM t_mjsbjdxzjhzb WHERE YEAR( create_time_ ) = "+end+" AND DATE(yi_jian_xiao_ri_q) >= DATE(ji_hua_ri_qi_) GROUP BY she_bei_ming_chen HAVING COUNT(she_bei_ming_chen)>=1 ORDER BY she_bei_ming_chen) s7sheBeiJiaoZhun12 "
  //v1
  // return "( SELECT COUNT( id_ ) AS t_ndsbxzjdjh"+begin+" FROM t_ndsbxzjdjh WHERE shi_fou_guo_shen_ = '1' and YEAR( create_time_ ) = "+begin+" ) s7sheBeiJiaoZhun1  JOIN "+
  //  tool(end,"t_ndsbxzjdjh",PAT(end),1)+" JOIN "+
  //  "( SELECT COUNT( id_ ) AS t_yqsbxzjg"+begin+" FROM t_yqsbxzjg WHERE shi_fou_guo_shen_ = '1' and  YEAR ( create_time_ ) = "+begin+" ) s7sheBeiJiaoZhun2  JOIN "+
  //  tool(end,"t_yqsbxzjg",PAT(end),1)
 }
 /* 设备核查 */
function s8sheBeiHeCha(begin,end){
  return "( SELECT COUNT( id_ ) AS t_sbhcjh"+begin+" FROM t_sbhcjh WHERE shi_fou_guo_shen_ = '1' and YEAR( create_time_ ) = "+begin+" ) s8sheBeiHeCha1  JOIN "+
   tool(end,"t_sbhcjh",PAT(end),1)+" JOIN "+
   "( SELECT COUNT( id_ ) AS t_sbhcjlb"+begin+" FROM t_sbhcjlb WHERE shi_fou_guo_shen_ = '1' and  YEAR ( create_time_ ) = "+begin+" ) s8sheBeiHeCha2  JOIN "+
   tool(end,"t_sbhcjlb",PAT(end),1)
 }
 /* 内部质量控制 */
function s9neiBu(begin,end,scope){
  return "( SELECT COUNT( id_ ) AS t_mjzlkzxb"+end+" FROM t_mjzlkzxb WHERE YEAR ( create_time_ ) = "+end+" ) s9neibu1  JOIN "+
  "( SELECT COUNT( t_mjzlkzxb.id_ ) AS t_mjzlkzxbS"+end+" FROM t_mjzlkzxb left join t_mjzlkzjhb on t_mjzlkzxb.parent_id_ = t_mjzlkzjhb.id_ WHERE t_mjzlkzjhb.shi_fou_guo_shen_='1' AND YEAR ( t_mjzlkzxb.create_time_ ) = "+end+"   ) s9neibu2 join"+
  "( SELECT COUNT( id_ ) AS t_mjzlkzjlb"+end+" FROM t_mjzlkzjlb WHERE length(shi_fou_guo_shen_) >0 AND YEAR ( create_time_ ) = "+end+" ) s9neibu3 join" +
  "( SELECT COUNT( id_ ) AS t_mjzlkzjlbS"+end+" FROM t_mjzlkzjlb WHERE shi_fou_guo_shen_=1 AND YEAR ( create_time_ ) = "+end+" ) s9neibu4"

 }
 function s12fengXian(begin,end,scope){
  return "(select COUNT(t_mjsyshdfxsbykzjhxb.id_) as t_mjsyshdfxsbykzjhxb"+end+" from t_mjsyshdfxsbykzjhxb INNER JOIN t_mjsyshdfxsbykzjhb on t_mjsyshdfxsbykzjhxb.parent_id_ = t_mjsyshdfxsbykzjhb.id_  where YEAR(t_mjsyshdfxsbykzjhxb.shi_shi_ri_qi_)="+end+") s12fengxian1  JOIN " +
  "(select COUNT(t_mjsyshdfxsbykzjhxb.id_) as t_mjsyshdfxsbykzjhxbS"+end+" from t_mjsyshdfxsbykzjhxb INNER JOIN t_mjsyshdfxsbykzjhb on t_mjsyshdfxsbykzjhxb.parent_id_ = t_mjsyshdfxsbykzjhb.id_  where YEAR(t_mjsyshdfxsbykzjhxb.shi_shi_ri_qi_)="+end+" and t_mjsyshdfxsbykzjhb.shi_fou_guo_shen_ = '1') s12fengxian2 "

 }
 function s14bufuhexiang(begin,end,scope){
  return "(select COUNT(t_bfhxbgyjzcsjlbx.id_) as t_bfhxbgyjzcsjlbx"+end+" from t_bfhxbgyjzcsjlbx where YEAR(t_bfhxbgyjzcsjlbx.create_time_)="+end+") s14bufuhexiang1  JOIN " +
  "(select COUNT(t_bfhxbgyjzcsjlbx.id_) as t_bfhxbgyjzcsjlbxS"+end+" from t_bfhxbgyjzcsjlbx where t_bfhxbgyjzcsjlbx.zhuang_tai_ = '已完成' and YEAR(t_bfhxbgyjzcsjlbx.create_time_)="+end+") s14buhexiang2 "

 }

