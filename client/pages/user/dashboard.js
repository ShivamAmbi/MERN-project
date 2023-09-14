import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context";
import UserRoute from "../../components/routes/UserRoute";
import PostForm from "../../components/forms/PostForm";
import { useRouter } from "next/router";
import axios from "axios";
import { toast } from "react-toastify";
import PostList from "../../components/cards/postList";

const Home = () => {
    const [state, setState] = useContext(UserContext);
    //state
    const [content, setContent] = useState('');
    const [image,setImage]=useState({});
    const [uploading,setUploading]= useState(false);
    const [posts, setPosts] = useState([]);
    //route
    const router = useRouter();

    useEffect(()=>{
        if(state && state.token) fetchUserPosts();
    },[state && state.token]);
    
    const fetchUserPosts = async () => {
        try {
            const { data } = await axios.get('/user-posts');
            console.log('---posts:',data);
            setPosts(data);
        } catch (error) {
            console.log('fetchUserPosts err-->',error);
        }
    }
    
    const postSubmit = async (e) => {
        e.preventDefault();
        let user_id = state.user._id
        try {
            const { data } = await axios.post('/create-post', { content, image, user_id });
            console.log('create post resp:', data,user_id);
            if (data.error) {
                toast.error(data.error);
            } else {
                fetchUserPosts();
                toast.success('Post created');
                setContent('');
                setImage('');
            }
        } catch (error) {
            console.log('err-->', error);
        }
    }
    const uploadImage = async(e)=> {
        const file = e.target.files[0];

        const formData = new FormData();
        formData.append('image',file);
        setUploading(true);
        // formData.append('content',content);
        try {
            const { data } = await axios.post('/upload-image',formData);
            console.log('uploaded image data--->',data);
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
        <UserRoute>
            <div className="container-fluid" style={{ height: "985px" }}>
                <div className="row py-5 text-light bg-login-image">
                    <div className="col text-center">
                        <h1> News Feed</h1>
                    </div>
                </div>
                <div className="row py-3 ">
                    <div className="col-md-8 ">
                        <PostForm
                            content={content}
                            setContent={setContent}
                            postSubmit={postSubmit} 
                            uploadImage={uploadImage} 
                            uploading={uploading}
                            image={image}/>
                        <br/>
                        <PostList posts={posts}/>
                    </div>

                    

                    <div className="col-md-4">
                        Sidebar
                    </div>
                </div>
            </div>
        </UserRoute>
    )
}

export default Home;