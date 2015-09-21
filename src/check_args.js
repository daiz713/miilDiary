var check_args = {
    // 第一引数
    user_name: function (args) {
        var DEFAULT_USER = 'daiz';
        var val = args[2] || DEFAULT_USER;
        return val;
    },

    // 第二引数
    start_date: function (args) {
        var val = args[3] || undefined;
        if (val !== undefined) {
            // 形式がYYYY-MM-DDになっているかどうか
            // なっていないものは無効
            var vals = val.split('-');
            if (vals.length === 3) {
                if (isFinite(+vals[0]) && isFinite(+vals[1]) && isFinite(+vals[2])) {
                    // ok
                }else {
                    vals = undefined;
                }
            }else {
                vals = undefined;
            }
        }
        return vals;
    }
};

module.exports = check_args;
