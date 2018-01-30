const express = require('express');
const bodyParser = require('body-parser');
const {User} = require('./models');
const router = express.Router();

const request = require('request');
//do I have this installed from NPM?

const jsonParser = bodyParser.json();
const bcrypt = require('bcryptjs');

//post to register a new user
router.post('/', jsonParser, (req, res)=>{
	const requiredFields = ['username', 'password'];
	const missingField = requiredFields.find(field => !(field in req.body));

	if(missingField) {
		return res.status(422).json({
			code: 422,
			reason: 'ValidationError',
			message: 'The great kitten lords say there is a missing field! HISS',
			location: missingField
		});
	}

	const stringFields = ['username', 'password', 'firstName', 'lastName', 'gender', 'personalityType'];
	//going back to possible having a gender datatype issue...string or not?
	const nonStringField = stringFields.find(
		field => field in req.body && typeof req.body[field] !== 'string'
		);

	if (nonStringField) {
		return res.status(422).json({
			code: 422,
			reason: 'ValidationError',
			message: 'Ooo, Hooman, we kittehs expected a string',
			location: nonStringField
		});
	}

	const explicityTrimmedFields = ['username', 'password'];
	const nonTrimmedField = explicityTrimmedFields.find(
		field => req.body[field].trim() !== req.body[field]
		);
	if (nonTrimmedField) {
		return res.status(422).json({
			code: 422,
			reason: 'ValidationError',
			message: 'Ooo, silly hooman, these parts cannot start or end with a whitespace, hooman',
			location: nonTrimmedField
		});
	}

	const sizedFields = {
		username: {
			min: 1
		},
		password: {
			min: 10,
			max: 72
		}
	};

	const tooSmallField = Object.keys(sizedFields).find(
		field => 'min' in sizedFields[field] && req.body[field].trim().length < sizedFields[field].min
	);
	const tooLargeField = Object.keys(sizedFields).find(
		field => 'max' in sizedFields[field] && req.body[field].trim().length > sizedFields[field].max
	);

	if(tooSmallField || tooLargeField) {
		return res.status(422).json({
			code: 422,
			reason: 'ValidationError',
			message: tooSmallField ? `Ish too shmol! Must be ${sizedFields[tooSmallField].min} characters long!!`
			: `Itz TOO BIIiiiiG!1!! Must be at most ${sizedFields[tooLargeField]} characters long!`,
			location: tooSmallField || tooLargeField
		});
	}

	let {username, password, firstName, lastName, personalityType, gender} = req.body;

	return User.find({username})
		.count()
		.then(function(count){
			if( count > 0 ) {
				return Promise.reject({
					code: 422,
					reason: 'ValidationError',
					message: 'Oooh, hooman, somepershon already has dat username!',
					location: 'username'
				});
			}

			return User.hashPassword(password);
		})
		.then(function(hash){
			console.log(hash);
			return User.create({
				username,
				password: hash,
				firstName,
				lastName,
				personalityType,
				gender
			});
		})
		.then(function(user){
			return res.status(201).json(user.apiRepr());
		})
		.catch(function(err){
			if(err.reason === 'ValidationError'){
				return res.status(err.code).json(err);
			}

			res.status(500).json({
				code: 500,
				message: 'OOo, hooman, we kittehs have messed something up on our end, it is a statistical improbability, so you should feel honored, hooman'
			});
		});
});

router.get('/', function(req, res){
	return User.find()
	.then(function(users){
		let set = [];
		for(let i=0; i<=users.length-1; i++) {
			set.push(users[i].apiRepr());
		}
		return res.status(200).json(set);
	})
	.catch(function(err){
		return res.status(500).json({message: 'Internal Server Error, hooman'});
	});
});

router.delete('/', jsonParser, (req, res)=> {
	let {id} = req.body;
	return User.findOne({'_id': id})
	.then((user)=>{
		let killSwitch = id;
		console.log(user);
		return User.deleteOne({'_id': killSwitch})
			.then(()=>{
				console.log(`account id ${killSwitch} has been batted away, hooman`);
				return res.status(204).json({message: 'Account Shunned'});
			})
		.catch((err)=>{
			console.log(err);
			console.error(err);
			return res.status(500).json({message: `Internal Server Issue`});
		});
	})

});

module.exports = {router};
//may need an update thing...must to see later. derp 9:38am 1/30/2018