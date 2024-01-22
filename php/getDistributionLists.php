<?php
    require("IspconfigSoap.php");
    require("config.php");
    
    $ispconfigSoap = new IspconfigSoap($soap_location, $soap_uri, $username, $password);

    $result = $ispconfigSoap->connect();

    if($result == "sucess"){

        $response = $ispconfigSoap->getDistributionListsToFile();
        echo $response;
        return ;
    }

    echo "failed";
?>