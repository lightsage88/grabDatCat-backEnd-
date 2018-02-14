
exports.DATABASE_URL = process.env.DATABASE_URL || global.DATABASE_URL || 'mongodb://lightsage88:Walruses8@ds119688.mlab.com:19688/grabdatcat';
exports.PORT = process.env.PORT || 8080;
exports.JWT_SECRET = process.env.JWT_SECRET || 'felixTheCat';
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '1d';

//mongodb://<dbuser>:<dbpassword>@ds119688.mlab.com:19688/grabdatcat 
