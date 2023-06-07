
const getDate = () => {
  var date = new Date(new Date());
  var year = date.getFullYear();
  var month = trans(date.getMonth() + 1);
  var day = trans(date.getDate());
  return year + '-' + month + '-' + day;
}
function trans(val) {
  return val < 10 ? '0' + val : val;
}

export default getDate
