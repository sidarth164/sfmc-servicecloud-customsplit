'use strict';

define(function (require) {
	var Postmonger = require('postmonger');
	var connection = new Postmonger.Session();
	var payload = {};
	var toJbPayload = {};
	var steps = [
		{'key': 'eventdefinitionkey', 'label': 'Event Definition Key'}
	];
	var currentStep = steps[0].key;

	$(window).ready(function () {
		connection.trigger('ready');
	});

	
	function initialize (data) {
		if (data) {
			payload = data;
		}
	        var option;
	
        	if (payload) {
	            toJbPayload = payload;
	            console.log('payload',payload);
	            
				//merge the array of objects.
				var aArgs = toJbPayload['arguments'].execute.inArguments;
				var oArgs = {};
				for (var i=0; i<aArgs.length; i++) {  
					for (var key in aArgs[i]) { 
						oArgs[key] = aArgs[i][key]; 
					}
				}
				//oArgs.option will contain a value if this activity has already been configured:
				option = oArgs.option || toJbPayload['configurationArguments'].defaults.option;            
	        }
	
	}

	function onClickedNext () {
		if (currentStep.key === 'eventdefinitionkey') {
			save();
		} else {
			connection.trigger('nextStep');
		}
	}

	function onClickedBack () {
		connection.trigger('prevStep');
	}

	function onGotoStep (step) {
		showStep(step);
		connection.trigger('ready');
	}

	function showStep (step, stepIndex) {
		if (stepIndex && !step) {
			step = steps[stepIndex - 1];
		}

		currentStep = step;

		$('.step').hide();

		switch 	(currentStep.key) {
		case 'eventdefinitionkey':
			$('#step1').show();
			$('#step1 input').focus();
			break;
		}
	}

	function save () {
		var option = $('#option').val();
		console.log(option);
		
		payload['arguments'] = payload['arguments'] || {};
		payload['arguments'].execute = payload['arguments'].execute || {};
		payload['arguments'].execute.inArguments.push({"option": option});

		payload['metaData'] = payload['metaData'] || {};
		payload['metaData'].isConfigured = true;

		console.log(JSON.stringify(payload));

		connection.trigger('updateActivity', payload);
	}

	connection.on('initActivity', initialize);
	connection.on('clickedNext', onClickedNext);
	connection.on('clickedBack', onClickedBack);
	connection.on('gotoStep', onGotoStep);
});
