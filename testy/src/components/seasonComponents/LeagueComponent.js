import React, { useEffect, useState } from 'react';
import SeasonModel from '../../modelController/SeasonModel';
import SpeedwayTeam from "../../modelController/SpeedwayTeam"

const LeagueComponent = (props) => {
    const rok = props.leagueDetails.year
    const liga = props.leagueDetails.liga

    let key = 1
    const [teams, setTeams] = useState([])
    const [newTeam, setNewTeam] = useState('')
    const [pickTeams, setPickTeams] = useState(false)

    const handleCheckbox = (event) => {
        console.log('checkbox working fine')
        console.log(event.target.value)}

    const fetchTeams = async () => {
        await new SpeedwayTeam().getAllTeams()
            .then((res) => { console.log(res); setTeams(res) })
            .then((res) => setPickTeams(true))}

    const fetchSeason = async(year) => {
        await new SeasonModel().getSeasonByYear(year)
        .then((res) => {
            if(res !== null && res[liga] === false){
                fetchTeams()}})}

    const handleInputTeamChange = (event) => {
        const { value } = event.target;
        setNewTeam(value)}

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
        for(let i = 0; i < teams.length; i++)
            tempTeams.push(teams[i])
        tempTeams.push(addTeam)
        setTeams(tempTeams)
        await new SpeedwayTeam().postNewTeam(addTeam)
            .then(() => new SpeedwayTeam().getLastId())}

    useEffect(() => {
        console.log('league component db read')
        fetchSeason(rok)
    }, [])

    return (
        <div>
            <div>{liga}</div>
            <div>{rok}</div>
            {setPickTeams && 
            <div>
            {teams.map((team) => (
                <div
                    key={key++ + 'teamLeagueComponent'}
                >
                    {team.fullName}
                    <input onChange={handleCheckbox} type="checkbox" name={liga} value={team.name} />
                </div>
            ))}
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
            </div>}
        </div>)
}

export default LeagueComponent