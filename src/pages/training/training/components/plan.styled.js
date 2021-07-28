import styled from 'styled-components';

const HeaderWrapper = styled.div`
  margin-top: 30px;

  .title {
    font-size: 24px;
    font-weight: Bold;
    margin-left: 45px;
  }

  .ant-btn {
    border: none;
    font-size: 15px;
  }
`;
export const ContentWrapper = styled.div`
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
    margin: 20px 0px 20px 0px;
  }

  label {
    color: #7d7d7d;
    font-size: 13px;
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
    padding-top: 4px;
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

export default HeaderWrapper;
