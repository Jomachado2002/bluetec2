const bcrypt = require('bcryptjs'); // Corregido: 'bcryptjs'
const userModel = require('../../models/userModel');
const jwt = require ('jsonwebtoken');


async function userSignInController(req, res) {
  try {
    const { email, password } = req.body; // Corregido: 'req.body'

    if (!email) {
      throw new Error("Por favor ingresa tu correo");
    }
    if (!password) {
      throw new Error("Por favor ingresa tu contraseña");
    }

    const user = await userModel.findOne({ email });

    if (!user) { // Corregido: 'if (!user)' para cuando el usuario no existe
      throw new Error("Usuario no encontrado");
    }

    const checkPassword = await bcrypt.compare(password, user.password); // Corregido: 'await bcrypt.compare'

    console.log("Verifica tu Contraseña", checkPassword);

    if(checkPassword){

        const tokenData= {
            _id : user._id,
            email: user.email,
        }
        const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET_KEY , {expiresIn: 60*60*8});

        const tokenOption = {
            httpOnly: true,
            secure: true
        }
        res.cookie("token", token, tokenOption).status(200).json({
            message: "Inicio de sesión exitoso",
            data : token,
            success: true,
            error: false
        })
    }else{
        throw new Error("Por favor verifica tu contraseña")
    }

    // Si la contraseña es correcta, aquí deberías agregar la lógica para proceder con el inicio de sesión.

  } catch (err) {
    res.json({
      message: err.message || err,
      error: true,
      success: false, // Corregido: 'success' en lugar de 'succes'
    });
  }
}

module.exports = userSignInController;
