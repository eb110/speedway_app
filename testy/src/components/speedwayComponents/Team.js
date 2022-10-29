import Rider from "./Rider"

const Team = (props) => {

    let team = props.team
    let match = props.match
    let riders = match.riders.filter((rider) => team.side === 'Gospodarze' ? 
        rider.homeAway === 'home' : rider.homeAway === 'away')
    let key = 0

    return (
        <div>
            {team.side}: {team.result} BIEGI: {team.heats}
            <div>
                {team.fullName}
            </div>
            <div>
                {riders.map((rider) => (
                    <div
                        key={key++ + ' rider.nr'}
                    >
                        <Rider
                            rider={rider}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Team