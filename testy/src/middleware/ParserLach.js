//pareser of the r.lach website
//the data has to be in a string format
//it has to be the fetched website of r.lach web page
//as r.lach works in lating format, endoing has to be performed and
//the result from encoder should to be provided to the parser (endoded.str)

class ParserLach {
    constructor(data){
       // console.log(data)
        this.data = data;
        this.home = ''
        this.fullHomeName = undefined
        this.fullAwayName = undefined
        this.away = ''
        this.round = ''
        this.league = ''
        this.dateOfGame = null
        this.homeRiders = []
        this.awayRiders = []
        this.official = ""
        this.riders = []
        this.fetchRidersFromDB = true
        this.awayResultPoints = 0.0
        this.homeResultPoints = 0.0
        this.awayHeats = 0
        this.homeHeats = 0
        this.homeConfirmed = false
        this.awayConfirmed = false
        this.roundAndLeagueParser()
        this.teamsNamesParser()
        this.dateOfGameParser()
        this.teamParser(1, this.awayRiders)
        this.teamParser(2, this.homeRiders)
        this.parseOfficial()
        this.consolidateRiders();
        
        let res = this.countResult(this.awayRiders)
        this.awayResultPoints = res[0]
        this.awayHeats = res[1]
        this.awayRiders = res[2]
        res = this.countResult(this.homeRiders)
        this.homeResultPoints = res[0]
        this.homeHeats = res[1]
        this.homeRiders = res[2]
        
    }

    roundAndLeagueParser(){
        let check = this.data.substring(0, this.data.indexOf(':'))
        this.league = check.substring(check.lastIndexOf('\n') + 5)
        this.round = this.data.substring(this.data.indexOf('RUNDA') -4, this.data.indexOf('RUNDA') - 1).replaceAll(' ', '')
        if(this.round.length === 0)
            this.round = 'PO'
    }

    consolidateRiders(){
        for(let i = 0; i < this.awayRiders.length; i++){
            let wsad = this.awayRiders[i]
            wsad.homeAway = 'away'
            this.riders.push(wsad)
        }
        for(let i = 0; i < this.homeRiders.length; i++){
            let wsad = this.homeRiders[i]
            wsad.homeAway = 'home'
            this.riders.push(wsad)
        }
    }


    teamsNamesParser(){
        let base = this.data.substring(this.data.indexOf('<title>') + 7, this.data.indexOf('</title>'))
        this.data = this.data.substring(this.data.indexOf(':') + 1)
        this.home = base.split(' - ')
        this.away = this.home[1].split(' ')[0]
        this.home = this.home[0].split(' ')[0]
    }

    dateOfGameParser(){
        let base = this.data.substring(0, this.data.indexOf('<'))
        this.data = this.data.substring(this.data.indexOf('1 '))
        //base = base.split('-').map(x => parseInt(x))
        //this.dateOfGame = new Date(base[2], base[1], base[0])
        this.dateOfGame = base.replaceAll(' ', '')  
    }

    teamParser(flag, arr){
        let base = ""
        if(flag === 1){
            base = this.data.substring(0, this.data.indexOf('\n     '))
            this.data = this.data.substring(this.data.indexOf('\n     '))
        }
        else{
            base = this.data.substring(this.data.indexOf('<br>\n    ') + 9, this.data.indexOf('<br><br>'))
        }
        base = base.replaceAll('(G)', '')
        base = base.split('<br>\r\n    ').filter(x => x.includes('('))      
        for(let i = 0; i < base.length; i++){
            let wsad = base[i]
            let rider = {}
            rider.nr = wsad.substring(0, wsad.indexOf(' '))
            wsad = wsad.substring(wsad.indexOf(' ') + 1)
            rider.name = wsad.substring(0, wsad.indexOf('.'))
            rider.surname = wsad.substring(wsad.indexOf('.') + 1)
            if(wsad.indexOf('jr') !== -1)
                rider.surname = rider.surname.substring(0, rider.surname.indexOf('jr.') + 3)
            else{
                rider.surname = rider.surname.substring(0, rider.surname.indexOf(' '))
            }         
            rider.pointsString = wsad.substring(wsad.indexOf('(') + 1, wsad.indexOf(')'))
            //as there is an issue with '/-' during the render
            //if rider has had an accident and has been replaced then the 'z' letter
            //is provided
            rider.pointsString = rider.pointsString.replaceAll('/', 'z')
            arr.push(rider)    
        }
    }

    parseOfficial(){
        this.data = this.data.substring(this.data.indexOf("Sędzia: ") + 8)
        this.official = this.data.substring(0, this.data.indexOf(' ') + 1)
        this.data = this.data.substring(this.data.indexOf(' ') + 1)
        this.official += this.data.substring(0, this.data.indexOf(' '))
        this.official = this.official.trim()
        this.data = ''
    }

    countResult(riders){
        let result = 0.0
        let heats = 0
        for(let i = 0; i < riders.length; i++){
            let points = riders[i].pointsString.split(',').filter((x) => x !== '-')
            let bonus = 0;
            let point = 0.0
            let heat = 0
            let fullPerfect = 0
            let paidPerfect = 0
            for(let j = 0; j < points.length; j++){
                let heatRecord = points[j];
                let pointTemp = 0.0;
                if(heatRecord.includes("."))
                    pointTemp = parseFloat(heatRecord.substring(0, 3));               
                if('0123456789'.includes(heatRecord[0]))
                    pointTemp = +("" + heatRecord[0])             
                if(heatRecord.includes("*"))
                    bonus++;
                point += pointTemp;
                result += pointTemp;
                heats++;
                heat++;
            }
  
            if(heat >= 5 && point / heat === 3){
                fullPerfect++;
            }
            else if(heat >= 5 && (point + bonus) / heat === 3) {
                paidPerfect++;
            }
            riders[i].heats = heat
            riders[i].points = point
            riders[i].bonuses = bonus
            riders[i].games = 1
            riders[i].fullPerfects = fullPerfect
            riders[i].paidPerfects = paidPerfect
            riders[i].perfect = (fullPerfect > 0 || paidPerfect > 0) ? true : false
        }
        return [result, heats, riders]
    }

}

module.exports = ParserLach