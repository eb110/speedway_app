import React, {useEffect, useState} from 'react';
import SpeedwayTeam from '../../modelController/SpeedwayTeam';

const Team = (props) => {

    const [match, setMatch] = useState(props.match)
    const updateMatchComponent = props.updateMatchComponent;
    const [renderTeamInput, setRenderTeamInput] = useState(false)
    const homeAway = props.homeAway 
    const side = homeAway === "away" ? 'GOŚCIE' : 'GOSPODARZE'
    const heats = homeAway === "away" ? match.awayHeats : match.homeHeats
    const result = homeAway === "away" ? match.awayResultPoints : match.homeResultPoints
    const fullNameTag = homeAway === 'away' ? 'fullAwayName' : 'fullHomeName'
  
    useEffect(() => {
        if(match[fullNameTag] === undefined){
            fetchTeamName()
        }        
    },[])

    const fetchTeamName = async () => {
            await new SpeedwayTeam().getByName(match[homeAway])
            .then((res) => {
                                if(res){
                                    match[fullNameTag] = res.fullName
                                    match[homeAway + 'Id'] = res.id
                                    setMatch(Object.assign({}, match))}                                  
                                else{
                                    match[fullNameTag] = match[homeAway]
                                    setRenderTeamInput(true)
                                }})
    }

    const handleInputTeamChange = (event) => {
        const {value} = event.target;
        match[fullNameTag] = value
        setMatch(Object.assign({}, match))
    }

    const updateTeam = async () => {
        setRenderTeamInput(false)
        let newTeam = {
            name: match[homeAway],
            fullName: match[fullNameTag],
            created: Date.now(),
            lastUpdated: Date.now()
        }
        await new SpeedwayTeam().postNewTeam(newTeam)
        .then(() => new SpeedwayTeam().getLastId())
        .then((res) => match[homeAway + 'id'] = res)
        .then(() => updateMatchComponent(match))
    }

    return (
        <div>
            {side}: {result} BIEGI: {heats} 
            <div>
                {renderTeamInput &&
                    <div>
                        <input
                            style={{width: "20%"}}
                            value={match[fullNameTag]}
                            onChange={handleInputTeamChange}
                        />
                        <button
                            name={match[homeAway]}
                            onClick={event => updateTeam(event, homeAway)}
                        >Update</button>
                    </div>
                } 
            </div>
            <div>
                {match[fullNameTag]}
            </div>
        </div>
    )

}

export default Team