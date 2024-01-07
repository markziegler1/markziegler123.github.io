import React, { useContext } from 'react';
import { UserContext } from './UserContext';

const UserProfile = () => {
    const currentUser = useContext(UserContext);
    // ... (rest of the component)
};
