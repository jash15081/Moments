
import { Outlet } from "react-router-dom"
function MainPage(){
    return (
        <>
        <p>Main Page</p>
        <Outlet/>
        </>
    )
}
export default MainPage;