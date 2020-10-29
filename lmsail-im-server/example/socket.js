(function(window) {
    var helper = {};

    helper.connect = () => {
        helper.insertMsg('系统通知', '与服务器连接成功！');
    }

    helper.init = data => {
        helper.insertMsg('系统消息 [init]', `${JSON.stringify(data)}`);

        setTimeout(() => {
            helper.insertMsg('我', '申请加入了与2号选手的私聊窗口！', 'error');
            socket.emit('join', { to_uid: 2 });
        }, 1000);
    }

    helper.join = data => {
        helper.insertMsg('系统消息 [join]', `${JSON.stringify(data)}`);
    }

    helper.message = data => {
        helper.insertMsg('系统消息 [message]', `${data.data.message}`);
    }

    helper.authError = data => {
        helper.insertMsg('系统消息 [authError]', 'Socket 连接握手认证失败！', 'error');
    }

    helper.disconnect = err => {
        helper.insertMsg('系统消息 [disconnect]', `socket 服务器已关闭！`, 'error');
    }

    helper.send = () => {
        var node = document.getElementById('message');
        var message = node.value;
        if(message !== "") {
            socket.emit('message', { message, to_uid: 2 });
            helper.insertMsg('我', message, 'error');
            node.value = "";
        }
    }

    helper.insertMsg = (prefix, message, className = 'success') => {
        var node = document.getElementById('terminal');
        node.innerHTML += `
            <div style="border-bottom: 1px dashed #ddd;padding: 5px 0;">
                <span class="${className}">${prefix}：${message}</span>
            </div>`;
        node.scrollTop = node.scrollHeight
    }

    window.helper = helper;
})(window);

