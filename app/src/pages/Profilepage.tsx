import { useParams } from "react-router-dom"

const Profilepage = () => {
    const { _id } = useParams<{_id: string}>()
    console.log(_id);
    
  return (
    <div>UserId:{_id}</div>
  )
}

export default Profilepage