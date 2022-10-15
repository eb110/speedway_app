import {useParams} from 'react-router-dom'
import Speedway from '../components/speedwayComponents/Speedway';

const SpeedwayMatchPage = () => {
    const {matchDetails} = useParams();
    return (
        <Speedway
            matchDetails={matchDetails}
        />
    )
}

export default SpeedwayMatchPage;