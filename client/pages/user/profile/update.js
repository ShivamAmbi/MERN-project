import { useContext, useEffect, useState } from "react";
import axios from 'axios';
import { toast } from "react-toastify";
import { Modal, Avatar } from 'antd';
import Link from "next/link";
import { UserContext } from "../../../context";
import { useRouter } from "next/router";
import { LoadingOutlined, CameraOutlined } from "@ant-design/icons";

import AuthForm from "../../../components/forms/Authform";

const ProfileUpdate = () => {
    const [userName,setUsername] = useState('');
    const [about,setAbout] = useState('');
    const [name,setName] = useState('');
    const [email,setEmail] = useState('');
    const [age,setAge] = useState('');
    const [psw,setPsw] = useState('');
    const [secret,setSecret] = useState('');
    const [success,setSuccess] = useState(false);
    const [ok,setOk] = useState(false);
    const [loading,setLoading] = useState(false);
    const [state, setState] = useContext(UserContext);
    const router = useRouter();
    const [image,setImage] = useState({})
    const [uploading,setUploading] = useState(false)

    useEffect(()=>{
        if(state && state.user){
            console.log('profile update:',state.user);
            state.user.username && setUsername(state.user.username);
            state.user.email && setEmail(state.user.email);
            state.user.name && setName(state.user.name);
            state.user.about && setAbout(state.user.about);
            state.user.age && setAge(state.user.age);
            setImage(state.user.image)
        }
    },[state && state.user]);

    const handleSubmit = async(e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await axios.put('/profile-update',{
                userName,
                about,
                name,
                age,
                psw,
                secret,
                image
            });
            console.log('updated data:',data);
            if(data.error){
                toast.error(data.error);
                setLoading(false);
            }else{
                //updating local storage
                let auth = JSON.parse(localStorage.getItem('auth'));
                auth.user = data;
                localStorage.setItem('auth',JSON.stringify(auth));
                //update context
                setState({ ...state, user:data });
                setOk(true);
                setLoading(false);
                // router.push('/login');
            }
        } catch (e) {
            toast.error(e.response.data);
            setLoading(false);
        }
        
    }

    const uploadImage = async(e)=> {
        const file = e.target.files[0];
        const fileFormat = e.target.files[0].name.split('.');
        const imageFormats = ['jpg','jpeg','gif','png','tiff','raw'];

        const formData = new FormData();
        formData.append('image',file);
        setUploading(true);

        try {
            const checkPoint = imageFormats.find((e)=> e == fileFormat[fileFormat.length-1].toLowerCase())
            if( checkPoint ){
                const { data } = await axios.post('/upload-image',formData);
                toast.success('Image Uploaded');
                setImage({
                    url: data.url,
                    public_id: data.public_id,
                })
                setUploading(false);
            }else{
                toast.error('Please upload a image file with .jpeg/jpg/gif/png format only !');
                setUploading(false);
            }
        } catch (error) {
            console.log('err:',error);
            setUploading(false);
        }
    }

    return (
        <div key={success.length} className="container-fluid">
            <div className="row py-5 text-light bg-default-image" >
                <div className="col text-center">
                    <h1> Profile Page</h1>
                </div>
            </div>
            <div className="row py-5">
                <div className="col-md-6 offset-md-3">
                    {/* upload image */}
                    <label className="d-flex justify-content-center h5">
                        {
                            image && image.url ? (
                                <Avatar size={30} src={image.url} className='mt-1' />
                            ) : uploading ? (<LoadingOutlined className='mt-2' />) : (<CameraOutlined className='mt-2' />)
                        }
                        <input onChange={uploadImage} type='file' accept='image/*' hidden />
                    </label>

                    <AuthForm 
                        handleSubmit={handleSubmit}
                        userName={userName}
                        setUsername={setUsername}
                        about={about}
                        setAbout={setAbout}
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
                        profileUpdate={true}
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
                        <p>You have Successfully updated your profile. </p>
                    </Modal>     
                </div>     
            </div>
        </div>
    )
}

export default ProfileUpdate;