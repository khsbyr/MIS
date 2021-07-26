/* eslint-disable import/no-anonymous-default-export */
import React, { useState } from 'react';
import Loader from '../loader/Loader';

export const ToolsContext = React.createContext();

// var ref = null

// export function toolsStore.setIsShowLoader(utga) {
//     if (!!ref) {
//         ref.current.toolsStore.setIsShowLoader(utga);
//     }
// }

export default function ContextProvider({ children }) {
  // ref = useRef(null)
  const [isShowLoader, setIsShowLoader] = useState(false);
  const [tokenParsed, setTokenParsed] = useState();
  const [user, setUser] = useState();
  const [org, setOrg] = useState();

  // React.useImperativeHandle(
  //     ref,
  //     () => ({
  //         toolsStore.setIsShowLoader: (utga) => { setIsShowLoader(utga) }
  //     }),
  //     [],
  // )

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
