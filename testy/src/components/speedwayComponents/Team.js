import React, {useEffect, useState} from 'react';

const Team = (props) => {

    let match = props.match
    const homeAway = props.homeAway 
    const side = homeAway === "away" ? 'GOŚCIE' : 'GOSPODARZE'
    const heats = homeAway === "away" ? match.awayHeats : match.homeHeats
    const result = homeAway === "away" ? match.awayResultPoints : match.homeResultPoints
  

    return (
        <div>
            {side}: {result} BIEGI: {heats} 
        </div>
    )

}

export default Team