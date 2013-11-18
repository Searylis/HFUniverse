<?php
	$shipID = $_POST['id'];
	$baseID = $_POST['baseID'];
	$wald = $_POST['waldemarium'];
	$helg = $_POST['helgen'];
	$fran = $_POST['frankur'];
	$mich = $_POST['michaelum'];
	$thom = $_POST['thomasium'];
	$jirk = $_POST['jirkan'];

	session_start();
	
	//PHP Part - Database Connection
	$link = mysql_connect('dbs.hs-furtwangen.de:3306', $_SESSION['user'], $_SESSION['password']); //connect

	$q = "USE ".$_SESSION['user']; //create the query
	mysql_query($q); //use the query

	//End of Database Connection
	$kommando = "INSERT INTO kommandos(kommando, schiff_id, basis_id, waldemarium, helgen, frankur, michaelum, thomasium, jirkan) VALUES(4,";
	$kommando = $kommando.$shipID.", ".$baseID.", ".$wald.", ".$helg.", ".$fran.", ".$mich.", ".$thom.", ".$jirk.");";
	//echo "<script>alert('".$kommando."');</script>";
	mysql_query($kommando);
?>