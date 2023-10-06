import { UserContext } from "../context";
import { useState, useContext } from "react";
import axios from 'axios';
import { toast } from "react-toastify";
import Link from "next/link";
import {useRouter} from "next/router"

import AuthForm from "../components/forms/Authform";

const Login = () => {
    const [email,setEmail] = useState('');
    const [psw,setPsw] = useState('');
    const [loading,setLoading] = useState(false);
    const router = useRouter();
    const [state,setState] = useContext(UserContext);


    const handleSubmit = async(e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const { data } = await axios.post('/login', {
                email,
                psw,
            });
            if(data.error){
                console.log('data error-->:',data);
                toast.error(data.error);
                setLoading(false);
            }else{
                console.log('data-->:',data);
                setState({
                    user: data.user,
                    token: data.token,
                })
                //save to local storage
                window.localStorage.setItem('auth', JSON.stringify(data));
                router.push('/user/dashboard')
            }
        } catch (e) {
            console.log('-e-e-e->:',e);
            toast.error(e.response.data);
            setLoading(false);
        }
    }

    if(state && state.token) router.push('/user/dashboard');
    
    return (
        <div className="container-fluid">
            <div className="row py-5 text-light bg-login-image" >
                <div className="col text-center">
                    <h1> Login Page</h1>
                </div>
            </div>
            <div className="row py-5">
                <div className="col-md-6 offset-md-3">
                    <AuthForm 
                        handleSubmit={handleSubmit} 
                        email={email}
                        setEmail={setEmail}
                        psw={psw}
                        setPsw={setPsw}
                        loading={loading}
                        page={'login'}
                    />
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <p className="text-center">Not registered ?{" "}
                    <Link href="/register">
                        Register
                    </Link>
                    </p>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <p className="text-center">
                    <Link className="text-danger" href="/forgot-password">
                        Forgot Password
                    </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login;