

import React, {useState} from 'react';
import RiderPoints from './RiderPoints';
import Polska from '../../public/img/flags/Polska.svg';
import Szwecja from '../../public/img/flags/Szwecja.svg';
import Anglia from '../../public/img/flags/Anglia.svg';
import Norwegia from '../../public/img/flags/Norwegia.svg';
import Australia from '../../public/img/flags/Australia.svg';
import Łotwa from '../../public/img/flags/Łotwa.svg';
import Rosja from '../../public/img/flags/Rosja.svg';
import Dania from '../../public/img/flags/Dania.svg';
import Ukraina from '../../public/img/flags/Ukraina.svg';
import Czechy from '../../public/img/flags/Czechy.svg';
import Węgry from '../../public/img/flags/Węgry.svg';
import Słowacja from '../../public/img/flags/Słowacja.svg';
import Słowenia from '../../public/img/flags/Słowenia.svg';
import Niemcy from '../../public/img/flags/Niemcy.svg';
import Francja from '../../public/img/flags/Francja.svg';


const RidersComponent = (props) => {

    const{matchResult, matchTeam, funkcja} = props


    const [teamPoints, setTeamPoints] = useState(0)
    const [runsSum, setRunsSum] = useState(0)

    let flag = {'Polska': Polska, 'Szwecja': Szwecja, 'Anglia': Anglia, 'Norwegia': Norwegia, 'Australia': Australia, 'Łotwa': Łotwa, 
    'Niemcy': Niemcy, 'Rosja': Rosja, 'Dania': Dania, 'Ukraina': Ukraina, 'Czechy': Czechy, 'Węgry': Węgry, 'Słowacja': Słowacja, 
    'Słowenia': Słowenia, 'Francja': Francja}
        
    let key = 0
    let updateButtonRiderIndex = 0
    let tempPointsSum = 0
    let tempRunsSum = 0
   
    const countTeamPoints = (pts, biegi) => {
     //   console.log('pts: ' + pts + 'biegi: ' + biegi)
        tempPointsSum += pts
        tempRunsSum += biegi
        setTeamPoints(tempPointsSum)
        setRunsSum(tempRunsSum)
    }
    
    //add or update the rider, based on the SpeedwayMatch.js testButton function
    const editRider = (event) => {
        let index = event.target.name
        funkcja(matchResult[index].nr, true)
    }

    return (
            <div>
                <div
                  style={{
                    border: '1px solid red',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    width: '30%'
                    }}
                >
                    {matchTeam}: {teamPoints} Biegi: {runsSum}
                </div>
               {matchResult.map((rider) => (
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
                                <button
                                    name={updateButtonRiderIndex++}
                                    onClick={editRider}
                                >U</button>
                            </div>   
                        </div>
                    </div>
                    <div 
                        style={{
                            display: 'inline-block', 
                            width: "40%",
                            border: '1px solid blue',
                            textAlign: 'left',
                            paddingLeft: '5px',
                            margin: '1px'}}
                        key={key++}
                    >
                        <RiderPoints
                            pts={rider.points}
                            calculateTeamPoints={countTeamPoints}
                        />

                    </div>
                </div>                
            ))}             
            </div>     
    )

}

export default RidersComponent