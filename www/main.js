// Pythonのformat関数の基本的なやつを真似たもの
String.prototype.format = function() {
  var str = this.toString();
  var args = arguments;
  // {} の個数を確認
  var len_blanks = (str.match(/\{\}/g) || []).length;
  // 引数の個数を確認
  var len_args = args.length;
  // 個数が一致しない場合は文字列をそのまま返す
  if(len_args != len_blanks) return str;
  // 個数が一致していれば置換作業を行う
  for(var i=0; i < args.length; i++) {
    str = str.replace(/\{\}/, args[i]);
  }
  return str;
}

$(function () {
    var WIDTH = Math.min(window.innerHeight * 0.6, 600);
    var $contentsPage = $('#contents-page');
    // .photo-frame
    var temp_photoFrame = '<div class="content" style="width:{}px">{}{}<div style="width: {}px; height: {}px" class="photo-frame">{}</div>{}</div>';
    var temp_day        = '<div class="day">{}</div>';
    var temp_title      = '<div class="title">{}</div>';
    var temp_photo      = '<img src="{}" class="photo">';
    var temp_diary      = '<div class="diary">{}</div>';

    var miilDiary = {
        contents: user_contents,
        biggestFav: 0,

        addPhotoFrame: function (content) {
            var day = content.posted;
            day = temp_day.format(day[0] +'-'+ day[1] +'-'+ day[2]);
            var title = temp_title.format(content.title);
            var photo = 'photos/'+ content.date + '.jpg';
            photo = temp_photo.format(photo);
            var diary = temp_diary.format(content.diary);

            var photoFrame = temp_photoFrame.format(WIDTH, day, title, WIDTH, WIDTH, photo, diary);
            $contentsPage.append(photoFrame);
        },

        setBiggestFavNum: function () {
            var max = 0;
            this.contents.forEach(function (content) {
                var fav = +content.favs;
                if (fav > max) max = fav;
            });
            this.biggestFav = max;
        },

        init: function (settings) {
            
        }
    };

    miilDiary.setBiggestFavNum();

    // コンテンツの最初の要素は設定オブジェクト
    var settings = miilDiary.contents[0];
    miilDiary.contents.shift();

    miilDiary.contents.reverse();

    miilDiary.contents.forEach(function (content) {
        miilDiary.addPhotoFrame(content);
    });
});
