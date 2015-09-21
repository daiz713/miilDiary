var http = require('http');

var access_miil = {
    // APIを読んだ回数
    call_times: 0,

    // 繰り返し制御
    main: function (user_name, start_date, res) {
        if (res === undefined) {
            // 初回
            access_miil.call_miil(user_name, start_date);
        }else {
            // res: 得られたデータを加工したもの
            console.log(access_miil.call_times);

            if (res.next_page === undefined) {
                // 最終ページに達した
            }
        }

    },

    // データを取得するためのAPIを発行する
    call_miil: function (user_name, start_date) {
        var url = 'http://api.miil.me/api/users/'+ user_name +'/photos/public.json';
        access_miil.call_times++;

        http.get(url, function (res) {
            res.setEncoding('utf8');
            var body = '', json;

            res.on('data', function (chunk) {
                body += chunk;
            });

            res.on('end', function(res){
                json = JSON.parse(body);
                // 写真配列
                var photos = json.photos;
                // ページング
                var next_page = json.next_url || undefined;

                var photos_data = photos.map(function (photo) {
                    // photosのなかの必要な項目のみを詰める
                    var r = {};
                    r.title  = photo.title;
                    r.url    = photo.url;
                    r.favs   = photo.favorites_count;
                    r.page   = photo.page_url;
                    r.icon   = photo.user.user_icon_url;
                    // format of photo.created_at: "2015-09-08T13:56:05Z"
                    r.posted = photo.created_at.split('T')[0].split('-');
                    return r;
                });

                var result = {
                    photos   : photos_data,
                    next_page: next_page
                }

                // mainに戻る
                access_miil.main(user_name, start_date, result);
            });

        }).on('error', function(e){
            console.log(e.message);
        });
    }
};

module.exports = access_miil;
