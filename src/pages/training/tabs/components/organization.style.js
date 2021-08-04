import styled from 'styled-components';

const ContentWrapper = styled.div`
  margin-left: 45px;
  margin-right: 45px;
  .ant-upload.ant-upload-drag {
    width: 150px;
    height: 150px;
    border: 1px solid #d9d9d9;
    border-radius: 15px;
    @media (max-width: 991px) {
      width: 100%;
    }
  }

  .title {
    font-size: 16px;
    font-weight: bold;
    color: #103154;
  }

  label {
    color: #7d7d7d;
    font-size: 13px;
  }

  Input {
    width: 100%;
    border-radius: 3px;
  }

  Select {
    text-align: center;
  }

  .ant-select-single:not(.ant-select-customize-input) .ant-select-selector {
    height: 40px;
    padding-top: 8px;
  }

  .button {
    background-color: #103154;
    float: right;
    height: 39px;
    width: 110px;
    border-radius: 8px;
  }

  .ant-input-number {
    width: 100%;
    border-radius: 3px;
    height: 39px;
  }
  .ant-input-number-handler-wrap {
    display: none;
  }
`;

export default ContentWrapper;