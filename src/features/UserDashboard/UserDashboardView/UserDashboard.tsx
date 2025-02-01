import { handleLogout } from "../../../utils/authUtils"

const UserDashboard = () => {
  return (
    <div>UserDashboard
      <button onClick={handleLogout}>kijelentkezés</button>
    </div>
  )
}

export default UserDashboard