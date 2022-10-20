import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';

import Home from '../pages/Home';
import SharedLayout from '../pages/SharedLayout';
import FetchRlach from '../pages/FetchRlach';
import Error from '../pages/Error';
import NewRider from '../pages/NewRider';
import SpeedwayMatchPage from '../pages/SpeedwayMatchPage';
import League from '../pages/League';

function IndexComponent(){

    return(
        <BrowserRouter>
            <Routes>
                <Route exact path="/" element={<SharedLayout />} >
                    <Route index element={<Home />} />
                    <Route exact path="/fetch/:rlachLink" element={<FetchRlach />} />
                    <Route exact path="/*" element={<Error />} />
                    <Route exact path="/newRider/:matchDetails" element={<NewRider />} />
                    <Route exact path="/speedwayMatch/:matchDetails" element={<SpeedwayMatchPage />} />
                    <Route exact path="/league/:leagueDetails" element={<League />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default IndexComponent;