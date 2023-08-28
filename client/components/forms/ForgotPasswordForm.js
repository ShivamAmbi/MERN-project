import { SyncOutlined } from "@ant-design/icons"

const ForgotPasswordForm = ({
    handleSubmit,
    email,
    setEmail,
    newPsw,
    setNewPsw,
    secret,
    setSecret,
    loading,
}) => (
    <form onSubmit={handleSubmit}>
            <div className="form-group mb-2 rounded-pill">
                <small className="d-flex">
                    <label className="text-muted"> Your email:</label>
                    <input type="email" className="form-control w-300" placeholder="enter email" onChange={(e) => setEmail(e.target.value)} value={email} />
                </small>
            </div>
            <div className="form-group mb-2 rounded-pill">
                <small className="d-flex">
                    <label className="text-muted"> Your new password:</label>
                    <input type="password" className="form-control w-300" placeholder="enter password" onChange={(e) => setNewPsw(e.target.value)} value={newPsw} />
                </small>
            </div>
            

            <>
            <div className="form-group mb-2 rounded-pill">
                <small className="d-flex">
                    <label className="text-muted"> Pick a question</label>
                    {/* <input type="password" className="form-control w-300" placeholder="enter password"/> */}
                </small>
                <select className="form-select">
                    <option>What is your favorite color ?</option>
                    <option>What is your grandfather's name ?</option>
                    <option>What is your favorite sport ?</option>
                    <option>What city were you born in ?</option>

                </select>
                <small className="form-text text-muted">
                    You can use this to reset password if forgotten.
                </small>
            </div>
            <div className="form-group mb-2">
                <input type="text" className="form-control" placeholder="Write your answer..." onChange={(e) => setSecret(e.target.value)} value={secret} />
            </div>
            </>
            <button disabled={ !email || !newPsw || !secret || loading} className="btn btn-primary col-12 mb-2">
                {loading ? <SyncOutlined spin className="py-1"/> : "Submit"}
            </button>
        </form>
);

export default ForgotPasswordForm;