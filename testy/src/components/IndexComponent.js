import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';

import Home from '../pages/Home';
import SharedLayout from '../pages/SharedLayout';
import TestFetch from '../pages/FetchRlach';
import Error from '../pages/Error';
import NewRider from '../pages/NewRider';
import SpeedwayMatch from '../pages/SpeedwayMatchPage';

function IndexComponent(){

    return(
        <BrowserRouter>
            <Routes>
                <Route exact path="/" element={<SharedLayout />} >
                    <Route index element={<Home />} />
                    <Route exact path="/fetch" element={<TestFetch />} />
                    <Route exact path="/*" element={<Error />} />
                    <Route exact path="/newRider/:matchDetails" element={<NewRider />} />
                    <Route exact path="/speedwayMatch/:matchDetails" element={<SpeedwayMatch />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default IndexComponent;