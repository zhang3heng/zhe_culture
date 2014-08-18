var mysql = require("mysql");

exports.pool=function(){
    return mysql.createPool({
        host: 'localhost',
        database: 'zhe',
        port: '3306',
        user: 'root',
        password: ''
    })
}