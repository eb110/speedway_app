//encoder instance is based upon the fetched binary data
//usually axios res.data
//this.str sends back the same string but encoded

class EncoderLatin {
    constructor(data){
        this.dataToEncode = data
        this.binaryToCharIntegersValue()
        this.l = this.dataToEncode.length
        this.dataDecoded = []   
        this.encode()
        this.str = ''
        this.toString()
    }

    binaryToCharIntegersValue(){
        this.dataToEncode = new Int8Array(this.dataToEncode);
    }

    encode(){
        let latinLettersCodes = [-84, -96, -13, -22, -47, -93, -90, -15, -77, -81, -95, -45, -54, -79, -68, -36, -42, -65, -74, -60, -58]
        for(let i = 0; i < this.l; i++){
            let latinLetters = ['Ź', ' ', 'ó', 'ę', 'Ń', 'Ł', 'Ś', 'ń', 'ł', 'Ż', 'Ą', 'Ó', 'Ę', 'ą', 'ź', 'Ü', 'Ö', 'ż', 'ś', 'Ä', 'Ć']
            let letterValue = this.dataToEncode[i]
            if(letterValue < 0){
                if(latinLettersCodes.includes(letterValue))
                    this.dataDecoded.push(latinLetters[latinLettersCodes.indexOf(letterValue)])
                else{
                    console.log(`no letter found for value: ${letterValue}`)
                    this.dataDecoded.push('�')
                }
            }
            else{
                this.dataDecoded.push(String.fromCharCode(letterValue))
            }
        }
        // console.log(this.dataDecoded)
    }

    toString(){
       for(let i = 0; i < this.l; i++)
            this.str += this.dataDecoded[i] 
         //   console.log(this.str)    
    }
}

module.exports = EncoderLatin