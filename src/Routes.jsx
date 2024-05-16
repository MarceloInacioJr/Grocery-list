import React from "react";
import {
    BrowserRouter as Router,
    Routes, Route
} from 'react-router-dom'


import Login from "./components/contents/LoginScreen";
import Main from "./components/contents/MainScreen";

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />}></Route>
                <Route path="/main" element={<Main />}></Route>
            </Routes>
        </Router>
    );
};

export default AppRoutes;
