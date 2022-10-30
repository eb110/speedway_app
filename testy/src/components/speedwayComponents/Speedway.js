import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'
import RiderModel from '../../modelController/RiderModel';
import Teams from './Teams';
import SpeedwayMatchRider from '../../modelController/SpeedwayMatchRider';
import SpeedwayMatch from '../../modelController/SpeedwayMatch';
import SeasonGames from '../../modelController/SeasonGames';
import Validator from '../validators/Validator';
import TeamModel from '../../modelController/TeamModel';
import TotalResultModel from '../../modelController/TotalResultModel';

const Speedway = () => {

  const navigate = useNavigate()
  const [match, setMatch] = useState(JSON.parse(useParams().matchDetails))
  const [message, setMessage] = useState({ state: false, msg: '' })
  const [validator, setValidator] = useState(false);

  match.seasonGame.link = match.seasonGame.link.replaceAll('*', '/')

  useEffect(() => {
    const updateRiders = async () => {
      await new RiderModel().fetchRidersFromDB(match, match.riders.length - 1)
        .then((res) => new RiderModel().countRidersPoints(res))
        .then((res) => new TeamModel().countResult(res))
        .then((res) => setMatch(Object.assign({}, res)))
        .then(() => setValidator(true))
    }

    if (match.fetchRidersFromDB === true) {
      updateRiders()
      match.fetchRidersFromDB = false
    }
    else {
      setValidator(true)
    }
  }, [])

  const confirmMatch = async () => {
    let datka = match.dateOfGame.split('-')
    let datkaWsad = datka[2] + '-' + (datka[1].length === 1 ? '0' + datka[1] : datka[1]) + '-' + (datka[0].length === 1 ? '0' + datka[0] : datka[0]);
    new RiderModel().updateRidersResultForDbUpdate(match)

    try {
      await new SpeedwayMatch().insertMatch(datkaWsad, match.round, match.seasonGame.level)
        .then(() => new SpeedwayMatch().getLastMatch())
        .then((res) => { console.log('1'); match.match = res; return })
        .then(() => new SpeedwayMatchRider().postMatchRiders(match, match.riders.length - 1))
        .then(() => new RiderModel().updateRiders(match, match.riders.length - 1))
        .then(() => { match.seasonGame.inserted = true; new SeasonGames().updateSeasonGame(match.seasonGame) })
        .then(() => new TotalResultModel().updateTotalResult())
        .then(() => setMessage({ state: true, msg: 'ALL WENT OK' }))
    } catch (error) {
      match.seasonGame.inserted = false
      console.log('confirm of the match results failed')
      setMessage({ state: true, msg: error })
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
          <Teams
            match={match}
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