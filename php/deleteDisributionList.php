<?php
    require("IspconfigSoap.php");
    require("config.php");

    $argc; //number of args
    $argv; // array of args

    if($argc < 2){
        echo "Nincs elég paraméter a terjesztési lista létrehozásához.";
    }

    $distributionlist = $argv[1];

    $ispconfigSoap = new IspconfigSoap($soap_location, $soap_uri, $username, $password);
    $result = $ispconfigSoap->connect();

    if($result == "sucess"){

        $response = $ispconfigSoap->deleteDistributionList($distributionlist);
        echo $response;
        return ;
    }

    echo "failed";
?>