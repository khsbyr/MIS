import styled from 'styled-components'

const HeaderWrapper = styled.div `
    .texthide {
        @media (max-width: 991px) {
            display: none;
        }
    }

    .textshow {
        @media (max-width:991px) {
            text-align: center;
        }
    }
`;



export default HeaderWrapper;