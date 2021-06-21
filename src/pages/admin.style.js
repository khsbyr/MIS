import styled from 'styled-components';

const AdminWrapper = styled.div `

body {
    margin: 0;
    /* font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif; */
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
    background: green;
    width: 500px;
  }

  .title {
    font-size: 16px;
    text-align: center;
    color: #103154;
    font-weight: 400;
    margin-bottom: 30px;
  }

  .icon {
    width: 250px;
    display: block;
    margin: auto;
  }

  .ant-layout-sider-zero-width-trigger {
    position: absolute;
    top: 10px;
  }
  `;

export default AdminWrapper;