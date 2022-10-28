
const Team = (props) => {

    let match = props.match
    const homeAway = props.homeAway
    const side = homeAway === "away" ? 'GOŚCIE' : 'GOSPODARZE'
    const heats = homeAway === "away" ? match.awayHeats : match.homeHeats
    const result = homeAway === "away" ? match.awayResultPoints : match.homeResultPoints
    const fullNameTag = homeAway === 'away' ? 'away' : 'home'

    return (
        <div>
            {side}: {result} BIEGI: {heats}
            <div>
                {match[fullNameTag]}
            </div>
        </div>
    )
}

export default Team