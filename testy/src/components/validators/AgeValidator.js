import React, { useEffect, useState } from 'react';

const AgeValidator = (props) => {

    let match = props.match
    const validateGame = props.validateGame
    const [confirmAge, setConfirmAge] = useState({ state: false, msg: '' })

    const calculateAgeLimits = () => {
        let tooYoung = match.riders.filter((rider) => rider.riderDB.seasonAge < 16)
        let oldPricks = match.riders.filter((rider) => rider.riderDB.seasonAge > 35)
        if (tooYoung.length > 0){
            validateGame()
        }

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