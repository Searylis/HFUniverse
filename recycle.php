<?php

	$id = $_POST['id'];
	session_start();
	//PHP Part - Database Connection

	$link = mysql_connect('dbs.hs-furtwangen.de:3306', $_SESSION['user'], $_SESSION['password']); //connect
	$q = "USE ".$_SESSION['user']; //create the query
	mysql_query($q); //use the query

	//End of Database Connection
	$kommando = "INSERT INTO kommandos(kommando, schiffstyp_id) VALUES(7, ";
	$kommando = $kommando.$id.");";

	mysql_query($kommando);
?>