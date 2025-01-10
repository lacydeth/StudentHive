import { handleLogout } from "../../utils/authUtils"

const AdminDashboard = () => {
  
  return (
    <div>AdminDashboard
      <button onClick={handleLogout}>kijelentkezés</button>
    </div>
  )
}

export default AdminDashboard