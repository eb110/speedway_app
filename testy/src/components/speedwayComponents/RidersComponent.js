import Flags from '../../utility/Flags';

const RidersComponent = (props) => {

    let match = props.match
    let newRider = props.createNewRider
    let ha = props.homeAway
    let riders = ha === 'away' ? match.riders.filter((rider) => rider.homeAway === 'away') : match.riders.filter((rider) => rider.homeAway === 'home')
    let flag = new Flags().flag
    let key = 0
   
    //add or update the rider, based on the SpeedwayMatch.js testButton function
    const editRider = (event) => {
        let riderNr = event.target.name
        newRider(riderNr)
    }

    return (
            <div>
               {riders.map((rider) => (
                <div
                    key={key++} 
                    style={{display: 'block'}}
                >
                    <div
                        key={key++}
                        style={{
                            display: 'inline-block', 
                            width: "40%", 
                            border: '1px solid red',
                            textAlign: 'left',
                            paddingLeft: '5px',
                            margin: '1px'}}
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
                                <img alt='' src={flag[rider.countryOfBirth]}/>
                            </div>
                            <div
                                style={{
                                    display: 'inline-block',
                                    float: 'right',
                                    margin: '1px'
                                }}
                            >
                                {!rider.birthDate &&
                                <button
                                    name={rider.nr}
                                    onClick={editRider}
                                >Update</button>}
                            </div>   
                        </div>
                    </div>
                    <div 
                        style={{
                            display: 'inline-block', 
                            width: "12%",
                            border: '1px solid blue',
                            textAlign: 'left',
                            paddingLeft: '5px',
                            margin: '1px'}}
                        key={key++}
                    >
                        {rider.pointsString}
                        {rider.perfect && <b> X</b>}
                    </div>
                    <div 
                        style={{
                            display: 'inline-block', 
                            width: "6%",
                            border: '1px solid blue',
                            textAlign: 'left',
                            paddingLeft: '5px',
                            margin: '1px'}}
                        key={key++}
                    >
                        Pts: {rider.pointsCurrent}
                    </div>
                    <div 
                        style={{
                            display: 'inline-block', 
                            width: "5%",
                            border: '1px solid blue',
                            textAlign: 'left',
                            paddingLeft: '5px',
                            margin: '1px'}}
                        key={key++}
                    >
                        Bg: {rider.heatsCurrent}
                    </div>
                    <div 
                        style={{
                            display: 'inline-block', 
                            width: "5%",
                            border: '1px solid blue',
                            textAlign: 'left',
                            paddingLeft: '5px',
                            margin: '1px'}}
                        key={key++}
                    >
                        Bns: {rider.bonusesCurrent}
                    </div>       
                </div>                
            ))}             
            </div>     
    )

}

export default RidersComponent