

//import React, {useEffect, useState} from 'react';
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
import Bułgaria from '../../public/img/flags/Bułgaria.svg';
import USA from '../../public/img/flags/USA.svg';
import Nowa_Zelandia from '../../public/img/flags/Nowa Zelandia.svg';

const RidersComponent = (props) => {

    let match = props.match
    let newRider = props.createNewRider
    let ha = props.homeAway
    let riders = ha === 'away' ? match.riders.filter((rider) => rider.homeAway === 'away') : match.riders.filter((rider) => rider.homeAway === 'home')

    //console.log(riders)

    let flag = {'Polska': Polska, 'Szwecja': Szwecja, 'Anglia': Anglia, 'Norwegia': Norwegia, 'Australia': Australia, 'Łotwa': Łotwa, 
    'Niemcy': Niemcy, 'Rosja': Rosja, 'Dania': Dania, 'Ukraina': Ukraina, 'Czechy': Czechy, 'Węgry': Węgry, 'Słowacja': Słowacja, 
    'Słowenia': Słowenia, 'Francja': Francja, 'Bułgaria': Bułgaria, 'USA': USA, 'Nowa Zelandia': Nowa_Zelandia}
        
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
                            width: "10%",
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