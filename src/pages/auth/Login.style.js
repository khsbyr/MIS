import styled from 'styled-components';

const TextWrapper = styled.div`
  float: left;
  text-align: start;
  margin: 200px 0 0 120px;

  .title {
    color: #103154;
    font-size: 24px;
  }

  .icon {
    width: 190px;
    height: 100%;
    text-align: start;
  }

  .ant-carousel .slick-dots li {
    margin-top: 30px;
    background-color: #fff;
    width: 10px;
    height: 10px;
    border-radius: 5px;
  }
  .ant-carousel .slick-dots li.slick-active button {
    background-color: #103154;
    width: 10px;
    height: 10px;
    border-radius: 5px;
  }
  .ant-carousel .slick-dots li button {
    background-color: #103154;
    width: 10px;
    height: 10px;
    border-radius: 5px;
    margin-top: 40px;
  }

  .ant-carousel .slick-dots {
    margin-left: 0%;
    margin-right: 92%;
  }

  @media (max-width: 991px) {
    margin: 5%;
  }
`;

export const LoginWrapper = styled.div``;

export const ImageWrapper = styled.div`
  margin-left: 20px;
`;

export const LogIn = styled.div`
  margin: 120px;

  @media (max-width: 1626px) {
    margin: 80px 30px 0px 30px;
    .login-form-button,
    .register-form-button {
      margin-bottom: 10px;
    }
  }

  @media (max-width: 991px) {
    height: 100vh;
    .title {
      text-align: center;
    }
  }

  .title {
    color: #103154;
    font-size: 25px;
    font-weight: 700;
  }

  .subTitle {
    color: #989898;
    font-weight: 700;
  }

  .login-form-forgot {
    float: right;
    color: #103154;
    font-weight: 600;
  }

  .underline {
    border-bottom: 1px solid #103154;
  }

  .login-form-button {
    background-color: white;
    color: #103154;
    font-weight: 600;
    border-color: #103154;
    width: 150px;
    height: 50px;
    border-radius: 36px;
    margin-right: 35px;

    :hover {
      background-color: #103154;
      color: white;
    }
  }

  .reset-form-button {
    background-color: white;
    color: #103154;
    font-weight: 600;
    border-color: #103154;
    height: 50px;
    border-radius: 36px;
    margin-right: 35px;

    :hover {
      background-color: #103154;
      color: white;
    }
  }

  .register-form-button2 {
    background-color: #103154;
    color: white;
    font-weight: 600;
    border-color: #103154;
    width: 150px;
    height: 50px;
    border-radius: 36px;
  }

  .register-form-button {
    color: #103154;
    font-weight: 600;
    border: none;
    margin-right: 45px;
    outline: 0;
  }

  .copyright {
    color: #103154;
    font-size: 12px;
    font-family: Roboto, sans-serif;
    margin-top: 40px;
    font-weight: 500;
  }
  @media (max-width: 991px) {
    margin: 5%;
  }
`;

export default TextWrapper;
