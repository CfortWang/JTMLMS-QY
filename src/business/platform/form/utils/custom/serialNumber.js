import request from '@/utils/request'

//编号字体 ，   编号生成规则 如001则输入3 ，   版本号 唯一标识。
const getSeroal =  (font,rule,ver,length) => {
  let dataCont = {'matchingFont':font,'rule':rule,'version':ver}
  if(length){
    dataCont['length'] = length
  }
   return request({
              url: 'business/v3/sys/universal/getDataNumber',
              method: 'post',
              data: dataCont
              })
}

export default getSeroal
