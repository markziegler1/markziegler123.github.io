//WorkoutContext.js
import React, { createContext, useState } from 'react';

// Opretter en ny Context, WorkoutContext
// Som at oprette en slags global veriable som kan tilgås af alle komponenter i appen
export const WorkoutContext = createContext();


// Komponenten WorkoutProvider
// WorkoutProvider komponenten bruges useState til at oprette workoutLogs state. Denne holder styr på træningslogs
// Når jeg omslutter mine komponenter med WorkoutContext.Provider, kan workoutLogs tilgås af alle child komponenter
// Det betyder at alle komponenter der har brug for aat tilgå eller opdataere træningslog kan gøre det gennem Context
// Hvor er det smart? Uden Context ville jeg manuelt skulle sende workoutLogs og setWorkoutLogs som props fra en parentkomponent til en child komponent.
// Med WorkoutContext.js kan child komponenter blot "abonnere" på disee data.

export const WorkoutProvider = ({ children }) => {
    // State til at gemme workoutLogs
    const [workoutLogs, setWorkoutLogs] = useState([]);

    // Retunerer en Provider som gør workoutLogs tilgængelig for alle child komponenter
    return (
        <WorkoutContext.Provider value={{ workoutLogs, setWorkoutLogs }}>
            {children}
        </WorkoutContext.Provider>
    );
};


