import styled from 'styled-components';

const ContentWrapper = styled.div`
  margin-left: 45px;
  margin-right: 45px;
  margin-top: 40px;

  .title {
    font-size: 24px;
    font-weight: bold;
    color: #103154;
  }

  Select {
    text-align: center;
  }

  .ant-select-single:not(.ant-select-customize-input) .ant-select-selector {
    height: 33px;
    padding-top: 6px;
    border: none;
    background-color: unset;
  }

  .ant-select-single.ant-select-sm:not(.ant-select-customize-input):not(.ant-select-customize-input)
    .ant-select-selection-search-input {
    height: 33px !important;
  }
`;

export default ContentWrapper;
