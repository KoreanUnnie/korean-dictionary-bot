const handle = async ({ message }) => {
  console.log("botOnDisconnect");
};

module.exports = {
  handle,
  name: "disconnect"
};
