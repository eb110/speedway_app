export default class InsertedMatch{
    insertMatch = async (im) => {
        let matchName = {
            name: im
        }
        try{
            return await fetch(`http://localhost:8080/insertedMatch/insertMatchName`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(matchName)        
            });
        }catch(error){
         console.log('match name insert failed')
        }
    }

    rlachLinkToName = (link) => {
        let linkParts = link.split('/')
        let res = linkParts[4] + '_' + linkParts[5].substring(0, 6)
        return res
    }

    /*
    The link comes from rlach page. It is shrunk to shorter version by link to name method
    This name is added to the json which then is send to render component
    This name is needed later on to check if current link already been checked
    */
    addLinkToMatchJson = (link, json) => {
        link = this.rlachLinkToName(link)
        json = '{"link": "' + link + '",' + json.substring(1)
        return json
    }
    
    checkIfExist = async (name) => {
        try{
            return await fetch(`http://localhost:8080/insertedMatch/checkIfExist/${name}`)
            .then((res) => res.json())
          } catch(err){
              console.log('get rider by id has failed')
          }
    }
}