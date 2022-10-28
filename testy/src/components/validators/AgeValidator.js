import React, { useEffect, useState } from 'react';

const AgeValidator = (props) => {

    let match = props.match
    const validateGame = props.validateGame
    const [confirmAge, setConfirmAge] = useState({ state: false, msg: '' })
    match.riders[0].seasonAge = 15
    match.riders[1].seasonAge = 38

    const calculateAgeLimits = () => {
        let tooYoung = match.riders.filter((rider) => rider.seasonAge < 16)
        let oldPricks = match.riders.filter((rider) => rider.seasonAge > 35)
        if (tooYoung.length > 0)
            validateGame('age validator')

        if (tooYoung.length > 0 || oldPricks.length > 0) {
            let msg = 'Check the age of riders: '
            for (let i = 0; i < tooYoung.length; i++)
                msg += tooYoung[i].surname + ' '
            for (let i = 0; i < oldPricks.length; i++)
                msg += oldPricks[i].surname + ' '
            setConfirmAge({ state: true, msg: msg })
        }
    }

    useEffect(() => {
        calculateAgeLimits()
    }, [])

    return (
        <div>
            {confirmAge &&
                confirmAge.msg
            }
        </div>
    )
}

export default AgeValidator;