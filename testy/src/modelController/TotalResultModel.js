export default class TotalResultModel {

    controller() { }

    getTotalResultById = async (id) => {
        try {
            return await fetch(`http://localhost:8080/totalResult/getTotalResult/${id}`)
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
                body: JSON.stringify(rdr)
            });
        } catch (error) {
            console.log('update of total result has failed')
        }
    }
}