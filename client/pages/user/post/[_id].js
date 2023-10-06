import { useEffect, useState } from "react";
import axios from 'axios';
import { useRouter } from "next/router";
import PostForm from "../../../components/forms/PostForm";
import PostList from "../../../components/cards/postList";
import UserRoute from "../../../components/routes/UserRoute";
import { toast } from "react-toastify";

const EditPost = () => {
    const [post,setPost] = useState({});
    const [content, setContent] = useState('');
    const [image,setImage]=useState({});
    const [uploading,setUploading]= useState(false);

    const router = useRouter();
    const _id = router.query._id;

    useEffect(()=>{
        if(_id) fetchPost();
    },[_id])

    const fetchPost = async() => {
        try {
            const { data } = await axios.get(`/user-post/${_id}`);
            setPost(data);
            setContent(data.content);
            setImage(data.image);
        } catch (error) {
            console.log('error:',error);
        }
    }

    const postSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.put(`/update-post/${_id}`,{content,image});
            if (data.error){
                toast.error(data.error);
            }else{
                toast.success('Post updated');
                router.push('/user/dashboard');
            }
        } catch (error) {
            console.log('error:',error);
        }
    }
    //in edit reupload image
    const uploadImage = async(e)=> {
        const file = e.target.files[0];

        const formData = new FormData();
        formData.append('image',file);
        setUploading(true);
        try {
            const { data } = await axios.post('/upload-image',formData);
            setImage({
                url: data.url,
                public_id: data.public_id,
            })
            setUploading(false);
        } catch (error) {
            console.log('err:',error);
            setUploading(false);
        }
    }

    return (
        <div>
            <UserRoute>
            <div className="container-fluid" style={{ height: "985px" }}>
                <div className="row py-5 text-light bg-login-image">
                    <div className="col text-center">
                        <h1> Edit Page </h1>
                    </div>
                </div>
                <div className="row py-3 ">
                    <div className="col-md-8 offset-md-2 ">
                        <PostForm
                            content={content}
                            setContent={setContent}
                            postSubmit={postSubmit} 
                            uploadImage={uploadImage} 
                            uploading={uploading}
                            image={image}/>
                    </div>
                </div>
            </div>
        </UserRoute>
        </div>
    )
}

export default EditPost;