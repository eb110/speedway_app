import AgeValidator from "./AgeValidator";
import GameDateValidator from "./GameDateValidator";
import RiderStartingNumberValidator from "./RiderStartingNumberValidator";

const Validator = (props) => {

    let match = props.match
    let validateGame = props.validateGame

    return (
        <div>
            <GameDateValidator
                match={match}
                validateGame={validateGame}
            />
            <RiderStartingNumberValidator
                match={match}
                validateGame={validateGame}
            />
            <AgeValidator
                match={match}
                validateGame={validateGame}
            />
        </div>

    )
}

export default Validator;