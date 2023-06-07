/* 统计的合格率配置信息，  如公正性，  一年需要完成4次， 当前完成2次的话，则为50%完成率。 */
export const getConfig = (begin,end)=>{
  return "select * FROM t_tjpzb"

}
export const DBData = (begin,end)=>{
  return "select tt.*,cast(1-(t_gdyrqcwt4"+begin+"/t_gdyrqcwt"+begin+")  AS decimal(32,2)) as t_gdyrqcwt6"+begin+
  ",cast(1-(t_gdyrqcwt4"+end+"/t_gdyrqcwt"+end+") AS decimal(32,2)) as t_gdyrqcwt6"+end+
  ",cast(1-(t_gdyrqcwt50"+begin+"/t_gdyrqcwt"+begin+") AS decimal(32,2)) as t_gdyrqcwt5"+begin+",cast(1-(t_gdyrqcwt50"+end+"/t_gdyrqcwt"+end+") AS decimal(32,2)) as t_gdyrqcwt5"+end+
  ",cast(ifnull(1-(t_gdyrqcwt2"+begin+"/t_gdyrqcwt"+begin+"),0)+0.01 AS decimal(32,2)) as t_myddc5"+begin+",cast(ifnull(1-(t_gdyrqcwt2"+end+"/t_gdyrqcwt"+end+"),0)+0.01 AS decimal(32,2)) as t_myddc5"+end+
  ",cast(ifnull(1-(t_gdyrqcwt3"+begin+"/t_gdyrqcwt"+begin+"),0)+0.01 AS decimal(32,2)) as t_myddc6"+begin+",cast(ifnull(1-(t_gdyrqcwt3"+end+"/t_gdyrqcwt"+end+"),0)+0.01 AS decimal(32,2)) as t_myddc6"+end+
  ",cast(ifnull((t_gdyrqcwt50"+begin+"/t_gdyrqcwt"+begin+"),0)+0.01 AS decimal(32,2)) as t_myddc4"+begin+",cast(ifnull((t_gdyrqcwt50"+end+"/t_gdyrqcwt"+end+"),0)+0.01 AS decimal(32,2)) as t_myddc4"+end+
  " FROM("+s1jianCe(begin,end)+
  " join "+s2manYiDu(begin,end)+
  " join "+s3tousu(begin,end)+
  " join "+s4renYuanPeiXun(begin,end)+
  " join "+s5renYuanJianDu(begin,end)+
  " join "+s6sheBeiWeiHu(begin,end)+
  " join "+s7sheBeiJiaoZhun(begin,end)+
  " join "+s8sheBeiHeCha(begin,end)+
  ") tt"
}
/* 拼接通用条件，选用 */
function PAT(val){
  return "shi_fou_guo_shen_ = '1' AND YEAR ( create_time_ ) = '" + val+"'"
}
function PAT_YEAR(val){
  return " YEAR ( create_time_ ) = '" + val+"'"
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
/* 满意度 */
function s1jianCe(begin,end){
  //委托检测数
  return "SELECT *  FROM (select COUNT( id_ ) AS t_gdyrqcwt"+begin+" from t_gdyrgpjc WHERE YEAR( create_time_ ) = "+begin+" union all select id_ from t_gdyrqcjc WHERE YEAR( create_time_ ) = "+begin+") s1jianCe1  JOIN "+
  "(SELECT COUNT( id_ ) AS t_gdyrqcwt"+end+" FROM (select id_ from t_gdyrgpjc WHERE YEAR( create_time_ ) = '"+end+"' union all select id_ from t_gdyrqcjc WHERE YEAR( create_time_ ) = '"+end+"') a0) s1jianCe2 on 1=1 join "+
  //按期完成检测件数
  "(select count(id_) as t_gdyrqcwt2"+begin+" from(select id_   from t_gdyrgpjc where qi_wang_wan_cheng>fa_fang_biao_zhi_ and wei_tuo_id_ in (select id_ from t_gdyrqcwt where YEAR( create_time_ ) = "+begin+") union all select id_ from t_gdyrqcjc where qi_wang_wan_cheng>fa_fang_biao_zhi_ and wei_tuo_id_ in (select id_ from t_gdyrqcwt where YEAR( create_time_ ) = "+begin+")) a) s1jianCe3 on 1=1 JOIN "+
  "(select count(id_) as t_gdyrqcwt2"+end+" from(select id_  from t_gdyrgpjc where qi_wang_wan_cheng>fa_fang_biao_zhi_ and wei_tuo_id_ in (select id_ from t_gdyrqcwt where YEAR( create_time_ ) = "+end+") union all select id_ from t_gdyrqcjc where qi_wang_wan_cheng>fa_fang_biao_zhi_ and wei_tuo_id_ in (select id_ from t_gdyrqcwt where YEAR( create_time_ ) = "+end+")) a) s1jianCe4 on 1=1 join "+
  //出具报告数
  "(select count(id_) as t_gdyrqcwt3"+begin+" from(select id_   from t_gdyrgpjc where fa_fang_biao_zhi_ is not null and wei_tuo_id_ in (select id_ from t_gdyrqcwt where YEAR( create_time_ ) = "+begin+") union all select id_ from t_gdyrqcjc where fa_fang_biao_zhi_ is not null and wei_tuo_id_ in (select id_ from t_gdyrqcwt where YEAR( create_time_ ) = "+begin+")) a) s1jianCe5 on 1=1 JOIN "+
  "(select count(id_) as t_gdyrqcwt3"+end+" from(select id_  from t_gdyrgpjc where fa_fang_biao_zhi_ is not null and wei_tuo_id_ in (select id_ from t_gdyrqcwt where YEAR( create_time_ ) = "+end+") union all select id_ from t_gdyrqcjc where fa_fang_biao_zhi_ is not null and wei_tuo_id_ in (select id_ from t_gdyrqcwt where YEAR( create_time_ ) = "+end+")) a) s1jianCe6 on 1=1 join "+
  //逾期未完成数
  "(select count(id_) as t_gdyrqcwt4"+begin+" from(select id_   from t_gdyrgpjc where (qi_wang_wan_cheng<fa_fang_biao_zhi_ or fa_fang_biao_zhi_ is null) and wei_tuo_id_ in (select id_ from t_gdyrqcwt where YEAR( create_time_ ) = "+begin+") union all select id_ from t_gdyrqcjc where (qi_wang_wan_cheng<fa_fang_biao_zhi_ or fa_fang_biao_zhi_ is null) and wei_tuo_id_ in (select id_ from t_gdyrqcwt where YEAR( create_time_ ) = "+begin+")) a) s1jianCe7 on 1=1 JOIN "+
  "(select count(id_) as t_gdyrqcwt4"+end+" from(select id_  from t_gdyrgpjc where (qi_wang_wan_cheng<fa_fang_biao_zhi_ or fa_fang_biao_zhi_ is null) and wei_tuo_id_ in (select id_ from t_gdyrqcwt where YEAR( create_time_ ) = "+end+") union all select id_ from t_gdyrqcjc where (qi_wang_wan_cheng<fa_fang_biao_zhi_ or fa_fang_biao_zhi_ is null) and wei_tuo_id_ in (select id_ from t_gdyrqcwt where YEAR( create_time_ ) = "+end+")) a) s1jianCe8 on 1=1 JOIN " +
  //检测结果准确率
  "(select count(wei_tuo_id_) as t_gdyrqcwt50"+begin+" from(select wei_tuo_id_   from t_gdyrgpjc where (qi_wang_wan_cheng<fa_fang_biao_zhi_ or fa_fang_biao_zhi_ is null) and wei_tuo_id_ in (select id_ from t_gdyrqcwt where YEAR( create_time_ ) = "+begin+" ) group by wei_tuo_id_ having count(1)=1 union all select wei_tuo_id_ from t_gdyrqcjc where (qi_wang_wan_cheng<fa_fang_biao_zhi_ or fa_fang_biao_zhi_ is null) and wei_tuo_id_ in (select id_ from t_gdyrqcwt where YEAR( create_time_ ) = "+begin+")  group by wei_tuo_id_ having count(1)=1 ) a) s1jianCe9 on 1=1 JOIN "+
  "(select count(wei_tuo_id_) as t_gdyrqcwt50"+end+" from(select wei_tuo_id_  from t_gdyrgpjc where (qi_wang_wan_cheng<fa_fang_biao_zhi_ or fa_fang_biao_zhi_ is null) and wei_tuo_id_ in (select id_ from t_gdyrqcwt where YEAR( create_time_ ) = "+end+" ) group by wei_tuo_id_ having count(1)=1 union all select wei_tuo_id_ from t_gdyrqcjc where (qi_wang_wan_cheng<fa_fang_biao_zhi_ or fa_fang_biao_zhi_ is null) and wei_tuo_id_ in (select id_ from t_gdyrqcwt where YEAR( create_time_ ) = "+end+"  ) group by wei_tuo_id_ having count(1)=1 ) a) s1jianCe10 on 1=1 "
  //按时完成率
  //"( select select count(id_) AS t_gdyrqcwt6"+begin+" from t_gdyrgpjc where (qi_wang_wan_cheng<fa_fang_biao_zhi_ or fa_fang_biao_zhi_ is null) and wei_tuo_id_ in (select id_ from t_gdyrqcwt where YEAR( create_time_ ) = "+begin+"))) s1jianCe11 on 1=1 JOIN "+
  //"( select count(id_) AS t_gdyrqcwt6"+end+" from t_gdyrgpjc where qi_wang_wan_cheng>fa_fang_biao_zhi_ and wei_tuo_id_ in (select id_ from t_gdyrqcwt where YEAR( create_time_ ) = '"+end+"')  ) s1jianCe12 on 1=1"
  }
 /* 满意度 */
 function s2manYiDu(begin,end){
   //调查表总数
  return "( SELECT COUNT( id_ ) AS t_myddc"+begin+" FROM t_myddc "+ "WHERE YEAR( create_time_ ) = "+begin+" ) s2manYiDu1  JOIN "+
    "( SELECT COUNT( id_ ) AS t_myddc"+end+" FROM t_myddc "+ "WHERE YEAR( create_time_ ) = '"+end+"' ) s2manYiDu2 on 1=1 JOIN "+
    //技术水平
    "( SELECT sum(case when dang_nin_dui_jian='满意' then 1 else 0 end)/sum(1)+0.01 AS t_myddc1"+begin+" FROM t_myddc "+ "WHERE YEAR( create_time_ ) = '"+begin+"' ) s2manYiDu3 on 1=1 JOIN "+
    "( SELECT sum(case when dang_nin_dui_jian='满意' then 1 else 0 end)/sum(1)+0.01 AS t_myddc1"+end+" FROM t_myddc "+ "WHERE YEAR( create_time_ ) = '"+end+"' ) s2manYiDu4 on 1=1 JOIN "+
    //检测效率满意度
    "( SELECT sum(case when nin_dui_jian_yan_='满意' then 1 else 0 end)/sum(1)+0.01 AS t_myddc2"+begin+" FROM t_myddc "+ "WHERE YEAR( create_time_ ) = '"+begin+"' ) s2manYiDu5 on 1=1 JOIN "+
    "( SELECT sum(case when nin_dui_jian_yan_='满意' then 1 else 0 end)/sum(1)+0.01 AS t_myddc2"+end+" FROM t_myddc "+ "WHERE YEAR( create_time_ ) = '"+end+"' ) s2manYiDu6 on 1=1 JOIN "+
    //工作态度
    "( SELECT sum(case when nin_dui_jian_ce_r='满意' then 1 else 0 end)/sum(1)+0.01 AS t_myddc3"+begin+" FROM t_myddc "+ "WHERE YEAR( create_time_ ) = '"+begin+"' ) s2manYiDu7 on 1=1 JOIN "+
    "( SELECT sum(case when nin_dui_jian_ce_r='满意' then 1 else 0 end)/sum(1)+0.01 AS t_myddc3"+end+" FROM t_myddc "+ "WHERE YEAR( create_time_ ) = '"+end+"' ) s2manYiDu8 on 1=1 "
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
function s3tousu(begin,end){
  return "( SELECT COUNT( id_ ) AS t_complaint"+begin+" FROM t_complaint WHERE YEAR ( create_time_ ) = "+begin+" ) s3tousu1  JOIN "+
   tool(end,"t_complaint",PAT_YEAR(end),1)
 }
 /* 人员培训 */
function s4renYuanPeiXun(begin,end){
  return "( SELECT COUNT( id_ ) AS t_ryndpxjh"+begin+" FROM t_ryndpxjh WHERE shi_fou_guo_shen_ = '1' and YEAR( create_time_ ) = "+begin+" ) s4renYuanPeiXun1  JOIN "+
   tool(end,"t_ryndpxjh",PAT(end),1)+" JOIN "+
   "( SELECT COUNT( id_ ) AS t_rypxjlnk"+begin+" FROM t_rypxjlnk WHERE shi_fou_guo_shen_ = '1' and  YEAR ( create_time_ ) = "+begin+" ) s4renYuanPeiXun2  JOIN "+
   tool(end,"t_rypxjlnk",PAT(end),1)
 }
 /* 人员监督 */
function s5renYuanJianDu(begin,end){
  return "( SELECT COUNT( id_ ) AS t_zljd"+begin+" FROM t_zljd WHERE shi_fou_guo_shen_ = '1' and YEAR( create_time_ ) = "+begin+" ) s5renYuanJianDu1  JOIN "+
   tool(end,"t_zljd",PAT(end),1)+" JOIN "+
   "( SELECT COUNT( id_ ) AS t_zljdss"+begin+" FROM t_zljdss WHERE shi_fou_guo_shen_ = '1' and  YEAR ( create_time_ ) = "+begin+" ) s5renYuanJianDu2  JOIN "+
   tool(end,"t_zljdss",PAT(end),1)
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
  return "( SELECT COUNT( id_ ) AS t_ndsbxzjdjh"+begin+" FROM t_ndsbxzjdjh WHERE shi_fou_guo_shen_ = '1' and YEAR( create_time_ ) = "+begin+" ) s7sheBeiJiaoZhun1  JOIN "+
   tool(end,"t_ndsbxzjdjh",PAT(end),1)+" JOIN "+
   "( SELECT COUNT( id_ ) AS t_yqsbxzjg"+begin+" FROM t_yqsbxzjg WHERE shi_fou_guo_shen_ = '1' and  YEAR ( create_time_ ) = "+begin+" ) s7sheBeiJiaoZhun2  JOIN "+
   tool(end,"t_yqsbxzjg",PAT(end),1)
 }
 /* 设备核查 */
function s8sheBeiHeCha(begin,end){
  return "( SELECT COUNT( id_ ) AS t_sbhcjh"+begin+" FROM t_sbhcjh WHERE shi_fou_guo_shen_ = '1' and YEAR( create_time_ ) = "+begin+" ) s8sheBeiHeCha1  JOIN "+
   tool(end,"t_sbhcjh",PAT(end),1)+" JOIN "+
   "( SELECT COUNT( id_ ) AS t_sbhcjlb"+begin+" FROM t_sbhcjlb WHERE shi_fou_guo_shen_ = '1' and  YEAR ( create_time_ ) = "+begin+" ) s8sheBeiHeCha2  JOIN "+
   tool(end,"t_sbhcjlb",PAT(end),1)
 }
