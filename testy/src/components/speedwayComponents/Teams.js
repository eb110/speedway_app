import { useEffect, useState } from "react"
import TeamModel from '../../modelController/TeamModel'
import Team from "./Team"

const Teams = (props) => {

    let match = props.match
    let key = 0
    const [display, setDisplay] = useState(false)

    useEffect(() => {
        if (match.teamsInsert === undefined) {
            match.teamsInserted = true
            new TeamModel().getByName(match.home)
                .then((res) => {
                    let result = match.teams[0].result
                    let heats = match.teams[0].heats
                    match.teams[0] = res
                    match.teams[0].result = result
                    match.teams[0].heats = heats
                    match.teams[0].side = 'Gospodarze'
                })
                .then(() => new TeamModel().getByName(match.away))
                .then((res) => {
                    let result = match.teams[1].result
                    let heats = match.teams[1].heats
                    match.teams[1] = res
                    match.teams[1].result = result
                    match.teams[1].heats = heats
                    match.teams[1].side = 'Goście'
                })
                .then(() => setDisplay(true))
        } else {
            setDisplay(true)
        }
    }, [])

    return (
        <div>
            {display &&
                match.teams.map((team) => (
                    <div
                        key={key++ + ' team'}
                    >
                        <Team
                            match={match}
                            team={team}
                        />
                    </div>
                ))
            }
        </div>
    )
}

export default Teams