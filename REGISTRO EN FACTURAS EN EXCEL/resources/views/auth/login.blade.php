<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Login</title>
    <style>
        body {
            margin: 0;
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            background: linear-gradient(135deg, #ff4b2b, #8e2de2, #1a1a40);
            font-family: Arial, sans-serif;
        }
        .login-box {
            background: #f0f0f0;
            padding: 40px;
            border-radius: 10px;
            text-align: center;
            width: 300px;
            box-shadow: 0 0 15px rgba(0,0,0,0.3);
        }
        .login-box img {
            width: 80px;
            margin-bottom: 20px;
            border-radius: 50%;
        }
        .login-box input {
            width: 100%;
            padding: 10px;
            margin: 10px 0;
            border: none;
            background: #000;
            color: #fff;
            border-radius: 5px;
        }
        .login-box button {
            width: 100%;
            padding: 10px;
            background: #000;
            color: #fff;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
        .login-box a {
            display: block;
            margin-top: 10px;
            font-size: 12px;
            color: #333;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="login-box">
        <img src="https://cdn-icons-png.flaticon.com/512/847/847969.png" alt="Usuario">
        <form action="{{ url('/login') }}" method="POST">
            @csrf
            <input type="text" name="usuario" placeholder="Usuario" value="{{ old('usuario') }}">
            <input type="password" name="password" placeholder="Contraseña">
            <button type="submit">Iniciar sesión</button>
        </form>
        <a href="#">¿Olvidó su contraseña?</a>
    </div>
</body>
</html>