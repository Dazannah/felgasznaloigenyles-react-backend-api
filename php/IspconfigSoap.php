<?php
    class IspconfigSoap{

        public function __construct($soap_location, $soap_uri, $username, $password){
            $this->username = $username;
            $this->password = $password;

            $arrContextOptions=stream_context_create(array(
                "ssl" => array(
                     "verify_peer" => false,
                     "verify_peer_name" => false,
                )));
          
              $this->client = new SoapClient(null, array(
              'location' => $soap_location,
                  'uri'      => $soap_uri,
                  'trace' => 1,
                  'exceptions' => 1,
              "stream_context" => $arrContextOptions
            
            ));
        }

        public function connect(){
            try{
                $this->session_id = $this->client->login("jogosultsagigenylo", "kDXY3mfa!");
                return "sucess";
            }catch(SoapFault $err){
                die('SOAP Error: '.$err); 
            }
        }

        public function getDistributionListsToFile($accessor, $value){
            try {
                $params = array('custom_mailfilter' => "%redirect%");

                if($accessor === "email"){
                    $params[$accessor] = "%$value%";
                }

                if($accessor === "fullEmail"){
                    $params["email"] = "$value";
                }

                //$params = array('custom_mailfilter' => "%redirect%");
        
                $response = $this->client->mail_user_get($this->session_id, $params);

                $file = fopen("json/tempGetDistributionlists.json", "w") or die("Unable to open file!");
                $json = json_encode($response);
                fwrite($file, $json);
                fclose($file);
          
                return "sucess";
            } catch (SoapFault $err) {
                die('SOAP Error: '.$err); 
            }
        }

        public function createDistributionList($fileLocation){
            try {
                $json = $this->readFile($fileLocation);
                $this->deleteFile($fileLocation);

                $email = $json["distributionListAddres"];
                $custom_mailfilter = "";

                foreach($json["addresses"] as $address){
                    $custom_mailfilter = $custom_mailfilter . <<<STR
                    redirect "{$address}";
                    STR;
                }

                $client_id = 1;
                $params = array(
                    'server_id' => 1,
                    'email' => "$email@hmek.hu",
                    'login' => "$email@hmek.hu",
                    'password' => '',
                    'name' => '',
                    'uid' => 5000,
                    'gid' => 5000,
                    'maildir' => "/var/vmail/hmek.hu/$email",
                    'quota' => 0,
                    'cc' => '',
                    'homedir' => '/var/vmail',
                    'autoresponder' => 'n',
                    'autoresponder_start_date' => '',
                    'autoresponder_end_date' => '',
                    'autoresponder_text' => '',
                    'autoresponder_subject' => 'Out of office reply',
                    'move_junk' => 'y',
                    'custom_mailfilter' => $custom_mailfilter,
                    'postfix' => 'y',
                    'access' => 'y',
                    'disableimap' => 'n',
                    'disablepop3' => 'n',
                    'disabledeliver' => 'n',
                    'disablesmtp' => 'n',
                    'purge_trash_days' => 0,
                    'purge_junk_days' => 0
                );

                $response = $this->client->mail_user_add($this->session_id, $client_id, $params);

                return "sucess";

            } catch (SoapFault $err) {
                return "Felhasználó létrehozása sikertelen."; 
            }
        }

        public function deleteDistributionList($distributionlist){
            try {
                $client_id = 1;
                $params = array("email" => $distributionlist . "@hmek.hu");
                $mailuser = $this->client->mail_user_get($this->session_id, $params);
                $userid = $mailuser[0]["mailuser_id"];

                $affected_rows = $this->client->mail_user_delete($this->session_id, $userid);
                return "sucess";

            } catch (SoapFault $err) {
                die('SOAP Error: '.$err); 
            }
        }

        public function updateDistributionList($fileLocation){
            try {
                $json = $this->readFile($fileLocation);
                $this->deleteFile($fileLocation);

                $email = $json["distributionListAddres"];
                $custom_mailfilter = "";

                foreach($json["adresses"] as $address){
                    $custom_mailfilter = $custom_mailfilter . <<<STR
                    redirect "{$address}";
                    STR;
                }

                $custom_mailfilter = $custom_mailfilter . "keep;";

                $client_id = 1;
                $params = array("email" => $email /*. "@hmek.hu"*/);
                $mailuser = $this->client->mail_user_get($this->session_id, $params);
                $userid = $mailuser[0]["mailuser_id"];

                $mailuser['custom_mailfilter'] = $custom_mailfilter;

                $affected_rows = $this->client->mail_user_update($this->session_id, $client_id, $userid, $mailuser);
                return "sucess";

            } catch (SoapFault $err) {
                die('SOAP Error: '.$err); 
            }
        }
        
        private function readFile($fileLocation){
            $file = fopen($fileLocation, 'r') or die("Unable to open file!");

            $json = json_decode(fread($file,filesize($fileLocation)), true);
            fclose($file);

            return $json;
        }

        private function deleteFile($fileLocation){
            $result = unlink($fileLocation);
        }
    }   
?>