layui.use(['form','layer',"jquery",'upload'],function(){
    var form = layui.form,
    upload = layui.upload,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery;
    form.render();
    form.on("submit(UpdateUser)",function(data){
        //弹出loading
        console.log(data);
        var index = top.layer.msg('数据提交中，请稍候',{icon: 16,time:false,shade:0.5});
        // 实际使用时的提交信息
        // $.post("上传路径",{
        //     userName : $(".userName").val(),  //登录名
        //     userEmail : $(".userEmail").val(),  //邮箱
        //     userSex : data.field.sex,  //性别
        //     userGrade : data.field.userGrade,  //会员等级
        //     userStatus : data.field.userStatus,    //用户状态
        //     newsTime : submitTime,    //添加时间
        //     userDesc : $(".userDesc").text(),    //用户简介
        // },function(res){
        //
        // })
        $.post('updatetable.action', data.field, function (flag) {
            if (flag == 1) {
                layer.msg("修改成功", {icon: 6});
                layer.closeAll();
                table.reload('testReload', {});//修改后返回列表页面进行刷新
            } else {
                layer.msg("修改失败", {icon: 6});
            }
        })
        //return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
    })

    // var uploadInst = upload.render({
    //     elem: '#test1'
    //     , url: 'updatehead.action'
    //     , auto: false //选择文件后不自动上传
    //     , bindAction: '#upload1'
    //     , data: {
    //         user_id: function () {
    //             return $('#id').val();
    //         }
    //     }
    //     , before: function () {
    //         //预读本地文件示例，不支持ie8
    //         layer.load(); //上传loading
    //
    //     }
    //     , choose: function (obj) {
    //         // 预读本地文件示例，不支持ie8
    //         obj.preview(function (index, file, result) {
    //             $('#picture').attr('src', result); //图片链接（base64）
    //         });
    //     }
    //     , done: function (msg) {
    //         //如果上传失败
    //         if (msg.code > 0) {
    //             return layer.msg('上传失败');
    //         } else{
    //             layer.close(layer.index)
    //             parent.location.reload();
    //             return layer.msg('上传成功');
    //         }
    //     }
        ,error: function(){
            // 演示失败状态，并实现重传
            var demoText = $('#demoText');
            demoText.html('<span style="color: #FF5722;">上传失败</span> <a class="layui-btn layui-btn-xs demo-reload">重试</a>');
            demoText.find('.demo-reload').on('click', function(){
                uploadInst.upload();
            });
        }
    });


    //格式化时间
    function filterTime(val){
        if(val < 10){
            return "0" + val;
        }else{
            return val;
        }
    }
    //定时发布
    var time = new Date();
    var submitTime = time.getFullYear()+'-'+filterTime(time.getMonth()+1)+'-'+filterTime(time.getDate())+' '+filterTime(time.getHours())+':'+filterTime(time.getMinutes())+':'+filterTime(time.getSeconds());

})