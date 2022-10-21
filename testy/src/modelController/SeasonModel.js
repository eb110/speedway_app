export default class SeasonModel {
    controller() { }

    async postSeason(season) {
        let datka = Date.now();
        season.created = datka
        season.lastUpdated = datka
        try {
            return await fetch(`http://localhost:8080/season/addSeason`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(season)
            })
        } catch (error) {
            console.log('add season failed')
        }
    }

    async updateSeasonLeagueState(seasonId, league){
        //topLeague
        let sn = {id: seasonId}
        try {
            await fetch(`http://localhost:8080/season/updateSeason${league}`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(sn)
            });
        } catch (error) {
            console.log('update of the season ' + league + ' has failed')
        }
    }

    async getSeasonByYear(year) { 
        try {
            return await fetch(`http://localhost:8080/season/getSeasonByYear/${year}`)
                .then((res) => {
                    if (res.status === 200) {
                        return res.json()
                    }
                    else {
                        console.log('the season: ' + year + ' record doesnt exist')
                        return null
                    }
                })
        } catch (error) {
            console.log('get season by year has failed')
        }
    }

    seedDb() {
        for (let i = 1948; i < 2023; i++) {
            let season = {
                year: i,
                topLeague: false
            }
            this.postSeason(season)
        }
    }
}