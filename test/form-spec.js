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

});