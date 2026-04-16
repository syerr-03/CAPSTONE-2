import "./App.css";
import { useState } from "react";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Dashboard from "./Pages/Dashboard";

function App(){

const [currentPage,setCurrentPage] = useState("login");

return(

<div className="container">

<h1 className="logo-text">BrainyBits</h1>

{currentPage === "login" &&
<Login 
goToRegister={()=>setCurrentPage("register")}
goToDashboard={()=>setCurrentPage("dashboard")}
/>
}

{currentPage === "register" &&
<Register goToLogin={()=>setCurrentPage("login")}/>
}

{currentPage === "dashboard" &&
<Dashboard/>
}

</div>

);

}

export default App;