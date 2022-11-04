import Flags from '../../utility/Flags.js'
import { useNavigate } from 'react-router-dom'

const Rider = (props) => {

    let flag = new Flags().flag
    const navigate = useNavigate()

    let matchRider = props.rider
    let match = props.match
    let rider = '';
    if(matchRider.riderDB){
        matchRider.riderDB.nr = matchRider.nr
        rider = matchRider.riderDB
        console.log(rider.countryOfBirth)
    }else{
        rider = matchRider
    }
   
    const newRider = () => {
        match.riders.map((rdr) => rdr.nr === rider.nr ? rdr.riderDB = 'newRider' : rdr)
        match.seasonGame.link = match.seasonGame.link.replaceAll('/', '*')
        navigate(`/newRider/${JSON.stringify(match)}`)
    }

    return (
        <div>
            <div
                style={{
                    display: 'inline-block',
                    width: "40%",
                    border: '1px solid red',
                    textAlign: 'left',
                    paddingLeft: '5px',
                    margin: '1px'
                }}
            >
                <div
                    style={{
                        display: 'block'
                    }}
                >
                    <div
                        style={{
                            display: 'inline-block'
                        }}
                    >
                        {rider.nr}.{rider.name}  {rider.surname} {rider.ripDate && <b>RIP </b>}
                    </div>
                    <div
                        style={{
                            display: 'inline-block',
                            float: 'right'
                        }}
                    >
                        Age: {rider.age} S/Age: {rider.seasonAge}
                        <img alt='' src={flag[rider.countryOfBirth]} />
                    </div>
                    <div
                        style={{
                            display: 'inline-block',
                            float: 'right',
                            margin: '1px'
                        }}
                    >
                        {!matchRider.riderDB &&
                            <button
                                name={rider.nr}
                                onClick={newRider}
                            >New Rider</button>}
                    </div>
                </div>
            </div>
            <div
                style={{
                    display: 'inline-block',
                    width: "10%",
                    border: '1px solid blue',
                    textAlign: 'left',
                    paddingLeft: '5px',
                    margin: '1px'
                }}
            >
                {matchRider.pointsString}&nbsp;
                {matchRider.perfect && <b> X</b>}
            </div>
            <div
                style={{
                    display: 'inline-block',
                    width: "6%",
                    border: '1px solid blue',
                    textAlign: 'left',
                    paddingLeft: '5px',
                    margin: '1px'
                }}
            >
                Pts: {matchRider.pointsCurrent}
            </div>
            <div
                style={{
                    display: 'inline-block',
                    width: "5%",
                    border: '1px solid blue',
                    textAlign: 'left',
                    paddingLeft: '5px',
                    margin: '1px'
                }}
            >
                Bg: {matchRider.heatsCurrent}
            </div>
            <div
                style={{
                    display: 'inline-block',
                    width: "5%",
                    border: '1px solid blue',
                    textAlign: 'left',
                    paddingLeft: '5px',
                    margin: '1px'
                }}
            >
                Bns: {matchRider.bonusesCurrent}
            </div>
        </div>
    )
}

export default Rider
