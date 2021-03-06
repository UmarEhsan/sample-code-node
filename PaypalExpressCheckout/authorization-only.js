'use strict';

var ApiContracts = require('authorizenet').APIContracts;
var ApiControllers = require('authorizenet').APIControllers;
var utils = require('../utils.js');
var constants = require('../constants.js');

function authorizationOnly(callback) {
	var merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();
	merchantAuthenticationType.setName(constants.apiLoginKey);
	merchantAuthenticationType.setTransactionKey(constants.transactionKey);

	var payPal = new ApiContracts.PayPalType();
	payPal.setCancelUrl('http://www.merchanteCommerceSite.com/Success/TC25262');
	payPal.setSuccessUrl('http://www.merchanteCommerceSite.com/Success/TC25262');

	var paymentType = new ApiContracts.PaymentType();
	paymentType.setPayPal(payPal);

	var transactionRequestType = new ApiContracts.TransactionRequestType();
	transactionRequestType.setTransactionType(ApiContracts.TransactionTypeEnum.AUTHONLYTRANSACTION);
	transactionRequestType.setPayment(paymentType);
	transactionRequestType.setAmount(utils.getRandomAmount());

	var createRequest = new ApiContracts.CreateTransactionRequest();
	createRequest.setMerchantAuthentication(merchantAuthenticationType);
	createRequest.setTransactionRequest(transactionRequestType);

	console.log(JSON.stringify(createRequest.getJSON(), null, 2));
		
	var ctrl = new ApiControllers.CreateTransactionController(createRequest.getJSON());

	ctrl.execute(function(){

		var apiResponse = ctrl.getResponse();

		var response = new ApiContracts.CreateTransactionResponse(apiResponse);

		console.log(JSON.stringify(response, null, 2));

		if(response != null){
			if(response.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK){
				console.log('Transaction ID: ' + response.getTransactionResponse().getTransId());
				console.log('Secure Acceptance URL: ' + response.getTransactionResponse().getSecureAcceptance().getSecureAcceptanceUrl());
			}
			else{
				console.log('Result Code: ' + response.getMessages().getResultCode());
				console.log('Error Code: ' + response.getMessages().getMessage()[0].getCode());
				console.log('Error message: ' + response.getMessages().getMessage()[0].getText());
			}
		}
		else {
			console.log('Null Response.');
		}
		
		callback(response);
	});
}

if (require.main === module) {
	authorizationOnly(function(){
		console.log('authorizationOnly call complete.');
	});
}

module.exports.authorizationOnly = authorizationOnly;