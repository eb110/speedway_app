export default class SpeedwayTeam{

    controller(){}

    async getLastId(){
        try{
            return await fetch(`http://localhost:8080/team/getLastId`).then((res) => res.json())
          }catch(error){
              console.log("can't get the last team id")
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

}