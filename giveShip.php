<?php
	$id = $_POST['fID'];
	$ship = $_POST['ship'];

	session_start();
	
	//PHP Part - Database Connection
	$link = mysql_connect('dbs.hs-furtwangen.de:3306', $_SESSION['user'], $_SESSION['password']); //connect

	$q = "USE ".$_SESSION['user']; //create the query
	mysql_query($q); //use the query

	//End of Database Connection
	$kommando = "INSERT INTO kommandos(kommando, schiff_id, ziel_team_id) VALUES(8,";
	$kommando = $kommando.$ship.", ".$id.");";
	//echo "<script>alert('".$kommando."');</script>";
	mysql_query($kommando);

?>