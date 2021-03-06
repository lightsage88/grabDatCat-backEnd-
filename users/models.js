const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const UserSchema = mongoose.Schema({
	username: {
		type: String,
		require: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	mBTI: {
		type: String,
		default: ''
	},
	cats: Array
});

UserSchema.methods.apiRepr = function () {
	return {
		id: this.id,
		username: this.username || '',
		personalityType: this.personalityType,
		cats: this.cats
	};
};

UserSchema.methods.validatePassword = function(password) {
	return bcrypt.compare(password, this.password);
};

UserSchema.statics.hashPassword = function(password) {
	return bcrypt.hash(password, 10);
};

const User = mongoose.model('User', UserSchema);

module.exports = {User};