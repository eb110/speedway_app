import { useNavigate } from 'react-router-dom'
import React, { useState } from 'react';
import SeasonGames from '../../modelController/SeasonGames';

const SeasonGame = (props) => {

    let seasonGame = props.seasonGame;

    const [walkoverButtonsConfirmation, setWalkoverButtonsConfirmation] = useState(false)
    const [displayComponent, setDisplayComponent] = useState(true)

    const navigate = useNavigate()

    const confirmSeasonGame = () => {
        navigate(`/fetch/${JSON.stringify(seasonGame)}`)
    }

    const showWalkoverButtons = () => {
        setWalkoverButtonsConfirmation(true)
    }

    const walkoverConfirmation = (homeAway) => {
        let datka = Date.now();
        seasonGame.walkover = homeAway
        seasonGame.lastUpdated = datka
        seasonGame.inserted = true
        new SeasonGames().updateSeasonGame(seasonGame)
        setDisplayComponent(false)
    }

    return (
        <div>
            {displayComponent &&
                <div>
                    <div>
                        <button
                            name='wlakoverMatch'
                            onClick={event => showWalkoverButtons()}
                        >Walkover</button>
                        &nbsp;{seasonGame.home} - {seasonGame.away}&nbsp;

                        <button
                            name='confirmSeasonGame'
                            onClick={event => confirmSeasonGame(event, seasonGame.link, seasonGame.id)}
                        >Confirm Season Game</button>
                    </div>
                    {walkoverButtonsConfirmation &&
                        <div>Blamed:&nbsp;
                            <button
                                name='wlakoverMatchHome'
                                onClick={event => walkoverConfirmation('home')}
                            >Home</button>
                            <button
                                name='wlakoverMatchAway'
                                onClick={event => walkoverConfirmation('away')}
                            >Away</button>
                        </div>
                    }
                </div>}
        </div>
    )

}

export default SeasonGame