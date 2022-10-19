export default class SeasonModel{
    controller(){}

    async postSeason(season){
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

    seedDb(){
        for(let i = 1948; i < 2023; i++){
            let season = {
               year: i,
               topLeague: false 
            }
            this.postSeason(season)
        }
    }
}