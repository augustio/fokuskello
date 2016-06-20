var jpMin = 1, jpMax = 60;
var tpMin = 1, tpMax = 30;
var defTTime = 25; //Default task duration in minutes
var defPTime = 5; //Default pause duration in minutes
var tTime = defTTime * 60; //Time to complete a single task
var pTime = defPTime * 60; //Pause duration between tasks
var tTimeLeft = 0; //Time left for a single task to be completed
var pTimeLeft = 0; //Time left for a single pause to end
var toDoTasks = 0; //Total number of todo tasks
var numTGOne = 8; //Number of task tabs on first row
var numTGTwo = 8; //Number of task tabs on second row
var doneTasks = 0; //Number of completed tasks
var selectedTasks = 0 //Number of completed tasks + number of toDo tasks
var maxNumTasks = numTGOne + numTGTwo; //Maximum number of tasks to be selected
var tI;
var pI;
var taskStarted = false;
var timerOn = false;
var alarmSet = true;
var intervalType = 0; //Set taskInterval = 0, set pause Interval = 1
var alarmSoundFilePath = "audio/alarm_sound.wav";
var audioElement = document.createElement('audio');
	
audioElement.setAttribute('src', alarmSoundFilePath);
displayTime(tTime, 0);
displayTime(pTime, 1);
$("#jp-slider-max").text(jpMax);
$("#tp-slider-max").text(tpMax);
$("#jp-slider-min").text(jpMin);
$("#tp-slider-min").text(tpMin);
$("#num-sel-task").text(0);

$("#jp-slider").slider({
	max: jpMax,
	min: jpMin,
	value:defTTime,
	slide: function(event, ui){
		if(!taskStarted){
			tTime = ui.value * 60;
			displayTime(tTime, 0);
		}
	}
});
$("#tp-slider").slider({
	max: tpMax,
	min: tpMin,
	value:defPTime,
	slide: function(event, ui){
		if(!taskStarted){
			pTime = ui.value * 60;
			displayTime(pTime, 1);
		}	
	}
});

$(document).ready(function(){
	$("#pause").hide();
	$("#mute").hide();
	$("#dec").on('click', function(){
		var num = Number($("#sel-task").text());
		if(selectedTasks > doneTasks && !taskStarted){
			setTaskStatus(selectedTasks, 0);
			selectedTasks--;
			toDoTasks--;
			$("#sel-task").text(toDoTasks);
		}
	});

	$("#inc").on('click', function(){
		if(selectedTasks < maxNumTasks && !taskStarted){
			selectedTasks++;
			toDoTasks++;
			setTaskStatus(selectedTasks, 1);
			$("#sel-task").text(toDoTasks);
		}
	});

	$("#play-pause").on('click', function(){
		if(toDoTasks > 0){
			if(!timerOn){
				timerOn = true;
				if(!taskStarted){
					taskStarted = true;
					tTimeLeft = tTime;
				}
				$("#pause").show();
				$("#play").hide();
				if(intervalType == 0){
					rotateClock(tTimeLeft);
					tI = setInterval("taskInterval()",1000);
				}else{
					pI = setInterval("pauseInterval()", 1000);
				}
			}else{
				timerOn = false;
				resetClock();
				if(intervalType == 0){
					clearInterval(tI);
				}else{
					clearInterval(pI);
				}
				$("#pause").hide();
				$("#play").show();
			}
		}	
	});

	$("#alarm").on('click', function(){
		if(alarmSet){
			alarmSet = false;
			$("#sound").hide();
			$("#mute").show();
		}else{
			alarmSet = true;
			$("#mute").hide();
			$("#sound").show();
		}
	});

	$("#reset").on('click', function(){
		document.location.reload(true);
	});
});

function displayTime(t, type){
	if(t >= 0){
		var minutes = Math.floor(t/60);
		var seconds = t % 60;
		var minStr = minutes;
		var secStr = seconds;
		if(minutes < 10){
			minStr = "0" + minutes;
		}
		if(seconds < 10){
			secStr = "0" + seconds;
		}
		if(type == 0){
			$("#time-display").text(minStr + " : " + secStr);
		}else{
			$("#pause-time-display").text(minStr + ":" + secStr);
		}
	}
}

function taskInterval(){
	if(tTimeLeft > 0){
		tTimeLeft--;
		if(tTimeLeft == 0){
			if(alarmSet){
				audioElement.play();
			}
			resetClock();
			doneTasks++;
			$("#sel-task").text(toDoTasks-1);
			setTaskStatus(doneTasks, 2)
		}
		displayTime(tTimeLeft, 0);
	}else{
		if(toDoTasks > 1){
			intervalType = 1;
			toDoTasks--;
			clearInterval(tI);
			pTimeLeft = pTime;
			displayTime(--pTimeLeft, 1);
			pI = setInterval("pauseInterval()", 1000);
		}else{
			toDoTasks = 0;
			clearInterval(tI);
			taskStarted = false;
			timerOn = false;
			displayTime(tTime, 0);
			$("#pause").hide();
			$("#play").show();
		}
	}
}

function pauseInterval(){
	if(pTimeLeft > 0){
		pTimeLeft--;
		displayTime(pTimeLeft, 1);
	}else{
		intervalType = 0;
		clearInterval(pI);
		tTimeLeft = tTime;
		displayTime(--tTimeLeft, 0);
		rotateClock(tTimeLeft);
		tI = setInterval("taskInterval()", 1000);
	}
}

function rotateClock(t){
	var path = document.querySelector('#rotating-clock');
	path.style.transition = path.style.WebkitTransition =
	  'none';
	path.style.transition = path.style.WebkitTransition =
	  'background-color ' + (t) + 's linear';
	path.style.backgroundColor = 'transparent';
}

function resetClock(){
	var path = document.querySelector('#rotating-clock');
	path.style.transition = path.style.WebkitTransition =
	  'none';
	path.style.backgroundColor = '#003C78';
}

function setTaskStatus(num, status){
	switch(status){
		case 0:
			if(num <= numTGOne)
				$(".tg-one:nth-child("+num+")").css("background-color", "#7F7F7F");
			else{
				var taskNum = num - numTGOne;
				$(".tg-two:nth-child("+taskNum+")").css("background-color", "#7F7F7F");
			}
			break;
		case 1:
			if(num <= numTGOne)
				$(".tg-one:nth-child("+num+")").css("background-color", "#E9ECB3");
			else{
				var taskNum = num - numTGOne;
				$(".tg-two:nth-child("+taskNum+")").css("background-color", "#E9ECB3");
			}
			break;
		case 2:
			if(num <= numTGOne)
				$(".tg-one:nth-child("+num+")").css("background-color", "#B4BE00");
			else{
				var taskNum = num - numTGOne;
				$(".tg-two:nth-child("+taskNum+")").css("background-color", "#B4BE00");
			}
			break;
	}
}
