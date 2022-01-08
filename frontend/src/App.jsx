import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Home } from "./components/pages/Home";
import { Login } from "./components/pages/Login";
import { Register } from "./components/pages/Register";
import { Apartment } from "./components/pages/Apartment";
import { Apartments } from "./components/pages/Apartments";
import { MyApartments } from "./components/pages/MyApartments";
import { NewApartmentForm } from "./components/pages/NewApartmentForm";
import { PageNotFound } from "./components/pages/PageNotFound"; 
import { LoggedInRoute } from './components/routing/LoggedInRoute';
import { GuestsRoute } from './components/routing/GuestsRoute';
import { UserProvider } from "./contexts/User"

export function App() {
    
    return (
        <UserProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Home />} />
                        <Route path="login" element={(
                            <GuestsRoute><Login /></GuestsRoute>
                        )} />
                        <Route path="register" element={(
                            <GuestsRoute><Register /></GuestsRoute>
                        )} />
                        <Route path="apartments/new" element={(
                            <LoggedInRoute><NewApartmentForm /></LoggedInRoute>
                        )} />
                        <Route path="my-apartments" element={(
                            <LoggedInRoute><MyApartments /></LoggedInRoute>
                        )} />
                        <Route path="apartments/:apartmentId" element={<Apartment />} />
                        <Route path="apartments" element={<Apartments />} />
                        <Route path="*" element={<PageNotFound />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </UserProvider>
    )
}