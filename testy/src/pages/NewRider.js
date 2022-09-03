import {useParams} from 'react-router-dom'
import NewRiderComponent from '../components/speedwayComponents/NewRiderComponent';

const NewRider = () => {
    const {matchDetails} = useParams();
    return (
        <NewRiderComponent
            matchDetails={matchDetails}
        />
    )
}

export default NewRider;