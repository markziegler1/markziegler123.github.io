//WorkoutContext.js
import React, { createContext, useState } from 'react';

export const WorkoutContext = createContext();

export const WorkoutProvider = ({ children }) => {
    const [workoutLogs, setWorkoutLogs] = useState([]);

    return (
        <WorkoutContext.Provider value={{ workoutLogs, setWorkoutLogs }}>
            {children}
        </WorkoutContext.Provider>
    );
};
