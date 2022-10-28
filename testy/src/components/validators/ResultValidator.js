import React, { useEffect, useState } from 'react';

const ResultValidator = (props) => {

    let match = props.match
    const validateGame = props.validateGame
    const [confirmResult, setConfirmResult] = useState({ state: false, msg: '' })

    const calculateResultReliability = () => {
        const pts = match.homeResultPoints + match.awayResultPoints
        const bg = match.homeHeats + match.awayHeats
        if (pts !== 90 || bg !== 60) {
            setConfirmResult({ state: true, msg: 'CHECK THE RESULT: Points: ' + pts + ' Heats: ' + bg })
            validateGame('result validator')
        }
    }

    const confirmResultFunction = () => {
        setConfirmResult({state: false, msg: ''})
        validateGame(false)
    }

    useEffect(() => {
        calculateResultReliability()
    }, [])

    return (
        <div>
            {confirmResult.state &&
                <div>
                    {confirmResult.msg}&nbsp;
                    <button
                        onClick={confirmResultFunction}
                    >Confirm Result Anyway</button>
                </div>}
        </div>
    )
}

export default ResultValidator;