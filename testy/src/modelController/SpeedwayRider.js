export default class SpeedwayRider{

    controller(){}

    getTheRiderById = async (id) => {
        try{
            return await fetch(`http://localhost:8080/rider/getById/${id}`)
            .then((res) => res.json())
          } catch(err){
              console.log('get rider by id has failed')
          }
    }

    async getAllBySurname(surname){
        try{
            return await fetch(`http://localhost:8080/rider/getAllBySurname/${surname}`)
            .then((res) => res.json())
        }catch(error){
            console.log('get all riders by surname failed')
        }
    }

    traverseJsonRider(base, copyMatch, homeAwayTeam, i, match){
        if(base.length > 0){
            for(let j = 0; j < base.length; j++){  
              if(base[j].name.substring(0, copyMatch[homeAwayTeam][i].name.length) === copyMatch[homeAwayTeam][i].name){
                copyMatch[homeAwayTeam][i].pts = copyMatch[homeAwayTeam][i].points
                for(const key in base[j]){
                  copyMatch[homeAwayTeam][i][key] = base[j][key]
                  if(copyMatch[homeAwayTeam][i][key] === null){
                    copyMatch[homeAwayTeam][i][key] = ''
                  }
                }
  
                let temp = copyMatch[homeAwayTeam][i].points
                copyMatch[homeAwayTeam][i].points = copyMatch[homeAwayTeam][i].pts
                copyMatch[homeAwayTeam][i].pts = temp
                let currentDate = new Date().getFullYear()
                if(base[j].ripDate)
                  currentDate = +base[j].ripDate.substring(0, 4)             
                copyMatch[homeAwayTeam][i].birthDate = base[j].birthDate.substring(0, 10)
                if(base[j].ripDate)
                  copyMatch[homeAwayTeam][i].ripDate = base[j].ripDate.substring(0, 10)
                copyMatch[homeAwayTeam][i].age = currentDate - +copyMatch[homeAwayTeam][i].birthDate.substring(0, 4)
                copyMatch[homeAwayTeam][i].seasonAge = +match.dateOfGame.substring(match.dateOfGame.lastIndexOf('-') + 1) - +copyMatch[homeAwayTeam][i].birthDate.substring(0, 4)
                match = copyMatch
                break
              }
            }
            return copyMatch
          }
        }
    
    async parseRiderJson(copyMatch, homeAwayTeam, match){
        for(let i = 0; i < copyMatch[homeAwayTeam].length; i++){ 
            let surname = this.checkSurname(copyMatch[homeAwayTeam][i].surname)
            await this.getAllBySurname(surname)
            .then((res) => this.traverseJsonRider(res, copyMatch, homeAwayTeam, i, match))
         }
         return copyMatch 
    }

    async postNewRider (newRider) {
        try{
            await fetch(`http://localhost:8080/rider/addRider`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newRider)        
            });
        }catch(error){
            console.log('rider post has failed')
        }
    }


    /*
    It happens the rlach source contains mistakes in riders names
    this method consist a list of them and send back the proper name
    */
    checkSurname(surname){
        let exc = ['DRAPAŁA']
        let proper = ['Dropała']
        let res = surname
        for(let i = 0; i < exc.length; i++){
            if(exc[i] === res)
                return proper[i]
        }
        return surname
    }

    /*
    The db stores the points as '3,2,2,1'
    The method receives those points already splited
    based on this proper points are calculated and sent back
    as rider properties to add
    */
    convertPoints(points){
        let point = 0;
        let bonus = 0;
        let heats = 0;
        let perfect = 0;
        let paidPerfect = 0;

        for(let j = 0; j < points.length; j++){
            let heat = points[j];
            let pointTemp = 0.0;
            if(heat.includes("."))
                pointTemp = parseFloat(heat.substring(0, 3));               
            if('0123456789'.includes(heat[0]))
                pointTemp = +("" + heat[0])             
            if(heat.includes("*"))
                bonus++;
            point += pointTemp;
            heats++;
        }

        if(heats === 5 && point === 15){
            perfect++;
        }
        else if(heats === 5 && point + bonus === 15) {
            paidPerfect++;
        }
        return{pts: point, bns: bonus, hts: heats, prf: perfect, pdPrf: paidPerfect}
    }

    /*
    The method receives data from convertPoints
    and based on this feeding up the proper rider object
    */
    updateRiderScore(rdr, riderScore){
    //    console.log(riderScore)
        rdr.points += riderScore.pts
        rdr.bonuses += riderScore.bns
        rdr.heats += riderScore.hts
        rdr.games += 1
        rdr.fullPerfects += riderScore.prf
        rdr.paidPerfects += riderScore.pdPrf
    //    console.log(rdr)
        return rdr
    }
    
    updateTheRiderInDB = async (rdr) => {
        try{
           await fetch(`http://localhost:8080/rider/updateRider/${rdr.id}`, {
               method: 'PUT',
               headers: {
                   'Accept': 'application/json',
                   'Content-Type': 'application/json'
               },
               body: JSON.stringify(rdr)        
           });
           console.log('speedway rider record updated')
       }catch(error){
        console.log('update rider failed')
       }
    }
}
