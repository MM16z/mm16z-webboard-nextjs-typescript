const hasJWT = () => {
  let istoken = false;

  localStorage.getItem("token") ? (istoken = true) : (istoken = false);

  return istoken;
};

export default hasJWT;
