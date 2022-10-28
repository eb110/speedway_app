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
  const [validator, setValidator] = useState(false);

  match.seasonGame.link = match.seasonGame.link.replaceAll('*', '/')

  useEffect(() => {
    const updateRiders = async () => {
      await new SpeedwayRider().fetchRidersFromDB(match, match.riders.length - 1)
        .then((res) => setMatch(Object.assign({}, res)))
        .then(() => countRidersPoints())
    }

    if (match.fetchRidersFromDB === true) {
      updateRiders()
      match.fetchRidersFromDB = false
    }
    else {
      setValidator(true)
    }
  }, [])

  const countResult = () => {
    let tempmatch = match
    tempmatch.awayResultPoints = 0
    tempmatch.homeResultPoints = 0
    tempmatch.awayHeats = 0
    tempmatch.homeHeats = 0
    tempmatch.bonuses = 0
    tempmatch.heats = 0
    tempmatch.games = 0
    tempmatch.paidPerfects = 0
    tempmatch.fullPerfects = 0
    tempmatch.points = 0
    for(let i = 0; i < tempmatch.riders.length; i++){
        let rd = tempmatch.riders[i]
        if(rd.homeAway === 'away'){
          tempmatch.awayResultPoints += rd.pointsCurrent
          tempmatch.awayHeats += rd.heatsCurrent
        }else{
          tempmatch.homeResultPoints += rd.pointsCurrent
          tempmatch.homeHeats += rd.heatsCurrent
        }
        tempmatch.bonuses += rd.bonusesCurrent
        tempmatch.heats += rd.heatsCurrent
        tempmatch.games++
        tempmatch.paidPerfects += rd.paidPerfectsCurrent
        tempmatch.fullPerfects += rd.fullPerfectsCurrent
        tempmatch.points += rd.pointsCurrent
    }
    setMatch(Object.assign({}, tempmatch))
    setValidator(true)
    console.log(match)
}

const countRidersPoints = () => {
    for (let i = 0; i < match.riders.length; i++) {
        match.riders[i].pointsString = match.riders[i].pointsString.replaceAll(' ', '')
        let points = match.riders[i].pointsString.split(',').filter((x) => x !== '-')
        let bonus = 0;
        let point = 0.0
        let heat = 0
        let fullPerfect = 0
        let paidPerfect = 0
        for (let j = 0; j < points.length; j++) {
            let heatRecord = points[j];
            let pointTemp = 0.0;
            if (heatRecord.includes(".")) {
                pointTemp = parseFloat(heatRecord.substring(0, 3));
            }
            else if ('0123456789'.includes(heatRecord[0]))
                pointTemp = +("" + heatRecord[0])
            if (heatRecord.includes("*"))
                bonus++;
            point += pointTemp;
            heat++;
        }

        if (heat >= 5 && point / heat === 3) {
            fullPerfect++;
        }
        else if (heat >= 5 && (point + bonus) / heat === 3) {
            paidPerfect++;
        }
        match.riders[i].heatsCurrent = heat
        match.riders[i].heats += heat
        match.riders[i].pointsCurrent = point
        match.riders[i].points += point
        match.riders[i].bonusesCurrent = bonus
        match.riders[i].bonuses += bonus
        match.riders[i].fullPerfectsCurrent = fullPerfect
        match.riders[i].fullPerfects += fullPerfect
        match.riders[i].paidPerfectsCurrent = paidPerfect
        match.riders[i].paidPerfects += paidPerfect
        match.riders[i].games++
        match.riders[i].perfect = (fullPerfect > 0 || paidPerfect > 0) ? true : false
    }
    countResult()
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

  const confirmMatch = async () => {
    let datka = match.dateOfGame.split('-')
    let datkaWsad = datka[2] + '-' + (datka[1].length === 1 ? '0' + datka[1] : datka[1]) + '-' + (datka[0].length === 1 ? '0' + datka[0] : datka[0]);
    try {
      await new SpeedwayMatch().insertMatch(datkaWsad, match.round, match.seasonGame.level)
        .then(() => new SpeedwayMatch().getLastMatch())
        .then((res) => { match.match = res; return })
        .then(() => new SpeedwayMatchRider().postMatchRiders(match, match.riders.length - 1))
        .then(() => new SpeedwayRider().updateRiders(match, match.riders.length - 1))
        .then(() => { new InsertedMatch().insertMatch(match.seasonGame.link); setMessage({ state: true, msg: 'The match has been uploaded' }) })
        .then(() => { match.seasonGame.inserted = true; new SeasonGames().updateSeasonGame(match.seasonGame) })
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

  return (

    <div>
      <div>
        Data: {match.dateOfGame} - {match.seasonGame.level}
      </div>
      {validator &&
        <div>
          <Team
            match={match}
            homeAway={'away'}
          />
          <RidersComponent
            match={match}
            homeAway='away'
            createNewRider={newRider}
          />
          <Team
            match={match}
            homeAway={'home'}
          />
          <RidersComponent
            match={match}
            homeAway='home'
            createNewRider={newRider}
          />
          <Validator
            match={match}
            confirmMatch={confirmMatch}
          /></div>}
      <div>
        {message.state &&
          message.msg
        }
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