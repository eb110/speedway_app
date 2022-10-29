export default class TeamModel{

    controller(){}

    async getLastId(){
        try{
            return await fetch(`http://localhost:8080/team/getLastId`).then((res) => res.json())
          }catch(error){
              console.log("can't get the last team id")
          }
    }

    async getAllTeams(){
        try{
            return await fetch(`http://localhost:8080/team/getAllTeams`).then((res) => res.json())
          }catch(error){
              console.log("can't get teams")
          }
    }

    async postNewTeam(team){
        try{
        return await fetch(`http://localhost:8080/team/addTeam`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(team)        
        }).then(() => team);
    }catch(error){
        console.log('post of new team has failed')
    }
    }

    async getByName(name){
        try{
            return await fetch(`http://localhost:8080/team/getByName/${name}`)
            .then((res) => {
                if(res.status === 200){
                    return res.json()
                }
                else{
                    console.log('the team: ' + name + ' record doesnt exist')
                    return null
                }
            })
        }catch(error){
            console.log('get team by name has failed')
        }
    }

    countResult(match){
        let homeRiders = match.riders.filter((rider) => rider.homeAway === 'home')
        let awayRiders = match.riders.filter((rider) => rider.homeAway === 'away')
        let res = [{},{}]
        res[0].result = homeRiders.reduce((sum, rider) => sum += rider.pointsCurrent, 0)
        res[0].heats = homeRiders.reduce((sum, rider) => sum += rider.heatsCurrent, 0)
        res[1].result = awayRiders.reduce((sum, rider) => sum += rider.pointsCurrent, 0)
        res[1].heats = awayRiders.reduce((sum, rider) => sum += rider.heatsCurrent, 0)
        match.teams = res
        return match
    }

}