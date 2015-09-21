var access_miil = require('./src/access_miil');
var check_args  = require('./src/check_args');

var user_name  = check_args.user_name(process.argv);
var start_date = check_args.start_date(process.argv);

// access_miil.main()
//  --> call_miil
// <-- main
access_miil.main(user_name, start_date);
