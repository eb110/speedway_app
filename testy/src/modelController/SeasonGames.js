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

    async updateInsertedStateToTrue(seasonGameId) {
        let sg = {
            id: seasonGameId
        }
        try {
            await fetch(`http://localhost:8080/seasonGames/updateSeasonGames`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(sg)
            });
        } catch (error) {
            console.log('update of the season game has failed')
        }}

        prepareRlachLinkElements(seasonGames, year){
            for (let i = 0; i < seasonGames.length; i++) {
                seasonGames[i].rlachHome = seasonGames[i].home.substring(0, 2).toLowerCase()
                seasonGames[i].rlachAway = seasonGames[i].away.substring(0, 2).toLowerCase()
                seasonGames[i].rlachLeague = seasonGames[i].level === 'topLeague' ? '_1.htm' : 'next choice'
                seasonGames[i].rlachDomain = seasonGames[i].level === 'topLeague' ? 'http://www.speedwayw.pl/dmp/' : 'next choice'
                seasonGames[i].link = seasonGames[i].rlachDomain + year + '/' + seasonGames[i].rlachHome + seasonGames[i].rlachAway + seasonGames[i].rlachLeague
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