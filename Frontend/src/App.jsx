import { Toaster } from 'react-hot-toast';
import { RouterProvider } from "react-router"
import { router } from "./app.routes.jsx"
import { AuthProvider } from "./features/auth_features/auth.context.jsx"
import { InterviewerProvider } from "./features/interview/interview.context.jsx"
import { MockInterviewProvider } from "./features/interview/mockInterview.context.jsx"


function App() {

  return (
    <AuthProvider>
      <Toaster
          position="top-center"
          toastOptions={{
            duration: 3500,
            style: {
              background: 'rgba(13, 22, 33, 0.9)',
              color: '#f8fafc',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              borderRadius: '14px',
              padding: '14px 18px',
              fontSize: '0.9rem',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
            },
            success: {
              iconTheme: {
                primary: '#81e6d9',
                secondary: '#0b1d28',
              },
              style: {
                border: '1px solid rgba(129, 230, 217, 0.35)',
              },
            },
            error: {
              iconTheme: {
                primary: '#f87171',
                secondary: '#1a0b0b',
              },
              style: {
                border: '1px solid rgba(248, 113, 113, 0.35)',
              },
            },
          }}
        />
      <InterviewerProvider>
        <MockInterviewProvider>
          <RouterProvider router={router} />
        </MockInterviewProvider>
      </InterviewerProvider>
      
    </AuthProvider>
  )

}

export default App