var fs = require('fs');

var create_diaryjs = {
    save: function (diary_info) {
        arr_str = JSON.stringify(diary_info, null, '    ');
        arr_str = 'var user_contents = ' + arr_str + ';';

        // www/diary.js に出力する
        fs.writeFileSync('www/diary.js', arr_str, 'utf8');
    }
};

module.exports = create_diaryjs;
