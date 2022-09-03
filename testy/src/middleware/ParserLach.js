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
        this.away = ''
        this.round = ''
        this.league = ''
        this.dateOfGame = null
        this.homeRiders = []
        this.awayRiders = []
        this.official = ""
        this.roundAndLeagueParser()
        this.teamsNamesParser()
        this.dateOfGameParser()
        this.teamParser(1, this.awayRiders)
        this.teamParser(2, this.homeRiders)
        this.parseOfficial()
    }

    roundAndLeagueParser(){
        let check = this.data.substring(0, this.data.indexOf(':'))
        this.league = check.substring(check.lastIndexOf('\n') + 5)
        this.round = this.data.substring(this.data.indexOf('RUNDA') -4, this.data.indexOf('RUNDA') - 1).replaceAll(' ', '')
        if(this.round.length === 0)
            this.round = 'PO'
    }


    teamsNamesParser(){
        let base = this.data.substring(this.data.indexOf('<title>') + 7, this.data.indexOf('</title>'))
        this.data = this.data.substring(this.data.indexOf(':') + 1)
        this.home = base.split(' - ')
        this.away = this.home[1]
        this.home = this.home[0]
    }

    dateOfGameParser(){
        let base = this.data.substring(0, this.data.indexOf('<'))
        this.data = this.data.substring(this.data.indexOf('1 '))
        //base = base.split('-').map(x => parseInt(x))
        //this.dateOfGame = new Date(base[2], base[1], base[0])
        this.dateOfGame = base.replaceAll(' ', '')
        console.log(this.league)
        
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
            rider.points = wsad.substring(wsad.indexOf('(') + 1, wsad.indexOf(')'))
            //as there is an issue with '/-' during the render
            //if rider has had an accident and has been replaced then the 'z' letter
            //is provided
            rider.points = rider.points.replaceAll('/-', 'z')
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

}

module.exports = ParserLach