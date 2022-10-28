import Flags from '../../utility/Flags.js'
import React, { useState } from 'react';

const Points = (props) => {

    let rider = props.rider
    let obtainRiderNr = props.obtainRiderNr
    let flag = new Flags().flag

    const editRider = (event) => {
        let riderNr = event.target.name
        obtainRiderNr(riderNr)
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
                    margin: '1px'
                }}
            >
                {rider.pointsString}&nbsp;
                {rider.perfect && <b> X</b>}
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
                Pts: {rider.pointsCurrent}
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
                Bg: {rider.heatsCurrent}
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
                Bns: {rider.bonusesCurrent}
            </div>
        </div>
    )

}

export default Points