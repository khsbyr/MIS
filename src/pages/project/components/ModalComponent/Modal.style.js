import styled from 'styled-components';

const ContentWrapper = styled.div`
  margin-left: 45px;
  margin-right: 45px;

  .ant-upload.ant-upload-drag {
    width: 100%;
    height: 200px;
    border: 1px solid #d9d9d9;
    border-radius: 15px;
  }

  .title {
    font-size: 24px;
    font-weight: bold;
    color: #0d0d0d;
    margin: 20px 0px 20px 0px;
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

  .FormItem {
    width: 60%;
    height: 40px;
    border: none;
    border-bottom: 1px solid #103154;
    @media (max-width: 991px) {
      width: 100%;
    }
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

  .ant-input-prefix {
    color: #103154;
    margin-right: 25px;
  }
  .ant-select-selection-search {
    margin-top: 8px;
  }
  #nest-messages_total {
    height: 40px;
    border: 1px solid rgb(217, 217, 217);
    padding: 4px 11px;
  }
  #nest-messages_total:focus-visible {
    outline: none;
  }
  #nest-messages_total:focus {
    border-color: #40a9ff;
    box-shadow: 0 0 0 0.025rem #1890ff;
  }

  #nest-messages_total:hover {
    border-color: #40a9ff;
  }
  #nest-messages_total:focus {
    border-color: #1890ff;
  }
  #nest-messages_costOfCompany {
    height: 40px;
    border: 1px solid rgb(217, 217, 217);
    padding: 4px 11px;
  }
  #nest-messages_costOfCompany:focus-visible {
    outline: none;
  }
  #nest-messages_costOfCompany:focus {
    border-color: #40a9ff;
    box-shadow: 0 0 0 0.025rem #1890ff;
  }

  #nest-messages_costOfCompany:hover {
    border-color: #40a9ff;
  }
  #nest-messages_costOfCompany:focus {
    border-color: #1890ff;
  }
  #nest-messages_projectInvestment {
    height: 40px;
    border: 1px solid rgb(217, 217, 217);
    padding: 4px 11px;
  }
  #nest-messages_projectInvestment:focus-visible {
    outline: none;
  }
  #nest-messages_projectInvestment:focus {
    border-color: #40a9ff;
    box-shadow: 0 0 0 0.025rem #1890ff;
  }

  #nest-messages_projectInvestment:hover {
    border-color: #40a9ff;
  }
  #nest-messages_projectInvestment:focus {
    border-color: #1890ff;
  }
`;

export default ContentWrapper;
