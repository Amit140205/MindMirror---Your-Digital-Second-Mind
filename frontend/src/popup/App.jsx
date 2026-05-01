import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { setUserData } from "../shared/store/userSlice.js"
import { getCurrentUserAPI } from "../shared/api/api.js"
import Login from "./pages/Login.jsx"
import Status from "./pages/Status.jsx"

export default function App() {
  const dispatch = useDispatch()
  const user = useSelector(state => state.user.userData)

  const checkCurrentUser = async () => {
    try {
      // check token exists before calling backend
      const result = await chrome.storage.local.get("token")
      if (!result.token) return

      const response = await getCurrentUserAPI(result.token)
      // console.log(response)
      dispatch(setUserData(response.user))

    } catch (error) {
      console.log(`User not authenticated: ${error}`)
      await chrome.storage.local.remove("token")
    }
  }

  useEffect(() => {
    checkCurrentUser()
  }, [])

  return (
    <>
      {user ? <Status /> : <Login />}
    </>
  )
}