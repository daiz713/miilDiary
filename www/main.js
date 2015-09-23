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
    var temp_photoFrame = '<div class="content" id="content-{}" style="width:{}px">{}{}<div style="width: {}px; height: {}px" class="photo-frame">{}</div>{}</div>';
    var temp_day        = '<div class="day">{}</div>';
    var temp_title      = '<div class="title">{}</div>';
    var temp_photo      = '<a href="{}" target="_blank"><img src="{}" class="photo"></a>';
    var temp_diary      = '<div class="diary">{}</div>';

    var miilDiary = {
        contents: user_contents,
        biggestURL: '',
        biggestFav: 0,
        photoNums: 0,

        // いま表示している年月日(YYYY-MM-DD)
        lastDate: '',

        addPhotoFrame: function (content) {
            var day = content.posted;
            var date = day[0] +'-'+ day[1] +'-'+ day[2];
            day = temp_day.format(date);
            if (this.lastDate === date) {
                day = temp_day.format('');
            }
            this.lastDate = date;
            var title = temp_title.format(content.title);
            var photo = 'photos/'+ content.date + '.jpg';
            photo = temp_photo.format(content.page, photo);
            var diary = temp_diary.format(content.diary);

            // 「食べたい！」数に応じて写真を小さくする
            // 最小値はデフォルトの50%
            var width = WIDTH;
            var v = Math.min(100, this.biggestFav - content.favs);
            var rate = Math.min(0.5, v / 100);
            if (rate !== 0 && rate < 0.5) rate += 0.1;
            width = width * (1 - rate);

            var photoFrame = temp_photoFrame.format(this.photoNums, WIDTH, day, title, width, width, photo, diary);
            $contentsPage.append(photoFrame);

            this.bindEvents('content-' + this.photoNums);
            this.centering('content-' + this.photoNums);

            this.photoNums++;
        },

        setBiggestFavNum: function (flag) {
            var max = 0;
            var max_url = '';
            this.contents.forEach(function (content) {
                var fav = +content.favs;
                if (fav > max) {
                    max = fav;
                    max_url = content.url;
                }
            });
            this.biggestURL = max_url;
            this.biggestFav = max;
            if (flag) {
                $('.toppage').css({backgroundImage: 'url('+ max_url +')'});
            }
        },

        init: function (settings) {
            $('.toptitle').text(settings.title);
        },

        centering: function (elemId) {
            var $elem = $('#' + elemId);
            // .content内の各パーツの高さ
            var height_day        = $elem.find('.day')[0].offsetHeight;
            var height_title      = $elem.find('.title')[0].offsetHeight;
            var height_photoFrame = $elem.find('.photo-frame')[0].offsetHeight;
            var height_diary      = $elem.find('.diary')[0].offsetHeight;
            // windowの高さと、.contentの高さの差（余白）
            var room = window.innerHeight - (height_day + height_title + height_photoFrame + height_diary);
            // 余白の約半分をcontentの上余白にする
            if (room > 0) {
                $elem.css({marginTop: room / 2.6});
            }
        },

        // 表示エリア外の画像は非表示にしておく
        bindEvents: function (elemId) {
            $('#' + elemId).on('inview', function (event, isInView, visiblePartX, visiblePartY) {
                var $photo = $('#' + elemId).find('.photo');
                if (isInView) {
                    if (visiblePartY == 'both' && visiblePartX == 'left'){
                        $photo.fadeIn();
                    }
                    else if (visiblePartY == 'both' && (visiblePartX == 'right' || visiblePartX == 'both')){
                        $photo.fadeIn();
                    }
                } else {
                    $photo.css({display: 'none'});
                }
            });
        }
    };

    miilDiary.setBiggestFavNum(true);

    // コンテンツの最初の要素は設定オブジェクト
    var settings = miilDiary.contents[0];
    miilDiary.contents.shift();

    // 初期化
    miilDiary.init(settings);
    miilDiary.contents.reverse();

    miilDiary.contents.forEach(function (content) {
        miilDiary.addPhotoFrame(content);
    });
});
