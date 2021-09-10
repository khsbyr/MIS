import styled from 'styled-components';

const ContentWrapper = styled.div`
  margin-left: 45px;
  margin-right: 45px;
  .ant-upload.ant-upload-drag {
    margin-left: 30px;
    width: 150px;
    height: 150px;
    border: 1px solid #d9d9d9;
    border-radius: 15px;
    @media (max-width: 991px) {
      width: 50%;
      margin-left: 0px;
      margin-bottom: 30px;
      left: 20%;
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
    height: 39px;
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
  .ant-select-selection-search {
    margin-top: 4px;
  }
  .ant-upload.ant-upload-select-picture-card {
    width: 200px !important;
    height: 240px !important;
  }
`;

export default ContentWrapper;
