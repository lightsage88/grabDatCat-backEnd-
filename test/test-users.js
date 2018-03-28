const chai = require('chai');
const chaiHttp = require('chai-http');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const should = chai.should;

const {app, runServer, closeServer} = require('../server');

const {User} = require('../users');

const expect = chai.expect;
chai.use(chaiHttp);

describe('/api/users', function() {

const username= 'username'; 
const password='1234567890'; 
const firstName='firstName'; 
const lastName= 'lastName'; 
const phoneNumber='55555555555'; 
const emailAddress= 'go@code.com'; 
const mBTI= 'INFP';
// const _id = '5a754c3e151ded2af04a5870';
const _id = '5a34a7938c232a0b1402a7c5';
let superId;
let cat =  {
            "age": "Baby",
            "breed": "American Shorthair",
            "contactEmail": "dawnvargas05@yahoo.com",
            "contactPhone": "213-840-0153",
            "description": "If you are interested in meeting any one of our cat's or kittens please call: DAWN (213) 840-0153 OR feel free to email us at dawnvargas05@yahoo.com.  \nWe would love for you to come by and hang out in our new cattery until you find the best matched cat for you!  We have many cute kittens AND young cats here at Fur Baby that are ready for their forever homes.  Come find your purrfect meowing match today!",
            "id": "35159904",
            "media": "http://photos.petfinder.com/photos/pets/35157004/1/?bust=1463668448&width=500&-x.jpg",
            "name": "Rascal",
            "sex": "M"
        };

	




	before(function(){
		return runServer();
	});
	after(function(){
		return closeServer();
	});
	beforeEach(function(){

	});
	afterEach(function(){

	});

	describe('GET', function(){
		it('should return all users', ()=> {
			return chai.request(app)
			.get('/api/users')
			.then(res=> {
				console.log(res.body);
				expect(res).to.have.status(200);
				expect(res.body).to.be.an('array');
			});
		});
	});

	describe('DELETE', function(){
		it('should delete a specific user from the database', ()=>{
			return chai.request(app)
			.get('/api/users')
			.then(res=> {
				console.log(res.body[0].id);
				killSwitch = res.body[0].id;
				console.log(killSwitch);
				return chai.request(app)
				.delete('/api/users')
				.send({'_id':'5a3484cdcbe57939348da91e'})
				.then(res=>{
					expect(res).to.have.status(204);
				});
			});
		});
	});

	describe('POST-/', ()=>{
		it('should create a new user', ()=>{
			return chai.request(app)
			.post('/api/users')
			.send({
				username: `TestDummy`+Math.random(),
				password,
				firstName,
				lastName,
				phoneNumber,
				emailAddress,
				mBTI
			})
			.then((res)=>{
				let responseThing = res;
				superId = responseThing.id;
				console.log(res.body);
				expect(res).to.have.status(201);
				expect(res.body).to.be.an('object');
				expect(res.body).to.have.deep.keys(
					'username',
					// 'password',
					// '__v',
					// 'firstName',
					// 'lastName',
					// 'phoneNumber',
					// 'emailAddress',
					// 'mBTI',
					'id',
					'cats'
					);
			})
			// .catch((err)=>{
			// 	console.error(err);
			// 	console.log(err);
			// 	if(err instanceof chai.AssertionError) {
			// 		throw err;
			// 	}
			// });
		});
	});

	describe('POST-/roundUpCats', ()=>{
		it(`should return the data of a particular user, this was create
			a way to load the cats the user would have selected upon visiting the kennel page`, ()=>{
				return chai.request(app)
				.post('/api/users/roundUpCats')
				.send({mLabId:_id})
				.then((res)=>{
					console.log(res.body);
					expect(res).to.have.status(202);
					expect(res.body).to.be.an('object');
					expect(res.body).to.include.keys(
					'firstName',
					'lastName',
					'phoneNumber',
					'emailAddress',
					'mBTI',
					'_id',
					'cats',
					'__v'
					);
				})
				.catch((err)=>{
					console.error(err);
					console.log(err);
					if(err instanceof chai.AssertionError){
						throw err;
					}
				});
			});
	});

	describe('POST-/persist', ()=>{
		it(`should return, yet again, the data of a particular user...this was done to fix a redux issue`, ()=>{
			return chai.request(app)
				.post('/api/users/roundUpCats')
				.send({mLabId:_id})
				.then((res)=>{
					console.log(res.body);
					expect(res).to.have.status(202);
					expect(res.body).to.be.an('object');
					expect(res.body).to.include.keys(
					'firstName',
					'lastName',
					'phoneNumber',
					'emailAddress',
					'mBTI',
					'_id',
					'cats',
					'__v'

					);
				})
				.catch((err)=>{
					console.error(err);
					console.log(err);
					if(err instanceof chai.AssertionError){
						throw err;
					}
				});
			});
		});

	describe('PUT', ()=>{
		it('should update a user',()=>{
			return chai.request(app)
			.put('/api/users')
			.send({_id, firstName, lastName, phoneNumber, emailAddress, mBTI})
			.then((res)=>{
				console.log('put test going...');
				console.log(res.body);
				expect(res).to.have.status(202);
				expect(res.body).to.be.an('object');
				expect(res.body).to.have.deep.keys(
					'__v',
					'_id',
					'cats',
					'emailAddress',
					'firstName',
					'lastName',
					'mBTI',
					'phoneNumber',
					);
			})
			.catch((err)=>{
				console.error(err);
				console.log(err);
				if(err instanceof chai.AssertionError){
					throw err;
				}
			});
		});
	});

	describe('PUT-/addCat', ()=>{
		it('should add a cat to the cat array in the data', ()=>{
			return chai.request(app)
			.put('/api/users/addCat')
			.send({cat, mLabId:_id})
			.then((res)=>{
				console.log('put addCat test going...');
				console.log(cat);
				console.log(res.body);
				expect(res).to.have.status(200);
				expect(res.body).to.be.an('object');
				expect(res.body).to.have.deep.keys(
					'__v',
					'_id',
					'cats',
					'emailAddress',
					'firstName',
					'lastName',
					'mBTI',
					'phoneNumber',
					);
				console.log('I am true crip');
				console.log(res.body);
				expect(res.body.cats).to.not.include(cat);
		
			})
			.catch((err)=>{
				console.error(err);
				console.log(err);
				if(err instanceof chai.AssertionError){
					throw err;
				}
			});

		});
	});

	describe('PUT-/deleteCat', ()=>{
		it('should delete a cat from the cat array in the data', ()=>{
			return chai.request(app)
			.put('/api/users/deleteCat')
			.send({catId:'35159904', mLabId:_id})
			.then((response)=>{
				console.log('put deleteCat test going...');
				// console.log(cat);
				console.log(response.body);
				console.log(response.text);
				console.log('mochocan');
				expect(response).to.have.status(202);
				// expect(res.body).to.be.an('object');
								// expect(response.body).to.not.include.key('__flags');

				expect(response.body).to.have.deep.keys(
					'_id',
					'cats',
					'emailAddress',
					'firstName',
					'lastName',
					'mBTI',
					'phoneNumber',
					'__v'
					);
				expect(response.body.cats).to.not.include(cat);
		
			})
			.catch((err)=>{
				console.error(err);
				console.log(err);
				if(err instanceof chai.AssertionError){
					throw err;
				}
			});

		});
	});


});