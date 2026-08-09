import { RouterProvider } from "react-router"
import { router } from "./app.routes.jsx"

function App() {

  return (
    // basically we have export router and here we have import it
    <RouterProvider router={router} />
  )
}

export default App
