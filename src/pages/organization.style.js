import styled from 'styled-components';


const ContentWrapper = styled.div `
    margin-left: 45px;
    margin-right: 45px;
    .ant-upload.ant-upload-drag {
        width: 100%;
        height: 200px;
        //margin: 50px 20px 20px 40px;
        
        /* top: 10%;
        bottom: 20%; */
        border: 1px solid #d9d9d9;
        border-radius: 15px;
    }

    .title {
        font-size: 16px;
        font-weight: bold;
        color: #103154;
    }

    label {
        color: #7D7D7D;
        font-size: 13px;
    }

    Input {
        width: 100%;
        height: 40px;
        border-radius: 3px;
    }

    Select {
        text-align: center;
    }

    .ant-select-single:not(.ant-select-customize-input) .ant-select-selector {
        height: 40px;
        padding-top: 4px;
    }

    .button {
        background-color: #103154;
        float: right;
        height: 39px;
        width: 110px;
        border-radius: 8px;
    }
`;

export default ContentWrapper;