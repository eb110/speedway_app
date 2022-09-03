import SpeedwayRider from "../modelController/SpeedwayRider"
import SpeedwayMatch from "../modelController/SpeedwayMatch"
import SpeedwayMatchRider from "../modelController/SpeedwayMatchRider"

export default class MatchResultCalculator{
    
    constructor(rawMatch){

        this.rawMatch = rawMatch
        this.calculateMatchRecords()
    //    this.updateTheRiderData()
    }

    async calculateMatchRecords(){
        let datka = this.rawMatch.dateOfGame.split('-')
        let datkaWsad = datka[2] + '-' + (datka[1].length === 1 ? '0' + datka[1] : datka[1]) + '-' + (datka[0].length === 1 ? '0' + datka[0] : datka[0]);
        let speedwayMatch = new SpeedwayMatch()
        //console.log(this.rawMatch)
        try{
            await speedwayMatch.getTheLastMatchId()
            .then((res) => speedwayMatch.insertMatch(res, datkaWsad, this.rawMatch.round, this.rawMatch.league))
            .then((res) => this.insertRidersMatch(res))
        }catch(error){
            console.log('new match record failed')
        }
    }

    async updateTheRiderData(id){
        let rider = new SpeedwayRider()
        rider.getTheRiderById(1)
    }

    async insertRidersMatch(matchId){
        let mr = new SpeedwayMatchRider()
  //      console.log('match id: ' + matchId)
        await mr.getTheLastMatchRiderId()
        .then((res) => this.insertRiderMatch(this.rawMatch.awayRiders, 1, matchId, res))
        .then((res) => this.insertRiderMatch(this.rawMatch.homeRiders, 2, matchId, res))
    }

    async insertRiderMatch(team, homeAway, matchId, mrId){
        let speedwayMatchRider = new SpeedwayMatchRider()
        let speedway_rider = new SpeedwayRider()
        for(let i = 0; i < team.length; i++){
            mrId++
            let rider = team[i]
            let points = rider.pkt.split(",");
            let currentRiderScore = speedway_rider.convertPoints(points)

            if(homeAway === 1){
                await speedwayMatchRider.insertRiderMatch(rider, 'away', this.rawMatch.awayId, matchId, mrId)
                .then(() => speedway_rider.getTheRiderById(rider.id)
                .then((res) => speedway_rider.updateRiderScore(res, currentRiderScore))
                .then((res) => speedway_rider.updateTheRiderInDB(res)))
            }else{
                await speedwayMatchRider.insertRiderMatch(rider, 'home', this.rawMatch.homeId, matchId, mrId)
                .then(() => speedway_rider.getTheRiderById(rider.id)
                .then((res) => speedway_rider.updateRiderScore(res, currentRiderScore))
                .then((res) => speedway_rider.updateTheRiderInDB(res)))
            }

        }
        return mrId
    }
}
   