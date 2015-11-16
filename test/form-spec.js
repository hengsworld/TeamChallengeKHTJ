'use strict';

describe('Index page form', function(){

	beforeEach(function(){
		browser.get('http://localhost:8000/');
	})

	it('should have an invalid email address', function() {

		var emailBox = element( by.id('email') );
		emailBox.sendKeys('abc');
		expect( emailBox.getAttribute('class') ).toContain('ng-invalid');

		emailBox.clear();
		expect( emailBox.getAttribute('class') ).toContain('ng-invalid');		

	});

	it('should have a valid email address', function() {

		var emailBox = element( by.id('email') );
		emailBox.sendKeys('test.test@gmail.com');
		expect( emailBox.getAttribute('class') ).toContain('ng-valid');

		emailBox.clear();
		emailBox.sendKeys('test.test.123@email.net');
		expect( emailBox.getAttribute('class') ).toContain('ng-valid');

		emailBox.clear();
		emailBox.sendKeys('test@q.gov');
		expect( emailBox.getAttribute('class') ).toContain('ng-valid');
	});

	it('should have an invalid last name', function() {

		var lastName = element( by.id('lastName') );
		lastName.click();
		var firstName = element( by.id('firstName') );
		firstName.click();
		expect( lastName.getAttribute('class') ).toContain('ng-invalid');

		lastName.sendKeys('test');
		lastName.clear();
		expect( lastName.getAttribute('class') ).toContain('ng-invalid');

	});

	it('should have a valid last name', function() {

		var lastName = element( by.id('lastName') );
		lastName.sendKeys('test');
		expect( lastName.getAttribute('class') ).toContain('ng-valid');

		lastName.clear();
		lastName.sendKeys('123');
		expect( lastName.getAttribute('class') ).toContain('ng-valid');

		lastName.clear();
		lastName.sendKeys('TEST');
		expect( lastName.getAttribute('class') ).toContain('ng-valid');

		lastName.clear();
		lastName.sendKeys('test 123 TEST');
		expect( lastName.getAttribute('class') ).toContain('ng-valid');

	});

	// add other tests here

	it('should have two password fields that are valid', function() {

		var pwd1 = element( by.id('pwd1') );
		var pwd2 = element( by.id('pwd2') );
		pwd1.sendKeys('password');
		pwd2.sendKeys('different');
		expect( pwd1.getAttribute('class') ).toContain('ng-invalid');
		expect( pwd2.getAttribute('class') ).toContain('ng-invalid');
		pwd1.clear();
		pwd2.clear();
		expect( pwd1.getAttribute('class') ).toContain('ng-invalid');
		expect( pwd2.getAttribute('class') ).toContain('ng-invalid');

	});

	it('should have two password fields that are valid', function() {

		var pwd1 = element( by.id('pwd1') );
		var pwd2 = element( by.id('pwd2') );
		pwd1.sendKeys('password');
		pwd2.sendKeys('password');
		expect( pwd1.getAttribute('class') ).toContain('ng-valid');
		expect( pwd2.getAttribute('class') ).toContain('ng-valid');

	});

	it('should have the reset button clear all the inputs', function() {

		var reset = element( by.buttonText('Reset') );
		element.all( by.tagName('input') ).then(function(inputs) {
			for (var i = 0; i < inputs.length; i++) {
				inputs[i].sendKeys('test');
			}
			reset.click();
			for (var i = 0; i < inputs.length; i++) {
				expect(inputs[i].getText()).toEqual('');
			}
		})
	});
	//this fill in everything then submit.
	it('should submit after everything been filled in', function(){
		var email = element(by.model('signUpForm'));
		input.sendKeys('hengsworld@awesomemail.com');

		var firstName = element(by.model('firstName'));
		input.sendKeys('legendary');

		var lastName = element(by.model('lastName'));
		input.sendKeys('Awesome');

		var date = element(by.id('numbers'));
		input.sendKeys('10/16/1996');

		var pwd1 = element( by.id('pwd1') );
		var pwd2 = element( by.id('pwd2') );
		pwd1.sendKeys('password');
		pwd2.sendKeys('password');

		var button = element(by.buttonText("submit"));
		button.click();

	});

});