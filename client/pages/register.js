import { useEffect, useState } from "react";
import axios from 'axios';
import { toast } from "react-toastify";
import { Modal } from 'antd';
import Link from "next/link";

import AuthForm from "../components/forms/Authform";

const Register = () => {
    const [name,setName] = useState('');
    const [email,setEmail] = useState('');
    const [age,setAge] = useState('');
    const [psw,setPsw] = useState('');
    const [secret,setSecret] = useState('');
    const [success,setSuccess] = useState(false);
    const [ok,setOk] = useState(false);
    const [loading,setLoading] = useState(false);


    const handleSubmit = async(e) => {
        e.preventDefault();
        setLoading(true);
        // console.log(name,email,age,psw,secret);
        // axios.post('http://localhost:8000/api/register',{
        //     name,
        //     email,
        //     age,
        //     psw,
        //     secret
        // }).then((res)=>{
        //     console.log('resp---xxx',res);
        //     res.data.ok && setSuccess(res.data.ok);
        // }).catch((err)=> toast.error(err.response.data))
        try {
            const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API}/register`,{
                name,
                email,
                age,
                psw,
                secret
            });
            data.ok && setOk(data.ok) && setLoading(false);
            setName('');
            setEmail('');
            setAge('');
            setPsw('');
            setSecret('');
        } catch (e) {
            toast.error(e.response.data);
            setLoading(false);
        }
        
    }


    return (
        <div key={success.length} className="container-fluid">
            <div className="row py-5 text-light bg-default-image" >
                <div className="col text-center">
                    <h1> Register Page</h1>
                </div>
            </div>
            <div className="row py-5">
                <div className="col-md-6 offset-md-3">
                    <AuthForm 
                        handleSubmit={handleSubmit} 
                        name={name}
                        setName={setName}
                        email={email}
                        setEmail={setEmail}
                        age={age}
                        setAge={setAge}
                        psw={psw}
                        setPsw={setPsw}
                        secret={secret}
                        setSecret={setSecret}
                        loading={loading}
                    />
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <Modal 
                    title="Congrats" 
                    open={ok} 
                    onCancel={()=>setOk(false)}
                    footer={null}
                    >
                        <p>You have Successfully registered. </p>
                    </Modal>     
                </div>     
            </div>
            <div className="row">
                <div className="col">
                    <p className="text-center">Already Registered ?{" "}
                    <Link href="/login">
                        Login
                    </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Register;