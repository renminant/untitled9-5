layui.use(['form','layer','table','laytpl','jquery','upload'],function(){
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        upload = layui.upload,
        laytpl = layui.laytpl,
        table = layui.table;

    //用户列表
    var tableIns = table.render({
        elem: '#userList',
        url : '/ren/tableuser.action',
        cellMinWidth : 95,
        page : true,
        height : "full-125",
        limits : [10,15,20,25],
        limit : 20,
        id : "userListTable",
        cols : [[
            {type: "checkbox", fixed:"left", width:50},
            {field: 'userName', title: '用户名', minWidth:100, align:"center"},
            {field: 'userEmail', title: '用户邮箱', minWidth:200, align:'center',templet:function(d){
                return '<a class="layui-blue" href="mailto:'+d.userEmail+'">'+d.userEmail+'</a>';
            }},
            {field: 'userSex', title: '用户性别', align:'center'},
            {templet: '<div>{{(d.power.powername)}}</div>', title: '用户身份', align: 'center'},
            {field: 'userStatus', title: '用户状态',  align:'center',templet:function(d){
                return d.userStatus == "1" ? "正常使用" : "限制使用";
            }},
            // {field: 'userGrade', title: '用户等级', align:'center',templet:function(d){
            //     if(d.userGrade == "1"){
            //         return "教师";
            //     }else if(d.userGrade == "2"){
            //         return "学生";
            //     }else if(d.userGrade == "3"){
            //         return "管理员";
            //     }
            // }},
            {field: 'userEndTime', title: '最后登录时间', align:'center',minWidth:150},
            {title: '操作', minWidth:175, templet:'#userListBar',fixed:"right",align:"center"}
        ]]
    });

    //搜索【此功能需要后台配合，所以暂时没有动态效果演示】
    $(".search_btn").on("click",function(){
        var searchVal = $("#searchVal").val();
        // if($(".searchVal").val() != ''){
            table.reload("userListTable",{
                page: {
                    curr: 1 //重新从第 1 页开始
                },
                url:'/ren/tableuser.action',
                where: {
                    key: $(".searchVal").val()  //搜索的关键字

                        // 'userName': $.trim(searchVal)

                }
            }, 'data');
        });

    //添加用户
    function addUser(edit){
        var index = layui.layer.open({
            title : "添加用户",
            type : 2,
            content : "userAdd.html",
            success : function(layero, index){
                var body = layui.layer.getChildFrame('body', index);
                if(edit){
                    body.find(".userName").val(edit.userName);  //登录名
                    body.find(".password").text(edit.password);
                    body.find(".userEmail").val(edit.userEmail);  //邮箱
                    body.find(".userSex input[value="+edit.userSex+"]").prop("checked","checked");  //性别
                    body.find(".userGrade").val(edit.userGrade);  //会员等级
                    body.find(".userStatus").val(edit.userStatus);    //用户状态
                    body.find(".userDesc").text(edit.userDesc);//用户简介
                    form.render();
                }
                setTimeout(function(){
                    layui.layer.tips('点击此处返回用户列表', '.layui-layer-setwin .layui-layer-close', {
                        tips: 3
                    });
                },500)
            }
        })
        layui.layer.full(index);
        window.sessionStorage.setItem("index",index);
        //改变窗口大小时，重置弹窗的宽高，防止超出可视区域（如F12调出debug的操作）
        $(window).on("resize",function(){
            layui.layer.full(window.sessionStorage.getItem("index"));
        })
    }
    $(".addNews_btn").click(function(){
        addUser();
    })

    //批量删除
    $(".delAll_btn").click(function(){
        var checkStatus = table.checkStatus('userListTable'),
            data = checkStatus.data
            // newsId = [];
        var  id = "";
        if(data.length > 0) {
            for (var i in data) {
                id += data[i].id + ","
                layer.msg(id);
                // newsId.push(data[i].newsId);
            }
            console.log(id);
            layer.confirm('确定删除选中的用户？', {icon: 3, title: '提示信息'}, function (index) {
                // $.get("删除文章接口",{
                //     newsId : newsId  //将需要删除的newsId作为参数传入
                // },function(data){
                $.ajax({
                    url: "/ren/deleteAll.action",
                    data: {"user_ids": id},
                    success: function (flag) {
                        if (flag > 0) {
                            layer.msg("删除成功", {icon: 6});
                            layer.closeAll();
                            table.reload('testReload', {});
                        } else {
                            layer.msg("删除 失败", {icon: 6});
                        }
                    }
                })
                tableIns.reload();
                layer.close(index);
                // })
            })
        }else{
            layer.msg("请选择需要删除的用户");
        }
    })

    //列表操作
    table.on('tool(userList)', function(obj){
        var checkStatus = table.checkStatus(obj.config.id)
            // ,data = checkStatus.data; //获取选中的数据
        var layEvent = obj.event,
            data = obj.data;
        // id =obj.id;

        if(layEvent === 'edit'){ //编辑
            if (data.length==0){
                layer.msg('请选择一行');
            }else if(data.length > 1){
                layer.msg('只能同时编辑一个');
            } else {
                layer.alert('编辑 [id]：'+ checkStatus.data[0].id);
            }
            // addUser(data);
        }else if(layEvent === 'usable'){ //启用禁用
            var _this = $(this),
                usableText = "是否确定禁用此用户？",
                btnText = "已禁用";
            if(_this.text()=="已禁用"){
                usableText = "是否确定启用此用户？",
                btnText = "已启用";
            }
            layer.confirm(usableText,{
                icon: 3,
                title:'系统提示',
                cancel : function(index){
                    layer.close(index);
                }
            },function(index){
                _this.text(btnText);
                layer.close(index);
            },function(index){
                layer.close(index);
            });
        }else if(layEvent === 'del'){ //删除
            layer.confirm('确定删除此用户？',{icon:3, title:'提示信息'},function(index){

                $.ajax({
                    url:"/ren/deleteUserByid.action",
                    data:{"id":data.id},
                    success:function (flag) {
                        if (flag==1){
                            layer.msg("删除成功",{icon:6});
                            layer.closeAll();
                            table.reload("testReload",{});
                        }else {
                            layer.msg("删除 失效",{icon:6});
                        }
                    },

                });
                // $.get("删除文章接口",{
                //     newsId : data.newsId  //将需要删除的newsId作为参数传入
                // },function(data){
                    tableIns.reload();
                    layer.close(index);
                // })
            });
        }
    });

})
