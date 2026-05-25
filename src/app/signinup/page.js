
import { signup } from './actions'
import { login } from './actions'
import { logout } from './actions'

export default function SigninupPage() {
    return (
        <form>
            <h1>Sign In</h1>
            <label htmlFor="email">Email:</label>
            <input id="email" name="email" type="email" required/>

            <label htmlFor="password">Password:</label>
            <input id="password" name="password" type="password" required/>

            <button formAction={signup}>Sign up</button>

            <br/><br/>

            <h1>Login</h1>
            <label htmlFor="email">Email:</label>
            <input id="email" name="email" type="email" required/>

            <label htmlFor="password">Password:</label>
            <input id="password" name="password" type="password" required/>

            <button formAction={login}>Login</button>

            <br/><br/>

            <h1>Logout</h1>
            <button formAction={logout}>Logout</button>
        </form>
    )
}