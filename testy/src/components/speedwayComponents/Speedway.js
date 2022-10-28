import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'
import RidersComponent from './RidersComponent';
import SpeedwayRider from '../../modelController/SpeedwayRider';
import InsertedMatch from '../../modelController/InsertedMatch';
import Team from './Team';
import SpeedwayMatchRider from '../../modelController/SpeedwayMatchRider';
import SpeedwayMatch from '../../modelController/SpeedwayMatch';
import SeasonGames from '../../modelController/SeasonGames';
import Validator from '../validators/Validator';

const Speedway = () => {

  const navigate = useNavigate()
  const [match, setMatch] = useState(JSON.parse(useParams().matchDetails))
  const [message, setMessage] = useState({ state: false, msg: '' })
  const [confirmMatch, setConfirmMatch] = useState(false)
 
  match.year = match.seasonGame.season.year
  match.seasonGame.link = match.seasonGame.link.replaceAll('*', '/')

  useEffect(() => {

    const updateRiders = async () => {
      await new SpeedwayRider().fetchRidersFromDB(match, match.riders.length - 1)
        .then((res) => setMatch(Object.assign({}, res))).then(() => confirmMatchFunction())
    }

    if (match.fetchRidersFromDB === true) {
      updateRiders()
      match.fetchRidersFromDB = false
    }

    confirmMatchFunction()
    levelOfGame()

  }, [])

  const levelOfGame = () => {
      match.league = match.seasonGame.level
  }

  const newRider = (riderNumber) => {
    for (let i = 0; i < match.riders.length; i++) {
      if (match.riders[i].nr === riderNumber) {
        match.riders[i].edit = true
        break
      }
    }
    match.seasonGame.link = match.seasonGame.link.replaceAll('/', '*')
    navigate(`/newRider/${JSON.stringify(match)}`)
  }

  const updateTheMatchFromTeamComponent = (homeAway, team) => {
    match[homeAway + "Team"] = team
    setMatch(Object.assign({}, match))
    setConfirmMatch(false)
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
      await new SpeedwayMatch().insertMatch(datkaWsad, match.round, match.seasonGame.level)
        .then(() => new SpeedwayMatch().getLastMatch())
        .then((res) => { match.match = res; return })
        .then(() => new SpeedwayMatchRider().postMatchRiders(match, match.riders.length - 1))
        .then(() => new SpeedwayRider().updateRiders(match, match.riders.length - 1))
        .then(() => { new InsertedMatch().insertMatch(match.seasonGame.link); setMessage({ state: true, msg: 'The match has been uploaded' }) })
        .then(() => {match.seasonGame.inserted = true; new SeasonGames().updateSeasonGame(match.seasonGame)})
    } catch (error) {
      match.seasonGame.inserted = false
      console.log('confirm of the match results failed')
    }
  }

  const goToTheLeagueComponent = () => {
    navigate(`/league/${JSON.stringify({ year: match.seasonGame.season.year, lige: match.seasonGame.level })}`)
  }

  const backHome = (event) => {
    navigate(`/`)
  }

  const validateGame = (state) => {
    console.log('STATE: ' + state)
  }

  return (

    <div>
      <div>
        Data: {match.dateOfGame} - {match.seasonGame.level}
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
      />

      <div>
        {confirmMatch &&
          <button
            onClick={confirmButton}
          >Confirm</button>
        }

        <Validator
          match={match}
          validateGame={validateGame}
        />  

        <div>
          {message.state &&
            message.msg
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