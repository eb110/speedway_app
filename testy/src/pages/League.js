import {useParams} from 'react-router-dom'
import LeagueComponent from "../components/seasonComponents/LeagueComponent";

const League = () => {
    const {leagueDetails} = useParams();
    return (

      <div
        style={{
          margin: '5px',
          padding: '15px',
          border: '1px solid red'}}
      >
        <LeagueComponent 
          leagueDetails={JSON.parse(leagueDetails)}
        />
      </div>
     
    );
  };

  export default League;