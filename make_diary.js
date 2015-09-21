var access_miil = require('./src/access_miil');
var check_args  = require('./src/check_args');

var user_name  = check_args.user_name(process.argv);
var start_date = check_args.start_date(process.argv);

console.log(start_date);
// access_miil()
//  -->
//access_miil(user_name);
