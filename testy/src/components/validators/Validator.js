import AgeValidator from "./AgeValidator";
import GameDateValidator from "./GameDateValidator";
import ResultValidator from "./ResultValidator";
import RiderStartingNumberValidator from "./RiderStartingNumberValidator";
import React, { useState } from 'react';
import RiderDbExistenceValidator from "./RiderDbExistenceValidator";

const Validator = (props) => {

    let match = props.match
    let confirmMatch = props.confirmMatch
    const [confirm, setConfirm] = useState(true)
    const [validatorsCounter, setValidatorCounter] = useState(0)

    const validateGame = () => {
        setValidatorCounter(validatorsCounter + 1)
        if (confirm !== false)
            setConfirm(false)
    }

    const resultDoubleConfirmation = () => {
        if(validatorsCounter === 1)
            setConfirm(true)
    }

    const confirmGame = (state) => {
        confirmMatch()
    }

    return (
        <div>
            <GameDateValidator
                match={match}
                validateGame={validateGame}
            />
            <RiderStartingNumberValidator
                match={match}
                validateGame={validateGame}
            />
            <AgeValidator
                match={match}
                validateGame={validateGame}
            />
            <ResultValidator
                secondValidator={resultDoubleConfirmation}
                match={match}
                validateGame={validateGame}
            />
            <RiderDbExistenceValidator
                   match={match}
                   validateGame={validateGame}
            />
            {confirm &&
                <div>
                    <button
                        onClick={confirmGame}
                    >Confirm</button>
                </div>
            }
        </div>

    )
}

export default Validator;