/* jshint eqnull: true */

(function($, root){
    'use strict';

    var isString = function(obj){
        return toString.call(obj) === "[object String]";
    };

    var isObject = function(obj) {
        return obj === Object(obj);
    };

    var isFunction = function(obj) {
        return typeof obj == 'function';
    };

    var prefs = [
        null, '北海道', '青森県', '岩手県', '宮城県',
        '秋田県', '山形県', '福島県', '茨城県', '栃木県',
        '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
        '新潟県', '富山県', '石川県', '福井県', '山梨県',
        '長野県', '岐阜県', '静岡県', '愛知県', '三重県',
        '滋賀県', '京都府', '大阪府', '兵庫県', '奈良県',
        '和歌山県', '鳥取県', '島根県', '岡山県', '広島県',
        '山口県', '徳島県', '香川県', '愛媛県', '高知県',
        '福岡県', '佐賀県', '長崎県', '熊本県', '大分県',
        '宮崎県', '鹿児島県', '沖縄県'
    ];

    $.extend({
        // arg: object
        // arg: string, string
        jpzip: function(arg1, arg2, arg3){
            var debug = true;
            var log = function(msg){
                if(debug && console) console.log(msg);
            };

            var opts = {
                type: "google", // or "ajaxzip3"
                zip1: null,
                zip2: null,
                divide: false,
                callback: null
            };

            var error = function(msg, call){
                call = !!call;

                if(console){
                    console.error(msg);
                }
                if(call && opts.callback){
                    opts.callback("", "");
                }
            };

            // if the first arg is null, exit.
            if(arg1 == null){
                error("You must specify at least one argument.");
                return;
            }

            /* argument type check */
            // if the first arg is object, ignore second arg.
            if(isObject(arg1)){
                // merge to default.
                $.extend(opts, arg1);
            } else if(isString(arg1)){
                if(!arg2 || !isString(arg2)){
                    // arg2 must be there and be string.
                    error("Second argument must be spefified and be string.");
                    return;
                }
                if(arg3 && !isFunction(arg3)){
                    // arg3 must be a function.
                    error("Third argument must be a function.");
                    return;
                }
                $.extend(opts, {zip1: arg1, zip2: arg2, callback: arg3});
            } else {
                // argument type error
                error("First argument must be object or string.");
                return;
            }

            /* argument format check */
            if(!opts.zip1 || opts.zip1.match(/^\d{3}$/) == -1){
                error("Zip1 must be three digits.");
                return;
            }
            if(!opts.zip1 || opts.zip2.search(/^\d{4}$/) == -1){
                error("Zip2 must be four digits.");
                return;
            }

            var funcs = {
                google: function(){
                    var url =
                        "http://www.google.com/transliterate?langpair=ja-Hira|ja&text="+
                        opts.zip1+"-"+opts.zip2;

                    $.ajax({
                        url: url,
                        dataType: "jsonp",
                        jsonp: "jsonp"
                    }).done(function(data, textStatus, jqXHR){
                        // [["135-0022",["東京都江東区三好","135-0022　東京都江東区三好","135-0022"]]]
                        // select first candidate.
                        var result = data[0][1][0];
                        // is it valid?
                        var flag = false;
                        var match;
                        for(var i=0; i<prefs.length; i++){
                            if(!prefs[i]) continue;
                            if(match = result.match(new RegExp('^('+prefs[i]+')(.*)$'))){
                                flag = true;
                                break;
                            }
                        }
                        if(flag === false){
                            // fail
                            error("Fail: the result is \""+result+"\"", true);
                        } else {
                            if(opts.callback){
                                if(opts.divide){
                                    opts.callback.call(root, match[1], match[2]);
                                } else {
                                    opts.callback.call(root, match[0]);
                                }
                            }
                        }
                    }).fail(function(jqXHR, textStatus, errorThrown){
                        error("Fail: ajax returns error -> "+textStatus, "error", true);
                    });
                },

                ajaxzip3 : function(){
                    var url =
                        "http://ajaxzip3.googlecode.com/svn/trunk/ajaxzip3/zipdata/zip-"+opts.zip1+".js";

                    $.ajax({
                        url: url,
                        dataType: "jsonp",
                        jsonp: "jsonp",
                        jsonpCallback: "zipdata"
                    }).done(function(data, textStatus, jqXHR){
                        var ary = data[opts.zip1+opts.zip2];
                        if(!ary){
                            error("Data not found.", true);
                        } else {
                            var p = prefs[ary[0]];
                            if(opts.callback){
                                if(opts.divide){
                                    opts.callback.call(root, p, ary[1]+ary[2]);
                                } else {
                                    opts.callback.call(root, p+ary[1]+ary[2]);
                                }
                            }
                        }
                    }).fail(function(jqXHR, textStatus, errorThrown){
                        error("Fail: ajax returns error -> "+textStatus, "error", true);
                    });
                }
            };

            funcs[opts.type]();
        }
    });
})(jQuery, this);
