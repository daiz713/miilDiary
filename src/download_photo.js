var request = require('request');
var fs   = require('fs');

var download_photo = {
    // ダウンロード待ちの写真
    will_dl_photos: [],

    main: function (photos) {
        console.log('Downloading %d photos.... to www/photos/', photos.length);
        download_photo.will_dl_photos = photos;
        download_photo.saver();
    },

    // 繰り返し制御
    saver: function () {
        if (download_photo.will_dl_photos.length > 0) {
            var photo = download_photo.will_dl_photos[0];
            // コンソールでURLを知らせる
            console.log('>', photo[0]);
            // 一枚減らす
            download_photo.will_dl_photos.shift();

            download_photo.save(photo);
        }else {
            console.log('Done.');
        }
    },

    save: function (photo) {
        var url       = photo[0];
        var file_name = 'www/photos/' + photo[1];

        request({
            method  : 'GET',
            url     : url,
            encoding: null
        }, function (error, response, body) {
            if(!error && response.statusCode === 200){
                fs.writeFileSync(file_name, body, 'binary');
                // 次の写真をダウンロードする
                download_photo.saver();
            }
        });
    }

};

module.exports = download_photo;
