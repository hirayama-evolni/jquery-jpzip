# 郵便番号から住所を引くライブラリ

## 注意

このモジュールは作者の業務上の必要により開発されたものです。お使いになっ
たり参考にされたりするのは自由ですが、業務関係者以外の質問などへの対応
は行いませんし、特に業務上の必要がない限り、機能拡張などは行われないか
もしれません。

## 必要なもの

jQuery

## 使い方

このライブラリは`$.jpzip'というメソッドを作成します。

## 定義

```javascript
$.jpzip(arg1, arg2, arg3)
```

## 引数

```javascript
$.jpzip(zip1, zip2, callback);
```

或いは

```javascript
$.jpzip(opts);
```

となります。

- zip1 … 郵便番号の前３桁
- zip2 … 郵便番号の後４桁
- callback … 取得が終わった際に呼ばれるコールバック。`function(result)`
- opts … オプション設定の入ったオブジェクト
  - type … `"google"` or `"ajaxzip3"`。前者は
  [Google日本語入力API](http://www.google.co.jp/ime/cgiapi.html)を、
  後者は[ajaxzip3](https://code.google.com/p/ajaxzip3/)のデータを使って検索します。
  - zip1 … 郵便番号の前３桁
  - zip2 … 郵便番号の後４桁
  - callback … 取得が終わった際に呼ばれるコールバック。`function(result)`

## その他

エラーの場合はconsoleにメッセージが出ます。

## サンプル

```html
<!doctype html>
<html>
  <head>
    <title>test</title>
    <meta charset="utf-8" />
    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min.js"></script>
    <script src="jquery.jpzip.js"></script>
    <script>
    $(function(){
        $("#clear").click(function(e){
            e.preventDefault();

            $("#result").text("");
        });
        $("#form").submit(function(e){
            e.preventDefault();

            $.jpzip({
                zip1: $("#zip1").val(),
                zip2: $("#zip2").val(), 
                callback: function(result){
                  $("#result").text(result);
                }, 
                type: $("#type").val()});
        });
    });
    </script>
  </head>
  <body>
    <form id="form">
      <select id="type">
        <option value="google" selected>google</option>
        <option value="ajaxzip3">ajaxzip3</option>
      </select>
      <input type="text" id="zip1" value="130"> - 
      <input type="text" id="zip2" value="0022">
      <input type="submit">
      <input type="button" id="clear" value="clear">
    </form>
    <div id="result"></div>
  </body>
</html>
```
