import { Link } from 'react-router-dom';

const Season = (props) => {
    const rok = props.rok
    let wsad = JSON.stringify({year: rok, liga: 'top'})
    return (
        <div>
            <div>{rok}</div>
            <Link to={{pathname: `/league/${wsad}`}}
            >
                Top League
            </Link>
        </div>

    )
}

export default Season