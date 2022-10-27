export default class SeasonGames {
    controller() { }

    async postSeasonGames(seasonGames) {
        try {
            return await fetch(`http://localhost:8080/seasonGames/addSeasonGames/`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(seasonGames)
            })
        } catch (error) {
            console.log('add season games failed')
        }
    }

    async getAllBySeasonId(seasonId) {
        try {
            return await fetch(`http://localhost:8080/seasonGames/getAllBySeasonId/${seasonId}`)
                .then((res) => res.json())
        } catch (error) {
            console.log('get the list of season games by season id has failed')
        }
    }

    async updateSeasonGame(seasonGame) {
        try {
            await fetch(`http://localhost:8080/seasonGames/updateSeasonGames`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(seasonGame)
            });
        } catch (error) {
            console.log('update of the season game has failed')
        }}

        prepareRlachLinkElements(seasonGames, year){
            for (let i = 0; i < seasonGames.length; i++) {
                let rlachHome = seasonGames[i].home.substring(0, 2).toLowerCase()
                let rlachAway = seasonGames[i].away.substring(0, 2).toLowerCase()
                //zielona góra case
                rlachAway = rlachAway === 'zi' ? 'zg' : rlachAway === 'św' ? 'sw' : rlachAway
                rlachHome = rlachHome === 'zi' ? 'zg' : rlachHome === 'św' ? 'sw' : rlachHome
                let rlachLeague = seasonGames[i].level === 'topLeague' ? '_1.htm' : 'next choice'
                let rlachDomain = seasonGames[i].level === 'topLeague' ? 'http:**www.speedwayw.pl*dmp*' : 'next choice'
                seasonGames[i].link = rlachDomain + year + '*' + rlachHome + rlachAway + rlachLeague
            }
            return seasonGames
        }

    async postSeasonsGames(seasonsGames, index){
            if (index < 0)
                return
            await this.postSeasonGames(seasonsGames[index])
                .then((res) => this.postSeasonsGames(seasonsGames, index - 1))
        }
    }