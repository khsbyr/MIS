import styled from 'styled-components';

const ContentWrapper = styled.div`
  color: white;
  width: 100%;
  height: 100%;
  background: #1b1b1b;
  /* margin-top: -30%; */
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

  .btn {
    color: #999;
    margin-top: 20px;
    margin-left: 15px;
    background: rgba(0, 0, 0, 0.5);
    padding: 20px 20px;
    font-size: 12px;
    text-decoration: none;
    letter-spacing: 2px;
    text-transform: uppercase;
  }

  .btn:hover {
    border: none;
    background: rgba(0, 0, 0, 0.4);
    background: #fff;
    padding: 20px 20px;
    color: #1b1b1b;
  }
`;

export default ContentWrapper;
