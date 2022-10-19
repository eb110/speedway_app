export default class SpeedwayMatch {

    controller() { }

    async getLastId() {
        try {
            return await fetch(`http://localhost:8080/match/getLastMatchId`).then((res) => res.json())
        } catch (error) {
            console.log("get last match id was a failure")
        }
    }

    async getLastMatch() {
        try {
            return await fetch(`http://localhost:8080/match/getLastMatch`).then((res) => res.json())
        } catch (error) {
            console.log("get last match was a failure")
        }
    }

    async insertMatch(date, rnd, lg) {
        let datka = Date.now();
        let newMatch = {
            dateOfMatch: date,
            round: rnd,
            typeOfGame: lg,
            created: datka,
            lastUpdated: datka
        }
        try {
            return await fetch(`http://localhost:8080/match/addMatch`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newMatch)
            })
        } catch (error) {
            console.log('add match failed')
        }
    }

}