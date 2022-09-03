export default class SpeedwayMatchRider{

    controller(){}

    async getTheLastMatchRiderId(){
        try{
          return await fetch(`http://localhost:8080/matchRider/getLastMatchRiderId`).then((res) => res.json())
        }catch(error){
            console.log("get last match rider id was a failure")
        }
    }

    async insertRiderMatch(rdr, homeAway, teamId, matchId, mrId){
      //  console.log('rider id: ' + rdr.id)
            let matchRider = {
                id: mrId,
                homeAwaySide: homeAway,
                fkIdRider: rdr.id,
                fkIdTeam: teamId,
                fkIdMatch: matchId,
                riderMatchNumber: rdr.nr,
                pkt: rdr.pkt
            }

            await fetch(`http://localhost:8080/matchRider/addMatchRider`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(matchRider)        
            });
        }
}