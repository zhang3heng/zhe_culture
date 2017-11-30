var mysql = require("mysql"),
    Busboy = require("busboy");
var pool = mysql.createPool({
    host: 'localhost',
    database: 'zhe',
    port: '3306',
    user: 'root',
    password: 'root'
})
/*用户登录*/
exports.login = function (req, res) {
    var name = null, psd = null, userName, userPsd;
    var busboy = new Busboy({ headers: req.headers });

    busboy.on("field", function (fieldname, val) {
        if (fieldname === "userName") {
            userName = val;
        } else if (fieldname == "userPsd") {
            userPsd = val;
        }
    })

    busboy.on("finish", function () {
        var login_result = false;
        pool.getConnection(function (error, conn) {
            conn.query("select * from user where name=? and password=?", [userName, userPsd], function (err, rows) {
                if (rows.length > 0) {
                    login_result = true
                }
                conn.release();
                res.json(login_result);
            })
        });
    })

    return req.pipe(busboy);

}
/*用户注册*/
exports.userReg = function (req, res) {
    var userName, userPsd;
    var busboy = new Busboy({ headers: req.headers });
    var regResult = false;

    busboy.on("field", function (fieldname, val) {
        if (fieldname === "userName") {
            userName = val;
        } else if (fieldname == "userPsd") {
            userPsd = val;
        }
    });
    busboy.on("finish", function () {
        var sql = "insert into user values (null,?,?,1)"
        pool.getConnection(function (error, conn) {
            conn.query(sql, [userName, userPsd], function (err, result) {
                console.log(result);
                if (result.affectedRows) {
                    regResult = true;
                }
                conn.release();
                res.end(regResult);
            })

        })
    })
    return req.pipe(busboy);
}