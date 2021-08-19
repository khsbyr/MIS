import React, { useState, useContext } from 'react';

export const ProjectContext = React.createContext({});

export const useProjectStore = () => useContext(ProjectContext);

export default function ProjectContextProvider({ children }) {
  const [ProjectList, setProjectList] = useState([]);

  return (
    <ProjectContext.Provider
      value={{
        ProjectList,
        setProjectList,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}
