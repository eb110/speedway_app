import {useParams} from 'react-router-dom'
import FetchComponent from "../components/FetchComponent";

const FetchRlach = () => {
    const {seasonGame} = useParams();
    return (

      <div
        style={{
          margin: '5px',
          padding: '15px',
          border: '1px solid red'}}
      >
        <FetchComponent 
          seasonGame={JSON.parse(seasonGame)}
        />
      </div>
     
    );
  };

  export default FetchRlach;