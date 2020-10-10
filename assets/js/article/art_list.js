$(function() {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;
    //3.定义美化时间的过滤器
    template.defaults.imports.dataFormat = function(data) {
        const dt = new Date(data);
        var y = dt.getFullYear();
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());
        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    //4.定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n;
    }
    //1.定义一个查询的参数对象，将来请求数据时需要将请求参数对象提交到服务器
    var q = {
        //页码值，默认请求第一的数据
        pagenum: 1,
        //每页显示数，默认每页显示2条
        pagesize: 2,
        // 文章分类的id，默认为空
        cate_id: '',
        // 文章的发布状态，默认为空
        state: '',
    };
    //调用文章列表数据方法
    initTable();
    //调用初始化文章分类的方法
    initCate();
    //2.获取文章列表数据的方法
    function initTable() {
        //2.1发送ajax请求
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                //2.2使用模板引擎渲染页面数据
                // layer.msg(res.message)
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
                // console.log(htmlStr);
                //调用渲染分页的方法
                renderPage(res.total);
            }
        })
    };
    //5.初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.messge);
                }
                // layer.msg('恭喜您，获取分类数据成功！')
                // 调用模板引擎渲染分类的可选项
                var htmlStr = template('tpl-cate', res);
                // console.log(htmlStr);
                $('[name = cate_id]').html(htmlStr);
                //通知layui重新渲染表单区域的UI结构
                form.render();
            }
        })
    };
    //6.为筛选表单绑定submit事件
    $('#form-search').on('submit', function(e) {
        //6.1阻止表单默认提交行为
        e.preventDefault();
        //6.2拿到两个下拉表单中的值
        var cate_id = $('[name = cate_id]').val();
        var state = $('[name = state]').val();
        //6.3为查询参数对象q中对应的属性赋值
        q.cate_id = cate_id;
        q.state = state;
        //6.4根据最新筛选条件重新渲染表格数据
        initTable();
    });

    //7.定义渲染分页方法
    function renderPage(total) {
        // console.log(total);
        //7.1调用laypage.render()方法渲染分页结构
        laypage.render({
            //分页容器id
            elem: 'pageBox',
            //总数据条数
            count: total,
            //每页显示数据
            limit: q.pagesize,
            //设置默认被选中的分页
            curr: q.pagenum,
            //7.3
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // 分页发生切换的时候，触发jummp回调
            //7.2触发jump回调的方式有两种：
            //第一种：点击页码值时会触发
            //第二种：只要调用了laypage.render()方法就会触发
            jump: function(obj, first) {
                //可以通过first的值来判断是哪种方式触发的jump回调，如果first值为true,证明是方式二触发，否则方式一
                // console.log(first);
                // console.log(obj.curr);
                // 7.2.1把最新的页码值赋值给q这个参数对象中
                q.pagenum = obj.curr
                    //7.2.2把最新的条目数赋值到q这个查询参数对象的pagesize属性中
                q.pagesize = obj.limit
                    //根据最新的q获取对应的数据列表，并渲染表格
                    // initTable(); //死循环问题
                if (!first) {
                    initTable()
                }
            }
        })
    };
    //8.通过代理行式为删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function() {
        // alert('ok');
        //获取删除按钮的个数
        var len = $('.btn-delete').length;
        console.log(len);
        //8.1询问用户是否删除数据
        // 获取到文章的id
        var id = $(this).attr('data-id');
        layer.confirm('确认删除?', {
            icon: 3,
            title: '提示'
        }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message);
                    };
                    layer.msg('恭喜您，删除文章成功！');
                    //当数据删除完成后，需要判断当前这一页中是否还有剩余的数据，如果没有则让页码值减1之后再重新调用initTable方法
                    if (len === 1) {
                        //如果len值等于1，证明删除完毕后，页面上没有任何数据
                        //前提页码值必须是1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }
                    initTable();
                    layer.close(index);
                }
            })
        })
    })


})