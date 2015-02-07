/**
 * Created by thonatos on 15/2/6.
 */

var first = 0;

// Jqurey Object

var $text = $('#text');
var $width = $('#width');
var $height = $('#height');
var $type = $('#type');
var $resImg = $('.res-img');


init();

function init(){

    // Init Func
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs){

        var currentUrl = tabs[0].url;
        if(currentUrl.length > 0){
            $text.val(currentUrl);
            generate();
        }
    });

    // Init Event
    $('.btn-generate').click(function (e) {
        e.preventDefault();
        generate();
    });

    $('.btn-save').click(function (e) {
        e.preventDefault();
        save();

    });

    $('.btn-reset').click(function (e) {
        showMsg('');
    });

}

// Utils

function showMsg(msg){
    $('.msg').html(msg);
}

function generate(){

    var text = $text.val() || 'Generate QrCode Image';
    var width = $width.val();
    var height = $height.val();
    //var type = $type.val();

    if(text.length < 1){
        showMsg('请输入内容，内容不能为空！<br>Please Enter Text,Text Cant Be Empty!');
    }else{

        $resImg.html('');
        $resImg.qrcode({
            render: "canvas", //table方式
            width: parseInt(width) || 205, //宽度
            height:parseInt(height) || 205, //高度
            text: utf16to8(text) //任意内容
        });
        first++;
    }
}

function save(){

    if(first>0){
        var canvas= document.getElementsByTagName('canvas')[0];
        var w=window.open('about:blank','image from canvas');
        w.document.write("<img src='"+canvas.toDataURL("image/png")+"' alt='from canvas'/>");

    }else{
        showMsg('必须先生成二维码！<br>Please Generate It Before save it!');
    }
}

function utf16to8(str) {
    var out, i, len, c;
    out = "";
    len = str.length;
    for(i = 0; i < len; i++) {
        c = str.charCodeAt(i);
        if ((c >= 0x0001) && (c <= 0x007F)) {
            out += str.charAt(i);
        } else if (c > 0x07FF) {
            out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
            out += String.fromCharCode(0x80 | ((c >>  6) & 0x3F));
            out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
        } else {
            out += String.fromCharCode(0xC0 | ((c >>  6) & 0x1F));
            out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
        }
    }
    return out;
}

function convertCanvasToImage(canvas) {
    var image = new Image();
    image.src = canvas.toDataURL("image/png");
    return image;
}



