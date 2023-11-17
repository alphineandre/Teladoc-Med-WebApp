//Data Array
var appointments = new Array();
var j = 0;
appointments[j] = "Alan"; j++;
appointments[j] = "Joe"; j++;
appointments[j] = "Tracy"; j++;
appointments[j] = "Ross"; j++;
appointments[j] = "Mary"; j++;
appointments[j] = "Paul"; j++;
appointments[j] = "Kate"; j++;
appointments[j] = "Thomas"; j++;
appointments[j] = "Mike"; j++;
appointments[j] = "Jose"; j++;
appointments[j] = "Julia"; j++;
appointments[j] = "Martin"; j++;
appointments[j] = "Dafne"; j++;
appointments[j] = "Monica"; j++;
appointments[j] = "Jessica"; j++;
appointments[j] = "Carla"; j++;
appointments[j] = "Peter"; j++;
appointments[j] = "Rachel"; j++;
appointments[j] = "Homer"; j++;
appointments[j] = "Margie"; j++;
appointments[j] = "Lisa"; j++;
appointments[j] = "Claire"; j++;
appointments[j] = "Eddie"; j++;
appointments[j] = "Max"; j++;
appointments[j] = "George"; j++;
appointments[j] = "Meggan"; j++;
appointments[j] = "Bill"; j++;
appointments[j] = "Simon"; j++;
appointments[j] = "Oswald"; j++;
appointments[j] = "Walter"; j++;
appointments[j] = "Felix"; j++;
appointments[j] = "Carlton"; j++;
appointments[j] = "Roy"; j++;
appointments[j] = "Grace"; j++;
appointments[j] = "Wynona"; j++;
appointments[j] = "Burns"; j++;
appointments[j] = "Flanders"; j++;
appointments[j] = "Edna"; j++;
appointments[j] = "Milhouse"; j++;
appointments[j] = "Nelson"; j++;
appointments[j] = "Barney"; j++;
appointments[j] = "Carl"; j++;
appointments[j] = "Brian"; j++;
appointments[j] = "Selma"; j++;
appointments[j] = "Veronica"; j++;
appointments[j] = "Rodney"; j++;
appointments[j] = "Mona"; j++;
appointments[j] = "Norbert"; j++;
appointments[j] = "Philip"; j++;
appointments[j] = "Agnes"; j++;
appointments[j] = "Larry"; j++;
appointments[j] = "Waylon"; j++;
appointments[j] = "Elen"; j++;

//Enviroment vars
var openHour = 8;
var lunchHourStart = 12;
var lunchHourEnd = 13;
var closeHour = 21;
var clientsLimit = 15;
var MaxStartedAppointments = 5;

var workingTime = closeHour - lunchHourEnd + lunchHourStart - openHour;
console.log("working Time: " + workingTime + " hours");

var clientAverageTime = (workingTime/clientsLimit) * 60;
console.log("Client Time Average: " + clientAverageTime + " minutes");

function workingTimeVal(param)
{
	console.log(param.getHours());
	
	if( param.getHours() > closeHour)
	{
		console.log('Closed');
		return param.setHours(openHour,0);
	}
	else if(param.getHours() > lunchHourStart)
	{
		console.log('Lunch Time');
		//return lunchHourEnd;
		return param.setHours(lunchHourEnd,0);
	}
	else
	{
		console.log('No change');
		return param;
	}
}

function updateGraph(param)
{
	var widthBar = parseInt($("counter ."+ param + " value").html()) * 100/clientsLimit;
	//console.log(widthBar+"%");
	$("performance ." + param).html(parseInt($("counter ."+ param + " value").html()));
	$("performance ." + param).css("width", widthBar+"%");
}

function msToTime(duration)
{
	var milliseconds = Math.floor((duration % 1000) / 100),
	seconds = Math.floor((duration / 1000) % 60),
	minutes = Math.floor((duration / (1000 * 60)) % 60),
	hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

	hours = (hours < 10) ? "0" + hours : hours;
	minutes = (minutes < 10) ? "0" + minutes : minutes;
	seconds = (seconds < 10) ? "0" + seconds : seconds;

	return "<hour>" + hours + "</hour>h<min>" + minutes + "</min><sec>" + seconds +"</sec>";
}

function difDateTime(param)
{
	//var d2 = Date.parse(param);
	var d2 = ((param - 1) % clientsLimit) * clientAverageTime * 60 * 1000;
 	//console.log(d2);
	var now = new Date();
	var hour = now.setHours(openHour,0);
	//console.log(hour);
	var d1 = hour - (3 * 60 * 60 * 1000);
	
	var hourAppoitment = new Date(d1+d2);
		
 	return msToTime(hourAppoitment);
}

function plusDateTime(param)
{
	var d2 = Date.parse(param);
 	//console.log(d2);
	var d1 = Date.now() - (0 * 60 * 60 * 1000);
	//console.log(msToTime(d1));
 	return msToTime(d1-d2);
}

function dateTimeNow()
{
	var today = new Date();
	var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
	var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
	var dateTime = date+' '+time;
	
	return dateTime;
}

function updatePos()
{
	//console.log($("line obj").length);

	var $lineItens = $("line obj");
	var indexLine = 0;
	
	for(i=0; i < $lineItens.length; i++)
	{
		//console.log($lineItens.eq(i).find('O_pos').html());
		
		if($lineItens.eq(i).find('O_pos').html())
		{
			indexLine++;
			$lineItens.eq(i).find('O_pos').html(indexLine+'º');
		}
		else
		{
			console.log($("line obj").html());
			indexLine = 0;
		}
	}
	
}

$( document ).ready(function()
{

	/**********
	Function that checks the internet connection
	**********/
	
	function checkconnection() {
		 var status = navigator.onLine;
		 if (status) {
			 $("internetConection off").css('display','none');
			 $("internetConection on").css('display','flex');
			 $("internetConection").delay(1500).slideUp('slow');
		 } else {
			 $("internetConection off").css('display','flex');
			 $("internetConection on").css('display','none');
			 $("internetConection").slideDown('slow');
		 }
	}
	
	setInterval(checkconnection, 1000);
	
	/**********
	Function that updates the forecasts of appointments
	**********/
	
	function countDown()
	{
		var $lineItens = $("line obj O_CD");
		//console.log($lineItens.length);

		for(i=0; i < $lineItens.length; i++)
		{			
			var time = parseInt($lineItens.eq(i).parent().find("O_pos").html());
			
			$lineItens.eq(i).html(difDateTime(time));
		}
	}
	
	setInterval(countDown, 1000);
	
	/**********
	Function that updates the duration of appointments
	**********/
	
	function countUp()
	{
		var $attendItens = $("clientPanel obj timeCounter");
		
		for(i=0; i < $attendItens.length; i++)
		{
			//console.log($attendItens.eq(i).parent().find("startTime").html());
			var time = $attendItens.eq(i).parent().find("startTime").html();
			$attendItens.eq(i).html(plusDateTime(time));
		}
	}
	
	setInterval(countUp, 1000);
	countUp();
	
	
	/**********
	Function to Exclude clients from the line
	and update the Top Counter
	**********/

	$("line").on("click", "obj O_Act button.btnExclude",function()
	{	
		var confirmQuestion = confirm("Do you want to exclude " + $(this).parent().parent().find("O_Name").html() + " from the line?");
		
		var ObjPos = parseInt($(this).parent().parent().find("O_pos").html());
		
		if(confirmQuestion == true)
		{
			
			var newValue = parseInt($("counter .canceled value").html());
			newValue++;
			
			$("counter .canceled value").html(newValue);
			//$("performance status").html(parseInt($("performance status").html()) - 1  + " left");
			updateGraph("canceled");
			
			//atualiza posicoes
			var $lineItens = $("line obj O_CD");
			for(i=0; i < $lineItens.length; i++)
			{
				if(ObjPos < parseInt($lineItens.eq(i).parent().find("O_pos").html()))
				{					
					//console.log(parseInt($lineItens.eq(i).parent().find("O_pos").html()));
					var NovaPos = parseInt($lineItens.eq(i).parent().find("O_pos").html()) - 1;
					$lineItens.eq(i).parent().find("O_pos").html(NovaPos+"º");
				}
			}
			
			$("counter .schedule value").html(parseInt($("counter .schedule value").html()) - 1);
			
			
			$(this).closest('obj').nextAll(".break").each(function()
			{
  				$(this).insertAfter($(this).next('obj'));
			});
			
			//erasing client
			$(this).parent().parent().remove();
			
			updatePos();
			countDown();
		}
	});

	/**********
	Function to start client's attendance
	and update the Top Counter
	**********/

	$("line").on("click", "obj O_Act button.btnStart",function()
	{	
		if($("clientPanel obj").length == MaxStartedAppointments)
		{
			alert('You have reached the maximum number of started appointments. Please, wait until we have a free position or finish one of the started ones.');
			return false;
		}
		
		var confirmQuestion = confirm("Do you want to start " + $(this).parent().parent().find("O_Name").html() + "'s appointment?");
		
		var ObjPos = parseInt($(this).parent().parent().find("O_pos").html());
		
		if(confirmQuestion == true)
		{
			var newClient = "<obj>"
				 					+ "<clientName>" + $(this).parent().parent().find("O_Name").html() + "</clientName>"
									+ "<startTime>" + dateTimeNow() + "</startTime>"
									+ "<timeCounter>00:00</timeCounter>"
									+ "<O_Act><button class=\"btnFinish\"><span class=\"material-icons\">stop</span></button></O_Act>"
									+ "</obj>";
			
			$("clientpanel").append(newClient);
			
			$(this).parent().parent().remove();
			
			var newValue = parseInt($("counter .ok value").html());
			newValue++;
			
			$("counter .ok value").html(newValue);
			
			var newStatus = parseInt($("performance status").html()) - 1;
			//console.log(newStatus);
			newStatus = (newStatus > -1) ? newStatus + " left" : newStatus + " extra";
			//console.log(newStatus);
			
			$("performance status").html(newStatus);
			updateGraph("ok");
			
			//atualiza posicoes
			var $lineItens = $("line obj O_CD");
			for(i=0; i < $lineItens.length; i++)
			{
				if(ObjPos < parseInt($lineItens.eq(i).parent().find("O_pos").html()))
				{					
					//console.log(parseInt($lineItens.eq(i).parent().find("O_pos").html()));
					var NovaPos = parseInt($lineItens.eq(i).parent().find("O_pos").html()) - 1;
					$lineItens.eq(i).parent().find("O_pos").html(NovaPos+"º");
				}
			}
		
			updatePos();
			
			countDown();
			
			$("counter .schedule value").html(parseInt($("counter .schedule value").html()) - 1);
					
		}
	});

	/**********
	Function to Finish client's appointment 
	**********/
	
	$("clientPanel").on("click", "obj O_Act button.btnFinish",function()
	{	
		var confirmQuestion = confirm("Do you want to finish " + $(this).parent().parent().find("clientName").html() + "'s appointment?");
		
		if(confirmQuestion == true)
		{			
			$(this).parent().parent().remove();
			
			//console.log(parseInt($("counter .schedule value").html()) - 1);
			//$("counter .schedule value").html(parseInt($("counter .schedule value").html()) - 1);
		}
	});
	
	/**********
	Function Add NewClient
	**********/
	$("actionLine .add").click(function()
	{
		
		var newClient = prompt("Enter the name of the new customer","Client's Name");
		
		//alert(newClient);
		//newClient = newClient.toString();
		
		if(newClient === "" || newClient === null)
		{
			return false;
		}
		else
		{	
			console.log($("line obj").not(".break").length);

			var index = $("line obj").not(".break").length%clientsLimit + 1;

			var html;		
			html =	"<obj>"
						+ "<O_pos>Nº</O_pos>"
						+ "<O_Name>" + newClient + "</O_Name>"
						+ "<O_CD><hour>00h</hour><min>00</min><sec>00</sec></O_CD>"
					+ "<O_Act><button class=\"btnStart\"><span class=\"material-icons\">play_arrow</span></button><button class=\"btnExclude\"><span class=\"material-icons\">close</span></button></O_Act>"
						+ "</obj>";

			if(index % clientsLimit == 1)
			{
				var data = new Date();
				data.setDate(data.getDate() + parseFloat($("line obj").not(".break").length/clientsLimit));
				console.log(data.toLocaleDateString());

				html = "<obj class=\"break\">"+ data.toLocaleDateString() +"</obj>" + html;
				
				//lineNavigator
				$("lineNavigator").append("<day>"+ data.toLocaleDateString().slice(0, 2) + "<sup>" +  data.toLocaleDateString().slice(2, 5) + "</sup>" +"</day>");
			}			
			
			$("line").append(html);
			updatePos();
			
			$("counter .schedule value").html(parseInt($("counter .schedule value").html()) + 1);
			
			$('html, body').animate({
			scrollTop: $("line obj").last().offset().top 
      	}, 1000);
		}
		
	});
	
	//Start In attendance
	$("clientPanel obj startTime").html(dateTimeNow());
	
	//Start dynamic client list
	$("line").html("");
	
	for(i=0; i < appointments.length; i++)
	{
		var html = '';
		var index = i%clientsLimit + 1;
		
		html =	"<obj>"
					+ "<O_pos>" + index + "º</O_pos>"
					+ "<O_Name>" + appointments[i] + "</O_Name>"
					+ "<O_CD><hour>00h</hour><min>00</min><sec>00</sec></O_CD>"
					+ "<O_Act><button class=\"btnStart\"><span class=\"material-icons\">play_arrow</span></button><button class=\"btnExclude\"><span class=\"material-icons\">close</span></button></O_Act>"
					+ "</obj>";
		
		if(index % clientsLimit == 1)
		{

			var data = new Date();
			data.setDate(data.getDate() + parseFloat(i/clientsLimit));

			html = "<obj class=\"break\">"+ data.toLocaleDateString() +"</obj>" + html;
			
			//lineNavigator
			$("lineNavigator").append("<day>"+ data.toLocaleDateString().slice(0, 2) + "<sup>" +  data.toLocaleDateString().slice(2, 5) + "</sup>" +"</day>");
		}
		
		$("line").append(html);
		
	}
	
	countDown();
	
	/*
	Initial Count
	*/
	$("counter .schedule value").html(appointments.length);
	$("performance status").html(clientsLimit + " left");
	
	/*
	Line Navigator
	*/
	$("lineNavigator top").click(function()
	{		
		$('html, body').animate({
      	scrollTop: $(".global").offset().top
      }, 1000);
	});
	
	$("lineNavigator").on("click", "day",function()
	{	
		var dayIndex = $(this).index()-1;
		
		var headerHeight =  $("header").height();
		
		$('html, body').animate({
			scrollTop: $("line obj.break").eq(dayIndex).offset().top - headerHeight - 20
      	}, 1000);
	});
	
	/*
	Hotkeys
	*/
	$(document).keydown(function(event)
	{
		//Start the first 5 clients in line
		if (event.altKey && event.which === 49)
		{
			$('line .btnStart').eq(0).click();
		}
		if (event.altKey && event.which === 50)
		{
			$('line .btnStart').eq(1).click();
		}
		if (event.altKey && event.which === 51)
		{
			$('line .btnStart').eq(2).click();
		}
		if (event.altKey && event.which === 52)
		{
			$('line .btnStart').eq(3).click();
		}
		if (event.altKey && event.which === 53)
		{
			$('line .btnStart').eq(4).click();
		}
		
	});
	
	/*
	Stick
	*/
	
	$(window).scroll(function() 
	{
	 if ($(this).scrollTop() > 45)
	 {
	  $('header').addClass("sticky");
	 }
	 else
	 {
	  $('header').removeClass("sticky");
	 }

	});

	/*
	Filter
	*/
	
	jQuery.expr[':'].contains = function(a, i, m) {
  		return jQuery(a).text().toUpperCase()
      .indexOf(m[3].toUpperCase()) >= 0;
	};
	
	$("filter #lineFilter").keyup(function()
	{
	 	if($("#lineFilter").val().length > 2)
		{
			$("line obj:not(.break)").hide();
			$( "line obj:contains('"+ $("#lineFilter").val() +"')" ).show();
		
			//console.log($("#lineFilter").val().toUpperCase());
		}
		else
		{
			$("line obj:not(.break)").show();
		}
  	});

	$("actionLine .filter").click(function()
	{
		$("filter").toggle('fast');
		$("line obj:not(.break)").show();
		$("#lineFilter").focus();
		$("#lineFilter").val('');
	});
	
	$("filter .close").click(function()
	{
		$("line obj:not(.break)").show();
		$("filter").hide('fast');
		$("#lineFilter").val('');
	});
	
	
});
