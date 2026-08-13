import { RouterProvider } from "react-router"
import { router } from "./app.routes.jsx"
import { AuthProvider } from "./features/auth_features/auth.context.jsx"
import { InterviewerProvider } from "./features/interview/interview.context.jsx"

function App() {

  return (
    <AuthProvider>
      
      <InterviewerProvider>
        <RouterProvider router={router} />
      </InterviewerProvider>
      
    </AuthProvider>
  )
}

export default App
