import { SyncOutlined } from "@ant-design/icons"

const AuthForm = ({
    handleSubmit,
    name,
    setName,
    email,
    setEmail,
    age,
    setAge,
    psw,
    setPsw,
    secret,
    setSecret,
    loading,
    page,
}) => (
    <form onSubmit={handleSubmit}>
            {page !='login' && <div className="form-group mb-2 rounded-pill">
                <small className="d-flex">
                    <label className="text-muted"> Your Name:</label>
                    <input type="text" className="form-control w-300" placeholder="enter name" onChange={(e) => setName(e.target.value)} value={name} />
                </small>
            </div>}
            <div className="form-group mb-2 rounded-pill">
                <small className="d-flex">
                    <label className="text-muted"> Your email:</label>
                    <input type="email" className="form-control w-300" placeholder="enter email" onChange={(e) => setEmail(e.target.value)} value={email} />
                </small>
            </div>
            {page !='login' &&
            <div className="form-group mb-2 rounded-pill">
                <small className="d-flex">
                    <label className="text-muted"> Your age:</label>
                    <input type="text" className="form-control w-300" placeholder="enter age" onChange={(e) => setAge(e.target.value)} value={age} />
                </small>
            </div>
            }
            <div className="form-group mb-2 rounded-pill">
                <small className="d-flex">
                    <label className="text-muted"> Your password:</label>
                    <input type="password" className="form-control w-300" placeholder="enter password" onChange={(e) => setPsw(e.target.value)} value={psw} />
                </small>
            </div>
            

            {page !='login' && <>
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
                    You can use this t reset password if forgotten.
                </small>
            </div>
            <div className="form-group mb-2">
                <input type="text" className="form-control" placeholder="Write your answer..." onChange={(e) => setSecret(e.target.value)} value={secret} />
            </div>
            </>}
            <button disabled={page != 'login' ?
            !name || !email || !psw || !secret
        : !email || !psw} className="btn btn-primary col-12 mb-2">
                {loading ? <SyncOutlined spin /> : page != 'login' ? "Submit" : "Login"}
            </button>
        </form>
);

export default AuthForm;