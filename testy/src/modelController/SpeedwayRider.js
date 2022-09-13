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

    getTheLastRider = async () => {
        try{
            console.log('getTheLastRider db read')
            return await fetch(`http://localhost:8080/rider/getLastRider`)
            .then((res) => res.json())
        }catch(err){
            console.log('get the last rider failed')
        }
    }

    /*
    It is a recursive call as its important to make sure all riders has been fetched from the db
    and promise call has been attached to each and every db call
    */
    async fetchRidersFromDB(match, index){
        if(index < 0){
            return match
        }
        return await this.getAllBySurname(match.riders[index].surname)
        .then((res) => this.concatRiderParserWithRiderDB(match.riders[index], res, match.dateOfGame))
        .then((res) => 
            {
                //rider fetched from the rlach is replaced by the rider fetched from the db
                match.riders[index] = res; 
                return this.fetchRidersFromDB(match, index - 1)})
    }

    concatRiderParserWithRiderDB(rider, riderDB, matchDate){
        riderDB = riderDB.find((rdr) => rdr.name.substring(0, rider.name.length) === rider.name)
        if(riderDB){
            for(const key in riderDB){
                rider[key] = riderDB[key]
            }
            rider = this.updateRiderBirthAttribs(rider, matchDate)
            rider.edit = false
            }
        return rider
    }

    /*
     Card_014
    */
    updateRiderBirthAttribs(rider, matchDate){
        let currentDate = new Date().getFullYear()
        if(rider.ripDate){
            currentDate = +rider.ripDate.substring(0, 4) 
            rider.ripDate = rider.ripDate.substring(0, 10)
        }
        rider.birthDate = rider.birthDate.substring(0, 10)
        rider.age = currentDate - +rider.birthDate.substring(0, 4)          
        rider.seasonAge = +matchDate.substring(matchDate.lastIndexOf('-') + 1) - +rider.birthDate.substring(0, 4)
        return rider
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
        let datka = Date.now();
        rdr.lastUpdated = datka
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
