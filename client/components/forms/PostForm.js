import 'react-quill/dist/quill.snow.css';
import React from 'react';
import ReactQuill from 'react-quill';

//Old version import
// import dynamic from 'next/dynamic';
// const ReactQuill = dynamic(()=> import('react-quill'),{ssr:false});

import { Avatar } from 'antd';
import { CameraOutlined, LoadingOutlined } from '@ant-design/icons';



const PostForm = ({ content, setContent, postSubmit, uploadImage, uploading, image }) => {
    return (
        <div className="card ">
            <div className="card-body pb-1">
                <form className="form-group">
                    <ReactQuill 
                        theme='snow'
                        className="form-control mt-1" 
                        placeholder="Write something..."
                        value={content}
                        onChange={(e)=>setContent(e)}>
                    </ReactQuill>
                </form>
            </div>
            <div className="card-footer d-flex justify-content-between text-muted">
                <button disabled={ !content }className="btn btn-primary btn-sm mt-1" onClick={postSubmit}>Posts</button>
                <label>
                    {
                        image && image.url ? (
                            <Avatar size={30} src={image.url} className='mt-1'/>
                        ) : uploading ? (<LoadingOutlined className='mt-2'/>) : (<CameraOutlined className='mt-2'/>)
                    }
                    <input onChange={uploadImage} type='file' accept='image/*' hidden/>
                </label>
            </div>
        </div>
    );
};

export default PostForm;