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
    padding-top: 7px;
  }

  .ant-input {
    height: 40px;
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

  .ant-input-number {
    width: 100%;
    border-radius: 3px;
    height: 40px;
  }
  .ant-input-number-handler-wrap {
    display: none;
  }
  .ant-select-selection-search {
    margin-top: 4px;
  }
  Select {
    text-align: center;
  }

  /* .ant-select-single:not(.ant-select-customize-input) .ant-select-selector {
    height: 33px;
    padding-top: 6px;
    border: none;
  } */
  .p-datatable.p-datatable-hoverable-rows
    .p-datatable-tbody
    > tr:not(.p-highlight):hover {
    background: #e6f7ff !important;
  }
`;

export default ContentWrapper;
