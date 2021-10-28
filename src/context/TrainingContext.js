import React, { useState, useContext } from 'react';

export const TrainingContext = React.createContext({});

export const useTrainingStore = () => useContext(TrainingContext);

export default function TrainingContextProvider({ children }) {
  const [TrainingList, setTrainingList] = useState([]);

  return (
    <TrainingContext.Provider
      value={{
        TrainingList,
        setTrainingList,
      }}
    >
      {children}
    </TrainingContext.Provider>
  );
}
