import pl from '../public/img/flags/Polska.svg';
import Season from '../components/seasonComponents/Season.js';
import { useEffect, useState } from 'react';

const Home = () => {
    const [years, setYears] = useState([])
    let seasonCounter = 0
    let seasonKey = 1
    useEffect(() => {
        let tempYears = []
        for (let i = 1948; i < 2023; i++)
            tempYears.push('' + i)
        setYears(tempYears)

    }, [])
    return (
        <div>
            <div>
                <img src={pl} />
            </div>
            <div
                key={'season' + seasonKey++}
            >
                {years.map((season, i) => {
                    seasonCounter++
                    if (seasonCounter === 5) {
                        seasonCounter = 0
                        let tempYears = years.slice(i - 4, i + 1)
                        return (
                            <div
                                key={'season' + seasonKey++}
                            >
                                {tempYears.map((ses) => (
                                    <div
                                        key={'season' + seasonKey++}
                                        style={{
                                            display: 'inline-block',
                                            width: "10%",
                                            border: '1px solid red',
                                            textAlign: 'center',
                                            paddingLeft: '5px',
                                            margin: '1px'
                                        }}
                                    >
                                        <Season
                                            rok={ses}
                                        />
                                    </div>
                                ))}
                            </div>
                        )
                    }
                })}
            </div>
        </div>
    )
}

export default Home;