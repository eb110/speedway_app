export default class SpeedwayRider {

    controller() { }

    getTheRiderById = async (id) => {
        try {
            return await fetch(`http://localhost:8080/rider/getById/${id}`)
                .then((res) => {
                    if (res.status === 200) {
                        return res.json()
                    }
                    else {
                        console.log('the rider of id: ' + id + ' doesnt exist in db')
                        return null
                    }
                })
        } catch (err) {
            console.log('get rider by id has failed')
        }
    }

    async getAllBySurname(surname) {
        try {
            return await fetch(`http://localhost:8080/rider/getAllBySurname/${surname}`)
                .then((res) => res.json())
        } catch (error) {
            console.log('get all riders by surname failed')
        }
    }

    getTheLastRider = async () => {
        try {
            console.log('getTheLastRider db read')
            return await fetch(`http://localhost:8080/rider/getLastRider`)
                .then((res) => res.json())
        } catch (err) {
            console.log('get the last rider failed')
        }
    }

    /*
    It is a recursive call as its important to make sure all riders has been fetched from the db
    and promise call has been attached to each and every db call
    */
    async fetchRidersFromDB(match, index) {
        if (index < 0) {
            return match
        }
        return await this.getAllBySurname(match.riders[index].surname)
            .then((res) => this.concatRiderParserWithRiderDB(match.riders[index], res, match.dateOfGame))
            .then((res) => {
                match.riders[index] = res;
                return this.fetchRidersFromDB(match, index - 1)
            })
    }

    concatRiderParserWithRiderDB(rider, riderDB, matchDate) {
        let checkDate = +matchDate.substring(matchDate.lastIndexOf('-') + 1)
        if (rider.surname.toLowerCase() === 'pawlicki' && rider.name === 'P') {
            if (checkDate < 1995) {
                rider.name = 'Piotr Sr'
            }
            else {
                rider.name = 'Piotr Jr'
            }
        }
        else if (rider.surname.toLowerCase() === 'baliński' && rider.name === 'D') {
            rider.name = 'Dariusz'
        }
        else if (rider.surname.toLowerCase() === 'liszka') {
            if (checkDate < 1986) {
                rider.name = 'Piotr'
            }
            else {
                rider.name = 'Przemysław'
            }
        }
        else if(rider.surname.toLowerCase() === 'kowalski'){
            if(rider.name === 'S'){
                if(checkDate === 1985){
                    riderDB = riderDB.filter((rdr) => rdr.id === 487)
                }
            }
        }
        else if(rider.surname.toLowerCase() === 'wiśniewski'){
            if(checkDate === 1985){
                if(rider.name === 'J'){
                    rider.name = 'Tadeusz'
                    riderDB = riderDB.filter((rdr) => rdr.id === 326)
                }
            }
        }
        riderDB = riderDB.find((rdr) => rdr.name.substring(0, rider.name.length) === rider.name)
        if (riderDB) {
            let numericData = {
                points: rider.points,
                bonuses: rider.bonuses,
                heats: rider.heats,
                games: rider.games,
                fullPerfects: rider.fullPerfects,
                paidPerfects: rider.paidPerfects
            }
            for (const key in riderDB) {
                rider[key] = riderDB[key]
            }
            rider.pointsCurrent = numericData.points
            rider.bonusesCurrent = numericData.bonuses
            rider.heatsCurrent = numericData.heats
            rider.fullPerfectsCurrent = numericData.fullPerfects
            rider.paidPerfectsCurrent = numericData.paidPerfects
            rider = this.updateRiderBirthAttribs(rider, matchDate)
            rider.edit = false
        }
        return rider
    }

    /*
     Card_014
    */
    updateRiderBirthAttribs(rider, matchDate) {
        let currentDate = new Date().getFullYear()
        if (rider.ripDate) {
            currentDate = +rider.ripDate.substring(0, 4)
            rider.ripDate = rider.ripDate.substring(0, 10)
        }
        rider.birthDate = rider.birthDate.substring(0, 10)
        rider.age = currentDate - +rider.birthDate.substring(0, 4)
        rider.seasonAge = +matchDate.substring(matchDate.lastIndexOf('-') + 1) - +rider.birthDate.substring(0, 4)
        return rider
    }

    async postNewRider(newRider) {
        try {
            await fetch(`http://localhost:8080/rider/addRider`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newRider)
            });
        } catch (error) {
            console.log('rider post has failed')
        }
    }

    /*
        match - global match with updated parameter values
        all riders already exist in db, same teams
        index - last index of the match.riders list
    */
    async updateRiders(match, index) {
        if (index < 0)
            return
        return await this.updateRider(match.riders[index])
            .then(() => this.updateRiders(match, index - 1))
    }

    updateRider = async (rdr) => {
        let datka = Date.now();
        rdr.lastUpdated = datka
        try {
            await fetch(`http://localhost:8080/rider/updateRider`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(rdr)
            });
            console.log('speedway rider update')
        } catch (error) {
            console.log('update rider failed')
        }
    }
}
