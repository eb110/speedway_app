import React, {useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom'
import RidersComponent from '../components/speedwayComponents/RidersComponent';
import MatchResultCalculator from '../middleware/MatchResultCalculator';
import SpeedwayRider from '../modelController/SpeedwayRider';
import InsertedMatch from '../modelController/InsertedMatch';
import Team from '../components/speedwayComponents/Team';

const SpeedwayMatch = () => {

  const navigate = useNavigate()
  const [match, setMatch] = useState(JSON.parse(useParams().matchDetails))
  const [homeTeam, setHomeTeam] = useState({fullName: match.home, name:match.home})
  const [awayTeam, setAwayTeam] = useState({fullName: match.away, name: match.away})
  const [message, setMessage] = useState({state:false, msg:''})

  useEffect(() => {

    const updateRiders = async () => {
        console.log('db read')
        await new SpeedwayRider().fetchRidersFromDB(match, match.riders.length - 1).then((res) => setMatch(Object.assign({}, res)))
      } 
    
    if(match.fetchRidersFromDB === true){  
      updateRiders()
      match.fetchRidersFromDB = false
    }

    },[])

    const newRider = (riderNumber) => {
      console.log('db read')
      for(let i = 0; i < match.riders.length; i++){
        if(match.riders[i].nr === riderNumber){
          match.riders[i].edit = true
          console.log(match.riders[i])
          break
        }
      }
      navigate(`/newRider/${JSON.stringify(match)}`)
      }

    /*
    Card_013
    */  
    const updateTheMatchFromTeamComponent = (matchFromTeamComponent) => {
      console.log('db read')
      setMatch(Object.assign({}, matchFromTeamComponent))
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
        Data: {match.dateOfGame} - {match.league}
      </div>
      <div>
        <Team
          match={match}
          homeAway={'away'}
          updateMatchComponent={updateTheMatchFromTeamComponent}
        />    
      </div>
        <RidersComponent
          match={match}
          homeAway='away'
          createNewRider={newRider}
        />
      <div>
        <Team
          match={match}
          homeAway={'home'}
          updateMatchComponent={updateTheMatchFromTeamComponent}
        />  
      </div>
        <RidersComponent
          match={match}
          homeAway='home'
          createNewRider={newRider}
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