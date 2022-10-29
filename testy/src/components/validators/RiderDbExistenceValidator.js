import React, { useEffect, useState } from 'react';

const RiderDbExistenceValidator = (props) => {

    let match = props.match
    const validateGame = props.validateGame
    const [riderValidator, setRiderValidator] = useState({ state: false, msg: '' })

    const confirmRidersDbExistence = () => {
        if(match.riders.some((rider) => rider.riderDB === undefined)){
            setRiderValidator({state: true, msg: 'Update riders'})
            validateGame()
        }
    }

    useEffect(() => {
       confirmRidersDbExistence()
    }, [])

    return (
        <div>
            {riderValidator.state &&
                riderValidator.msg
            }
        </div>
    )
}

export default RiderDbExistenceValidator;