export default class SpeedwayMatchRider{

    controller(){}

    async getTheLastMatchRiderId(){
        try{
          return await fetch(`http://localhost:8080/matchRider/getLastMatchRiderId`).then((res) => res.json())
        }catch(error){
            console.log("get last match rider id was a failure")
        }
    }

    /*
        match - global match with updated parameter values
        all riders already exist in db, same teams
        index - last index of the match.riders list
    */
    async postMatchRiders(match, index){
        if(index < 0)
            return
        let teamId = match.riders[index].homeAway === 'away' ? match.awayId : match.homeId
        return await this.insertRiderMatch(match.riders[index], teamId, match.matchId)
        .then(() => this.postMatchRiders(match, index - 1))
    }

    async insertRiderMatch(rider, teamId, matchId){
        let datka = Date.now();
            let matchRider = {
                homeAwaySide: rider.homeAway,
                fk_SpeedwayRider_SpeedwayMatchRider: rider.id,
                fk_SpeedwayTeam_SpeedwayMatchRider: teamId,
                fk_SpeedwayMatch_SpeedwayMatchRider: matchId,
                riderMatchNumber: rider.nr,
                pkt: rider.pointsString,
                created: datka,
                lastUpdated: datka
            }

            try{
            await fetch(`http://localhost:8080/matchRider/addMatchRider`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(matchRider)        
            })}catch(error){
                console.log('match rider post failed. Rider id: ' + rider.id)
            }
        }
}