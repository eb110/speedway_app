const LeagueComponent = (props) => {
    const rok = props.leagueDetails.year
    const liga = props.leagueDetails.liga
    return (
        <div>
            <div>{liga}</div>
            <div>{rok}</div>
        </div>

    )
}

export default LeagueComponent