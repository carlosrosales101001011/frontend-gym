import { createRoot } from 'react-dom/client'
import App from '@/App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '@/providers/AuthProvider.tsx'
import { Provider } from 'react-redux'
import { store } from '@/stores/Store.ts'
const container = document.getElementById('root')
if (container) {
  const root = createRoot(container)
  root.render(
    <Provider store={store}>
      <AuthProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </Provider>
  )
}
