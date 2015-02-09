/**
 * Created by thonatos on 15/2/6.
 */


(function () {

    var first = 0;
    var obj = {};
    var util = {};
    var _protected = {};

    // $element
    var $text = $('#text');
    var $width = $('#width');
    var $height = $('#height');
    var $type = $('#type');

    // UI
    var UI = {
        showMsg: function (msg) {
            $('.msg').html(msg);
        }
    };

    _protected.init = function () {

        $('.btn-generate').click(function (e) {
            e.preventDefault();
            _protected.createImage();
        });

        $('.btn-save').click(function (e) {
            //e.preventDefault();
            _protected.save($(this));

        });

        $('.btn-reset').click(function (e) {
            UI.showMsg('');
        });

    };

    _protected.createImage = function () {

        var text = $text.val() || 'Generate QrCode Image';
        var width = $width.val();
        var height = $height.val();
        var type = $type.val() || 'svg';

        var action = {
            canvas: function () {

                var qrcode = new QRCode(document.getElementById("qrcode-image"), {
                    width: width,
                    height: height
                });
                qrcode.makeCode(util.utf16to8(text));
            },
            svg: function () {
                var qrcodesvg = new Qrcodesvg(util.utf16to8(text), "qrcode-image", width);
                qrcodesvg.draw();
            }
        };

        if (text.length < 1) {
            UI.showMsg('请输入内容，内容不能为空！<br>Please Enter Text,Text Cant Be Empty!');
        } else {

            first++;

            $('#qrcode-image').empty();

            switch (type) {
                case 'canvas':
                    action.canvas(text);
                    break;

                default:
                    action.svg(text);
            }

        }
    };

    _protected.save = function () {

        if ($type.val() === 'svg') {

            var svg = $('#qrcode-image svg').get(0);
            var serializer = new XMLSerializer();
            var ser = serializer.serializeToString(svg);
            var svgBase64 = "data:image/svg+xml;base64,\n"+util.Base64.encode(ser);

            chrome.downloads.download({url: svgBase64, filename: 'qrcode-image.svg'}, function (downloadId) {
                console.log("download begin, the downId is:" + downloadId);
            });

            //w.document.write(ser);

        } else {

            var png = $('#qrcode-image img').get(0).src;
            chrome.downloads.download({url: png, filename: 'qrcode-image.png'}, function (downloadId) {
                console.log("download begin, the downId is:" + downloadId);
            });
        }

    };


    util.utf16to8 = function (str) {

        var out, i, len, c;
        out = "";
        len = str.length;
        for (i = 0; i < len; i++) {
            c = str.charCodeAt(i);
            if ((c >= 0x0001) && (c <= 0x007F)) {
                out += str.charAt(i);
            } else if (c > 0x07FF) {
                out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
                out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
                out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
            } else {
                out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
                out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
            }
        }
        return out;
    };

    util.Base64 = {
        // private property
        _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

        // public method for encoding
        encode: function (input) {
            var output = "";
            var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
            var i = 0;

            input = Base64._utf8_encode(input);

            while (i < input.length) {

                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output +
                Base64._keyStr.charAt(enc1) + Base64._keyStr.charAt(enc2) +
                Base64._keyStr.charAt(enc3) + Base64._keyStr.charAt(enc4);

            }

            return output;
        },

    // public method for decoding
        decode: function (input) {
            var output = "";
            var chr1, chr2, chr3;
            var enc1, enc2, enc3, enc4;
            var i = 0;

            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            while (i < input.length) {

                enc1 = Base64._keyStr.indexOf(input.charAt(i++));
                enc2 = Base64._keyStr.indexOf(input.charAt(i++));
                enc3 = Base64._keyStr.indexOf(input.charAt(i++));
                enc4 = Base64._keyStr.indexOf(input.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                output = output + String.fromCharCode(chr1);

                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }

            }

            output = Base64._utf8_decode(output);

            return output;

        },

        // private method for UTF-8 encoding
        _utf8_encode: function (string) {
            string = string.replace(/\r\n/g, "\n");
            var utftext = "";

            for (var n = 0; n < string.length; n++) {

                var c = string.charCodeAt(n);

                if (c < 128) {
                    utftext += String.fromCharCode(c);
                }
                else if ((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
                else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }

            }

            return utftext;
        },

        // private method for UTF-8 decoding
        _utf8_decode: function (utftext) {
            var string = "";
            var i = 0;
            var c = c1 = c2 = 0;

            while (i < utftext.length) {

                c = utftext.charCodeAt(i);

                if (c < 128) {
                    string += String.fromCharCode(c);
                    i++;
                }
                else if ((c > 191) && (c < 224)) {
                    c2 = utftext.charCodeAt(i + 1);
                    string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                    i += 2;
                }
                else {
                    c2 = utftext.charCodeAt(i + 1);
                    c3 = utftext.charCodeAt(i + 2);
                    string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                    i += 3;
                }

            }
            return string;
        }
    };

    obj.init = function () {

        // Init Func
        chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {

            var currentUrl = tabs[0].url;
            if (currentUrl.length > 0) {
                $text.val(currentUrl);
                _protected.createImage();
            }
        });

        _protected.init();

    };

    return obj.init();

})();








