import styled from 'styled-components';


const ContentWrapper = styled.div `
    margin-left: 45px;
    margin-right: 45px;
    margin-top: 30px;
    .p-checkbox .p-checkbox-box {
        width: 15px !important;
        height: 15px !important;
        border: 1px solid;
    }
    /* .p-checkbox .p-checkbox-box:active {
    background-color: red;   
    } */
    .p-checkbox .p-checkbox-box:focus {
    background-color: #103154;   
    }
`;

export default ContentWrapper;