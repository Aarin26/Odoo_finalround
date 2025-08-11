import React from 'react';

const Home = ({ user }) => {
    return (
        <div>
            <h1>Welcome {user ? user.username : 'to GlobeTrotter!'}</h1>
            <p>This is your travel planning dashboard.</p>
        </div>
    );
};

export default Home;