$(function() {
    var layer = layui.layer;
    var form = layui.form;
    initArtCateList();
    //1.获取文章分类列表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                var htmlStr = template("tpl-table", res);
                $('tbody').html(htmlStr);
            }
        })
    }
    //2.显示添加文章分类列表
    $('#btnAddCate').on('click', function() {
            indexAdd = layer.open({
                // 弹出层类型，1代表页面层
                type: 1,
                // 弹出层宽高
                area: ['500px', '250px'],
                title: '添加文章分类',
                content: $('#dialog-add').html()
            });
        })
        //3.提交文章分类添加（事件委托）
    var indexAdd = null;
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault();
        //3.1发送ajax请求
        $.ajax({
            method: 'POSt',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                //1.提示消息2.重新获取文章分类3.关闭弹出层
                initArtCateList();
                layer.msg('恭喜您，文章类别添加成功');
                layer.close(indexAdd);
            }
        })
    });
    //4.通过代理形式为btn-edit绑定点击事件
    var indexEdit = null;
    $('tbody').on('click', '#form-edit', function(e) {
        e.preventDefault();
        indexEdit = layer.open({
            // 弹出层类型，1代表页面层
            type: 1,
            // 弹出层宽高
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        });
        //4.1获取id,发送ajax请求，渲染到页面
        var id = $(this).attr('data-id');
        //发起ajax请求
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                form.val('form-edit', res.data);
            }
        })
    });
    //5.通过代理形式为修改分类的表单绑定submit事件
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                initArtCateList();
                layer.msg('恭喜您，文章类别更新成功');
                layer.close(indexEdit);
            }
        })
    });
    //6.通过代理形式为修改分类的表单绑定删除事件
    $('tbody').on('click', '.btn-delete', function() {
        //6.1先获取Id，进入到函数中this的指向就改变了
        var id = $(this).attr('data-id');
        //6.2显示对话框
        layer.confirm('是否确认删除?', {
            icon: 3,
            title: '提示'
        }, function(index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message);
                    }
                    layer.close(index);
                    layer.msg('恭喜您，文章类别删除成功！');
                    initArtCateList();
                }
            })

        });
    })
})