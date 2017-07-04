/* =========== Helper Functions =====================*/

//Creates rows for the card
function populateRow(tbody, nameArray) {
	for (var i=0; i<nameArray.length; i++) {
		var new_row = document.createElement('tr');

		var length = new_row.insertCell(0)
		length.innerHTML = nameArray[i];
		length.className = "name";

		var value = new_row.insertCell(1)
		value.innerHTML = "-";
		value.className = "value";

		tbody.appendChild(new_row);
	}
};
//Creates card based on selected option.
function tableCustomize(data) {
	var old_tbody = document.getElementsByTagName('tbody')[0];
	var new_tbody = document.createElement('tbody');
	var icon = document.querySelector('.measure');
	var currentClass = icon.classList[1];
	if (data == "Area") {
		measurementOption="Area";
		maxRow = 2;
		populateRow(new_tbody,["Length","Width","Area"]);
		//Updates the option icon using ::before
		icon.classList.remove(currentClass);
		icon.classList.add("area");
	}
	else if (data == "Volume") {
		measurementOption="Volume";
		maxRow = 3;
		populateRow(new_tbody,["Length","Width","Depth","Volume"]);
		icon.classList.remove(currentClass);
		icon.classList.add("volume");
	} else {
		measurementOption="Distance";
		maxRow = 0;
		populateRow(new_tbody,["Distance"]);
		icon.classList.remove(currentClass);
		icon.classList.add("distance");
	}
	old_tbody.parentNode.replaceChild(new_tbody, old_tbody);
}

//Calculates the Meaurements
function calculateArea(width,length) {
	return (width*length).toFixed(3);
}
function calculateVolume(width,length,height) {
	return (width*length*height).toFixed(3);
}
function calculateResult() {
	if(measurementOption !== "Distance"){
		var length = parseFloat($tbody.rows[0].cells[1].dataset.value);
		var width = parseFloat($tbody.rows[1].cells[1].dataset.value);
		var height=0;

		if(measurementOption == "Volume") {
			height = parseFloat($tbody.rows[2].cells[1].dataset.value);
			result = calculateVolume(length,width,height);
			$tbody.rows[3].cells[1].textContent = result+unit;
			$tbody.rows[3].cells[1].dataset.value = result;
			} else {
			result = calculateArea(length,width);
			$tbody.rows[2].cells[1].textContent = result+unit;
			$tbody.rows[2].cells[1].dataset.value = result;
		}
	}
}
//Converts measurements
function meterConverter(newUnit) {
	switch(newUnit) {
		case "cm":
  		calc = 100;
  		break;
		case "ft":
  		calc = 3.28;
  		break;
		case "in":
 			calc = 39.37;
 	 		break;
		default:
  		calc = 1;
  }
}
function feetConverter(newUnit) {
	switch(newUnit) {
		case "cm":
  		calc = 30.48;
  		break;
		case "m":
  		calc = 0.3048;
  		break;
		case "in":
 			calc = 12;
 	 		break;
		default:
  		calc = 1;
  }
}function centimeterConverter(newUnit) {
	switch(newUnit) {
		case "m":
  		calc = 0.01;
  		break;
		case "ft":
  		calc = 0.0328;
  		break;
		case "in":
 			calc = 0.3937;
 	 		break;
		default:
  		calc = 1;
  }
}
function inchesConverter(newUnit) {
	switch(newUnit) {
		case "cm":
  		calc = 2.54;
  		break;
		case "m":
  		calc = 0.0254;
  		break;
		case "ft":
 			calc = 0.0833;
 	 		break;
		default:
  		calc = 1;
  }
}
//Resets the Laser Distance
function reset () {
	Nexpaq.API.Module.SendCommand(Nexpaq.Arguments[0], 'TurnOffLaser', []);
	$stop.style.display= "none";
	$startButton.style.display = "block";
	$discard.classList.remove("active");
	$history.classList.remove("active");
	document.getElementsByClassName("result")[0].textContent = "";
	document.getElementById('ios_buttons').classList.add('hidden');
	currentRow = 0;
	setTimeout(function(){
		$label.classList.remove("slideBack");
	},500);
}
//Settings button handler
function settingsHandler () {
	$settings_panel.classList.remove("hidden");
	$general_panel.classList.add("hidden");
	Nexpaq.Header.cleanButtons();
	if(platformIOS) {
		$measureBox.classList.add('hidden');
		Nexpaq.Header.setTitle('Settings');
	}
}

//Handles the received Data
function nativeDataUpdateHandler(data) {
	data = parseFloat(data);
	
	meterConverter(unit);
	
	if (data != lastReceivedData) {
	// this solution doesnt rounds it up
	// lastData = slice(0,(lastData.indexOf("."))+3);

		lastData = (data * calc).toFixed(3);

		document.getElementsByClassName("result")[0].textContent = lastData + unit;
		data = lastReceivedData;
	}
}
function saveToHistoryHandler() {
	var cardTitle = document.getElementById('label_title').value;
	var name = "nexpaq.range";
	var params = {value:result};
	if (cardTitle != "") {
    params.title = cardTitle;
  }
	// nexpaqAPI.util.saveDataset(name,params);

	$label.classList.add("slidein");
	setTimeout(function () {
		document.getElementById("label_title").value = "";
		$label.classList.remove("slidein");
		$label.classList.add("slideBack");
		tableCustomize(measurementOption);
		reset();
	},600);
}
function discardHandler() {
	$label.classList.add("slideout");
	setTimeout(function () {
		document.getElementById("label_title").value = "";
		$label.classList.remove("slideout");
		$label.classList.add("slideBack");
		tableCustomize(measurementOption);
		reset();
	},600);
}
/* =========== ON PAGE LOAD HANDLER ============================*/
//Data Handler
document.addEventListener('NexpaqAPIReady', function(event) {
		Nexpaq.API.Module.addEventListener('DataReceived', function(event) {
		// we don't care about data not related to our module
		if(event.module_uuid != Nexpaq.Arguments[0]) return;
		nativeDataUpdateHandler(event.variables.distance);
	});
})

document.addEventListener("DOMContentLoaded", function(event) {
	Nexpaq.Header.create('Laser Distance');
	platformIOS = document.body.classList.contains('platform-ios');

//Header Customization
	header = {
		backgroundColor: '#313131',
		color: '#D8D8D8',
		iconColor: '#D8D8D8',
		borderBottom: '1px #FFFFFF'
	};
//Header Customization for IOS
	if (platformIOS) {
		header.color = 'white';
		header.iconColor = 'white';
		Nexpaq.Header.setTitle('Distance');
	}

	Nexpaq.Header.customize(header);
	Nexpaq.Header.hideShadow();
	Nexpaq.Header.addButton({image:"img/settings.svg"}, settingsHandler);

//Variables
	unit = "m";
	currentRow = 0;
	maxRow = 0;
	measurementOption = "Distance";
	lastData = -2;
	lastReceivedData = -1;
	result = 0;
	state = "Laser Distance";
	$wrapper = document.getElementById('wrapper');
	$label = document.getElementById('label');
	$measureBox = document.getElementById('measure_box');
	$selectedOption = document.getElementById('selected-option');
	$startButton = document.getElementById('start');
	$stop = document.getElementById('stop');
	$tbody = document.getElementsByTagName('tbody')[0];
	$discard = document.getElementById('discard');
	$history = document.getElementById('history');
	$saveButton = document.getElementById('button-save');
	$overlay = 	document.getElementsByClassName("overlay")[0];
	$general_panel = document.getElementById('general_panel');
	$settings_panel = document.getElementById('settings_panel');


//Handles the pop op menu and closing it
	//Handles if the option is same
	document.getElementsByClassName("overlay")[0].addEventListener('click', function(){
		$measureBox.classList.add("hidden");
		this.classList.remove("active");
		tableCustomize(measurementOption);
		reset();
	});
	//Closes pop up menu after the selection
	var inputOptions = document.querySelectorAll('#measure_box input');
	for (var i=0; i < inputOptions.length; i++) {
		inputOptions[i].addEventListener('click', function(e){
			selected = document.querySelector('input[name="measure_options"]:checked');
			measurementOption = document.querySelector('label[for="' + selected.id +'"]').innerText;
			$selectedOption.innerText = measurementOption;
			tableCustomize(measurementOption);
			reset();
			$overlay.classList.remove("active");
			$measureBox.classList.add("hidden");
			if (platformIOS) {
			$general_panel.classList.remove("hidden");
			Nexpaq.Header.setTitle(measurementOption);
			}
		})
	}

	document.getElementById('measure_panel').addEventListener('click', function() {
		$measureBox.classList.remove("hidden");
		if (platformIOS) {
			document.getElementById('measure_span').classList.add('hidden');
			$general_panel.classList.add('hidden');
			Nexpaq.Header.setTitle('Measure');
		} else {
			$overlay.classList.add("active");
		}
	});

	// Button Handlers
	document.getElementById('button-start').addEventListener('click', function() {
		//nexpaqAPI.LaserDistance.on();
		Nexpaq.API.Module.SendCommand(Nexpaq.Arguments[0], 'StartContinuousMeasurement', []);

		//Adjusts first row
		$tbody = document.getElementsByTagName('tbody')[0];
		var firstRow = $tbody.rows[0].cells[0];
		firstRow.style.color = "#F57C23";

		//Adjusts buttons
		if (platformIOS) {
			$saveButton.textContent = "SAVE"
		} else {
			$saveButton.textContent = "SAVE " + (firstRow.textContent.toUpperCase());
		}
		$saveButton.style.display = "block";
		$startButton.style.display = "none";
		$stop.style.display= "block";

	});

	document.getElementById('button-stop').addEventListener('click', function() {
		reset();
		tableCustomize(measurementOption);
	});

	document.getElementById('button-save').addEventListener('click', function() {
		$discard.classList.add("active");
		if (measurementOption == "Distance") {
			Nexpaq.API.Module.SendCommand(Nexpaq.Arguments[0], 'TurnOffLaser', []);
			$tbody.rows[currentRow].cells[1].dataset.value = lastData;
			$tbody.rows[currentRow].cells[1].textContent= lastData + unit;
			$tbody.rows[currentRow].cells[0].style.color = "#3A3A3A"
		}
		if (measurementOption == "Area" & currentRow < 2) {
			$tbody.rows[currentRow].cells[1].dataset.value = lastData;
			$tbody.rows[currentRow].cells[1].textContent= lastData + unit;
			$tbody.rows[currentRow].cells[0].style.color = "#3A3A3A"
			currentRow++;
		}
		if (measurementOption == "Volume" & currentRow < 3) {
			$tbody.rows[currentRow].cells[1].dataset.value = lastData;
			$tbody.rows[currentRow].cells[1].textContent= lastData + unit;
			$tbody.rows[currentRow].cells[0].style.color = "#3A3A3A"
			currentRow++;
		}

		if (currentRow == maxRow) {
			$saveButton.style.display = "none";
			calculateResult();
			if(platformIOS) {
				document.getElementById('ios_buttons').classList.remove('hidden');
				$stop.style.display = "none";
			} else {
				$history.classList.add("active");
			}
		} else {
			if(!platformIOS) {
			this.textContent = "SAVE " + ($tbody.rows[currentRow].cells[0].textContent).toUpperCase();
			}
			$tbody.rows[currentRow].cells[0].style.color = "#F57C23";
		}
	});

	document.getElementById('discard').addEventListener('click', function() {
		if(this.classList.contains("active")) {
			discardHandler();
		}
	});
		document.getElementById('reset').addEventListener('click', function() {
			discardHandler();
	});

	document.getElementById('history').addEventListener('click', function() {
		if(this.classList.contains("active")) {
			saveToHistoryHandler();
		}
	});
	document.getElementById('history_ios').addEventListener('click', function() {
			saveToHistoryHandler();
	});
	Nexpaq.Header.addEventListener('BackButtonClicked', function() {
		if(!$settings_panel.classList.contains('hidden')) {
			selectedUnit = document.querySelector('input[name="unit_options"]:checked');
			selectedUnitText = document.querySelector('label[for="' + selectedUnit.id +'"]').innerText;
			if (selectedUnitText == "Meters") {
				newUnit = "m";
			}
			if (selectedUnitText == "Feet") {
				newUnit = "ft";
			}
			if (selectedUnitText == "Centimeters") {
				newUnit = "cm";
			}
			if (selectedUnitText == "Inches") {
				newUnit = "in";
			}
	
		//Customizes the current table
			//finds the calc ratio for table customization
			if (newUnit !== unit) {
				if (unit == "m") {
					meterConverter(newUnit);
				}
				if (unit== "in") {
					inchesConverter(newUnit);
				}
				if (unit== "ft") {
					feetConverter(newUnit);
				}
				if (unit == "cm") {
					centimeterConverter(newUnit);
				}
				unit = newUnit;
			
				//customizes the table with new unit
				if ($discard.classList.contains("active")) {
					var table = document.getElementsByTagName('tbody')[0];
					for(var i=0; i<= maxRow; i++) {
						if(table.rows[i].cells[1].hasAttribute("data-value")) {
							var currentValue = table.rows[i].cells[1].dataset.value;
							var calcResult = (parseFloat(currentValue) * calc).toFixed(3);
							table.rows[i].cells[1].dataset.value = calcResult;
							table.rows[i].cells[1].textContent = calcResult + unit;
						}
					}
				}
			}

			// going to previous page
			$settings_panel.classList.add('hidden');
			$general_panel.classList.remove('hidden');
			Nexpaq.Header.addButton({image:"img/settings.svg"}, settingsHandler);
		} else if(!$measureBox.classList.contains('hidden')) {
			$general_panel.classList.remove('hidden');
			$measureBox.classList.add('hidden');
		} else {
			Nexpaq.API.Module.SendCommand(Nexpaq.Arguments[0], 'TurnOffLaser', []);
			Nexpaq.API.Exit();
		}
		if (platformIOS) {
			Nexpaq.Header.setTitle(measurementOption);
		}
	});
});
