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
const id = '5a754c3e151ded2af04a5870';
let superId;

	




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
				username,
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
				expect(res).to.have.status(201);
				expect(res.body).to.be.an('object');
				expect(res.body).to.include.keys(
					'username',
					'firstName',
					'lastName',
					'phoneNumber',
					'emailAddress',
					'mBTI',
					'id',
					'cats'
					);
			})
			.catch((err)=>{
				console.error(err);
				console.log(err);
				if(err instanceof chai.AssertionError) {
					throw err;
				}
			});
		});
	});

	describe('POST-/roundUpCats', ()=>{
		it(`should return the data of a particular user, this was create
			a way to load the cats the user would have selected upon visiting the kennel page`, ()=>{
				return chai.request(app)
				.post('/api/users/roundUpCats')
				.send({'_id':'5a34a7938c232a0b1402a7c5'})
				.then((res)=>{
					console.log(res.body);
					expect(res).to.have.status(202);
					// expect(res.body).to.be.an('object');
					expect(res.body).to.include.keys(
					'username',
					'firstName',
					'lastName',
					'phoneNumber',
					'emailAddress',
					'mBTI',
					'id',
					'cats'
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
				.send({'_id':'5a34a7938c232a0b1402a7c5'})
				.then((res)=>{
					console.log(res.body);
					expect(res).to.have.status(202);
					// expect(res.body).to.be.an('object');
					expect(res.body).to.include.keys(
					'username',
					'firstName',
					'lastName',
					'phoneNumber',
					'emailAddress',
					'mBTI',
					'id',
					'cats'
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

	





});