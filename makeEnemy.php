<?php
	$id = $_POST['player_ID'];
	
	session_start();

	$link = mysql_connect('dbs.hs-furtwangen.de:3306', $_SESSION['user'], $_SESSION['password']); //connect
	$q = "USE ".$_SESSION['user']; //create the query
	mysql_query($q); //use the query

	//End of Database Connection
	$kommando = "INSERT INTO kommandos(kommando, ziel_team_id) VALUES(11,";
	$kommando = $kommando.$id.");";
	//echo "<script>alert('".$kommando."');</script>";
	mysql_query($kommando);
?>