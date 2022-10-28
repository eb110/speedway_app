import React, { useEffect, useState } from 'react';

const GameDateValidator = (props) => {

    const [confirmDateOfGame, setConfirmDateOfGame] = useState({ state: false, msg: '' })
    let match = props.match
    const validateGame = props.validateGame
    match.seasonGame.season.year = 2000

    const confirmGameDate = () => {
        let tempYear = match.dateOfGame.substring(match.dateOfGame.lastIndexOf('-') + 1)
        if (+tempYear !== +match.seasonGame.season.year || match.dateOfGame.length > 10) {
            setConfirmDateOfGame({ state: true, msg: 'Check the date of game' })
            validateGame('validator game date')
        }
    }

    useEffect(() => {
        confirmGameDate()
    }, [])

    return (
        <div>
            {confirmDateOfGame.state &&
                confirmDateOfGame.msg
            }
        </div>
    )
}

export default GameDateValidator;