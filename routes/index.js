exports.index = function (req, res) {
    res.render("index", "");
};
exports.checkAuthcode = function (req, res) {
    res.jsonp("ok");
}

