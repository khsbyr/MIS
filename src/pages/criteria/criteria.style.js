import styled from 'styled-components';

const ContentWrapper = styled.div`
  margin-left: 45px;
  margin-right: 45px;
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
    padding-top: 6px;
    border: none;
  }
`;

export default ContentWrapper;
