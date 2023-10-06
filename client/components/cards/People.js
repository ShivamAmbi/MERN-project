import { useContext } from "react"
import { Avatar, List } from "antd"
import moment from "moment"
import { useRouter } from "next/router"
import { UserContext } from "../../context"
import { imageSource } from "../../functions"

const People = ({ people, handleFollow }) => {

    const [state,setState] = useContext(UserContext);
    const router = useRouter();


    return(
        <>
            <List 
                itemLayout="horizontal" 
                dataSource={people} 
                renderItem={(item, index) => (
                    <List.Item>
                        <List.Item.Meta
                            avatar={<Avatar src={imageSource(item)} />}
                            title={<div className="d-flex justify-content-between">
                                {item.name}
                                <span className="text-primary pointer" onClick={()=> handleFollow(item)} >Follow</span>
                            </div>}
                            description={
                                            <div>{item.about}</div>
                                        }
                            key={index}
                        />
                    </List.Item>
                )}
            />
        </>
    )

};

export default People;