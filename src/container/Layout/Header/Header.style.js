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
    .ant-select:not(.ant-select-customize-input) .ant-select-selector {
        color: white;
        border: none;
        background-color: transparent;
    }
`;



export default HeaderWrapper;