/* eslint-disable import/no-anonymous-default-export */
import React, { useState, useContext } from 'react';
import Loader from '../loader/Loader';

export const ToolsContext = React.createContext({});

export const useToolsStore = () => useContext(ToolsContext);

export default function ContextProvider({ children }) {
  const [isShowLoader, setIsShowLoader] = useState(false);
  const [user, setUser] = useState();
  const [orgList, setOrgList] = useState();
  const [countryList, setCountryList] = useState();
  const [aimagList, setAimagList] = useState();
  const [partnerList, setPartnerList] = useState();
  const [isAimag, setIsAimag] = useState(true);

  return (
    <ToolsContext.Provider
      value={{
        isShowLoader,
        setIsShowLoader,
        user,
        setUser,
        orgList,
        setOrgList,
        countryList,
        setCountryList,
        aimagList,
        setAimagList,
        setPartnerList,
        partnerList,
        isAimag,
        setIsAimag,
      }}
    >
      {isShowLoader && <Loader />}
      {children}
    </ToolsContext.Provider>
  );
}
