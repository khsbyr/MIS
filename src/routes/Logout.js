import React from 'react';
import { useKeycloak } from '@react-keycloak/web';

function Logout() {
    const { keycloak } = useKeycloak()
    debugger
    React.useEffect(() => {
        window.location.href = "/"
        keycloak.logout()
    }, [keycloak])

    return (
        <div>Logout...</div>
    );
}
export default Logout;