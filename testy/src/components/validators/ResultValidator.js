import React, { useEffect, useState } from 'react';

const ResultValidator = (props) => {

    let match = props.match
    const validateGame = props.validateGame
    const secondValidator = props.secondValidator
    const [confirmResult, setConfirmResult] = useState({ state: false, msg: '' })

    const calculateResultReliability = () => {
        const pts = match.teams[0].result + match.teams[1].result
        const bg = match.teams[0].heats + match.teams[1].heats
        if (pts !== 90 || bg !== 60) {
            setConfirmResult({ state: true, msg: 'CHECK THE RESULT: Points: ' + pts + ' Heats: ' + bg })
            validateGame('resultIsOk')
        }
    }

    const confirmResultFunction = () => {
        setConfirmResult({state: false, msg: ''})
        secondValidator()
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