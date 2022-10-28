import React, { useEffect, useState } from 'react';
import Points from './Points';

const RidersComponent = (props) => {

    let match = props.match
    let newRider = props.createNewRider
    let ha = props.homeAway
    let riders = ha === 'away' ? match.riders.filter((rider) => rider.homeAway === 'away') : match.riders.filter((rider) => rider.homeAway === 'home')
    let key = 0

    const editRider = (riderNr) => {
        newRider(riderNr)
    }

    const obtainRiderNr = (riderNr) => {
        editRider(riderNr)
    }

    return (
        <div>
            {riders.map((rider) => (
                <div
                    key={key++}
                    style={{ display: 'block' }}
                >
                    <Points
                        match={match}
                        rider={rider}
                        obtainRiderNr={obtainRiderNr}
                    />
                </div>
            ))}
        </div>
    )

}

export default RidersComponent