        import React, {useEffect, useState} from 'react';
        import axios from 'axios';
        import EncoderLatin from '../middleware/EncoderLatin';
        import ParserLach from "../middleware/ParserLach";
        import { useNavigate } from 'react-router-dom';
        import InsertedMatch from '../modelController/InsertedMatch';

        const FetchComponent = (props) => {

            const [axiosUrl, setAxiosUrl] = useState('')
            const [message, setMessage] = useState({state:false, msg:''})

            let leagueData = props.rlachLink
            leagueData.link = leagueData.link.replaceAll('*', '/')

            const [inputValue, setInputValue] = useState(leagueData.link)

            const navigate = useNavigate()

            useEffect(() => {
            
                const myFetch = async () => {

                    if(axiosUrl !== ''){

                        try{
                            await axios.request({
                                method: 'GET',
                                url: axiosUrl,
                                responseType: 'arraybuffer',
                                responseEncoding: 'binary'
                            })
                            .then((res) => new EncoderLatin(res.data))
                            .then((enc) => JSON.stringify(new ParserLach(enc.str)))
                            .then((res) => new InsertedMatch().addLinkToMatchJson(axiosUrl, res))
                            .then((parameter) => {
                                let tempParameter = JSON.parse(parameter)
                                tempParameter.year = leagueData.year; 
                                tempParameter.league = leagueData.league;
                                tempParameter.seasonGameId = leagueData.seasonGameId; 
                                navigate(`/speedwayMatch/${JSON.stringify(tempParameter)}`)
                            })

                        } catch(error){
                            console.log('cant read the url')
                        } 
                    }      
            
                }

                myFetch()
            // eslint-disable-next-line react-hooks/exhaustive-deps
            },[axiosUrl])
                        
            const handleInputChange = (event) => {
                const {value} = event.target;
                setInputValue(value)
            }

            const handleButtonClick = async () => {
                let im = new InsertedMatch()
                let name = im.rlachLinkToName(inputValue)
                await im.checkIfExist(name).then((res) => res ?  setMessage({state: true, msg: 'This match has been already inserted'}) : setAxiosUrl(inputValue))
            }


            return(

                <div>
                    <input
                        style={{width: "30%"}}
                        placeholder="url address"
                        value={inputValue}
                        onChange={handleInputChange}
                    />
                    <button
                        onClick={handleButtonClick}
                    >
                        Fetch Data
                    </button>
                    <div>
                        {message.state &&
                            message.msg
                        }
                     </div>
                </div>
                
            )
        }

        export default FetchComponent