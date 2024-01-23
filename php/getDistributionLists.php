<?php
    require("IspconfigSoap.php");
    require("config.php");

    $argc; //number of args
    $argv; // array of args

    $ispconfigSoap = new IspconfigSoap($soap_location, $soap_uri, $username, $password);

    $result = $ispconfigSoap->connect();

    if($result == "sucess"){

        $response = $ispconfigSoap->getDistributionListsToFile($argv[1], $argv[2]);
        echo $response;
        return ;
    }

    echo "failed";
?>