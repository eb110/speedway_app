import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom'
import SpeedwayRider from '../../modelController/SpeedwayRider';

const NewRiderComponent = (props) => {

    let insertOrUpdateFlag = 1

    const navigate = useNavigate()

    const {matchDetails} = props
    let match = JSON.parse(matchDetails)

    let riderNr = +match.data
    let name = ''
    let surname = ''
    let dob = ''
    let dod = ''
    let country = ''
    let pob = ''
    let pod = ''
    let rider = ''
    
    if(riderNr < 9)
        rider = match.awayRiders.filter(x => +x.nr === riderNr)[0]
    else
        rider = match.homeRiders.filter(x => +x.nr === riderNr)[0]

    name = rider.name
    surname = rider.surname
    dob = rider.birthDate
    dod = rider.ripDate
    country = rider.countryOfBirth
    pob = rider.placeOfBirth
    pod = rider.placeOfRip

    if(country || dob)
        insertOrUpdateFlag = 2

    if(!dob){
        dob = 'xxxx-xx-xx'
        dod = 'xxxx-xx-xx'
        country = 'Polska'
        pob = ''
        pod = ''
    }

    const[riderName, setRiderName] = useState(name)
    const[riderDOB, setRiderDOB] = useState(dob)
  
    const[riderPOB, setRiderPOB] = useState(pob)
    const[riderDOD, setRiderDOD] = useState(dod)
    const[riderPOD, setRiderPOD] = useState(pod)
    const[riderCOB, setRiderCOB] = useState(country)

    surname = surname[0] + surname.substring(1).toLowerCase()

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
        if(insertOrUpdateFlag === 1)
            postNewRider()
        else{
            updateTheRider()
        }
    }

    const updateTheRider = async () => {
        let datka = Date.now();
        let speedway_rider = {
            birthDate: riderDOB,
            bonuses: rider.bonuses,
            countryOfBirth: riderCOB,
            fullPerfects: rider.fullPerfects,
            games: rider.games,
            heats: rider.heats,
            name: riderName,
            paidPerfects: rider.paidPerfects,
            placeOfBirth: riderPOB,
            placeOfRip: riderPOD,
            points: rider.pts,
            ripDate: riderDOD,
            surname: riderSurname,
            created: rider.created,
            lastUpdated: datka,
            id: rider.id
        }
        await new SpeedwayRider().updateTheRiderInDB(speedway_rider)
        .then(() => navigate(`/speedwayMatch/${matchDetails}`))

    }

    const postNewRider = async () => {
        let datka = Date.now();
        let speedway_rider = {
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
        await new SpeedwayRider().postNewRider(speedway_rider)
        .then(() => navigate(`/speedwayMatch/${matchDetails}`))

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
                    placeholder={name}
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
                    placeholder={country}
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
                    placeholder={dob}
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
                    placeholder={pob}
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
                    placeholder={dod}
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
                    placeholder={pod}
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