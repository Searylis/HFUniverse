<?php

	$user = $_POST['Username'];
	$pass = $_POST['Passwort'];

	session_start();
	
	if(!isset($_SESSION['user']))
	{
		$_SESSION['user'] = $user;
		$_SESSION['password'] = $pass;
	}
	else
	{
		unset($_SESSION['user']);
		unset($_SESSION['password']);
		$_SESSION['user'] = $user;
		$_SESSION['password'] = $pass;
	}
	
	header("Location: client.html");
?>