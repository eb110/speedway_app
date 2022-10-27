import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'
import RidersComponent from './RidersComponent';
import SpeedwayRider from '../../modelController/SpeedwayRider';
import InsertedMatch from '../../modelController/InsertedMatch';
import Team from './Team';
import SpeedwayMatchRider from '../../modelController/SpeedwayMatchRider';
import SpeedwayMatch from '../../modelController/SpeedwayMatch';
import SeasonGames from '../../modelController/SeasonGames';

const Speedway = () => {

  const navigate = useNavigate()
  const [match, setMatch] = useState(JSON.parse(useParams().matchDetails))
  const [message, setMessage] = useState({ state: false, msg: '' })
  const [messageResultCalc, setMessageResultCalc] = useState({ state: false, msg: '' })
  const [ageMessageWarning, setAgeMessageWarning] = useState({ state: false, msg: '' })
  const [confirmMatch, setConfirmMatch] = useState(false)
  const [confirmStartingNumbers, setConfirmStartingNumbers] = useState({ state: false, msg: '' })
  const [confirmDateOfGame, setConfirmDateOfGame] = useState({ state: false, msg: '' })

  useEffect(() => {

    calculateResultReliability()

    const updateRiders = async () => {
      await new SpeedwayRider().fetchRidersFromDB(match, match.riders.length - 1)
        .then((res) => setMatch(Object.assign({}, res))).then(() => confirmMatchFunction())
        .then((res) => {
          calculateAgeLimits()
          confirmGameDate()
          confirmRidersStartingNumbers()
        })
    }

    if (match.fetchRidersFromDB === true) {
      updateRiders()
      match.fetchRidersFromDB = false
    }

    confirmMatchFunction()
    levelOfGame(match.link[match.link.length - 1])

  }, [])

  const levelOfGame = (level) => {
    if(level === '1')
      match.league = 'topLeague'
  }

  const confirmGameDate = () => {
    let tempYear = match.dateOfGame.substring(match.dateOfGame.lastIndexOf('-') + 1)
    if(tempYear !== match.year || match.dateOfGame.length > 10){
      setConfirmDateOfGame({state: true, msg: 'Check the date of game'})
      setConfirmMatch(false)
    }
  }

  const newRider = (riderNumber) => {
    for (let i = 0; i < match.riders.length; i++) {
      if (match.riders[i].nr === riderNumber) {
        match.riders[i].edit = true
        break
      }
    }
    navigate(`/newRider/${JSON.stringify(match)}`)
  }

  const updateTheMatchFromTeamComponent = (homeAway, team) => {
    match[homeAway + "Team"] = team
    setMatch(Object.assign({}, match))
    setConfirmMatch(false)
  }

  const confirmRidersStartingNumbers = () => {
    let numb = ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16']
    if(match.riders.some((rider) => !numb.includes(rider.nr))){
      setConfirmStartingNumbers({state: true, msg: 'Check starting numbers'})
      setConfirmMatch(false)
    }
  }

  const confirmMatchFunction = () => {
    if (match.riders.some(x => x.edit === undefined))
      return
    if (match.homeConfirmed && match.awayConfirmed) {
      setConfirmMatch(true)
    }
  }

  const updateConfirmTeams = (homeAway) => {
    match[homeAway + "Confirmed"] = true;
    confirmMatchFunction()
  }

  const calculateResultReliability = () => {
    const pts = match.awayResultPoints + match.homeResultPoints
    const bg = match.awayHeats + match.homeHeats
    if (pts !== 90 || bg !== 60) {
      setMessageResultCalc({ state: true, msg: 'CHECK THE RESULT: Points: ' + pts + ' Heats: ' + bg })
    }
    else {
      setMessageResultCalc({ state: false, msg: '' })
    }
  }

  const calculateAgeLimits = () => {
    let ageMistake = match.riders.filter((rider) => rider.seasonAge < 16 || rider.seasonAge > 40)
    if (ageMistake.length > 0) {
      let msg = 'Check the age of riders: '
      for (let i = 0; i < ageMistake.length; i++)
        msg += ageMistake[i].surname + ' '
      setAgeMessageWarning({ state: true, msg: msg })
    }
  }

  const updateRidersScoring = () => {
    for(let i = 0; i < match.riders.length; i++){
      match.riders[i].bonuses += match.riders[i].bonusesCurrent
      match.riders[i].points += match.riders[i].pointsCurrent
      match.riders[i].heats += match.riders[i].heatsCurrent
      match.riders[i].paidPerfects += match.riders[i].paidPerfectsCurrent
      match.riders[i].fullPerfects += match.riders[i].fullPerfectsCurrent
      match.riders[i].games++
    }
  }

  const confirmButton = async () => {
    updateRidersScoring()
    setConfirmMatch(false)
    let datka = match.dateOfGame.split('-')
    let datkaWsad = datka[2] + '-' + (datka[1].length === 1 ? '0' + datka[1] : datka[1]) + '-' + (datka[0].length === 1 ? '0' + datka[0] : datka[0]);
    try {
      await new SpeedwayMatch().insertMatch(datkaWsad, match.round, match.league)
        .then(() => new SpeedwayMatch().getLastMatch())
        .then((res) => { match.match = res; return })
        .then(() => new SpeedwayMatchRider().postMatchRiders(match, match.riders.length - 1))
        .then(() => new SpeedwayRider().updateRiders(match, match.riders.length - 1))
        .then(() => { new InsertedMatch().insertMatch(match.link); setMessage({ state: true, msg: 'The match has been uploaded' }) })
        .then(() => new SeasonGames().updateInsertedStateToTrue(match.seasonGameId))
      //to do -> update riders
    } catch (error) {
      console.log('confirm of the match results failed')
    }
  }

  const goToTheLeagueComponent = () => {
    navigate(`/league/${JSON.stringify({ year: match.year, lige: match.league })}`)
  }

  const backHome = (event) => {
    navigate(`/`)
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
          updateTeamConfirm={updateConfirmTeams}
        />
      </div>
      <RidersComponent
        match={match}
        homeAway='away'
        createNewRider={newRider}
        updateSpeedwayMatchResult={calculateResultReliability}
      />
      <div>
        <Team
          match={match}
          homeAway={'home'}
          updateMatchComponent={updateTheMatchFromTeamComponent}
          updateTeamConfirm={updateConfirmTeams}
        />
      </div>
      <RidersComponent
        match={match}
        homeAway='home'
        createNewRider={newRider}
        updateSpeedwayMatchResult={calculateResultReliability}
      />

      <div>
        {confirmMatch &&
          <button
            onClick={confirmButton}
          >Confirm</button>
        }
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
        <div>
          {ageMessageWarning.state &&
            ageMessageWarning.msg
          }
        </div>
        <div>
          {confirmStartingNumbers.state &&
            confirmStartingNumbers.msg
          }
        </div>
        <div>
          {confirmDateOfGame.state &&
            confirmDateOfGame.msg
          }
        </div>
      </div>
      <div>
        <button
          onClick={goToTheLeagueComponent}
        >Back</button>
        <button
          name='backToHome'
          onClick={event => backHome(event)}
        >Home</button>
      </div>
    </div>

  );
}

export default Speedway;