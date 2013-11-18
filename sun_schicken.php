<?php
	$shipID = $_POST['id'];
	$sunID = $_POST['sunID'];
	session_start();
	//PHP Part - Database Connection
	$link = mysql_connect('dbs.hs-furtwangen.de:3306', $_SESSION['user'], $_SESSION['password']); //connect
	$q = "USE ".$_SESSION['user']; //create the query
	mysql_query($q); //use the query

	//End of Database Connection
	$kommando = "INSERT INTO kommandos(kommando, schiff_id, ziel_reise_id) VALUES(2,";
	$kommando = $kommando.$shipID.", ".$sunID.");";
	//echo "<script>alert('".$kommando."');</script>";
	mysql_query($kommando);
?>