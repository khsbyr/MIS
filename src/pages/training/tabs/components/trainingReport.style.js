import styled from 'styled-components';

const ContentWrapper = styled.div`
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
    font-size: 14px;
    font-weight: bold;
    color: #0d0d0d;
  }

  label {
    color: #7d7d7d;
    font-size: 13px;
  }

  .FormItem {
    /* width: 100%;
        height: 40px;
        border:none;
        border-bottom: 1px solid #103154; */
    width: 100%;
    height: 40px;
    border-radius: 3px;
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
    padding-top: 7px;
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

  .ant-input-prefix {
    color: #103154;
    margin-right: 25px;
  }
`;

export default ContentWrapper;
