define(function () {

    var dialogTmpl = require('components/dialog/dialog.pug');
    require('components/dialog/dialog.less');

    var dialogHTML = dialogTmpl();

    /**
     * 弹出式对话框
     * @param  {object}     options             对话框配置
     * @param  {string}     options.dom         对话框DOM结构字符串
     * @param  {function}   options.onCreate    创建对话框时的回调函数
     * @param  {function}   options.onRemove    移除对话框时的回调函数
     * @return {object}                         对话框jquery对象
     */
    function dialog(options) {
        options = options || {};
        // var overlay = $('<div class="dialog-overlay"></div>');
        // var dialog = $('<div class="dialog"></div>');
        // var dialogHeader = $('<div class="dialog-header"></div>');
        // var dialogTitle = $('<span class="dialog-title"></span>');
        // var closeIcon = $('<i class="dialog-close cf cf-close"></i>');
        // var dialogBody = $('<div class="dialog-body"></div>');
        // var dialogFooter = $('<div class="dialog-footer"></div>');
        // dialogHeader.append(dialogTitle).append(closeIcon);
        // dialog.append(dialogHeader)
        //     .append(dialogBody);
        // overlay.append(dialog);
        // dialog.addClass(options.class || '');
        // dialogTitle.html(options.title || '');
        // dialogBody.html(options.dom || '');

        dialogHTML = $(dialogHTML);

        $('body').append(dialogHTML);
        // 点击关闭按钮或者对话框之外的遮罩部分，销毁对话框
        dialogHTML.on('click', function (e) {
            // if (e.currentTarget === e.target || closeIcon.get(0) === e.target) {
                closeDialog(dialogHTML);
            // }
        });
        // _.isFunction(options.onCreate) && options.onCreate(dialog);
        /**
         * 关闭对话框，并移除DOM节点
         * @param  {object} overlay 对话框容器
         */
        function closeDialog(overlay) {
            // _.isFunction(options.onRemove) && options.onRemove(dialog);
            dialogHTML.remove();
        }
        return dialogHTML;
    }

    return dialog;

});