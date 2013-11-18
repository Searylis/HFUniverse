<?php
	session_start();
	
	if(isset($_SESSION['user']))
	{
		$ret = array();
		$ret['val'] = "true";
		echo json_encode($ret);
	}
	else
	{
		$ret = array();
		$ret['val'] = "false";
		echo json_encode($ret);
	}
?>