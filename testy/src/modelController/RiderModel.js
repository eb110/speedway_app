export default class RiderModel {

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
                match.riders[index].riderDB = res;
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
        riderDB = riderDB.find((rdr) => rdr.name.substring(0, rider.name.length) === rider.name)
        if (riderDB) {
            riderDB = this.updateRiderBirthAttribs(riderDB, matchDate)
            riderDB.edit = false
        }
        return riderDB
    }

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

    countRidersPoints = (match) => {
        for (let i = 0; i < match.riders.length; i++) {
            match.riders[i].pointsString = match.riders[i].pointsString.replaceAll(' ', '')
            let points = match.riders[i].pointsString.split(',').filter((x) => x !== '-')
            let bonus = 0;
            let point = 0.0
            let heat = 0
            let fullPerfect = 0
            let paidPerfect = 0
            for (let j = 0; j < points.length; j++) {
                let heatRecord = points[j];
                let pointTemp = 0.0;
                if (heatRecord.includes(".")) {
                    pointTemp = parseFloat(heatRecord.substring(0, 3));
                }
                else if ('0123456789'.includes(heatRecord[0]))
                    pointTemp = +("" + heatRecord[0])
                if (heatRecord.includes("*"))
                    bonus++;
                point += pointTemp;
                heat++;
            }

            if (heat >= 5 && point / heat === 3) {
                fullPerfect++;
            }
            else if (heat >= 5 && (point + bonus) / heat === 3) {
                paidPerfect++;
            }
            match.riders[i].heatsCurrent = heat
            match.riders[i].pointsCurrent = point
            match.riders[i].bonusesCurrent = bonus
            match.riders[i].fullPerfectsCurrent = fullPerfect
            match.riders[i].paidPerfectsCurrent = paidPerfect
            match.riders[i].perfect = (fullPerfect > 0 || paidPerfect > 0) ? true : false
        }
        return match
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
        } catch (error) {
            console.log('update rider failed')
        }
    }

    updateRidersResultForDbUpdate = (match) => {
        match.total = {}
        match.total.point = 0.0
        match.total.heat = 0
        match.total.bonus = 0
        match.total.paidPerfect = 0
        match.total.fullPerfect = 0
        match.total.game = 0
        for(let i = 0; i < match.riders.length; i++){
            match.riders[i].riderDB.bonuses += match.riders[i].bonusesCurrent;
            match.riders[i].riderDB.games++
            match.riders[i].riderDB.heats += match.riders[i].heatsCurrent;
            match.riders[i].riderDB.points += match.riders[i].pointsCurrent;
            match.riders[i].riderDB.paidPerfects += match.riders[i].paidPerfectsCurrent;
            match.riders[i].riderDB.fullPerfects += match.riders[i].fullPerfectsCurrent;
            match.total.point += match.riders[i].riderDB.points
            match.total.heat += match.riders[i].riderDB.heats
            match.total.game += match.riders[i].riderDB.games
            match.total.bonus += match.riders[i].riderDB.bonuses
            match.total.paidPerfect += match.riders[i].riderDB.paidPerfects
            match.total.fullPerfect += match.riders[i].riderDB.fullPerfects
        }
    }
}
