export const registerUser = (req, res) => {
  const { username, password, email } = req.body;

  res.json({
    message: "User registered successfully",
    data: { username, password, email },
  });
};

export const loginUser = (req, res) => {
  res.json({
    message: "User logged in successfully",
  });
};
