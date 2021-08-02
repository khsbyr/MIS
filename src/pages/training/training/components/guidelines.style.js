import styled from 'styled-components';

const ContentWrapper = styled.div`
  margin-left: 35px;
  margin-right: 35px;
  margin-top: 45px;
  .ant-upload.ant-upload-drag {
    width: 100%;
    height: 200px;
    left: 20%;
    border: 1px solid #d9d9d9;
    border-radius: 15px;
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

  .ant-table-thead > tr > th {
    color: white;
    background-color: #103154;
  }
  .ant-table-thead
    > tr
    > th:not(:last-child):not(.ant-table-selection-column):not(.ant-table-row-expand-icon-cell):not([colspan])::before {
    background-color: #fff;
  }
  .FormItem {
    width: 100%;
    height: 40px;
    @media (max-width: 991px) {
      width: 100%;
    }
  }
`;

export default ContentWrapper;
