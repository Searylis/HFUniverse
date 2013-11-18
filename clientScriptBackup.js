var xmlDoc;
var user, pass;
var waldemarium, helgen, frankur, michaelum, jirkan, thomasium;
var sendingShip = false;
var sendingShipID;
var totalCargo;
var baseGeneralID;

function getXML() {
	xmlhttp = new XMLHttpRequest();
	xmlhttp.open("GET", "http://webuser.hs-furtwangen.de/~mendels/HFUniverse/getXML.php?user="+user+"&password="+pass, false);
	xmlhttp.send();
	xmlDoc = xmlhttp.responseXML;
	//alert(xmlDoc);
}

function getResources(base)
{
	var ourBase = base;
	var resources = ourBase.getElementsByTagName("resources");
	var ourRes = resources[0];
	waldemarium = ourRes.attributes.waldemarium.value;
	helgen = ourRes.attributes.helgen.value;
	frankur = ourRes.attributes.frankur.value;
	michaelum = ourRes.attributes.michaelum.value;
	jirkan = ourRes.attributes.jirkan.value;
	thomasium = ourRes.attributes.thomasium.value;
}

function getInfo()
{
	$.getJSON("getSession.php", function(data){
		user = data.user;
		pass = data.password;
		getXML();
	});
}

function fillHTML(page, shipToSend, base_id)
{
	if(typeof(shipToSend)==='undefined') shipToSend = -1;
	if(typeof(base_id)==='undefined') base_id = -1;
	sendingShip = false;
	$.getJSON("getSession.php", function(data){
		user = data.user;
		pass = data.password;
		getXML();
		
		var bases = xmlDoc.getElementsByTagName("bases");
		var own = bases[0].getElementsByTagName("own");
		var base = own[0].getElementsByTagName("base");

		getResources(base[0]);
		
		var submenu = document.getElementById('submenu');
		var resourceInner = '<br> <table> <tr> <td> Resourcen: </td> <td>';
		resourceInner += waldemarium + ' W</td> <td>';
		resourceInner += helgen + ' H</td> <td>';
		resourceInner += frankur + ' F</td> <td>';
		resourceInner += michaelum + ' M</td> <td>';
		resourceInner += jirkan + ' J</td> <td>';
		resourceInner += thomasium + ' T</td> </tr> </table>';
		submenu.innerHTML = resourceInner;
		var mainContent = document.getElementById('content');
		
		switch(page)
		{
			case "Main":
				var inner = '<div class="subtitle"> Welcome back, ' + user + '!</div>';
				inner += '<div class="text"> <div id="contents"> <table> <tr> <th width="30" class="shipcenterHeader"> Deine Basis </th> <th width="30" class="shipcenterHeader"> Planet </th> <th width="30" class="shipcenterHeader"> Sonne </th> <th width="30" class="shipcenterHeader"> HP </th> <th width="30" class="shipcenterHeader"> Status </th> </tr>';
				
				for(var i=0; i < base.length; i++)
				{
					var _base = base[i];
					var idBase = _base.attributes.id.value;
					var idPlanet = _base.attributes.planet_id.value;
					var idSun = _base.attributes.sun_id.value;
					var hp = _base.attributes.hp.value;
					var stat = _base.attributes.building.value;
					
					inner += '<tr> <td class="shipcenterHeader">' + idBase + '</td> <td class="shipcenterHeader">' + idPlanet + '</td> <td class="shipcenterHeader">' + idSun + '</td> <td class="shipcenterHeader">' + hp + '</td> <td class="shipcenterHeader">' + stat + '</td> </tr>';		
				}
				
				inner += '</table> </div> </div>';
				mainContent.innerHTML = inner; 
				
				$("#helpText").html("Hier befindest du dich auf der Startseite des Spiels!<br>Du kannst eine Auflistung deiner Basen sehen und die momentanen Ressourcen deiner Anfangsbasis.<br>Du kannst von hier aus zum Schiffcenter, oder der Universumsansicht navigieren.<br>");
				
				break;
			
			case "Shipcenter":
				var inner = '<div class="subtitle"> Deine Schiffe </div>';
				inner += '<div class="text"> <div id="contents">';
				var ships = xmlDoc.getElementsByTagName("ships");
				var childShips = ships[0].childNodes;
				var check = checkChildren(childShips);
				if(check)
				{
					var ownShips = ships[0].getElementsByTagName("own");
					var ship = ownShips[0].getElementsByTagName("ship");
					inner += '<fieldset style="border: none;" id="shipCenter"><table> <tr> <th width="100" class="shipcenterHeader"> Schiff ID </th><th width="100" class="shipcenterHeader">Typ</th><th class="shipcenterHeader" width="100">Sonne</th><th width="100" class="shipcenterHeader">Planet</th><th width="100" class="shipcenterHeader">HP</th><th width="100" class="shipcenterHeader">Aktivität</th><th width="100" class="shipcenterHeader">Auswahl</th></tr>';
					for(var i=0; i < ship.length; i++)
					{
						var _ship = ship[i];
						var idShip = _ship.attributes.id.value;
						var typ = _ship.attributes.shiptype.value;
						var idSun = _ship.attributes.sun_id.value;
						var idPlanet = _ship.attributes.planet_id.value;
						var hp = _ship.attributes.hp.value;
						var activity = _ship.attributes.activity.value;
						
						inner += '<tr> <td class="shipcenterHeader">' + idShip + '</td> <td class="shipcenterHeader">' + typ + '</td> <td class="shipcenterHeader">' + idSun + '</td> <td class="shipcenterHeader">' + idPlanet + '</td> <td class="shipcenterHeader">' + hp + '</td> <td class="shipcenterHeader">';
						
						var act;
						
						switch(activity)
						{
							case '0':
								act = "Idle";
								break;
							case '1':
								act = "Impulsantrieb";
								break;
							case '2':
								act = "Warp";
								break;
							case '3':
								act = "Abbauen";
								break;
							default:
								break;
						}
						
						inner += act +'</td>';
						inner += '<td class="shipcenterHeader"><input type="radio" name="shipCenter" title="Schiff auswahl" id="idShip_' + idShip + '"/></td></tr>';
					}
					inner += '</table></fieldset>';
				}
				else
				{
					inner += "Du hast keine Schiffe :(";
				}
				
				inner += '<br> <br>  <!-- Ich bin ein "aheuaheuaheuaheuaheu" 2 mal :D -->';
				inner += '<table width="100%" style="background-color: rgba(0,0,0,0);"><tr><td align="center"><button class="Button" id="newShipBuild" style="width: 150px;" onclick="fillHTML(\'Schiffsbau\')"> Neues Schiff bauen </button></td>';
				inner += '<td align="center"><button class="Button" id="sendShip" style="width: 150px;" onclick="selectShipsToSend()"> Schiff schicken</button></td></tr>';
				inner += '<tr><td align="center"><button class="Button" id="mineShip" style="width: 150px;" onclick="selectShipsToMine()"> Ressourcen abbauen</button></td>'; 
				inner += '<td align="center"><button class="Button" id="recycleShip" style="width: 150px;" onclick="recycleShip()"> Schiff recyceln </button></td></tr>';
				inner += '<tr><td align="center"><button class="Button" id="retrieveShip" style="width: 150px;" onclick="selectShipsToRetrieve()"> Ressourcen abladen </button></td></tr></table>';
				inner += '</div> </div>';

				mainContent.innerHTML = inner; 
				
				$("#helpText").html("Du befindest dich nun im Schiffcenter. Hier kannst du den momentanen Status deiner Schiffe sehen, sie verwalten und Aktionen ausführen.<br>Um Aktionen auszuführen, muss zuerst ein Schiff ausgewählt werden. - Außer beim Schiffsbau.<br>");
				
				break;
			
			case "Schiffsbau":	
				var inner = '<div class="subtitle"> Neues Schiff bauen </div>';
				inner += '<div class="text"> <div id="contents">';				
				
				inner += '<form action="schiffsbau.php" method="post" id="schiffsbauForm"> <select name="shiptypes" id="shipSel"></select>';
				inner += '<br><br>';
				inner += '<input type="hidden" name="basis_id" value="';
				inner += base[0].attributes.id.value;
				inner += '" />';
				inner += '<b>Vorhandene Ressourcen:</b>';
				inner += '<br>';
				inner += '<span id="AvRes"> </span>';
				inner += '<br><br>';
				inner += '<b>Benötigte Ressourcen:</b>';
				inner += '<br>';
				inner += '<span id="NedRes"> <input class=\"resourceInput\" name=\"avHelg\" readonly=\"readonly\" value=\"-\" /> W, <input class=\"resourceInput\" name=\"avHelg\" readonly=\"readonly\" value=\"-\" /> H, <input class=\"resourceInput\" name=\"avHelg\" readonly=\"readonly\" value=\"-\" /> F, <input class=\"resourceInput\" name=\"avHelg\" readonly=\"readonly\" value=\"-\" /> M, <input class=\"resourceInput\" name=\"avHelg\" readonly=\"readonly\" value=\"-\" /> J, <input class=\"resourceInput\" name=\"avHelg\" readonly=\"readonly\" value=\"-\" /> T </span>';
				inner += '<br><br>';
				
				inner += '<b>Eigenschaften:</b><br><br>';
				inner += '<table>';
				inner += '<tr><td width="120">Schiffstyp</td><td width="50"><input class="resourceInput" name="typPHP" id="typPHP" readonly="readonly" value="-"></input></td></tr>';
				inner += '<tr><td width="120">Impuls-Geschw.</td><td width="50" id="impuls_v">-</td></tr>';
				inner += '<tr><td width="120">Warp-Geschw.</td><td width="50" id="warp_v">-</td></tr>';
				inner += '<tr><td width="120">Kapazität</td><td width="50" id="cargo">-</td></tr>';
				inner += '<tr><td width="120">Stärke</td><td width="50" id="strength">-</td></tr>';
				inner += '<tr><td width="120">Abbau-Geschw.</td><td width="50" id="mining_v">-</td></tr>';
				inner += '<tr><td width="120">Max. HP</td><td width="50" id="max_hp">-</td></tr>';
				inner += '<tr><td width="120">Schild</td><td width="50" id="shield">-</td></tr>';
				inner += '<tr><td width="120">Impuls-Verbrauch</td><td width="50" id="impuls_con">-</td></tr>';
				inner += '<tr><td width="120">Warp-Verbrauch</td><td width="50" id="warp_con">-</td></tr>';
				inner += '</table>';
				
				inner += '<br>';
				inner += '<input class="Button" type="submit" value="Schiff Bauen"/> </form>';
				inner += '</div> </div>';
				mainContent.innerHTML = inner; 
				
				var ships = xmlDoc.getElementsByTagName("shiptype");
				fillOptions(ships);
				fillAvResources(base[0]);
				
				document.getElementById("schiffsbauForm").addEventListener("change",needed,false);
				
				$("#helpText").html("Um ein neues Schiff zu bauen, musst du zuerst den gewünschten Schiffstyp auswählen.<br>Die unterschiedlichen Schiffe haben unterschiedliche Eigenschaften, die dir in der Tabelle angezeigt werden.<br><br>Auch wirst du erfahren, ob du in deiner Basis genügend Ressourcen hast, um das gewünschte Schiff bauen zu können.<br>");
				
				break;
			
			case "Universe":
				var inner = '<div class="subtitle"> Universum </div>';
				inner += '<div class="text"> <div id="contents">';
				
				inner += '<select name="Sonnen" id="sunSel"> </select>';
				inner += '<select name="Planeten" id="planSel"><option value="please" selected="selected">Planeten wählen</option></select>';
				inner += '<br> <br>  <!-- Ich bin ein "aheuaheuaheuaheuaheu" 2 mal :D -->';
							
				inner += '<table width="100%">';
				inner += '<tr><th width="120">Planeten ID</th><td width="50" id="p_ID">-</td></tr>';
				inner += '<tr><th width="120">x-Koordinaten</th><td width="50" id="xCoord">-</td></tr>';
				inner += '<tr><th width="120">y-Koordinaten</th><td width="50" id="yCoord">-</td></tr>';
				inner += '<tr><th width="120">z-Koordinaten</th><td width="50" id="zCoord">-</td></tr>';
				inner += '<tr><th width="120">Bebaubar</th><td width="50" id="bebaubar">-</td></tr>';
				inner += '<tr><th width="120">Waldemarium</th><td width="50" id="wald">-</td></tr>';
				inner += '<tr><th width="120">Helgen</th><td width="50" id="helg">-</td></tr>';
				inner += '<tr><th width="120">Frankur</th><td width="50" id="fran">-</td></tr>';
				inner += '<tr><th width="120">Michaelum</th><td width="50" id="mich">-</td></tr>';
				inner += '<tr><th width="120">Jirkan</th><td width="50" id="jirk">-</td></tr>';
				inner += '<tr><th width="120">Thomasium</th><td width="50" id="thom">-</td></tr>';
				inner += '</table>';
				
				inner += '</div> </div>';
				mainContent.innerHTML = inner;
				
				var suns = xmlDoc.getElementsByTagName("suns");
				var sunList = suns[0].getElementsByTagName("sun");
				fillOptionsSonne(sunList);
				
				document.getElementById("sunSel").addEventListener("change", sunChange, false);
				
				$("#helpText").html("Hier kannst du dir Informationen zu ausgewählten Sonnen und Planeten anzeigen lassen.<br><br>Du kannst zu Sonnen gehörige Planeten nur sehen, wenn sich eines deiner Schiffe in diesem Sonnensystem befindet.<br>");
				
				break;
				
			case 'Schiffsenden':
				sendingShip = true;
				sendingShipID = shipToSend;
				var shipInfo = getShipById(sendingShipID);
				var inner = '<div class="subtitle"> Schiff verschicken </div>';
				inner += '<div class="text"> <div id="contents">';
				
				inner += '<select name="Sonnen" id="sunSel"> </select>';
				inner += '<select name="Planeten" id="planSel"><option value="please" selected="selected">Planeten wählen</option></select>';
				inner += '<br> <br>  <!-- Ich bin ein "aheuaheuaheuaheuaheu" 2 mal :D -->';
				
				inner += '<table><tr><th class="shipcenterHeader">Waldemarium</th><th class="shipcenterHeader">Helgen</th><th class="shipcenterHeader">Frankur</th><th class="shipcenterHeader">Michaelum</th><th class="shipcenterHeader">Jirkan</th><th class="shipcenterHeader">Thomasium</th></tr>';
				
				var shipResources = shipInfo.getElementsByTagName("resources")[0];
				
				inner += '<tr><td id="shipWald" align="center">'+shipResources.attributes.waldemarium.value+'</td>';
				inner += '<td id="shipHelg" align="center">'+shipResources.attributes.helgen.value+'</td>';
				inner += '<td id="shipFran" align="center">'+shipResources.attributes.frankur.value+'</td>';
				inner += '<td id="shipMich" align="center">'+shipResources.attributes.michaelum.value+'</td>';
				inner += '<td id="shipJirk" align="center">'+shipResources.attributes.jirkan.value+'</td>';
				inner += '<td id="shipThom" align="center">'+shipResources.attributes.thomasium.value+'</td></tr></table>';
				inner += '<br>';
				
				inner += '<span>Momentane Location <input class="resourceInput" readonly="readonly" value="-"/> Planet <input class="resourceInput" readonly="readonly" id="planetNum"  value="'+shipInfo.attributes.planet_id.value+'"/>, Sonne <input class="resourceInput" readonly="readonly" id="sonneNum"  value="'+shipInfo.attributes.sun_id.value+'"/></span>';
				
				inner += '<br> <br>  <!-- Ich bin ein "aheuaheuaheuaheuaheu" 2 mal :D -->';
				inner += '<table>';
				inner += '<tr><td width="120">Planeten ID</td><td width="50" id="p_ID">-</td></tr>';
				inner += '<tr><td width="120">x-Koordinaten</td><td width="50" id="xCoord">-</td></tr>';
				inner += '<tr><td width="120">y-Koordinaten</td><td width="50" id="yCoord">-</td></tr>';
				inner += '<tr><td width="120">z-Koordinaten</td><td width="50" id="zCoord">-</td></tr>';
				inner += '<tr><td width="120">Bebaubar</td><td width="50" id="bebaubar">-</td></tr>';
				inner += '<tr><td width="120">Waldemarium</td><td width="50" id="wald">-</td></tr>';
				inner += '<tr><td width="120">Helgen</td><td width="50" id="helg">-</td></tr>';
				inner += '<tr><td width="120">Frankur</td><td width="50" id="fran">-</td></tr>';
				inner += '<tr><td width="120">Michaelum</td><td width="50" id="mich">-</td></tr>';
				inner += '<tr><td width="120">Jirkan</td><td width="50" id="jirk">-</td></tr>';
				inner += '<tr><td width="120">Thomasium</td><td width="50" id="thom">-</td></tr>';
				inner += '</table>';
				
				inner += '<span><input class="resourceInput" name="fuelWald" id="fuelWald" value="-" readonly="readonly"/> Waldemarium benötigt</span>';
				inner += '<br>';
				inner += '<button class="Button" id="travelShip" style="width: 150px;" onclick="travelShip('+shipToSend+')"> Schiff senden </button>';
				
				inner += '</div> </div>';
				mainContent.innerHTML = inner;
				
				var suns = xmlDoc.getElementsByTagName("suns");
				var sunList = suns[0].getElementsByTagName("sun");
				fillOptionsSonne(sunList);
				
				document.getElementById("sunSel").addEventListener("change", sunChange, false);
		
				$("#helpText").html("In diesem Menü kannst du dein Schiff zu anderen Planeten oder Sonnen fliegen lassen.<br>Dein momentaner Standort wird dir angezeigt. Du kannst nun in dem Dropdown-Menü eine Sonne und einen dazugehörigen Planeten auswählen.<br><br>Vergiss hierbei nicht, dass du um zu einer anderen Sonne reisen zu können, zuerst zum Mittelpunkt deiner jetzigen Sonne reisen musst. Das ist der Planet des jeweiligen Sonnensystems, dessen Koordinaten alle im Ursprung liegen.<br><br>Um zu reisen, wird Waldemarium verbraucht. Wie viel deine Reise kosten wird und ob du genug hast, wird dir angezeigt werden.");
				
				break;
				
			case 'Abbauen':
				sendingShip = true;
				sendingShipID = shipToSend;
				var shipInfo = getShipById(sendingShipID);
				var shiptypeInfo = getShiptypeInfo(shipInfo.attributes.shiptype.value);
				totalCargo = shiptypeInfo.attributes.cargo.value;
				
				var inner = '<div class="subtitle"> Ressourcen abbauen </div>';
				inner += '<div class="text"> <div id="contents">';
				inner += '<span>Schifftyp <input class="resourceInput" readonly="readonly" value="'+shipInfo.attributes.shiptype.value+'"/> <input class="resourceInput" readonly="readonly" value="-"/> Ladekapazität <input class="resourceInput" readonly="readonly" id="shipInitialCargo"  value="'+totalCargo+'"/></span><br>';
				
				inner += '<table><tr><th class="shipcenterHeader">Waldemarium</th><th class="shipcenterHeader">Helgen</th><th class="shipcenterHeader">Frankur</th><th class="shipcenterHeader">Michaelum</th><th class="shipcenterHeader">Jirkan</th><th class="shipcenterHeader">Thomasium</th></tr>';
				
				var shipResources = shipInfo.getElementsByTagName("resources")[0];
				
				inner += '<tr><td id="shipWald" align="center">'+shipResources.attributes.waldemarium.value+'</td>';
				inner += '<td id="shipHelg" align="center">'+shipResources.attributes.helgen.value+'</td>';
				inner += '<td id="shipFran" align="center">'+shipResources.attributes.frankur.value+'</td>';
				inner += '<td id="shipMich" align="center">'+shipResources.attributes.michaelum.value+'</td>';
				inner += '<td id="shipJirk" align="center">'+shipResources.attributes.jirkan.value+'</td>';
				inner += '<td id="shipThom" align="center">'+shipResources.attributes.thomasium.value+'</td></tr></table>';
				inner += '<br>';
				inner += '<span>Momentane Location <input class="resourceInput" readonly="readonly" value="-"/> Planet <input class="resourceInput" readonly="readonly" id="planetNum"  value="'+shipInfo.attributes.planet_id.value+'"/>, Sonne <input class="resourceInput" readonly="readonly" id="sonneNum"  value="'+shipInfo.attributes.sun_id.value+'"/></span>';
				
				var planetToMine = getPlanetById(shipInfo.attributes.planet_id.value, shipInfo.attributes.sun_id.value);
				var shipInitialCargo = parseInt(shipResources.attributes.waldemarium.value)+parseInt(shipResources.attributes.helgen.value)+parseInt(shipResources.attributes.frankur.value)+parseInt(shipResources.attributes.michaelum.value)+parseInt(shipResources.attributes.jirkan.value)+parseInt(shipResources.attributes.thomasium.value);
				
				inner += '<br> <br>  <!-- Ich bin ein "aheuaheuaheuaheuaheu" 2 mal :D -->';				
				inner += '<table width="100%">';
				inner += '<tr><td width="120">Planeten ID</td><td width="50" id="p_ID">'+planetToMine.attributes.id.value+'</td><td># Waldemarium</td><td width="50"><input type="text" class="resourceBox" id="waldBox" maxlength="4" value="0" style="width: 45px;"></input></td></tr>';
				inner += '<tr><td width="120">x-Koordinaten</td><td width="50" id="xCoord">'+planetToMine.attributes.x.value+'</td><td># Helgen</td><td width="50"><input type="text" id="helgBox" class="resourceBox" value="0" maxlength="4" style="width: 45px;"></input></tr>';
				inner += '<tr><td width="120">y-Koordinaten</td><td width="50" id="yCoord">'+planetToMine.attributes.y.value+'</td><td># Frankur</td><td width="50"><input type="text" id="franBox" class="resourceBox" value="0" maxlength="4" style="width: 45px;"></input></tr>';
				inner += '<tr><td width="120">z-Koordinaten</td><td width="50" id="zCoord">'+planetToMine.attributes.z.value+'</td><td># Michaelum</td><td width="50"><input type="text" id="michBox" class="resourceBox" value="0" maxlength="4" style="width: 45px;"></input></tr>';
				
				var buildable;
				if(planetToMine.attributes.buildable.value == 1) buildable = "Ja";
				else buildable = "Nein";
				
				inner += '<tr><td width="120">Bebaubar</td><td width="50" id="bebaubar">'+buildable+'</td><td># Jirkan</td><td width="50"><input id="jirkBox" type="text" value="0" class="resourceBox" maxlength="4" style="width: 45px;"></input></tr>';
				
				var planetResources = planetToMine.getElementsByTagName("resources")[0];
				
				inner += '<tr><td width="120">Waldemarium</td><td width="50" id="waldPlanet">'+planetResources.attributes.waldemarium.value+'</td><td># Thomasium</td><td width="50"><input id="thomBox" value="0" type="text" class="resourceBox" maxlength="4" style="width: 45px;"></input></tr>';
				inner += '<tr><td width="120">Helgen</td><td width="50" id="helgPlanet">'+planetResources.attributes.helgen.value+'</td></tr>';
				inner += '<tr><td width="120">Frankur</td><td width="50" id="franPlanet">'+planetResources.attributes.frankur.value+'</td></tr>';
				inner += '<tr><td width="120">Michaelum</td><td width="50" id="michPlanet">'+planetResources.attributes.michaelum.value+'</td></tr>';
				inner += '<tr><td width="120">Jirkan</td><td width="50" id="jirkPlanet">'+planetResources.attributes.jirkan.value+'</td></tr>';
				inner += '<tr><td width="120">Thomasium</td><td width="50" id="thomPlanet">'+planetResources.attributes.thomasium.value+'</td></tr>';
				inner += '</table>';
				
				inner += '<br>';
				
				inner += '<span><input class="resourceInput" name="fuelWald" id="totalCargo" value="'+shipInitialCargo+'" readonly="readonly"/> verbrauchte Ladekapazität</span>';
				
				if(shipInfo.attributes.planet_id.value == base[0].attributes.planet_id.value)
				{
					inner += '<br><br>';
					inner += '<span>Basis Abbauen </span><input type="checkbox" id="baseAbbauenCheck" />'
				}
				
				inner += '<br><br>';
				inner += '<button class="Button" id="travelShip" style="width: 150px;" onclick="mineShip('+shipToSend+','+totalCargo+','+base[0].attributes.id.value+')"> Ressourcen abbauen </button>';
				
				inner += '</div> </div>';
				mainContent.innerHTML = inner;

				$('#waldBox').keyup(function () { abbauenChange(); });
				$('#helgBox').keyup(function () { abbauenChange(); });
				$('#franBox').keyup(function () { abbauenChange(); });
				$('#michBox').keyup(function () { abbauenChange(); });
				$('#jirkBox').keyup(function () { abbauenChange(); });
				$('#thomBox').keyup(function () { abbauenChange(); });
				
				$("#helpText").html("Hier kannst du mit deinem ausgewählten Schiff Ressourcen von dem Planeten abbauen, in dessen Orbit sich dein Schiff gerade befindet.<br>Dazu musst du die gewünschte Anzahl an Ressourcen in die Eingabefelder eingeben.<br>Vergiss dabei nicht, dass dein Schiff nur eine bestimmte Ladekapazität hat. - das Spiel wird dich aber daran erinnern, falls du ihn überschreitest, oder versuchst mehr Ressourcen abzubauen, als er Planet eigentlich hat.<br>");
				
				break;

			case 'Abladen':
				baseGeneralID = base_id;
				sendingShip = true;
				sendingShipID = shipToSend;
				var shipInfo = getShipById(sendingShipID);
				var shiptypeInfo = getShiptypeInfo(shipInfo.attributes.shiptype.value);
				totalCargo = shiptypeInfo.attributes.cargo.value;
				
				var inner = '<div class="subtitle"> Ressourcen abladen </div>';
				inner += '<div class="text"> <div id="contents">';
				
				var shipResources = shipInfo.getElementsByTagName("resources")[0];
								
				var planetToMine = getPlanetById(shipInfo.attributes.planet_id.value, shipInfo.attributes.sun_id.value);
				var shipInitialCargo = parseInt(shipResources.attributes.waldemarium.value)+parseInt(shipResources.attributes.helgen.value)+parseInt(shipResources.attributes.frankur.value)+parseInt(shipResources.attributes.michaelum.value)+parseInt(shipResources.attributes.jirkan.value)+parseInt(shipResources.attributes.thomasium.value);
				
				inner += '<br> <br>  <!-- Ich bin ein "aheuaheuaheuaheuaheu" 2 mal :D -->';				
				inner += '<table width="100%">';
				inner += '<tr><td width="120">Waldemarium</td><td width="50" id="shipWald">'+shipResources.attributes.waldemarium.value+'</td><td># Waldemarium</td><td width="50"><input type="text" class="resourceBox" id="waldBox" maxlength="4" value="0" style="width: 45px;"></input></td></tr>';
				inner += '<tr><td width="120">Helgen</td><td width="50" id="shipHelg">'+shipResources.attributes.helgen.value+'</td><td># Helgen</td><td width="50"><input type="text" id="helgBox" class="resourceBox" value="0" maxlength="4" style="width: 45px;"></input></tr>';
				inner += '<tr><td width="120">Frankur</td><td width="50" id="shipFran">'+shipResources.attributes.frankur.value+'</td><td># Frankur</td><td width="50"><input type="text" id="franBox" class="resourceBox" value="0" maxlength="4" style="width: 45px;"></input></tr>';
				inner += '<tr><td width="120">Michaelum</td><td width="50" id="shipMich">'+shipResources.attributes.michaelum.value+'</td><td># Michaelum</td><td width="50"><input type="text" id="michBox" class="resourceBox" value="0" maxlength="4" style="width: 45px;"></input></tr>';			
				inner += '<tr><td width="120">Jirkan</td><td width="50" id="shipJirk">'+shipResources.attributes.jirkan.value+'</td><td># Jirkan</td><td width="50"><input id="jirkBox" type="text" value="0" class="resourceBox" maxlength="4" style="width: 45px;"></input></tr>';		
				inner += '<tr><td width="120">Thomasium</td><td width="50" id="shipThom">'+shipResources.attributes.thomasium.value+'</td><td># Thomasium</td><td width="50"><input id="thomBox" value="0" type="text" class="resourceBox" maxlength="4" style="width: 45px;"></input></tr>';
				inner += '</table>';
				
				inner += '<br>';
				
				inner += '<br><br>';
				inner += '<button class="Button" id="travelShip" style="width: 150px;" onclick="retrieveShip('+shipToSend+', '+baseGeneralID+')"> Ressourcen abladen </button>';
				
				inner += '</div> </div>';
				mainContent.innerHTML = inner;

				$('#waldBox').keyup(function () { abladenChange(); });
				$('#helgBox').keyup(function () { abladenChange(); });
				$('#franBox').keyup(function () { abladenChange(); });
				$('#michBox').keyup(function () { abladenChange(); });
				$('#jirkBox').keyup(function () { abladenChange(); });
				$('#thomBox').keyup(function () { abladenChange(); });
				
				$("#helpText").html("Wenn du dich mit dem ausgewählten Schiff an der Basis befindest, kannst du hiermit Ressourcen, die dein Schiff trägt, auf die Basis abladen.<br>");
				
				break;
				
			default:
				break;
		}
	});
}

function checkChildren(child)
{
	for(var i = 0; i < child.length; i++)
		if(child[i].tagName == "own") return true;
	
	return false;
}

function fillOptions(ships)
{
	var code = '<option value="please" selected="selected">Bitte wählen</option>';
	
	for(var i=0; i < ships.length; i++)
	{
		var ship = ships[i];
		
		code += '<option value="shiptype_';
		var idShip = ship.attributes.id.value;
		code += idShip;
		code += '">Schiff Typ ';
		code += idShip;
		code += "<\/option>";
	}
	
	document.getElementById("shipSel").innerHTML = code;
}

function fillOptionsSonne(suns)
{
	var code = '<option value="please" selected="selected">Sonne wählen</option>';

	for(var i = 0; i < suns.length; i++)
	{
		var sun = suns[i];
		
		code += '<option value="sonne_';
		var idSun = sun.attributes.id.value;
		code += idSun;
		code += '">Sonne ';
		code += idSun;
		code += "<\/option>";
	}
	
	document.getElementById("sunSel").innerHTML = code;
}

function fillAvResources(base)
{
	var code = "<input class=\"resourceInput\" name=\"avWald\" readonly=\"readonly\" value=\"" + waldemarium  + "\" />" + " W, ";
	code += "<input class=\"resourceInput\" name=\"avHelg\" readonly=\"readonly\" value=\"" + helgen  + "\" />" + " H, ";
	code += "<input class=\"resourceInput\" name=\"avFran\" readonly=\"readonly\" value=\"" + frankur  + "\" />" + " F, ";
	code += "<input class=\"resourceInput\" name=\"avMich\" readonly=\"readonly\" value=\"" + michaelum  + "\" />" + " M, ";
	code += "<input class=\"resourceInput\" name=\"avJirk\" readonly=\"readonly\" value=\"" + jirkan  + "\" />" + " J, ";
	code += "<input class=\"resourceInput\" name=\"avThom\" readonly=\"readonly\" value=\"" + thomasium  + "\" />" + " T ";
	
	document.getElementById("AvRes").innerHTML = code;
}

function needed()
{
	var selectedOption = document.querySelectorAll("option");
	var id;
	for(var i = 0; i < selectedOption.length; i++)
	{
		var option = selectedOption[i];
		if(option.selected)
		{
			var val = option.attributes.value.value;
			var id = val.charAt(val.indexOf('_')+1);
		}
	}
	
	fillNeededResources(id);
}

function sunChange()
{
	var selectedOption = document.querySelectorAll("option");
	var id;
	for(var i = 0; i < selectedOption.length; i++)
	{
		var option = selectedOption[i];
		if(option.selected && checkIfSun(option.attributes.value.value))
		{
			var val = option.attributes.value.value;
			var id = val.substring(val.indexOf('_')+1);
			break;
		}
	}

	fillPlanetOptions(id);
	
	if(sendingShip)
	{
		fillWaldemarium(sendingShipID);
	}
}

function planetChange()
{
	var selectedOption = document.querySelectorAll("option");
	var id;
	for(var i = 0; i < selectedOption.length; i++)
	{
		var option = selectedOption[i];
		if(option.selected && checkIfPlanet(option.attributes.value.value))
		{
			var val = option.attributes.value.value;
			var id = val.substring(val.indexOf('_')+1);
			break;
		}
	}

	fillPlanetInfo(id);
	
	if(sendingShip)
	{
		fillWaldemarium(sendingShipID);
	}
}

function fillPlanetInfo(planetID)
{
	var sun = xmlDoc.getElementsByTagName("suns");
	var planets = sun[0].getElementsByTagName("planet");
	var selectedPlanet;
	for(var i = 0; i < planets.length; i++)
	{
		var _planet = planets[i];
		var idPlanet = _planet.attributes.id.value;
		var toCompare = planetID + "";
		
		if(idPlanet == toCompare)
		{
			selectedPlanet = _planet;
			break;
		}
	}

	var xCoord = selectedPlanet.attributes.x.value;
	var yCoord = selectedPlanet.attributes.y.value;
	var zCoord = selectedPlanet.attributes.z.value;
	var bebaubar = selectedPlanet.attributes.buildable.value;
	
	var resourcesPlanet = selectedPlanet.getElementsByTagName("resources")[0];
	var wald = resourcesPlanet.attributes.waldemarium.value;
	var helg = resourcesPlanet.attributes.helgen.value;
	var fran = resourcesPlanet.attributes.frankur.value;
	var mich = resourcesPlanet.attributes.michaelum.value;
	var jirk = resourcesPlanet.attributes.jirkan.value;
	var thom = resourcesPlanet.attributes.thomasium.value;
	
	document.getElementById("p_ID").innerHTML = planetID;
	document.getElementById("xCoord").innerHTML = xCoord;
	document.getElementById("yCoord").innerHTML = yCoord;
	document.getElementById("zCoord").innerHTML = zCoord;
	document.getElementById("bebaubar").innerHTML = bebaubar;
	document.getElementById("wald").innerHTML = wald;
	document.getElementById("helg").innerHTML = helg;
	document.getElementById("fran").innerHTML = fran;
	document.getElementById("mich").innerHTML = mich;
	document.getElementById("jirk").innerHTML = jirk;
	document.getElementById("thom").innerHTML = thom;
	
}

function fillPlanetOptions(sunID)
{
	var code = '<option value="please" selected="selected">Planeten wählen</option>';

	var sun = xmlDoc.getElementsByTagName("suns");
	var suns = sun[0].getElementsByTagName("sun");
	var selectedSun;
	for(var i = 0; i < suns.length; i++)
	{
		var _sun = suns[i];
		var idSun = _sun.attributes.id.value;
		var toCompare = sunID + "";
		
		if(idSun == toCompare)
		{
			selectedSun = _sun;
			break;
		}
	}
	
	var planets = selectedSun.getElementsByTagName("planet");
	
	for(var i = 0; i < planets.length; i++)
	{
		var planet = planets[i];
		
		code += '<option value="planet_';
		var idPlanet = planet.attributes.id.value;
		code += idPlanet;
		code += '">Planet ';
		code += idPlanet;
		code += "<\/option>";
	}
	
	document.getElementById("planSel").innerHTML = code;
	document.getElementById("planSel").addEventListener("change", planetChange, false);
}

function checkIfSun(text)
{
	var subtext = text.substring(0,6);
	if(subtext == "sonne_") return true;
	
	return false;
}

function checkIfPlanet(text)
{
	var subtext = text.substring(0,7);
	if(subtext == "planet_") return true;
	
	return false;
}

function fillNeededResources(number)
{
	var types = xmlDoc.getElementsByTagName("types");
	var shiptypes = types[0].getElementsByTagName("shiptypes");
	var shiptype = shiptypes[0].getElementsByTagName("shiptype");
	
	var pos = -1;
	
	for(var i=0; i < shiptype.length; i++)
	{
			var _ship = shiptype[i];
			var idShip = _ship.attributes.id.value;
			var toCompare = number + "";
			
			if(idShip == toCompare)
			{
					pos = i;
					break;
			}
	
	
	}
	
	var ourShip = shiptype[pos];
	var resources = ourShip.getElementsByTagName("resources");
	var ourRes = resources[0];
	
	var code = "";
	var neededWaldemarium = ourRes.attributes.waldemarium.value;
	var neededHelgen = ourRes.attributes.helgen.value;
	var neededFrankur = ourRes.attributes.frankur.value;
	var neededMichaelum = ourRes.attributes.michaelum.value;
	var neededJirkan = ourRes.attributes.jirkan.value;
	var neededThomasium = ourRes.attributes.thomasium.value;
	

	if((neededWaldemarium - waldemarium) > 0)
	{
			code += '<input class="resourceInput" name="nedWald" readonly="readonly" value="' + neededWaldemarium + '" style="color: #ff0000;" />' + ' W, ';
			waldemariumCheck = false;
	}
	else
	{
			code += '<input class="resourceInput" name="nedWald" readonly="readonly" value="' + neededWaldemarium + '"/>' + ' W, ';
			waldemariumCheck = true;
	}
	
	if((neededHelgen - helgen) > 0) 
	{ 
	code += '<input class="resourceInput" name="nedHelg" readonly="readonly" value="' + neededHelgen + '" style="color: #ff0000;" />' + ' H, ';
			helgenCheck = false;
	}
	else
	{
code += '<input class="resourceInput" name="nedHelg" readonly="readonly" value="' + neededHelgen+ '" />' + ' H, ';
	helgenCheck = true;
	}
	
	if((neededFrankur - frankur) > 0) 
	{
	code += '<input class="resourceInput" name="nedFrank" readonly="readonly" value="' + neededFrankur + '" style="color: #ff0000;" />' + ' F, ';
	frankurCheck = false;
	}
	else
	{ 
	code += '<input class="resourceInput" name="nedFrank" readonly="readonly" value="' + neededFrankur + '" />' + ' F, ';
	frankurCheck = true;
	}
	
	if((neededMichaelum - michaelum) > 0) 
	{
	code += '<input class="resourceInput" name="nedMich"         readonly="readonly" value="' + neededMichaelum + '" style="color: #ff0000;" />' + ' M, ';
			michaelumCheck = false;
	}
	else
	{
	code += '<input class="resourceInput" name="nedMich" readonly="readonly" value="' + neededMichaelum+ '" />' + ' M, ';
	michaelumCheck = true;
	}
	
	if((neededJirkan - jirkan) > 0) 
	{
	code += '<input class="resourceInput" name="nedJirk" readonly="readonly" value="' + neededJirkan + '" style="color: #ff0000;" />' + ' J, ';
	jirkanCheck = false;
	}
	else
	{ 
	code += '<input class="resourceInput" name="nedJirk" readonly="readonly" value="' + neededJirkan + '" />' + ' J, ';
	jirkanCheck = true;
	}
	
	if((neededThomasium - thomasium) > 0) 
	{
	code += '<input class="resourceInput" name="nedThom" readonly="readonly" value="' + neededThomasium + '" style="color: #ff0000;" />' + ' T, ';
			thomasiumCheck = false;
	}
	else
	{ 
	code += '<input class="resourceInput" name="nedThom" readonly="readonly" value="' + neededThomasium + '"/>' + ' T, ';
	thomasiumCheck = true;
	}
	
	document.getElementById("NedRes").innerHTML = code;
	
	var impulsV = ourShip.attributes.impuls_v.value;
	var warpV = ourShip.attributes.warp_v.value;
	var cargo = ourShip.attributes.cargo.value;
	var strength = ourShip.attributes.strength.value;
	var miningV = ourShip.attributes.mining_v.value;
	var maxHP = ourShip.attributes.max_hp.value;
	var shield = ourShip.attributes.shield.value;
	var impulsCon = ourShip.attributes.impuls_con.value;
	var warpCon = ourShip.attributes.warp_con.value;
	
	var typ = document.getElementById("typPHP");
	typ.setAttribute("value", number);
	
	document.getElementById("impuls_v").innerHTML = impulsV;
	document.getElementById("warp_v").innerHTML = warpV;
	document.getElementById("cargo").innerHTML = cargo;
	document.getElementById("strength").innerHTML = strength;
	document.getElementById("mining_v").innerHTML = miningV;
	document.getElementById("max_hp").innerHTML = maxHP;
	document.getElementById("shield").innerHTML = shield;
	document.getElementById("impuls_con").innerHTML = impulsCon;
	document.getElementById("warp_con").innerHTML = warpCon;
}

function recycleShip()
{
	var ships = xmlDoc.getElementsByTagName("ships");
	var ownShips = ships[0].getElementsByTagName("own");
	var ship = ownShips[0].getElementsByTagName("ship");
	var selected = new Array();
	var pos = 0;
	for(var i = 0; i < ship.length; i++)
	{
		var docElem = document.getElementById('idShip_'+ship[i].attributes.id.value);
		if(docElem.checked)
		{
			selected[pos] = ship[i].attributes.id.value;
			pos++;
		}
	}
	
	for(var i = 0; i < selected.length; i++)
	{
		$.post("recycle.php", { 'id': selected[i] } );
	}
	
	location.reload(true);
}

function selectShipsToSend()
{
	var ships = xmlDoc.getElementsByTagName("ships");
	var ownShips = ships[0].getElementsByTagName("own");
	var ship = ownShips[0].getElementsByTagName("ship");
	var shiptoTravelID = -1;
	for(var i = 0; i < ship.length; i++)
	{
		var docElem = document.getElementById('idShip_'+ship[i].attributes.id.value);
		if(docElem.checked)
		{
			shiptoTravelID = ship[i].attributes.id.value;
			break;
		}
	}

	if(shiptoTravelID == -1)
	{
		alert("Du musst ein Schiff auswählen!");
		fillHTML("Shipcenter");
	}
	else fillHTML("Schiffsenden", shiptoTravelID);
}

function selectShipsToMine()
{
	var ships = xmlDoc.getElementsByTagName("ships");
	var ownShips = ships[0].getElementsByTagName("own");
	var ship = ownShips[0].getElementsByTagName("ship");
	var shiptoTravelID = -1;
	for(var i = 0; i < ship.length; i++)
	{
		var docElem = document.getElementById('idShip_'+ship[i].attributes.id.value);
		if(docElem.checked)
		{
			shiptoTravelID = ship[i].attributes.id.value;
			break;
		}
	}
	
	if(shiptoTravelID == -1)
	{
		alert("Du musst ein Schiff auswählen!");
		fillHTML("Shipcenter");
	}
	else fillHTML("Abbauen", shiptoTravelID);
}

function selectShipsToRetrieve()
{
	var ships = xmlDoc.getElementsByTagName("ships");
	var ownShips = ships[0].getElementsByTagName("own");
	var ship = ownShips[0].getElementsByTagName("ship");
	var shiptoTravelID = -1;
	var currentPlanet;
	for(var i = 0; i < ship.length; i++)
	{
		var docElem = document.getElementById('idShip_'+ship[i].attributes.id.value);
		if(docElem.checked)
		{
			shiptoTravelID = ship[i].attributes.id.value;
			currentPlanet = ship[i].attributes.planet_id.value;
			break;
		}
	}
	
	var bases = xmlDoc.getElementsByTagName("bases");
	var ownBases = bases[0].getElementsByTagName("own");
	var basePlanetID = ownBases[0].getElementsByTagName("base")[0].attributes.planet_id.value;
	var baseID = ownBases[0].getElementsByTagName("base")[0].attributes.id.value;
	
	if(shiptoTravelID == -1)
	{
		alert("Du musst ein Schiff auswählen!");
		fillHTML("Shipcenter");
	}
	else if(currentPlanet != basePlanetID)
	{
		alert("Deine Schiff muss sich an der Base befinden, um Ressourcen abzuladen!!");
		fillHTML("Shipcenter");		
	}
	else fillHTML("Abladen", shiptoTravelID, baseID);
}

function travelShip(shipID)
{
	var ships = xmlDoc.getElementsByTagName("ships");
	var ownShips = ships[0].getElementsByTagName("own");
	var ship = ownShips[0].getElementsByTagName("ship");
	var shiptoTravel;
	for(var i = 0; i < ship.length; i++)
	{
		var _ship = ship[i];
		if(_ship.attributes.id.value == shipID)
		{
			shiptoTravel = _ship;
			break;
		}
	}
	
	var currentSun = shiptoTravel.attributes.sun_id.value;
	var currentPlanet = shiptoTravel.attributes.planet_id.value;
	
	var newPlanet, newSun;
	var selectedOption = document.querySelectorAll("option");
	for(var i = 0; i < selectedOption.length; i++)
	{
		var option = selectedOption[i];
		if(option.selected)
		{
			if(checkIfPlanet(option.attributes.value.value))
			{
				var val = option.attributes.value.value;
				var newPlanet = val.substring(val.indexOf('_')+1);
			}
			if(checkIfSun(option.attributes.value.value))
			{
				var val = option.attributes.value.value;
				var newSun = val.substring(val.indexOf('_')+1);
			}
		}
	}
	

	if($("#fuelWald").css("color") == 'rgb(255, 0, 0)')
	{
		alert("Nicht genugend Ressourcen.");
		return;
	}
	
	if(currentSun != newSun)
	{
		var currentPlanetElem = getPlanetById(currentPlanet, currentSun);

		if(currentPlanetElem.attributes.x.value != "0" && currentPlanetElem.attributes.y.value != "0" && currentPlanetElem.attributes.y.value != "0")
		{
			alert("Schiff befindet sich nicht zentral!");
			return;
		}
		
		$.post("sun_schicken.php", { 'id': shipID, 'sunID': newSun } );
		alert("Schiff wurde zur Sonne " + newSun + " geschickt!");
		fillHTML("Shipcenter");
		return;
	}
	
	if(currentPlanet != newPlanet)
	{
		$.post("planet_schicken.php", { 'id': shipID, 'planetID': newPlanet } );
		alert("Schiff wurde zum Planet " + newPlanet + " geschickt!");
		fillHTML("Shipcenter");
		return;
	}
	
	
}

function mineShip(shipID, maxCargo, baseID)
{
	
	var toMine = parseInt(document.getElementById("totalCargo").value);
	
	var shipWald = parseInt(document.getElementById("waldBox").value);
	var shipHelg = parseInt(document.getElementById("helgBox").value);
	var shipFran = parseInt(document.getElementById("franBox").value);
	var shipMich = parseInt(document.getElementById("michBox").value);
	var shipJirk = parseInt(document.getElementById("jirkBox").value);
	var shipThom = parseInt(document.getElementById("thomBox").value);
	
	var waldPlanet = parseInt(document.getElementById("waldPlanet").innerHTML);
	var helgPlanet = parseInt(document.getElementById("helgPlanet").innerHTML);
	var franPlanet = parseInt(document.getElementById("franPlanet").innerHTML);
	var michPlanet = parseInt(document.getElementById("michPlanet").innerHTML);
	var jirkPlanet = parseInt(document.getElementById("jirkPlanet").innerHTML);
	var thomPlanet = parseInt(document.getElementById("thomPlanet").innerHTML);
	
	var checkbox = document.getElementById("baseAbbauenCheck");
	var base = getBase();
	var baseResources = base.getElementsByTagName("resources")[0];
	
	var waldBase = parseInt(baseResources.attributes.waldemarium.value);
	var helgBase = parseInt(baseResources.attributes.helgen.value);
	var franBase = parseInt(baseResources.attributes.frankur.value);
	var michBase = parseInt(baseResources.attributes.michaelum.value);
	var jirkBase = parseInt(baseResources.attributes.jirkan.value);
	var thomBase = parseInt(baseResources.attributes.thomasium.value);
	
	if(!checkbox.checked)
	{
		if(toMine > maxCargo || shipWald > waldPlanet ||  shipHelg > helgPlanet || shipFran > franPlanet || shipMich > michPlanet || shipJirk > jirkPlanet || shipThom > thomPlanet)
		{
			alert('Schiff überladen oder Planet hat nicht genügend Ressourcen! Versuch es noch einmal.');
			return;
		}
	}
	else
	{
		if(toMine > maxCargo || shipWald > waldBase ||  shipHelg > helgBase || shipFran > franBase || shipMich > michBase || shipJirk > jirkBase || shipThom > thomBase)
		{
			alert('Schiff überladen oder Planet hat nicht genügend Ressourcen! Versuch es noch einmal.');
			return;
		}		
	}
	
	if(checkbox.checked)
		$.post("abbauenBase.php", { 'id': shipID, 'baseID': baseID, 'waldemarium': shipWald, 'helgen': shipHelg, 'frankur': shipFran, 'michaelum': shipMich, 'thomasium': shipThom, 'jirkan': shipJirk} );
	else
		$.post("abbauen.php", { 'id': shipID, 'waldemarium': shipWald, 'helgen': shipHelg, 'frankur': shipFran, 'michaelum': shipMich, 'thomasium': shipThom, 'jirkan': shipJirk} );
	
	alert('Ressourcen werden abgebaut!');
	
	fillHTML("Shipcenter");
}

function retrieveShip(shipID, baseID)
{
	
	var shipWald = parseInt(document.getElementById("waldBox").value);
	var shipHelg = parseInt(document.getElementById("helgBox").value);
	var shipFran = parseInt(document.getElementById("franBox").value);
	var shipMich = parseInt(document.getElementById("michBox").value);
	var shipJirk = parseInt(document.getElementById("jirkBox").value);
	var shipThom = parseInt(document.getElementById("thomBox").value);
	
	var inWald = parseInt(document.getElementById("shipWald").innerHTML);
	var inHelg = parseInt(document.getElementById("shipHelg").innerHTML);
	var inFran = parseInt(document.getElementById("shipFran").innerHTML);
	var inMich = parseInt(document.getElementById("shipMich").innerHTML);
	var inJirk = parseInt(document.getElementById("shipJirk").innerHTML);
	var inThom = parseInt(document.getElementById("shipThom").innerHTML);
	
	if(shipWald > inWald ||  shipHelg > inHelg || shipFran > inFran || shipMich > inMich || shipJirk > inJirk || shipThom > inThom)
	{
		alert('Zu viele Ressourcen ausgewählt! Versuch es noch einmal.');
		return;
	}
	
	$.post("abladen.php", { 'id': shipID, 'baseID': baseID, 'waldemarium': shipWald, 'helgen': shipHelg, 'frankur': shipFran, 'michaelum': shipMich, 'thomasium': shipThom, 'jirkan': shipJirk} );
	
	alert('Ressourcen werden abladen!');
	
	fillHTML("Shipcenter");
}

function fillWaldemarium(shipID)
{
	var ships = xmlDoc.getElementsByTagName("ships");
	var ownShips = ships[0].getElementsByTagName("own");
	var ship = ownShips[0].getElementsByTagName("ship");
	var shiptoTravel;
	for(var i = 0; i < ship.length; i++)
	{
		var _ship = ship[i];
		if(_ship.attributes.id.value == shipID)
		{
			shiptoTravel = _ship;
			break;
		}
	}
	
	var shiptypes = xmlDoc.getElementsByTagName("types")[0].getElementsByTagName("shiptypes")[0].getElementsByTagName("shiptype");
	var shiptypeNeeded;
	for(var i = 0; i < shiptypes.length; i++)
	{
		if(shiptypes[i].attributes.id.value == shiptoTravel.attributes.shiptype.value)
		{
			shiptypeNeeded = shiptypes[i];
			break;
		}
	}
	
	var currentSun = shiptoTravel.attributes.sun_id.value;
	var currentPlanet = shiptoTravel.attributes.planet_id.value;
	var newSun, newPlanet;
	var totalWaldemarium;
	var selectedOption = document.querySelectorAll("option");
	for(var i = 0; i < selectedOption.length; i++)
	{
		var option = selectedOption[i];
		if(option.selected)
		{
			if(checkIfPlanet(option.attributes.value.value))
			{
				var val = option.attributes.value.value;
				var newPlanet = val.substring(val.indexOf('_')+1);
			}
			if(checkIfSun(option.attributes.value.value))
			{
				var val = option.attributes.value.value;
				var newSun = val.substring(val.indexOf('_')+1);
			}
		}
	}
	
	var suns = xmlDoc.getElementsByTagName("suns");
	var sunList = suns[0].getElementsByTagName("sun");
	var currentSunElem, currentPlanetElem;
	var newSunElem, newPlanetElem;
	for(var i = 0; i < sunList.length; i++)
	{
		var thisSun = sunList[i];
		if(thisSun.attributes.id.value == currentSun)
		{
			currentSunElem = thisSun;
			break;
		}
	}

	for(var i = 0; i < sunList.length; i++)
	{
		var thisSun = sunList[i];
		if(thisSun.attributes.id.value == newSun)
		{
			newSunElem = thisSun;
			break;
		}
	}
	
	if(currentSun != newSun)
	{
		var currSunX = parseInt(currentSunElem.attributes.x.value);
		var currSunY = parseInt(currentSunElem.attributes.y.value);
		var currSunZ = parseInt(currentSunElem.attributes.z.value);
					
		var newSunX = parseInt(newSunElem.attributes.x.value);
		var newSunY = parseInt(newSunElem.attributes.y.value);
		var newSunZ = parseInt(newSunElem.attributes.z.value);
		
		var sunDistance = Math.sqrt( (newSunX - currSunX)*(newSunX - currSunX) + (newSunY - currSunY)*(newSunY - currSunY)  + (newSunZ - currSunZ)*(newSunZ - currSunZ)  );
		
		totalWaldemarium = parseInt(sunDistance * parseFloat(shiptypeNeeded.attributes.warp_con.value));

		var box = document.getElementById("fuelWald");
		box.setAttribute("value", totalWaldemarium);
		
		var shipWald = parseInt(document.getElementById('shipWald').innerText);

		if(totalWaldemarium > shipWald)
			$("#fuelWald").css({"color":"red"});
		else
			$("#fuelWald").css({"color":"white"});
		
		return;
	}
	else
	{
		totalWaldemarium = 0;
		var box = document.getElementById("fuelWald");
		box.setAttribute("value", totalWaldemarium);
	}
	
	if(currentPlanet != newPlanet)
	{
		var planetList = currentSunElem.getElementsByTagName("planet");
		for(var i = 0; i < planetList.length; i++)
		{
			var thisPlanet = planetList[i];
			if(thisPlanet.attributes.id.value == currentPlanet) currentPlanetElem = thisPlanet;
			if(thisPlanet.attributes.id.value == newPlanet) newPlanetElem = thisPlanet;
		}
		
		var planetListOffSun = newSunElem.getElementsByTagName("planet");
		for(var i = 0; i < planetListOffSun.length; i++)
		{
			var thisPlanet = planetListOffSun[i];
			if(thisPlanet.attributes.id.value == currentPlanet) currentPlanetElem = thisPlanet;
			if(thisPlanet.attributes.id.value == newPlanet) newPlanetElem = thisPlanet;
		}
		
		var currPlanetX = parseInt(currentPlanetElem.attributes.x.value);
		var currPlanetY = parseInt(currentPlanetElem.attributes.y.value);
		var currPlanetZ = parseInt(currentPlanetElem.attributes.z.value);		
		var newPlanetX = parseInt(newPlanetElem.attributes.x.value);
		var newPlanetY = parseInt(newPlanetElem.attributes.y.value);
		var newPlanetZ = parseInt(newPlanetElem.attributes.z.value);

		var distance = Math.sqrt( (newPlanetX - currPlanetX)*(newPlanetX - currPlanetX) + (newPlanetY - currPlanetY)*(newPlanetY - currPlanetY) + (newPlanetZ - currPlanetZ)*(newPlanetZ - currPlanetZ) );

		var planetWaldemarium = parseInt(distance * parseFloat(shiptypeNeeded.attributes.impuls_con.value));

		totalWaldemarium = planetWaldemarium;
		
		var box = document.getElementById("fuelWald");
		box.setAttribute("value", totalWaldemarium);
		
		var shipWald = parseInt(document.getElementById('shipWald').innerText);
		
		if(totalWaldemarium > shipWald)
			$("#fuelWald").css({"color":"red"});
		else
			$("#fuelWald").css({"color":"white"});
	}
}

function getShipById(id)
{
	var ships = xmlDoc.getElementsByTagName("ships");
	var ownShips = ships[0].getElementsByTagName("own");
	var ship = ownShips[0].getElementsByTagName("ship");
	var shiptoTravel;
	for(var i = 0; i < ship.length; i++)
	{
		var _ship = ship[i];
		if(_ship.attributes.id.value == id)
		{
			shiptoTravel = _ship;
			break;
		}
	}
	
	return shiptoTravel;
}

function getPlanetById(planetID, sunID)
{
	var suns = xmlDoc.getElementsByTagName("suns");
	var sunList = suns[0].getElementsByTagName("sun");
	var currentSunElem, currentPlanetElem;
	for(var i = 0; i < sunList.length; i++)
	{
		var thisSun = sunList[i];
		if(thisSun.attributes.id.value == sunID)
		{
			currentSunElem = thisSun;
			break;
		}
	}
	
	var planetList = currentSunElem.getElementsByTagName("planet");
	for(var i = 0; i < planetList.length; i++)
	{
		var thisPlanet = planetList[i];
		if(thisPlanet.attributes.id.value == planetID)
		{
			currentPlanetElem = thisPlanet;
			break;
		}
	}
	
	return currentPlanetElem;
}

function getShiptypeInfo(typ)
{
	var shiptypeList = xmlDoc.getElementsByTagName("types")[0].getElementsByTagName("shiptypes")[0].getElementsByTagName("shiptype");

	for(var i = 0; i < shiptypeList.length; i++)
		if(shiptypeList[i].attributes.id.value == typ) return shiptypeList[i];
	
}

function abbauenChange()
{
	var waldBoxVal = parseInt(document.getElementById("waldBox").value);
	var helgBoxVal = parseInt(document.getElementById("helgBox").value);
	var franBoxVal = parseInt(document.getElementById("franBox").value);
	var michBoxVal = parseInt(document.getElementById("michBox").value);
	var jirkBoxVal = parseInt(document.getElementById("jirkBox").value);
	var thomBoxVal = parseInt(document.getElementById("thomBox").value);
	
	if(isNaN(waldBoxVal))
	{	
		$("#waldBox").attr({"value":0});
		waldBoxVal = 0;
	}
	if(isNaN(helgBoxVal))
	{
		$("#helgBox").attr({"value":0});
		helgBoxVal = 0;
	}
	if(isNaN(franBoxVal))
	{
		$("#franBox").attr({"value":0});
		franBoxVal = 0;
	}
	if(isNaN(michBoxVal))
	{
		$("#michBox").attr({"value":0});
		michBoxVal = 0;
	}
	if(isNaN(jirkBoxVal))
	{
		$("#jirkBox").attr({"value":0});
		jirkBoxVal = 0;
	}
	if(isNaN(thomBoxVal))
	{
		$("#thomBox").attr({"value":0});
		thomBoxVal = 0;
	}
	
	var waldPlanet = parseInt(document.getElementById("waldPlanet").innerHTML);
	var helgPlanet = parseInt(document.getElementById("helgPlanet").innerHTML);
	var franPlanet = parseInt(document.getElementById("franPlanet").innerHTML);
	var michPlanet = parseInt(document.getElementById("michPlanet").innerHTML);
	var jirkPlanet = parseInt(document.getElementById("jirkPlanet").innerHTML);
	var thomPlanet = parseInt(document.getElementById("thomPlanet").innerHTML);
	
	var waldShip = parseInt(document.getElementById("shipWald").innerText);
	var helgShip = parseInt(document.getElementById("shipHelg").innerText);
	var franShip = parseInt(document.getElementById("shipFran").innerText);
	var michShip = parseInt(document.getElementById("shipMich").innerText);
	var jirkShip = parseInt(document.getElementById("shipJirk").innerText);
	var thomShip = parseInt(document.getElementById("shipThom").innerText);
	
	var base = getBase();
	var baseResources = base.getElementsByTagName("resources")[0];
	
	var waldBase = parseInt(baseResources.attributes.waldemarium.value);
	var helgBase = parseInt(baseResources.attributes.helgen.value);
	var franBase = parseInt(baseResources.attributes.frankur.value);
	var michBase = parseInt(baseResources.attributes.michaelum.value);
	var jirkBase = parseInt(baseResources.attributes.jirkan.value);
	var thomBase = parseInt(baseResources.attributes.thomasium.value);
	
	if(document.getElementById("baseAbbauenCheck").checked)
	{
		if(waldBoxVal > waldBase)
			$("#waldBox").css("color","red");
		else
			$("#waldBox").css("color","white");	
			
		if(helgBoxVal > helgBase)
			$("#helgBox").css("color","red");
		else
			$("#helgBox").css("color","white");

		if(franBoxVal > franBase)
			$("#franBox").css("color","red");
		else
			$("#franBox").css("color","white");	
			
		if(michBoxVal > michBase)
			$("#michBox").css("color","red");
		else
			$("#michBox").css("color","white");	
			
		if(jirkBoxVal > jirkBase)
			$("#jirkBox").css("color","red");
		else
			$("#jirkBox").css("color","white");
			
		if(thomBoxVal > thomBase)
			$("#thomBox").css("color","red");
		else
			$("#thomBox").css("color","white");	
	}
	else
	{
		if(waldBoxVal > waldPlanet)
			$("#waldBox").css("color","red");
		else
			$("#waldBox").css("color","white");	
			
		if(helgBoxVal > helgPlanet)
			$("#helgBox").css("color","red");
		else
			$("#helgBox").css("color","white");

		if(franBoxVal > franPlanet)
			$("#franBox").css("color","red");
		else
			$("#franBox").css("color","white");	
			
		if(michBoxVal > michPlanet)
			$("#michBox").css("color","red");
		else
			$("#michBox").css("color","white");	
			
		if(jirkBoxVal > jirkPlanet)
			$("#jirkBox").css("color","red");
		else
			$("#jirkBox").css("color","white");
			
		if(thomBoxVal > thomPlanet)
			$("#thomBox").css("color","red");
		else
			$("#thomBox").css("color","white");
	}
	
	var inputCargo = waldBoxVal+helgBoxVal+franBoxVal+michBoxVal+jirkBoxVal+thomBoxVal+waldShip+helgShip+franShip+michShip+jirkShip+thomShip;
		
	$("#totalCargo").attr({"value":inputCargo});
	
	if(parseInt($("#shipInitialCargo").attr("value")) < inputCargo)
		$("#totalCargo").css("color","red");
	else
		$("#totalCargo").css("color","white");
}

function abladenChange()
{
	var waldBoxVal = parseInt(document.getElementById("waldBox").value);
	var helgBoxVal = parseInt(document.getElementById("helgBox").value);
	var franBoxVal = parseInt(document.getElementById("franBox").value);
	var michBoxVal = parseInt(document.getElementById("michBox").value);
	var jirkBoxVal = parseInt(document.getElementById("jirkBox").value);
	var thomBoxVal = parseInt(document.getElementById("thomBox").value);
	
	if(isNaN(waldBoxVal))
	{	
		$("#waldBox").attr({"value":0});
		waldBoxVal = 0;
	}
	if(isNaN(helgBoxVal))
	{
		$("#helgBox").attr({"value":0});
		helgBoxVal = 0;
	}
	if(isNaN(franBoxVal))
	{
		$("#franBox").attr({"value":0});
		franBoxVal = 0;
	}
	if(isNaN(michBoxVal))
	{
		$("#michBox").attr({"value":0});
		michBoxVal = 0;
	}
	if(isNaN(jirkBoxVal))
	{
		$("#jirkBox").attr({"value":0});
		jirkBoxVal = 0;
	}
	if(isNaN(thomBoxVal))
	{
		$("#thomBox").attr({"value":0});
		thomBoxVal = 0;
	}
	
	var waldShip = parseInt(document.getElementById("shipWald").innerText);
	var helgShip = parseInt(document.getElementById("shipHelg").innerText);
	var franShip = parseInt(document.getElementById("shipFran").innerText);
	var michShip = parseInt(document.getElementById("shipMich").innerText);
	var jirkShip = parseInt(document.getElementById("shipJirk").innerText);
	var thomShip = parseInt(document.getElementById("shipThom").innerText);
	
	if(waldBoxVal > waldShip)
		$("#waldBox").css("color","red");
	else
		$("#waldBox").css("color","white");	
		
	if(helgBoxVal > helgShip)
		$("#helgBox").css("color","red");
	else
		$("#helgBox").css("color","white");

	if(franBoxVal > franShip)
		$("#franBox").css("color","red");
	else
		$("#franBox").css("color","white");	
		
	if(michBoxVal > michShip)
		$("#michBox").css("color","red");
	else
		$("#michBox").css("color","white");	
		
	if(jirkBoxVal > jirkShip)
		$("#jirkBox").css("color","red");
	else
		$("#jirkBox").css("color","white");
		
	if(thomBoxVal > thomShip)
		$("#thomBox").css("color","red");
	else
		$("#thomBox").css("color","white");
}

function loginMenu()
{
	$.getJSON("checkLogin.php", function(data) {
		if(data.val == "true")
		{
			var code = '<center><span style="font-size: 20px;"><a href="client.html">Hier für das Spiel Klicken!</a></span></center>';
			document.getElementById("loginBox").innerHTML = code;
		}
		else
		{
			var code = '<center><form method="post" action="login.php"><table>';
			code += '<tr><td>Username:</td><td><input name="Username" size="25" maxlength="25" value="Username"></td></tr>';
			code += '<br><tr><td>Passwort:</td><td><input type="password" name="Passwort" size="25" maxlength="25" value="123456789"></td></tr>';
			code += '</table><br><input type="submit" value="Absenden"></form></center>';
			document.getElementById("loginBox").innerHTML = code;
		}
	});
}

function getBase()
{
	var bases = xmlDoc.getElementsByTagName("bases");
	var own = bases[0].getElementsByTagName("own");
	var base = own[0].getElementsByTagName("base");
	
	return base[0];
}