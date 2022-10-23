import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import SeasonGames from '../../modelController/SeasonGames';
import SeasonModel from '../../modelController/SeasonModel';
import SpeedwayTeam from "../../modelController/SpeedwayTeam"

const LeagueComponent = (props) => {
    const rok = props.leagueDetails.year
    const liga = props.leagueDetails.liga
    const navigate = useNavigate()

    let key = 1
    const [season, setSeason] = useState('')
    const [teams, setTeams] = useState([])
    const [newTeam, setNewTeam] = useState('')
    const [pickTeams, setPickTeams] = useState(false)
    const [displaySeason, setDisplaySeason] = useState(false)
    const [seasonGames, setSeasonGames] = useState([])
    const [confirm, setConfirm] = useState(false)

    const handleCheckbox = (event) => {
        let tempName = event.target.value
        for (let i = 0; i < teams.length; i++) {
            if (teams[i].name === tempName) {
                teams[i].check = (teams[i].check === undefined || teams[i].check === false) ? true : false
                break
            }
        }
    }

    const fetchTeams = async () => {
        await new SpeedwayTeam().getAllTeams()
            .then((res) => { setTeams(res) })
            .then((res) => { setDisplaySeason(false); setPickTeams(true); })
    }

    const fetchSeason = async (year) => {
        await new SeasonModel().getSeasonByYear(year)
            .then((res) => {
                if (res !== null) {
                    setSeason(res)
                    if (res[liga] === false) {
                        fetchTeams();
                    }
                    else {
                        setPickTeams(false)
                        setDisplaySeason(true)
                        fetchSeasonGames(res.id)
                    }
                }
            })
    }

    const fetchSeasonGames = async (seasonId) => {
        await new SeasonGames().getAllBySeasonId(seasonId)
            .then((res) => new SeasonGames().prepareRlachLinkElements(res, rok))
            .then((res) => setSeasonGames(res))
    }

    const handleInputTeamChange = (event) => {
        const { value } = event.target;
        setNewTeam(value)
    }

    const insertTeam = async () => {
        let tempName = newTeam.split(' ')[1]
        let addTeam = {
            name: tempName,
            fullName: newTeam,
            created: Date.now(),
            lastUpdated: Date.now()
        }
        setNewTeam('')
        let tempTeams = []
        for (let i = 0; i < teams.length; i++)
            tempTeams.push(teams[i])
        tempTeams.push(addTeam)
        setTeams(tempTeams)
        await new SpeedwayTeam().postNewTeam(addTeam)
    }

    const confirmSeason = (event) => {
        let check = teams.filter((team) => team.check === true)
        let teamPairs = []
        let datka = Date.now();
        for (let i = 0; i < check.length; i++) {
            for (let j = 0; j < check.length; j++) {
                if (i !== j) {
                    teamPairs.push({
                        level: liga,
                        home: check[i].name,
                        away: check[j].name,
                        inserted: false,
                        created: datka,
                        lastUpdated: datka,
                        season: season
                    })
                }
            }
        }
        new SeasonGames().postSeasonsGames(teamPairs, teamPairs.length - 1)
            .then((res) => new SeasonModel().updateSeasonLeagueState(season.id, liga))
            .then((res) => setConfirm(true))
    }

    const confirmSeasonGame = (event, link, gameId) => {
        const data = {
            seasonGameId: gameId,
            year: rok,
            league: liga,
            link: link.replaceAll('/', '*')
        }
        navigate(`/fetch/${JSON.stringify(data)}`)
    }

    const backHome = (event) => {
        navigate(`/`)
    }

    useEffect(() => {
        console.log('league component db read')
        fetchSeason(rok)
    }, [confirm])

    return (
        <div>
            <div>{liga}</div>
            <div>{rok}</div>

            {pickTeams &&
                <div>
                    <div>
                        <input
                            style={{ width: "20%" }}
                            value={newTeam}
                            onChange={handleInputTeamChange}
                        />
                        <button
                            name='newTeamButton'
                            onClick={event => insertTeam(event)}
                        >New Team</button>
                    </div>
                    {teams.map((team) => (
                        <div
                            key={key++ + 'teamLeagueComponent'}
                        >
                            {team.fullName}
                            <input onChange={handleCheckbox} type="checkbox" name={liga} value={team.name} />
                        </div>
                    ))}

                    <div>
                        <button
                            name='confirmSeason'
                            onClick={event => confirmSeason(event)}
                        >Confirm Season</button>
                    </div>
                </div>}

            {displaySeason &&
                <div>
                    {seasonGames.map((seasonGame) => (
                        <div
                            key={key++ + 'teamLeagueComponent'}
                        >
                            <div
                                key={key++ + 'seasonGame'}
                            >
                                {seasonGame.home} - {seasonGame.away}&nbsp;
                                {!seasonGame.inserted &&
                                    <button
                                        name='confirmSeasonGame'
                                        onClick={event => confirmSeasonGame(event, seasonGame.link, seasonGame.id)}
                                    >Confirm Season Game</button>}
                            </div>
                        </div>
                    ))}
                </div>}

            <div>
                <button
                    name='backToHome'
                    onClick={event => backHome(event)}
                >Home</button>
            </div>
        </div>)
}

export default LeagueComponent