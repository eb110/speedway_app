import React, {useEffect, useState} from 'react';
import SpeedwayTeam from '../../modelController/SpeedwayTeam';

const Team = (props) => {

    const [match, setMatch] = useState(props.match)
    const updateMatchComponent = props.updateMatchComponent;
    const updateMatchConfirm = props.updateTeamConfirm
    const [renderTeamInput, setRenderTeamInput] = useState(false)
    const homeAway = props.homeAway 
    const side = homeAway === "away" ? 'GOŚCIE' : 'GOSPODARZE'
    const heats = homeAway === "away" ? props.match.awayHeats : props.match.homeHeats
    const result = homeAway === "away" ? props.match.awayResultPoints : props.match.homeResultPoints
    const fullNameTag = homeAway === 'away' ? 'fullAwayName' : 'fullHomeName'
  
    useEffect(() => {
        if(match[fullNameTag] === undefined || !match[fullNameTag].includes(' ')){
            fetchTeamName()
        }        
    },[])

    const fetchTeamName = async () => {
            await new SpeedwayTeam().getByName(match[homeAway])
            .then((res) => {
                                if(res){  
                                    updateMatchConfirm(homeAway)                      
                                    match[fullNameTag] = res.fullName
                                    match[homeAway + 'Id'] = res.id
                                    match[homeAway + "Team"] = res
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
        updateMatchConfirm(homeAway)     
        setRenderTeamInput(false)
        let newTeam = {
            name: match[homeAway],
            fullName: match[fullNameTag],
            created: Date.now(),
            lastUpdated: Date.now()
        }
        await new SpeedwayTeam().postNewTeam(newTeam)
        .then(() => new SpeedwayTeam().getLastId())
        .then((res) => {
                        newTeam.id = res
                        updateMatchComponent(homeAway, newTeam)})
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