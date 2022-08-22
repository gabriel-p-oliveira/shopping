function filter(array, property, value) {
    return array.filter(function(item) { return item[property] === value[property]; });
}
function percentageFunc(item1, item2, percentage){
    return ((item1*item2)* ((100 - percentage) / 100))
}
function formatDate(date) {
    let d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

module.exports = {filter, percentageFunc, formatDate}