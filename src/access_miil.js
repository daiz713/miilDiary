var http           = require('http');
var download_photo = require('./download_photo');
var create_diaryjs = require('./create_diaryjs');

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
            var url = 'http://api.miil.me/api/users/'+ user_name +'/photos/public.json';
            access_miil.call_miil(url, user_name, start_date);
        }else {
            console.log('Received: %d page.', access_miil.call_times);

            // 取得したデータを保持する
            // res: 得られたデータを加工したもの
            access_miil.add_photos(res.photos, start_date);

            // 繰り返す
            var j = access_miil.will_go_next(res, start_date);
            if (j) {
                var url = res.next_page;
                access_miil.call_miil(url, user_name, start_date);
            }else {
                // 日記データdiary.jsを出力する
                create_diaryjs.save(access_miil.diary_info);

                // 写真をダウンロードする
                download_photo.main(access_miil.dl_photos);
            }
        }
    },

    // ダウンロード予約リストに写真を追加する
    // 日記の雛形に追加する
    add_photos: function (photos, start_date) {
        photos.forEach(function (photo) {
            if (access_miil.is_in_range_date(photo.posted, start_date)) {
                var url = photo.url;
                var file_name = photo.date + '.jpg';
                var p = [url, file_name];
                access_miil.dl_photos.push(p);
                photo.diary = '';
                access_miil.diary_info.push(photo);
            }
        })
    },

    // 写真日時が、条件起点日時よりも後かどうか
    is_in_range_date: function (photo_date, start_date) {
        var judge = false;

        if (start_date === undefined) {
            return true;
        }else {
            var start_day = new Date(start_date[0] +'/'+ start_date[1] +'/'+ start_date[2]);
            var photo_day = new Date(photo_date[0] +'/'+ photo_date[1] +'/'+ photo_date[2]);

            judge = (start_day <= photo_day);
            return judge;
        }
    },

    // 繰り返すかどうかの判定
    will_go_next: function (res, start_date) {
        var photos = res.photos;

        // 4回繰り返している
        if (access_miil.call_times >= 4) {
            return false;
        }
        // 最も古いphotoが起点日時よりも前である
        var oldest_photo = photos[photos.length - 1];
        var j = access_miil.is_in_range_date(oldest_photo.posted, start_date);
        if (j === false) {
            return false;
        }
        // 次のページがない
        if (res.next_page === undefined) {
            return false;
        }

        return true;
    },

    // データを取得するためのAPIを発行する
    call_miil: function (url, user_name, start_date) {
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
