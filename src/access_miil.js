var http           = require('http');
var download_photo = require('./download_photo');

var access_miil = {
    // APIを読んだ回数
    call_times: 0,

    // ダウンロード予約のphotoURLとファイル名
    dl_photos: [],

    // 日記の雛形を生成するときに必要な情報を保持
    diary_info: [{'title': 'Sample Diary'}],

    // 繰り返し制御
    main: function (user_name, start_date, res) {
        if (res === undefined) {
            // 初回
            access_miil.call_miil(user_name, start_date);
        }else {
            // res: 得られたデータを加工したもの
            console.log('Received:', access_miil.call_times);

            access_miil.add_photos(res.photos);
            access_miil.add_diaries(res.photos);

            console.log(access_miil.diary_info.length);

            if (res.next_page === undefined) {
                // 最終ページに達した
            }
        }

    },

    // ダウンロード予約リストに写真を追加する
    add_photos: function (photos) {
        photos.forEach(function (photo) {
            var url = photo.url;
            var file_name = photo.date + '.jpg';
            var p = [url, file_name];
            access_miil.dl_photos.push(p);
        })
    },

    // 日記の雛形を作るメソッドを呼ぶ
    add_diaries: function (photos) {
        photos.forEach(function (photo) {
            photo.diary = '';
            access_miil.diary_info.push(photo);
        });
    },

    // 写真日時が、条件起点日時よりも後かどうか
    
    // 繰り返すかどうかの判定


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
                    r.date   = photo.created_at.replace(/\:/gi, '-');
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
