import styled from 'styled-components';

const ContentWrapper = styled.div`
  color: white;
  .title {
    width: 100%;
    height: 11%;
    background-color: #ffffff;
    border-radius: 5px;
    text-align: center;
    color: #283047;
    font-weight: 700;
    padding-top: 10px;
    font-size: 1vw;
  }

  .body {
    width: 100%;
    height: 90%;
    background-color: #36577a;
    border-radius: 10px;
    text-align: center;
    font-weight: 500;
    padding-top: 20px;
    font-size: 1vw;
  }

  .body2 {
    width: 100%;
    height: 70%;
    background-color: #36577a;
    border-radius: 10px;
    text-align: start;
    font-weight: 500;
    padding-top: 20px;
    padding-left: 55px;
    font-size: 1vw;
    margin-top: 10px;
  }

  .body .total {
    font-size: 3vw;
  }
  .body2 .total2 {
    font-size: 3vw;
    text-align: center;
  }

  .ant-select-selector {
    background-color: inherit !important;
    border: none !important;
    font-size: 18px;
    color: '#fff';
  }

  .ant-select-selection-placeholder {
    color: white !important;
  }

  .ant-select-arrow {
    color: white !important;
  }

  .ant-select-selection-item {
    color: white !important;
  }
`;

export default ContentWrapper;
