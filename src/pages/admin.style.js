import styled from 'styled-components'
const adminWrapper = styled.div `
body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
      monospace;
  }
  .trigger {
    padding: 0;
    font-size: 18px;
    line-height: 50px;
    cursor: pointer;
    transition: color 0.3s;
  }
  
  .trigger:hover {
    color: #1890ff;
  }
  .logo {
    float: left;
    width: 120px;
    height: 31px;
    margin: 16px 24px 16px 0;
    background: rgba(255, 255, 255, 0.3);
  }
  
  .ant-row-rtl .logo {
    float: right;
    margin: 16px 0 16px 24px;
  }
  
  .site-layout-background {
    background: #fff;
  }
  .ant-menu-root.ant-menu-vertical, 
  .ant-menu-root.ant-menu-vertical-left, .ant-menu-root.ant-menu-vertical-right, .ant-menu-root.ant-menu-inline {
    margin-top: "50px"
  }
  `;
