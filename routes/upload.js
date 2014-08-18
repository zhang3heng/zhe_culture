var fs = require("fs"),
    mysql = require("mysql"),
    path = require('path'),
    inspect = require('util').inspect,
    os = require('os'),
    Busboy = require("busboy"),
    UPLOAD_DIR = "./upload/";

var pool = mysql.createPool({
    host: 'localhost',
    database: 'zhe',
    port: '3306',
    user: 'root',
    password: ''
})

work = {
    name: '',
    content: '',
    author: '',
    uploader: '',
    uploadDate: '',
    comment: '',
    workFile: '',
    classify: ''
};

//作品上传
exports.upload = function (req, res) {
    var busboy = new Busboy({ headers: req.headers });
    var uploadFilePath = null;

    busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
        fs.exists(UPLOAD_DIR, function (exist) {
            if (!exist) {
                fs.mkdir(UPLOAD_DIR)
            }
            var saveTo = path.join(UPLOAD_DIR, filename);
            uploadFilePath = saveTo;
            file.pipe(fs.createWriteStream(saveTo));
        })
        file.on("data", function (data) {
            console.log("已上传：" + data.length);
        })
        file.on("end", function (data) {
            console.log("上传完成")
            work[fieldname] = UPLOAD_DIR + filename;
        })
    });
    busboy.on("field", function (fieldname, val) {
        work[fieldname] = val;
    })

    busboy.on('finish', function () {
        console.log(work);
        var status = false;
        pool.getConnection(function (error, conn) {
            if (error) {
                return;
            }
            var sql = "insert into work set ?"
            conn.query(sql, work, function (err, result) {
                if (err) {
                    console.log(err)
                    return;
                }
                if (result.affectedRows) {
                    status = true;
                    res.json(status)
                }
                conn.release();
            });
        });
    });
    return req.pipe(busboy);
}
exports.work_item = function (req, res) {
    var args = {};
    var itemId = req.query["itemId"];
    pool.getConnection(function (error, conn) {
        if (error) {
            console.log(error);
            res.send(500, '数据库连接失败');
            return;
        }
        var sql = "select * from work where id=?"
        conn.query(sql, [itemId], function (err, rows) {
            work = rows[0];
        })
        console.log(work);
        res.render("work_item", {"work": work});
        conn.release();
    });
}