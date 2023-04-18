let apiKey = "85121c4769f5607156585b6ca271e662";

export async function getCompeticiones(){

    let response = await fetch ("https://apiclient.besoccerapps.com/scripts/api/api.php?key=" + apiKey + "&tz=Europe/Madrid&req=categories&format=json");
    if (response.ok){
        let competiciones = await response.json();
        return competiciones;
    }

}//Fin de la función.