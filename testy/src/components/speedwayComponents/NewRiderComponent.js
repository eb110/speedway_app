import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom'
import SpeedwayRider from '../../modelController/SpeedwayRider';

const NewRiderComponent = (props) => {

    const navigate = useNavigate()

    let match = JSON.parse(props.matchDetails)
    let index = ''
    for(let i = 0; i < match.riders.length; i++){
        if(match.riders[i].edit){
            index = i
            break
        }
    }

    const[riderName, setRiderName] = useState(match.riders[index].name)
    const[riderDOB, setRiderDOB] = useState('xxxx-xx-xx')
    const[riderPOB, setRiderPOB] = useState('')
    const[riderDOD, setRiderDOD] = useState('xxxx-xx-xx')
    const[riderPOD, setRiderPOD] = useState('')
    const[riderCOB, setRiderCOB] = useState('Polska')

    let surname = match.riders[index].surname[0] + match.riders[index].surname.substring(1).toLowerCase()

    const[riderSurname, setRiderSurname] = useState(surname)

    const handleInputNameChange = (event) => {
        const {value} = event.target;
        setRiderName(value)
    }

    const handleInputSurnameChange = (event) => {
        const {value} = event.target;
        setRiderSurname(value)
    }

    const handleInputDOBChange = (event) => {
        const {value} = event.target;
        setRiderDOB(value)
    }

    const handleInputPOBChange = (event) => {
        const {value} = event.target;
        setRiderPOB(value)
    }

    const handleInputDODChange = (event) => {
        const {value} = event.target;
        setRiderDOD(value)
    }

    const handleInputPODChange = (event) => {
        const {value} = event.target;
        setRiderPOD(value)
    }

    const handleInputCOBChange = (event) => {
        const {value} = event.target;
        setRiderCOB(value)
    }

    const handleButtonClick = () => {
            postNewRider()
    }

    const postNewRider = async () => {
        let datka = Date.now();
        let speedway_rider = {
            /*Related to card_006*/
            birthDate: riderDOB,
            bonuses: 0,
            countryOfBirth: riderCOB,
            fullPerfects: 0,
            games: 0,
            heats: 0,
            name: riderName,
            paidPerfects: 0,
            placeOfBirth: riderPOB,
            placeOfRip: riderPOD,
            points: 0,
            ripDate: riderDOD,
            surname: riderSurname,
            created: datka,
            lastUpdated: datka
        }

        match.riders[index].edit = false

        await new SpeedwayRider().postNewRider(speedway_rider)
        .then(() => new SpeedwayRider().getTheLastRider())
        .then((res) => match.riders[index] = new SpeedwayRider().concatRiderParserWithRiderDB(match.riders[index], [res], match.dateOfGame))
        .then(() => console.log(match.riders[index]))
        .then(() => navigate(`/speedwayMatch/${JSON.stringify(match)}`))

    }

    return(

        <div
            style={{
                border: '1px solid red',
                marginLeft: 'auto',
                marginRight: 'auto',
                margin: 1
            }}
        >
            <div
                style={{
                    border: '1px solid green',
                    margin: 1
                }}
            >
                <label>Name: </label>
                <input
                    style={{width: "30%"}}
                    placeholder={riderName}
                    value={riderName}
                    onChange={handleInputNameChange}
                />
            </div>

            <div
                style={{
                    border: '1px solid green',
                    margin: 1
                }}
            >
                 <label>Surname: </label>
                <input
                    style={{width: "30%"}}
                    placeholder={surname}
                    value={riderSurname}
                    onChange={handleInputSurnameChange}
            />
            </div>

            <div
                style={{
                    border: '1px solid green',
                    margin: 1
                }}
            >
                 <label>Country of birth: </label>
                <input
                    style={{width: "30%"}}
                    placeholder={riderCOB}
                    value={riderCOB}
                    onChange={handleInputCOBChange}
            />
            </div>

            <div
                style={{
                    border: '1px solid green',
                    margin: 1
                }}
            >
                 <label>Date of birth: </label>
                <input
                    style={{width: "30%"}}
                    placeholder={riderDOB}
                    value={riderDOB}
                    onChange={handleInputDOBChange}
            />
            </div>

            <div
                style={{
                    border: '1px solid green',
                    margin: 1
                }}
            >
                 <label>Place of birth: </label>
                <input
                    style={{width: "30%"}}
                    placeholder={riderPOB}
                    value={riderPOB}
                    onChange={handleInputPOBChange}
            />
            </div>

            <div
                style={{
                    border: '1px solid green',
                    margin: 1
                }}
            >
                 <label>Date of death: </label>
                <input
                    style={{width: "30%"}}
                    placeholder={riderDOD}
                    value={riderDOD}
                    onChange={handleInputDODChange}
            />
            </div>
          
            <div
                style={{
                    border: '1px solid green',
                    margin: 1
                }}
            >
                 <label>Place of death: </label>
                <input
                    style={{width: "30%"}}
                    placeholder={riderPOD}
                    value={riderPOD}
                    onChange={handleInputPODChange}
            />
            </div>
            
            <button
                onClick={handleButtonClick}
            >
            Post Rider
        </button>
    </div>
    
    )
}

export default NewRiderComponent;