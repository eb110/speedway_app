import AgeValidator from "./AgeValidator";
import GameDateValidator from "./GameDateValidator";
import ResultValidator from "./ResultValidator";
import RiderStartingNumberValidator from "./RiderStartingNumberValidator";
import React, { useState } from 'react';

const Validator = (props) => {

    let match = props.match
    let confirmMatch = props.confirmMatch
    const [confirm, setConfirm] = useState(false)

    const validateGame = (state) => {
        if (confirm !== false)
            setConfirm(false)
    }

    const confirmGame = () => {
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