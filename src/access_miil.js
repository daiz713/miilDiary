var http = require('http');


var access_miil = function (user_name) {
    var user_name = user_name || 'daiz';
    var url = 'http://api.miil.me/api/users/'+ user_name +'/photos/public.json';

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
            var next = json.next_page;
        });

    }).on('error', function(e){
        console.log(e.message);
    });
}

module.exports = access_miil;
