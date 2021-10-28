import styled from 'styled-components';

const ContentWrapper = styled.div`
  margin-left: 35px;
  margin-right: 35px;
  margin-top: 30px;

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
    border: none;
    background-color: unset;
  }
`;

export default ContentWrapper;
