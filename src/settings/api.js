import jwt_decode from "jwt-decode";

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const checkTokenExpired = (token) => {
  var decodedToken = jwt_decode(token, { complete: true });
  var currentDate = new Date();

  if (decodedToken.exp * 1000 < currentDate.getTime()) {
    return true;
  }

  return false;
};

const postRequestNoToken = (url, data) => {
  return axios
    .post(url, data)
    .then((response) => {
      if (response.status === 400 || response.status === 500)
        throw response.data;
      return response.data;
    })
    .catch((err) => {
      throw err[1];
    });
};

const getRequest = async (url) => {
  delay(1000);
  let token = localStorage.getItem("token");

  if (!token || (token && checkTokenExpired(token))) {
    await postRequestNoToken("api/account/guest_jwt/", {}).then((res) => {
      token = res.result.JWToken;
    });
  }

  localStorage.setItem("token", token);

  const lang = localStorage.getItem("i18nextLng")
    ? localStorage.getItem("i18nextLng")
    : "en";
  const currency = localStorage.getItem("currency")
    ? localStorage.getItem("currency")
    : "MNT";

  let config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Accept-Language": lang,
      "x-display-currency": currency,
    },
  };
  return axios
    .get(url, config)
    .then((response) => {
      if (response.status === 400 || response.status === 500)
        throw response.data;
      return response.data;
    })
    .catch((err) => {
      throw err[1];
    });
};

export { postRequest, getRequest, postRequestNoToken };
