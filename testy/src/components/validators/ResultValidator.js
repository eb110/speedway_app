import React, { useEffect, useState } from 'react';

const ResultValidator = (props) => {

    let match = props.match
    const validateGame = props.validateGame
    const [confirmResult, setConfirmResult] = useState({ state: false, msg: '' })

    const calculateResultReliability = () => {
        const pts = match.awayResultPoints + match.homeResultPoints
        const bg = match.awayHeats + match.homeHeats
        if (pts !== 90 || bg !== 60) {
            setConfirmResult({ state: true, msg: 'CHECK THE RESULT: Points: ' + pts + ' Heats: ' + bg })
            validateGame('result validator')
        }
    }

    useEffect(() => {
        calculateResultReliability()
    }, [])

    return (
        <div>
            {confirmResult &&
                confirmResult.msg}
        </div>
    )
}

export default ResultValidator;