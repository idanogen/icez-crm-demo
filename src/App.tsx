import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { ToastContainer } from './components/ToastContainer'
import { Dashboard } from './pages/Dashboard'
import { Customers } from './pages/Customers'
import { Orders } from './pages/Orders'
import { Quotes } from './pages/Quotes'
import { CustomerCard } from './pages/CustomerCard'

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/customers/:id" element={<CustomerCard />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/quotes" element={<Quotes />} />
        </Routes>
      </Layout>
      <ToastContainer />
    </BrowserRouter>
  )
}
