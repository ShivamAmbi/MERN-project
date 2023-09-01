
const CreatePostForm = ({content,setContent,postSubmit}) => {
    return (
        <div className="card ">
            <div className="card-body pb-1">
                <form className="form-group">
                    <textarea className="form-control mt-1" 
                        placeholder="Write something..."
                        value={content}
                        onChange={(e)=>setContent(e.target.value)}>
                    </textarea>
                </form>
            </div>
            <div className="card-footer">
                <button className="btn btn-primary btn-sm mt-1" onClick={postSubmit}>Posts</button>
            </div>
        </div>
    );
};

export default CreatePostForm;