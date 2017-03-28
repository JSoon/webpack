define(function () {
    'use strict';

    require('less/a.less');

    console.log('***** I AM a *****');

    console.log($);

    var dialog = require('components/dialog/dialog.js');
    console.log(dialog);



    // var helloworld = require('views/helloworld.pug');

    // var helloworldHTML = $(helloworld()).text();

    // var dialog = require('views/dialog.pug');

    // console.log(dialog);

    // var dialogHTML = dialog({
    //     saying: helloworldHTML
    // });

    // var dialog = require('components/dialog/dialog.pug');
    // require('components/dialog/dialog.less');

    // var dialogHTML = dialog({
    //     saying: 'hello pug!',
    //     array: [1, 2, 3],
    //     user: false
    // });


    $('#dialog').on('click', function (e) {
        dialog();
    });

    // $('body').append(dialogHTML);
});