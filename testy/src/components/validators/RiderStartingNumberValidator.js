import React, { useEffect, useState } from 'react';

const RiderStartingNumberValidator = (props) => {

    let match = props.match
    const validateGame = props.validateGame
    const [confirmStartingNumber, setConfirmStartingNumber] = useState({ state: false, msg: '' })
    
    const confirmRiderStartingNumber = () => {
        let numb = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16']
        if (match.riders.some((rider) => !numb.includes(rider.nr))) {
            setConfirmStartingNumber({ state: true, msg: 'Check riders starting number' })
            validateGame()
        }
    }

    useEffect(() => {
        confirmRiderStartingNumber()
    }, [])

    return (
        <div>
            {confirmStartingNumber.state &&
                confirmStartingNumber.msg
            }
        </div>
    )
}

export default RiderStartingNumberValidator;