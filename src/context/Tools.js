/* eslint-disable import/no-anonymous-default-export */
import React, { useState, useContext, useEffect } from 'react';
import Loader from '../loader/Loader';

export const ToolsContext = React.createContext({});

export const useToolsStore = () => useContext(ToolsContext);

export default function ContextProvider({ children }) {
  const [isShowLoader, setIsShowLoader] = useState(false);
  const [generalInfo, setGeneralInfo] = useState({
    userInfo: {},
    orgList: null,
  });
  const [selectedUser, setSelectedUser] = useState();

  useEffect(() => {
    if (selectedUser && selectedUser.orgId) {
      localStorage.setItem('orgId', selectedUser.orgId);
    }
  }, [selectedUser]);

  return (
    <ToolsContext.Provider
      value={{
        isShowLoader,
        setIsShowLoader,
        generalInfo,
        setGeneralInfo,
        selectedUser,
        setSelectedUser,
      }}
    >
      {isShowLoader && <Loader />}
      {children}
    </ToolsContext.Provider>
  );
}
