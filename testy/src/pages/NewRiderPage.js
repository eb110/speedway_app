import {useParams} from 'react-router-dom'
import NewRider from '../components/speedwayComponents/NewRider.js';

const NewRiderPage = () => {
    const {matchDetails} = useParams();
    return (
        <NewRider
            match={matchDetails}
        />
    )
}

export default NewRiderPage;