import {BrowserRouter, Routes, Route} from "react-router-dom";
import App from "../App";


export let routes = (
    <BrowserRouter>
        <Routes>
            <Route path={'/'} element={<App/>}/>
        </Routes>
    </BrowserRouter>
)