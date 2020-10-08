//注：每次调用$.get()或$.post()或$.ajax()时，都要先调用ajaxPrefilter这个函数
//在这个函数中，可以拿到我们给ajax提供的配置对象
$.ajaxPrefilter(function(options) {
    // 在发起真正的ajax请求之前，统一拼接请求的根路径
    options.url = 'http://ajax.frontend.itheima.net' + options.url;
    console.log(options.url);


    //统一为有权限的接口设置headers请求头
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    //全局统一拦截complete回调函数
    options.complete = function(res) {
        //complete: function(res) {
        // console.log('执行了complete函数');
        // console.log(res);
        //在complete回调函数中，可以使用res.response.JSON拿到服务器响应回来的数据
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            //1.强制清空token 
            localStorage.removeItem('token');
            //2.强制跳转到登陆页面
            location.href = '/login.html';
        }
    }
})