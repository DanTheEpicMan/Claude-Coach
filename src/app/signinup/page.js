
import { signup } from './actions'
import { login } from './actions'
import { logout } from './actions'

export default function SigninupPage() {
    return (
        <div>
                <div>
                        <form>
                                <h1>Sign Up</h1>
                                <label htmlFor="email">Email:</label>
                                <input id="email" name="email" type="email" required/>

                                <label htmlFor="password">Password:</label>
                                <input id="password" name="password" type="password" required/>

                                <button formAction={signup}>Sign up</button>
                        </form>
                </div>
                <br/><br/>
                <div>
                        <form>
                                <h1>Login</h1>
                                <label htmlFor="email">Email:</label>
                                <input id="email" name="email" type="email" required/>

                                <label htmlFor="password">Password:</label>
                                <input id="password" name="password" type="password" required/>

                                <button formAction={login}>Login</button>
                        </form>
                </div>
                <br/><br/>
                <div>
                        <form>
                                <h1>Logout</h1>
                                <button formAction={logout}>Logout</button>
                        </form>
                </div>
        </div>
    )
}