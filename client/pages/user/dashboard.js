import { useContext } from "react";
import { UserContext, UserProvider } from "../../context";


const Dashboard = () => {
    const [state,setState] = useContext(UserContext)
    return (
        <div className="container">
            <div className="row">
                <div className="col">
                    <h1 className="display-1 text-center py-5"> Dashboard</h1>
                </div>
            </div>
        </div>
    )
}

export default Dashboard;