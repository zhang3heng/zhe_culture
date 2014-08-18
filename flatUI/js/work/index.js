var $btn_upload = $("#btn_upload"),
    $ipt_upload = $("#file_upload");
var showMsg = function (msg) {
    $btn_upload.popover({
        content: msg
    })
}
var $uploadMsg = $btn_upload.after("<div class='upload-msg'></div> ")
var xhr = new XMLHttpRequest();
/*点击按钮异步上传文件*/
$btn_upload.on("click", function (e) {
    e.preventDefault();
    var file = $ipt_upload[0].files[0];
    if (!$ipt_upload.val().length) {
        showMsg("请选择要上传的文件");
        return false;
    }
    var progress = function (event) {
        var percentage = Math.round((event.position / event.total) * 100)
        $uploadMsg.text(percentage);
    }
    var uploadComplete = function (event) {
        showMsg("完成");
    }
    var uploadFailed = function (event) {
        showMsg("上传失败")
    }
    var fd = new FormData();
    fd.append("workFile", file);
    xhr.upload.addEventListener("progress", progress, false);
    xhr.addEventListener("load", uploadComplete, false);
    xhr.addEventListener("error", uploadFailed, false);
    xhr.open("POST", "/workUpload");
    xhr.send(fd);


    /*$.ajax({
     url: "/workUpload",
     type: "POST",
     dataType: "multipart/form-data",
     processData: false,
     success: function () {
     showMsg("上传完成");
     },
     beforeSend: function (xhr, settings) {
     var upload = xhr.upload;
     if (settings.progress) {
     upload.addEventListener("progress", settings.progress, false);
     }
     if (settings.load) {
     upload.addEventListener("load", settings.load, false);
     }
     var fd = new FormData();
     for (var key in settings.data) {
     fd.append(key, settings.data[key]);
     }
     settings.data = fd;
     },
     data: file
     })*/
})

