namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function showLogin()
    {
        return view('auth.login');
    }

    public function login(Request $request)
    {
        $request->validate([
            'usuario' => 'required|string',
            'password' => 'required|string',
        ]);

        // Aquí iría la lógica de autenticación con Auth::attempt()
        // if(Auth::attempt([...])) { ... }

        return back()->with('error', 'Credenciales incorrectas');
    }

    public function logout()
    {
        Auth::logout();
        return redirect('/login');
    }
}