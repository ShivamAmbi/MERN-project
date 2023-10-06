import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context";
import UserRoute from "../../components/routes/UserRoute";
import PostForm from "../../components/forms/PostForm";
import { useRouter } from "next/router";
import axios from "axios";
import { toast } from "react-toastify";
import PostList from "../../components/cards/postList";
import People from "../../components/cards/People";
import Link from "next/link";
import post from "../../../server/models/post";
import { Modal } from "antd";
import CommentForm from "../../components/forms/commentForm";

const Home = () => {
    const [state, setState] = useContext(UserContext);
    //state
    const [content, setContent] = useState('');
    const [image,setImage]=useState({});
    const [uploading,setUploading]= useState(false);
    //post
    const [posts, setPosts] = useState([]);
    //people
    const [people, setPeople] = useState([]);
    //comment
    const [comment,setComment] = useState('');
    const [visible,setVisible] = useState(false);
    const [currentPost,setCurrentPost] = useState({});

    //route
    const router = useRouter();

    useEffect(()=>{
        if(state && state.token) {
            newsFeed();
            findPeople();
        }
    },[state && state.token]);

    const newsFeed = async () => {
        try {
            const { data } = await axios.get('/news-feed');
            console.log('---posts:',data);
            setPosts(data);
        } catch (error) {
            console.log('newsFeed err-->',error);
        }
    }
    
    const findPeople = async () => {
        try {
            const { data } = await axios.get('/find-people');
            console.log('data:',data);
            setPeople(data);
        } catch (error) {
            console.log('err-->', error);
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
                newsFeed();
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
        const fileFormat = e.target.files[0].name.split('.');
        const imageFormats = ['jpg','jpeg','gif','png','tiff','raw'];

        const formData = new FormData();
        formData.append('image',file);
        setUploading(true);
        // formData.append('content',content);
        try {
            const checkPoint = imageFormats.find((e)=> e == fileFormat[fileFormat.length-1].toLowerCase())
            if( checkPoint ){
                const { data } = await axios.post('/upload-image',formData);
                console.log('uploaded image data--->',data);
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
    const handleDelete = async(post) => {
        try {
            const confirmation = window.confirm('Please confirm deletion');
            if(!confirmation) return;
            const { data } = await axios.delete(`/delete-post/${post._id}`);
            toast.error('Post deleted');
            newsFeed();
        } catch (error) {
            console.log('err:',error);
        }
    }

    
    const handleFollow = async(user) => {
        try {
            const { data } = await axios.put('/user-follow',{ _id: user._id });
            let auth = JSON.parse(localStorage.getItem('auth'));
            auth.user = data;
            localStorage.setItem('auth',JSON.stringify(auth));
            //update-context
            setState({ ...state, user:data });
            let filtered = people.filter((e)=> e._id != user._id);
            setPeople(filtered);
            newsFeed();
            toast.success(`following ${user.name}`)
        } catch (error) {
            console.log('error:',error);
        }
    }

    const handleLike = async(_id) => {
        try {
            const { data } = await axios.put('/like-post',{ _id });
            newsFeed();
        } catch (error) {
            console.log('error:',error);
        }
    }
    
    const handleUnlike = async(_id) => {
        try {
            const { data } = await axios.put('/unlike-post',{ _id });
            newsFeed();
        } catch (error) {
            console.log('error:',error);
        }
    }

    const handleComment = async (post) => {
        try {
            setCurrentPost(post);
            setVisible(true);
        } catch (error) {
            console.log('error:',error);
        }
    }

    const addComment = async (e) => {
        try {
            e.preventDefault();
            const { data } = await axios.put('/add-comment',{
                postId:currentPost._id,
                comment,
            });
            setComment('');
            setVisible(false);
            newsFeed();
        } catch (error) {
            console.log('error:',error);
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
                            image={image} />
                        <br />
                        <PostList
                            posts={posts}
                            handleDelete={handleDelete}
                            handleLike={handleLike}
                            handleUnlike={handleUnlike}
                            handleComment={handleComment}
                        />
                    </div>

                    <div className="col-md-4">
                        {/* <pre>{JSON.stringify(people,null,4)}</pre> */}
                        {
                            state && state.user && state.user.following && <Link className="h6" href={`/user/following`}>
                                {state.user.following.length} Following
                            </Link>
                        }
                        <People people={people} handleFollow={handleFollow} />
                    </div>
                </div>
                <Modal
                    open={visible}
                    onCancel={() => setVisible(false)}
                    title='Comment'
                    footer={null}>
                    <CommentForm
                        comment={comment}
                        setComment={setComment}
                        addComment={addComment}
                    />
                </Modal>
            </div>
        </UserRoute>
    )
}

export default Home;