/* 驼峰转下划线 */
const underToData = (data) => {
           let newData ={}
           for(let key  in data){
            newData[operationData(key)] = data[key]
           }
           return newData
           }

function  operationData (s){
    var a = s.split("_");
       var result = a[0];
       for(var i=1;i<a.length;i++){
           result = result + a[i].slice(0,1).toUpperCase() + a[i].slice(1);
       }
       return result
  }

export default underToData
