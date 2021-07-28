import React, { useState } from 'react';
import Loader from '../loader/Loader';

export const ToolsContext = React.createContext();

export default function ContextProvider({ children }) {
  const [isShowLoader, setIsShowLoader] = useState(false);
  const [tokenParsed, setTokenParsed] = useState();
  const [user, setUser] = useState();
  const [org, setOrg] = useState();

  return (
    <ToolsContext.Provider
      value={{
        isShowLoader,
        setIsShowLoader,
        tokenParsed,
        setTokenParsed,
        user,
        setUser,
        org,
        setOrg,
      }}
    >
      {isShowLoader && <Loader />}
      {children}
    </ToolsContext.Provider>
  );
}
