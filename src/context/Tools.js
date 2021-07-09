import React, { useRef, useState } from 'react'
import Loader from '../loader/Loader';

export const Context = React.createContext()

var ref = null

export function isShowLoading(props) {
    if (!!ref) {
        ref.current.isShowLoading(props);
    }
}

export default function ({ children }) {
    ref = useRef(null)
    const [showLoader, setshowLoader] = useState(false)
    React.useImperativeHandle(
        ref,
        () => ({
            isShowLoading: (props) => { setshowLoader(props) }
        }),
        [],
    )

    return (
        <Context.Provider value={{ showLoader, setshowLoader }}>
            {showLoader && <Loader />}
            {children}
        </Context.Provider>
    )
}
