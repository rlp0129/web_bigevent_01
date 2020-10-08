$(function() {
        //调用getUserInfo获取用户基本信息
        getUserInfo();


        var layer = layui.layer;
        //点击按钮实现退出功能
        $('#btnLogout').on('click', function() {
            // alert('r');
            //提示用户是否确认退出
            layer.confirm('确定退出登录', {
                icon: 3,
                title: '提示'
            }, function(index) {
                //1.清空本地存储的token
                localStorage.removeItem('token');
                //2.重新跳转到登陆页面
                // alert('r');
                location.href = '/login.html';
                //关闭confirm询问框
                layer.close(index);
            });
        })
    })
    //获取用户基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        //headers就是请求头配置对象
        // headers: {
        //     Authorization: localStorage.getItem('token') || '',
        // },
        success: function(res) {
            // console.log(res);
            if (res.status !== 0) {
                return layer.msg('获取用户信息失败');
            }
            //调用renderAvatar渲染用户头像
            renderAvatar(res.data);
        },
        //不论成功失败，最终都会调用complete回调函数
        // complete: function(res) {
        //     // console.log('执行了complete函数');
        //     // console.log(res);
        //     //在complete回调函数中，可以使用res.response.JSON拿到服务器响应回来的数据
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         //1.强制清空token 
        //         localStorage.removeItem('token');
        //         //2.强制跳转到登陆页面
        //         location.href = '/login.html';
        //     }
        // }
    })
}
//渲染用户头像
function renderAvatar(user) {
    //1.获取用户名称
    var name = user.nickname || user.username;
    //2.设置欢迎文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name);
    // 3.按需渲染用户的头像
    if (user.user_pic !== null) {
        // 3.1渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide();
    } else {
        // 3.2渲染文本头像
        $('.layui-nav-img').hide();
        var first = name[0].toUpperCase();
        $('.text-avatar').html(first).show();
    }
}