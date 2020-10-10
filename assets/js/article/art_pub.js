$(function() {
    var layer = layui.layer;
    var form = layui.form;
    initCate();

    // 2.初始化富文本编辑器
    initEditor()
        //1.定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                //1.1调用模板引擎渲染分类的下拉菜单
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                //一定要记得调用form.render()方法
                form.render();
            }
        })
    };
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)
        //4.为选择封面按钮绑定事件
    $('#btnChangeImage').on('click', function() {
        $('#coverFile').click();
    });
    // 5.监听coverFile的change事件，获取用户选择的文件列表
    $('#coverFile').on('change', function(e) {
        var files = e.target.files;
        //5.1盘单用户是否选择了文件
        if (files.length === 0) {
            return
        }
        //5.2根据文件创建对应的URL地址
        var newImgURL = URL.createObjectURL(files[0]);
        //5.3为裁剪区域重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    });
    //6.定义文章的状态
    var art_state = '已发布';
    //6.1为存为草稿按钮绑定点击事件
    $('#btnSava2').on('click', function() {
        art_state = '草稿';
    });
    //7为表单绑定submit事件
    $('#form-pub').on('submit', function(e) {
        //7.1阻止表单默认提交行为
        e.preventDefault();
        //7.2基于form表单，快速创建一个FormData对象
        var fd = new FormData($(this)[0]);
        //7.3将文章发布状态存到fd中
        fd.append('state', art_state);
        // fd.forEach(function(v, k) {
        //     console.log(k, v);
        // })
        //7.4将封面裁剪过后的输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                //7.5将文件对象存储到fd中
                fd.append('cover_img', blob);
                //7.6发起ajax数据请求
                publishArticle(fd);
            })
    });
    //定义一个发布文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            //注意：如果想服务器提及的是FormData格式的数据，必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg('恭喜您，发布文章成功！');
                //发布文章成功后跳转到文章列表页面
                location.href = "/article/art_list.html";
            }
        })
    }
})