<?php
	$shipID = $_POST['id'];
	$planetID = $_POST['planetID'];

	session_start();
	
	//PHP Part - Database Connection
	$link = mysql_connect('dbs.hs-furtwangen.de:3306', $_SESSION['user'], $_SESSION['password']); //connect
	$q = "USE ".$_SESSION['user']; //create the query
	mysql_query($q); //use the query

	//End of Database Connection
	$kommando = "INSERT INTO kommandos(kommando, schiff_id, ziel_reise_id) VALUES(1,";
	$kommando = $kommando.$shipID.", ".$planetID.");";
	//echo "<script>alert('".$kommando."');</script>";
	mysql_query($kommando);
?>