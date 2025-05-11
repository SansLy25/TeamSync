import {useState, useEffect} from 'react';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import {AuthProvider} from './contexts/AuthContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import CreateLobbyPage from './pages/CreateLobbyPage';
import LobbiesPage from './pages/LobbiesPage';
import LobbyDetailsPage from './pages/LobbyDetailsPage';
import ProfilePage from './pages/ProfilePage';
import CreateRequestPage from './pages/CreateRequestPage';
import RequestsPage from './pages/RequestsPage';
import RequestDetailsPage from './pages/RequestDetailsPage';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {

    return (
        <AuthProvider>
            <Router>
                <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
                    <Header/>
                    <main className="flex-grow container mx-auto px-4 py-6">
                        <Routes>
                            <Route path="/" element={<HomePage/>}/>
                            <Route path="/register" element={<RegisterPage/>}/>
                            <Route path="/login" element={<LoginPage/>}/>
                            <Route path="/lobbies" element={<LobbiesPage/>}/>
                            <Route path="/lobbies/:id" element={<LobbyDetailsPage/>}/>
                            <Route path="/requests" element={<RequestsPage/>}/>
                            <Route path="/requests/:id" element={<RequestDetailsPage/>}/>

                            {/* Защищенные эндпоинты */}
                            <Route path="/profile" element={
                                <ProfilePage/>
                            }/>
                            <Route path="/create-lobby" element={
                                <CreateLobbyPage/>
                            }/>
                            <Route path="/create-request" element={
                                <CreateRequestPage/>
                            }/>

                            {/* Остальные пути */}
                            <Route path="*" element={<Navigate to="/" replace/>}/>
                        </Routes>
                    </main>
                    <Footer/>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;