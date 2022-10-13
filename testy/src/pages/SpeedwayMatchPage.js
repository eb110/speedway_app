import React, {useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom'
import RidersComponent from '../components/speedwayComponents/RidersComponent';
import SpeedwayRider from '../modelController/SpeedwayRider';
import InsertedMatch from '../modelController/InsertedMatch';
import Team from '../components/speedwayComponents/Team';
import SpeedwayMatchRider from '../modelController/SpeedwayMatchRider';
import SpeedwayMatch from '../modelController/SpeedwayMatch';

const SpeedwayMatchPage = () => {

  const navigate = useNavigate()
  const [match, setMatch] = useState(JSON.parse(useParams().matchDetails))
  const [message, setMessage] = useState({state:false, msg:''})
  const [messageResultCalc, setMessageResultCalc] = useState({state:false, msg:''})
  //console.log(match)

  useEffect(() => {

  calculateResultReliability()

    const updateRiders = async () => {
        await new SpeedwayRider().fetchRidersFromDB(match, match.riders.length - 1)
        .then((res) => setMatch(Object.assign({}, res)))
      } 
    
    if(match.fetchRidersFromDB === true){  
      updateRiders()
      match.fetchRidersFromDB = false
    }

    },[])

    const newRider = (riderNumber) => {
      for(let i = 0; i < match.riders.length; i++){
        if(match.riders[i].nr === riderNumber){
          match.riders[i].edit = true
          break
        }
      }
      navigate(`/newRider/${JSON.stringify(match)}`)
      }
 
    const updateTheMatchFromTeamComponent = (homeAway, team) => {
      match[homeAway + "Team"] = team
      setMatch(Object.assign({}, match))
    }

    const calculateResultReliability = () => {
      const pts = match.awayResultPoints + match.homeResultPoints
      const bg = match.awayHeats + match.homeHeats
      if(pts !== 90 || bg !== 60){
        setMessageResultCalc({state:true, msg: 'CHECK THE RESULT: Points: ' + pts + ' Heats: ' + bg})
      }
    }
    
    const confirmButton = async () => {

      let datka = match.dateOfGame.split('-')
      let datkaWsad = datka[2] + '-' + (datka[1].length === 1 ? '0' + datka[1] : datka[1]) + '-' + (datka[0].length === 1 ? '0' + datka[0] : datka[0]);
      try{
        await new SpeedwayMatch().insertMatch(datkaWsad, match.round, match.league)
        .then(() => new SpeedwayMatch().getLastMatch())
        .then((res) => {match.match = res; return})
        .then(() => new SpeedwayMatchRider().postMatchRiders(match, match.riders.length - 1))
        .then(() => new SpeedwayRider().updateRiders(match, match.riders.length - 1))
        .then(() => {new InsertedMatch().insertMatch(match.link); setMessage({state: true, msg: 'The match has been uploaded'})})
        //to do -> update riders
      }catch(error){
        console.log('confirm of the match results failed')
    }}
      
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
        <div>
          {messageResultCalc.state &&
            messageResultCalc.msg
          }
        </div>
      </div>
    </div>
        
      );
}

export default SpeedwayMatchPage;