import React, { useState } from 'react';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Home from './pages/Home';

function App() {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState('');
    const [showLogin, setShowLogin] = useState(true);

    const handleLogin = (token, user) => {
        setToken(token);
        setUser(user);
    };

    const handleRegister = (token, user) => {
        setToken(token);
        setUser(user);
    };

    if (!user) {
        return (
            <div>
                <button onClick={() => setShowLogin(true)}>Login</button>
                <button onClick={() => setShowLogin(false)}>Register</button>
                {showLogin ? <Login onLogin={handleLogin} /> : <Register onRegister={handleRegister} />}
            </div>
        );
    }

    return <Home user={user} />;
}

export default App;