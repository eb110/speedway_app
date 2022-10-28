import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EncoderLatin from '../middleware/EncoderLatin';
import ParserLach from "../middleware/ParserLach";
import { useNavigate } from 'react-router-dom';
import InsertedMatch from '../modelController/InsertedMatch';

const FetchComponent = (props) => {

    const [axiosUrl, setAxiosUrl] = useState('')
    const [message, setMessage] = useState({ state: false, msg: '' })

    let seasonGame = props.seasonGame;
    seasonGame.link = seasonGame.link.replaceAll('*', '/')

    const [inputValue, setInputValue] = useState(seasonGame.link)

    const navigate = useNavigate()

    useEffect(() => {

        const myFetch = async () => {

            if (axiosUrl !== '') {

                try {
                    await axios.request({
                        method: 'GET',
                        url: axiosUrl,
                        responseType: 'arraybuffer',
                        responseEncoding: 'binary'
                    })
                        .then((res) => new EncoderLatin(res.data))
                        .then((enc) => JSON.stringify(new ParserLach(enc.str)))
                        .then((parameter) => {
                            let tempParameter = JSON.parse(parameter)
                            tempParameter.seasonGame = seasonGame
                            tempParameter.seasonGame.link = tempParameter.seasonGame.link.replaceAll('/', '*')
                            navigate(`/speedwayMatch/${JSON.stringify(tempParameter)}`)
                        })

                } catch (error) {
                    console.log('cant read the url')
                }
            }

        }

        myFetch()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [axiosUrl])

    const handleInputChange = (event) => {
        const { value } = event.target;
        setInputValue(value)
    }

    const handleButtonClick = async () => {
        let im = new InsertedMatch()
        let name = im.rlachLinkToName(inputValue)
        await im.checkIfExist(name).then((res) => res ? setMessage({ state: true, msg: 'This match has been already inserted' }) : setAxiosUrl(inputValue))
    }

    const backHome = (event) => {
        navigate(`/`)
    }


    return (

        <div>
            <input
                style={{ width: "30%" }}
                placeholder="url address"
                value={inputValue}
                onChange={handleInputChange}
            />
            <button
                onClick={handleButtonClick}
            >
                Fetch Data
            </button>
            <button
                name='backToHome'
                onClick={event => backHome(event)}
            >Home</button>
            <div>
                {message.state &&
                    message.msg
                }
            </div>
        </div>

    )
}

export default FetchComponent