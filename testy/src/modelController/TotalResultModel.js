export default class TotalResultModel {

    controller() { }

    getTotalResultById = async (id) => {
        try {
            return await fetch(`http://localhost:8080/totalResult/getById/${id}`)
                .then((res) => {
                    if (res.status === 200) {
                        return res.json()
                    }
                    else {
                        console.log('the total result of id: ' + id + ' doesnt exist in db')
                        return null
                    }
                })
        } catch (err) {
            console.log('get total result by id has failed')
        }
    }

    getAllRidersTotals = async () => {
        try {
            return await fetch(`http://localhost:8080/totalResult/getTotalOfAllRiders`)
                .then((res) => {
                    if (res.status === 200) {
                        return res.json()
                    }
                    else {
                        console.log('could not fetch the riders total result')
                        return null
                    }
                })
        } catch (err) {
            console.log('get total result of riders failed')
        }
    }

    addResultToTotalResult = async (tr) => {
        await this.getAllRidersTotals()
        .then((res) => {
            res.game += tr.game
            res.point += tr.point
            res.bonus += tr.bonus
            res.heat += tr.heat
            res.fullPerfect += tr.fullPerfect
            res.paidPerfect += tr.paidPerfect
            return res
        })
        .then((res) => this.updateTotalResult(res))
    }

    updateTotalResult = async (tr) => {
        let datka = Date.now();
        tr.lastUpdated = datka
        try {
            await fetch(`http://localhost:8080/totalResult/updateTotalResult`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(tr)
            });
        } catch (error) {
            console.log('update of total result has failed')
        }
    }
}