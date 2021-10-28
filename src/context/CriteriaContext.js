import React, { useState, useContext } from 'react';

export const CriteriaContext = React.createContext({});

export const useCriteriaStore = () => useContext(CriteriaContext);

export default function CriteriaContextProvider({ children }) {
  const [criteriaReferenceList, setCriteriaReferenceList] = useState([]);

  return (
    <CriteriaContext.Provider
      value={{
        criteriaReferenceList,
        setCriteriaReferenceList,
      }}
    >
      {children}
    </CriteriaContext.Provider>
  );
}
