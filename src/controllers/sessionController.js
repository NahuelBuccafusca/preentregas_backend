const userDTO = require("../dao/DTOs/user.dto");

exports.register = async (req, res) => {
  res.redirect("/userregistrade");
};

exports.login = async (req, res) => {
  if (!req.user)
    return res
      .status(400)
      .send({ status: "error", error: "Credenciales invalidas" });
  try {
    if (!req.user) return res.redirect("/register");
    req.session.user = {
      id: req.user._id,
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      email: req.user.email,
      age: req.user.age,
      cart: req.user.cart,
      rol: req.user.rol,
    };

    if (req.session.user.rol === "admin") {
      res.redirect("/productsManager");
    } else {
      res.redirect("/products");
    }
  } catch (err) {
    res.status(500).send("Error al iniciar sesión");
  }
};
exports.current = async (req, res) => {
  try {
    if (req.session.user) {
      let user = new userDTO(req.session.user);
      res.render("profile", { user: user });
    } else {
      res.send({ message: "No hay usuario inciado" });
    }
  } catch (error) {
    console.error("No se ha iniciado sesión", error);
  }
};
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).send("Error al cerrar sesión");
    res.redirect("/login");
  });
};

exports.githubCallback = async (req, res) => {
  req.session.user = req.user;
  if (req.session.user.rol === "admin") {
    res.redirect("/productsManager");
  } else {
    res.redirect("/products");
  }
};
