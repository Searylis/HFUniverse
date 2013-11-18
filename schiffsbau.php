<?php

	$typPHP = $_POST['typ'];
	$id = $_POST['basis_id'];

	session_start();

	$link = mysql_connect('dbs.hs-furtwangen.de:3306', $_SESSION['user'], $_SESSION['password']); //connect
	$q = "USE ".$_SESSION['user']; //create the query
	mysql_query($q); //use the query

	//End of Database Connection
	$kommando = "INSERT INTO kommandos(kommando, basis_id, schiffstyp_id) VALUES(6,";
	$kommando = $kommando.$id.", ".$typPHP.");";
	//echo "<script>alert('".$kommando."');</script>";
	mysql_query($kommando);

?>