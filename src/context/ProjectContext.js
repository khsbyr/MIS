import React, { useState, useContext } from 'react';

export const ProjectContext = React.createContext({});

export const useProjectStore = () => useContext(ProjectContext);

export default function ProjectContextProvider({ children }) {
  const [ProjectList, setProjectList] = useState([]);
  const [PlanList, setPlanList] = useState([]);

  return (
    <ProjectContext.Provider
      value={{
        ProjectList,
        setProjectList,
        PlanList,
        setPlanList,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}
