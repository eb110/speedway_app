import React, {useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom'
import RidersComponent from '../components/speedwayComponents/RidersComponent';
import MatchResultCalculator from '../middleware/MatchResultCalculator';
import SpeedwayRider from '../modelController/SpeedwayRider';
import SpeedwayTeam from '../modelController/SpeedwayTeam';
import InsertedMatch from '../modelController/InsertedMatch';

const SpeedwayMatch = () => {

  const {matchDetails} = useParams();
  const navigate = useNavigate()
  const [match, setMatch] = useState(JSON.parse(matchDetails))
  const [homeTeam, setHomeTeam] = useState({fullName: match.home, name:match.home})
  const [awayTeam, setAwayTeam] = useState({fullName: match.away, name: match.away})

  const [renderHomeTeamInput, setRenderHomeTeamInput] = useState(false)
  const [renderAwayTeamInput, setRenderAwayTeamInput] = useState(false)

  const [message, setMessage] = useState({state:false, msg:''})

  useEffect(() => {

    const updateRiders = async () => {

        let copyMatch = match

        await parseRiderJson(copyMatch, 'awayRiders')
        await parseRiderJson(copyMatch, 'homeRiders')
    
        setMatch(Object.assign({}, copyMatch))
      } 
      
    updateRiders()
    fetchTeamNames()

    },[])

    const fetchTeamNames = async () => {

      /*
      Team names db obtaining process.
      If db doesn't possess current team then the team input is set to true and is displayed to the user.
      If db possess current team name then the team name is set based on the db output.
      */
      let st = new SpeedwayTeam()
      await st.getByName(match.home).then((res) => res ? setHomeTeam(res) : setRenderHomeTeamInput(true))
      await st.getByName(match.away).then((res) => res ? setAwayTeam(res) : setRenderAwayTeamInput(true))

    }

    const parseRiderJson = async (copyMatch, homeAwayTeam) => {
      let sr = new SpeedwayRider()
      await sr.parseRiderJson(copyMatch, homeAwayTeam, match).then((res) => setMatch[res])
    }

    const handleInputHomeTeamChange = (event) => {
      const {value} = event.target;
      let temp = {}
      temp.fullName = value
      temp.name = homeTeam.name
      temp.id = homeTeam.id
      setHomeTeam(temp)
    }

    const handleInputAwayTeamChange = (event) => {
      const {value} = event.target;
      let temp = {}
      temp.fullName = value
      temp.name = awayTeam.name
      temp.id = awayTeam.id
      setAwayTeam(temp)
    }

    const editButton = (riderNumber, flag) => {
      let copyMatch = Object.assign({}, match)
      copyMatch.data = riderNumber
      copyMatch = JSON.stringify(copyMatch)
      if(flag)
        navigate(`/newRider/${copyMatch}`)
      }

    const updateTeam = async (event, mask) => {

      let st = new SpeedwayTeam();
      await st.getLastId()
        .then((res) => st.createNewTeam(res + 1, mask, homeTeam.fullName, awayTeam.fullName, match.home, match.away))
        .then((res) => st.postNewTeam(res))
        .then((res) => mask === 'home' ? setHomeTeam(res) : setAwayTeam(res))

      if(mask === 'home'){
        setRenderHomeTeamInput(false)
      }
      else{
        setRenderAwayTeamInput(false)
      }
    }

    const confirmButton = async () => {

      let awayRds = []
      let homeRds = []

      for(let i = 0; i < match.awayRiders.length; i++){
        let wsad = {id: match.awayRiders[i].id, nr: match.awayRiders[i].nr, pkt: match.awayRiders[i].points}
        awayRds.push(wsad)
      }

      for(let i = 0; i < match.homeRiders.length; i++){
        let wsad = {id: match.homeRiders[i].id, nr: match.homeRiders[i].nr, pkt: match.homeRiders[i].points}
        homeRds.push(wsad)
      }

      let matchWsad = {
        awayId: awayTeam.id,
        homeId: homeTeam.id,
        dateOfGame: match.dateOfGame,
        league: match.league,
        round: match.round,
        awayRiders: awayRds,
        homeRiders: homeRds
      }

      new MatchResultCalculator(matchWsad)

      setMessage({state: true, msg: 'The match has been uploaded'})

      new InsertedMatch().insertMatch(match.link)

    }
      
  return (

    <div>
      <div>
        Data: {match.dateOfGame} Runda: {match.round} Liga: {match.league}
      </div>
      <div>
        GOŚCIE:
        {renderAwayTeamInput &&
          <div>
            <input
              style={{width: "20%"}}
              value={awayTeam.fullName}
              onChange={handleInputAwayTeamChange}
            />
            <button
              name={match.away}
              onClick={event => updateTeam(event, 'away')}
            >Update</button>
          </div>
        }  
      </div>
      <RidersComponent
        matchResult={match.awayRiders}
        matchTeam={awayTeam.fullName}
        funkcja={editButton}
      />
      <div>
        GOSPODARZE:
        {renderHomeTeamInput &&
          <div>
            <input
              style={{width: "20%"}}
              value={homeTeam.fullName}
              onChange={handleInputHomeTeamChange}
            />
          <button
            name={match.home}
            onClick={event => updateTeam(event, 'home')}
          >Update</button>
     </div>
        }  
      </div>
      <RidersComponent
        matchResult={match.homeRiders}
        matchTeam={homeTeam.fullName}
        funkcja={editButton}
      />
      <div>
        <button
          onClick={confirmButton}
        >Confirm</button>
        <div>
          {message.state &&
            message.msg
          }
        </div>
      </div>
    </div>
        
      );
}

export default SpeedwayMatch;