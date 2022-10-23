import React, { useEffect, useState } from 'react';
import Flags from '../../utility/Flags.js'

const Points = (props) => {

    let match = props.match
    let rider = props.rider
    let obtainRiderNr = props.obtainRiderNr
    let sendUpdatedResultToMatchPage = props.sendUpdatedResultToMatchPage
    let flag = new Flags().flag

    const [pointsString, setPointsString] = useState(rider.pointsString)

    const editRider = (event) => {
        let riderNr = event.target.name
        obtainRiderNr(riderNr)
    }

    const handlePointsStringChange = (event) => {
        const { value } = event.target
        recalculatePoints(value)
        setPointsString(value)
    }

    const recalculatePoints = (pointsString) => {
        let riderPoints = {
            bonus: 0,
            point: 0.0,
            heat: 0,
            paidPerfect: 0,
            fullPerfect: 0,
            pointsString: pointsString
        }
        let points = pointsString.split(',').filter((x) => x !== '-')
        for (let i = 0; i < points.length; i++) {
            let heatRecord = points[i];
            if (heatRecord.includes(".")) {
                riderPoints.point += parseFloat(heatRecord.substring(0, 3));
            }
            else if ('0123456789'.includes(heatRecord[0]))
                riderPoints.point += +("" + heatRecord[0])
            if (heatRecord.includes("*"))
                riderPoints.bonus++;
            riderPoints.heat++;
        }
        if (riderPoints.heat >= 5 && riderPoints.point / riderPoints.heat === 3) {
            riderPoints.fullPerfect++;
        }
        else if (riderPoints.heat >= 5 && (riderPoints.point + riderPoints.bonus) / riderPoints.heat === 3) {
            riderPoints.paidPerfect++;
        }
        updateRiderPoints(riderPoints)
    }
    const updateRiderPoints = (recalculatedPoints) => {
        rider.bonuses -= rider.bonusesCurrent
        rider.bonusesCurrent = recalculatedPoints.bonus
        rider.bonuses += recalculatedPoints.bonus

        rider.fullPerfects -= rider.currentFullPerfect
        rider.currentFullPerfect = recalculatedPoints.fullPerfect
        rider.fullPerfects += recalculatedPoints.fullPerfect

        rider.paidPerfects -= rider.currentPaidPerfect
        rider.currentPaidPerfect = recalculatedPoints.paidPerfect
        rider.paidPerfects += recalculatedPoints.paidPerfect

        rider.heats -= rider.heatsCurrent
        rider.heatsCurrent = recalculatedPoints.heat
        rider.heats += recalculatedPoints.heat

        rider.points -= rider.pointsCurrent
        rider.pointsCurrent = recalculatedPoints.point
        rider.points += recalculatedPoints.point

        rider.pointsString = recalculatedPoints.pointsString

        updateResult(rider)
    }
    const updateResult = (riderToUpdate) => {
        let side = rider.homeAway
        let result = 0
        let heats = 0
        for (let i = 0; i < match.riders.length; i++) {
            if (match.riders[i].id === riderToUpdate.id)
                match.riders[i] = riderToUpdate
            if (match.riders[i].homeAway === side) {
                result += match.riders[i].pointsCurrent
                heats += match.riders[i].heatsCurrent
            }
        }
        match[side + 'ResultPoints'] = result
        match[side + 'Heats'] = heats
        sendUpdatedResultToMatchPage()
    }

    return (
        <div>
            <div
                style={{
                    display: 'inline-block',
                    width: "40%",
                    border: '1px solid red',
                    textAlign: 'left',
                    paddingLeft: '5px',
                    margin: '1px'
                }}
            >
                <div
                    style={{
                        display: 'block'
                    }}
                >
                    <div
                        style={{
                            display: 'inline-block'
                        }}
                    >
                        {rider.nr}.{rider.name}  {rider.surname} {rider.ripDate && <b>RIP </b>}
                    </div>
                    <div
                        style={{
                            display: 'inline-block',
                            float: 'right'
                        }}
                    >
                        Age: {rider.age} S/Age: {rider.seasonAge}
                        <img alt='' src={flag[rider.countryOfBirth]} />
                    </div>
                    <div
                        style={{
                            display: 'inline-block',
                            float: 'right',
                            margin: '1px'
                        }}
                    >
                        {!rider.birthDate &&
                            <button
                                name={rider.nr}
                                onClick={editRider}
                            >Update</button>}
                    </div>
                </div>
            </div>
            <div
                style={{
                    display: 'inline-block',
                    width: "10%",
                    border: '1px solid blue',
                    textAlign: 'left',
                    paddingLeft: '5px',
                    margin: '1px'
                }}
            >
                <input
                    style={{ width: "80%" }}
                    value={pointsString}
                    onChange={handlePointsStringChange}
                />
                {rider.perfect && <b> X</b>}
            </div>
            <div
                style={{
                    display: 'inline-block',
                    width: "6%",
                    border: '1px solid blue',
                    textAlign: 'left',
                    paddingLeft: '5px',
                    margin: '1px'
                }}
            >
                Pts: {rider.pointsCurrent}
            </div>
            <div
                style={{
                    display: 'inline-block',
                    width: "5%",
                    border: '1px solid blue',
                    textAlign: 'left',
                    paddingLeft: '5px',
                    margin: '1px'
                }}
            >
                Bg: {rider.heatsCurrent}
            </div>
            <div
                style={{
                    display: 'inline-block',
                    width: "5%",
                    border: '1px solid blue',
                    textAlign: 'left',
                    paddingLeft: '5px',
                    margin: '1px'
                }}
            >
                Bns: {rider.bonusesCurrent}
            </div>
        </div>
    )

}

export default Points