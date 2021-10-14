import styled from 'styled-components';

const ContentWrapper = styled.div`
  background-color: #283047;
  height: 100%;

  .ant-tabs-nav-list {
    color: white !important;
  }

  .ant-tabs-nav-wrap {
    margin-left: 200px !important;
    margin-top: 20px !important;
  }

  .ant-tabs-tab.ant-tabs-tab-active {
    border-bottom: 2px solid white !important;
    z-index: 2;
  }

  .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
    color: white !important;
  }

  .ant-tabs > .ant-tabs-nav,
  .ant-tabs > div > .ant-tabs-nav {
    position: static;
  }
`;

export default ContentWrapper;
