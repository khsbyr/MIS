import styled from 'styled-components';

const ContentWrapper = styled.div`
  margin-left: 45px;
  margin-right: 45px;
  .title {
    font-size: 24px;
    font-weight: bold;
    color: #0d0d0d;
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

  .ant-input {
    height: 40px;
  }

  .button {
    background-color: #103154;
    float: right;
    height: 40px;
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

  .ant-input-number {
    width: 100%;
    border-radius: 3px;
    height: 40px;
  }
  .ant-input-number-handler-wrap {
    display: none;
  }
  .ant-select-selection-search {
    margin-top: 8px;
  }
  .ant-picker {
    width: 100%;
    height: 40px;
  }
  .ant-form-item .ant-mentions,
  .ant-form-item textarea.ant-input {
    height: 70px;
  }
  .p-multiselect-token {
    padding: 0px;
  }
  .p-multiselect .p-multiselect-label.p-placeholder {
    color: #c2c2c2;
    font-size: 14px;
  }
`;

export default ContentWrapper;
