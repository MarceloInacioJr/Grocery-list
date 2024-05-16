import { ReactComponent as LogoMain } from '../assets/componentsLogin/logo.svg'
import './style/loginScreen.css'

// hooks
import { useEffect, useState } from 'react'

// firebase
import auth from '../../db'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'


// Login

const Login = () => {
    const [formLogin, setFormLogin] = useState(true)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [messageLogin, setMessageLogin] = useState("")

    const navigate = useNavigate()

    // check login
    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            if (user) {
                navigate('/main')
            } else {
                // navigate login
                navigate('/')
            }
        })
    }, [])

    // clear messages
    useEffect(() => {
        const timer = setTimeout(() => {
            setMessageLogin("")
        }, 4000)

        return () => clearTimeout(timer)

    }, [messageLogin])


    const handleLoginClick = () => {
        setFormLogin(true);
    }

    const handleRegisterClick = () => {
        setFormLogin(false);
    }

    // register
    const Register = (email, password, confirmPassword) => {
        
        if (password === confirmPassword) { 
            createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
                const user = userCredential.user
                console.log(user)
            })
                .catch((error) => {
                    let errorCode = error.code
                   

                    console.log('Error code:', errorCode)
                    // console.log('Error Message:', errorMessage)

                    if( errorCode === 'auth/email-already-in-use'){
                        setMessageLogin('Email já cadastrado.')
                    }
                })
        }
        else {
            setMessageLogin('Senha são diferentes')
        }
    }

    // login
    const login = (email, password) => {
        signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
            const user = userCredential.user
        }).catch((error) => {
            let errorCode = error.code
            let errorMessage = error.message
            console.log('Error code:', errorCode)
            console.log('Error Message:', errorMessage)
            setMessageLogin('Email ou senha inválido')
        })
    }

    return (
        <div className="loginContainer">
            <div className="loginLogo">
                <LogoMain className='logo'></LogoMain>
            </div>

            {
                formLogin ?
                    <div className="form-login-content">
                        <p className="title-form">Login</p>
                        <div className="form-login">
                            <div className="input-email form-login-inputs">
                                <label htmlFor="login-email" className='form-label-inputs'>E-mail</label>
                                <input type="email" className='form-inputs' value={email} onChange={(e) => { setEmail(e.target.value) }} name="login-email" id="login-email" />
                            </div>
                            <div className="input-password form-login-inputs">
                                <label htmlFor="login-password" className='form-label-inputs'>Senha</label>
                                <input type="password" className='form-inputs' value={password} onChange={(e) => { setPassword(e.target.value) }} name="login-password" id="login-password" />
                            </div>

                            <div className="message-content">
                                <p>{
                                    messageLogin
                                }</p>
                            </div>

                            <div className="buttons-form-login">
                                <button id='btn-login' onClick={() => login(email, password)}>Login</button>
                                <button id='btn-page-register' onClick={handleRegisterClick}>Cadastrar</button>
                            </div>

                        </div>
                    </div>
                    :
                    <div className="form-register-content">
                        <p className="title-form">Cadastrar</p>
                        <div className="form-register">
                            <div className="input-email form-register-inputs">
                                <label htmlFor="register-email" className='form-label-inputs'>E-mail</label>
                                <input type="email" className='form-inputs' value={email} onChange={(e) => { setEmail(e.target.value) }} name="register-email" id="register-email" />
                            </div>
                            <div className="input-password form-register-inputs">
                                <label htmlFor="register-password" className='form-label-inputs'>Senha</label>
                                <input type="password" className='form-inputs' value={password} onChange={(e) => { setPassword(e.target.value) }} name="register-password" id="register-password" />
                            </div>
                            <div className="input-password form-register-inputs">
                                <label htmlFor="confirm-password" className='form-label-inputs'>Confirmar senha</label>
                                <input type="password" className='form-inputs' value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value) }} name="confirm-password" id="confirm-password" />
                            </div>

                            <div className="message-content">
                                <p>{
                                    messageLogin
                                }</p>
                            </div>

                            <div className="buttons-form-register">
                                <button id='btn-register' onClick={() => Register(email, password, confirmPassword)}>Cadastrar</button>
                                <button id='btn-back' onClick={handleLoginClick}>Voltar</button>
                            </div>

                        </div>
                    </div>
            }
        </div>
    )
}

export default Login
