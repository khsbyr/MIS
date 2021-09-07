import styled from 'styled-components';

const ContentWrapper = styled.div`
  color: white;
  margin-top: -500px;
  .title {
    width: 610px;
    height: 50px;
    background-color: #ffffff;
    border-radius: 5px;
    text-align: center;
    color: #283047;
    font-weight: 700;
    padding-top: 10px;
  }

  .body {
    width: 300px;
    height: 180px;
    background-color: #36577a;
    border-radius: 10px;
    text-align: center;
    font-weight: 500;
    padding-top: 20px;
    font-size: 18px;
  }

  .body2 {
    width: 610px;
    height: 160px;
    background-color: #36577a;
    border-radius: 10px;
    text-align: start;
    font-weight: 500;
    padding-top: 20px;
    padding-left: 55px;
    font-size: 18px;
    margin-top: 10px;
  }

  .body .total {
    font-size: 70px;
  }
  .body2 .total2 {
    font-size: 70px;
    text-align: center;
  }
`;

export default ContentWrapper;
