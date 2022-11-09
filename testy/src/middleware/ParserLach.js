//pareser of the r.lach website
//the data has to be in a string format
//it has to be the fetched website of r.lach web page
//as r.lach works in lating format, endoing has to be performed and
//the result from encoder should to be provided to the parser (endoded.str)

class ParserLach {
    constructor(data) {
        this.data = data;
        this.home = ''
        this.away = ''
        this.round = ''
        this.league = ''
        this.dateOfGame = null
        this.official = ""
        this.riders = []
        this.fetchRidersFromDB = true
        this.roundAndLeagueParser()
        this.teamsNamesParser()
        this.dateOfGameParser()
        this.teamParser(1)
        this.teamParser(2)
        this.parseOfficial()
    }

    roundAndLeagueParser() {
        let check = this.data.substring(0, this.data.indexOf(':'))
        this.league = check.substring(check.lastIndexOf('\n') + 5)
        this.round = this.data.substring(this.data.indexOf('RUNDA') - 4, this.data.indexOf('RUNDA') - 1).replaceAll(' ', '')
        if (this.round.length === 0)
            this.round = 'PO'
    }

    teamsNamesParser() {
        let base = this.data.substring(this.data.indexOf('<title>') + 7, this.data.indexOf('</title>'))
        this.data = this.data.substring(this.data.indexOf(':') + 1)
        this.home = base.split(' - ')
        this.away = this.home[1].split(' ')[0]
        this.home = this.home[0].split(' ')[0]
    }

    dateOfGameParser() {
        let base = this.data.substring(0, this.data.indexOf('<'))
        this.data = this.data.substring(this.data.indexOf('1 '))
        this.dateOfGame = base.replaceAll(' ', '')
        if (this.dateOfGame.includes('('))
            this.dateOfGame = this.dateOfGame.substring(0, this.dateOfGame.indexOf('('))
        this.dateOfGame = this.dateOfGame.replace(/[^0-9-]/gi, '')
    }

    teamParser(flag) {
   //     console.log(this.data)
        let base = ""
        if (flag === 1) {
            base = this.data.substring(0, this.data.indexOf('\n     '))
            this.data = this.data.substring(this.data.indexOf('\n     '))
        }
        else {
            base = this.data.substring(this.data.indexOf('<br>\n    ') + 9, this.data.indexOf('<br><br>'))
       //     base = this.data.substring(this.data.indexOf('<br>\n    ') + 9, this.data.indexOf('Sędzia'))
        //            base = this.data.substring(this.data.indexOf('<br>\n    ') + 9, this.data.indexOf('Po'))
        }
        base = base.replaceAll('(G)', '')
        base = base.replaceAll('jr', '')
        base = base.replaceAll('jr.', '')
        base = base.replaceAll('\r', '')
        base = base.split('<br>\n    ').filter(x => x.includes('('))
        base = base.filter((riderData) => !riderData.includes('brak zawodnika'))
        for (let i = 0; i < base.length; i++) {
            let wsad = base[i]
            let rider = {}
            rider.nr = wsad.substring(0, wsad.indexOf(' '))
            wsad = wsad.substring(wsad.indexOf(' ') + 1)
            rider.name = wsad.substring(0, wsad.indexOf('.'))
            rider.surname = wsad.substring(wsad.indexOf('.') + 1)
            rider.surname = rider.surname.substring(0, rider.surname.indexOf(' '))
            if(rider.surname === 'H.JÖRGENSEN'){
                rider.name = 'L'
                rider.surname = 'Jörgensen'
            }
            if(rider.surname === 'B.MONBERG'){
                rider.name = 'J'
                rider.surname = 'MONBERG'
            }
            if(rider.surname === 'H.JONASSON'){
                rider.name = 'T'
                rider.surname = 'Jonasson'
            }
            if(rider.surname === 'JUUL'){
                rider.name = 'P'
                rider.surname = 'Larsen'
            }
            else if(rider.surname === 'H.NIELSEN'){
                rider.name = 'J'
                rider.surname = 'Nielsen'
            }
            else if(rider.surname === 'KARLSSON' && rider.name === 'M'){
                let datka = this.dateOfGame.substring(this.dateOfGame.lastIndexOf('-') + 1)
                if(datka < 2008)
                    rider.surname = 'Max'
            }
            else if(rider.surname === 'B.JENSEN'){
                rider.name = 'J'
                rider.surname = 'Monberg'
            }
            else if(rider.surname === 'K.IVERSEN'){
                rider.name = 'N'
                rider.surname = 'Iversen'
            }
            else if(rider.surname === 'N.ANDERSEN'){
                rider.name = 'H'
                rider.surname = 'Andersen'
            }
            else if(rider.surname === 'HAFENBROCK'){
                rider.surname = 'Hefenbrock'
            }
            else if(rider.surname === 'KYLMÄKORPII'){
                rider.surname = 'KYLMÄKORPI'
            }
            else if(rider.surname === 'RICHARDSSON'){
                rider.surname = 'Richardson'
            }
            else if(rider.surname === 'LINBÄCK'){
                rider.surname = 'LINDBÄCK'
            }
            else if(rider.surname === 'ZIELIŃSKI' && rider.name[0] === 'K'){
                let datka = this.dateOfGame.substring(this.dateOfGame.lastIndexOf('-') + 1)
                if(datka > 2005){
                    rider.name = 'Kam'
                }
                else{
                    rider.name = 'Krz'
                }
            }
            else if(rider.surname === 'WIELEMBOREK' && rider.name[0] === 'R'){
                let datka = this.dateOfGame.substring(this.dateOfGame.lastIndexOf('-') + 1)
                if(datka > 2000){
                    rider.name = 'Raf'
                }
                else{
                    rider.name = 'Rom'
                }
            }
            else if(rider.surname === 'FEDECZKO' && rider.name[0] === 'R'){
                let datka = this.dateOfGame.substring(this.dateOfGame.lastIndexOf('-') + 1)
                if(datka > 2000){
                    rider.name = 'Rob'
                }
                else{
                    rider.name = 'Rom'
                }
            }
            else if(rider.surname === 'BEDNARSKI' && rider.name[0] === 'J'){
                if(this.home === 'Toruń' || this.away === 'Toruń'){
                    rider.name = 'Jar'
                }
                else{
                    rider.name = 'Jan'
                }
            }
            else if(rider.surname === 'ANDERSSON' && rider.name[0] === 'D'){
                let datka = this.dateOfGame.substring(this.dateOfGame.lastIndexOf('-') + 1)
                if(datka > 2005){
                    rider.name = 'Den'
                }
                else{
                    rider.name = 'Dan'
                }
            }
            else if(rider.surname === 'JURCZYŃSKI' && rider.name[0] === 'J'){
                let datka = this.dateOfGame.substring(this.dateOfGame.lastIndexOf('-') + 1)
                if(datka > 2000){
                    rider.name = 'Jor'
                }
                else{
                    rider.name = 'Jar'
                }
            }
            else if(rider.surname === 'KOWALSKI' && rider.name[0] === 'R'){
                let datka = this.dateOfGame.substring(this.dateOfGame.lastIndexOf('-') + 1)
                if(datka > 1993){
                    rider.name = 'Raf'
                }
                else{
                    rider.name = 'Rys'
                }
            }
            else if(rider.surname === 'NOWACKI' && rider.name[0] === 'K'){
                let datka = this.dateOfGame.substring(this.dateOfGame.lastIndexOf('-') + 1)
                if(datka < 2010){
                    rider.name = 'Krz'
                }
                else{
                    rider.name = 'Kam'
                }
            }
          
            // if (wsad.indexOf('jr') !== -1)
            //     rider.surname = rider.surname.substring(0, rider.surname.indexOf('jr.') + 3)
            // else {
            //     rider.surname = rider.surname.substring(0, rider.surname.indexOf(' '))
            // }
            rider.pointsString = wsad.substring(wsad.indexOf('(') + 1, wsad.indexOf(')'))
            rider.pointsString = rider.pointsString.replaceAll('/', 'z')
            rider.pointsString = rider.pointsString.replaceAll('?', 'X')

            if(flag === 1){
                rider.homeAway = 'away'
            }else{
                rider.homeAway = 'home'
            }
            this.riders.push(rider)
        }
    }

    parseOfficial() {
        this.data = this.data.substring(this.data.indexOf("Sędzia: ") + 8)
        this.official = this.data.substring(0, this.data.indexOf(' ') + 1)
        this.data = this.data.substring(this.data.indexOf(' ') + 1)
        this.official += this.data.substring(0, this.data.indexOf(' '))
        this.official = this.official.trim()
        this.data = ''
    }

}

module.exports = ParserLach