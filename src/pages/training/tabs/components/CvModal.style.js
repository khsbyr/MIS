import styled from 'styled-components';

const ContentWrapper = styled.div`
  margin-left: 45px;
  margin-right: 45px;

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
    padding-top: 4px;
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
  .ant-picker {
    width: 100%;
    height: 40px;
  }

  .ant-select-selection-overflow {
    height: 38px;
  }
`;

export default ContentWrapper;
