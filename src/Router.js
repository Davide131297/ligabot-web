import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './Components/Header';
import Home from './Pages/Home';
import Einstellungen from './Pages/Einstellungen';

export function Router() {
    return (
        <BrowserRouter>
        <Header />
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Einstellungen" element={<Einstellungen />} />
        </Routes>
        </BrowserRouter>
    );
}