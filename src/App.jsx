import { useState } from 'react'
import Layout from './components/Layout'
import ClientTable from './components/ClientTable'

function App() {
  const [activeItem, setActiveItem] = useState('clientes')

  return (
    <Layout activeItem={activeItem} setActiveItem={setActiveItem}>
      {activeItem === 'clientes' && <ClientTable />}
      {activeItem === 'otros' && (
        <div className="text-center py-20">
          <h2 className="text-xl font-semibold text-text-muted">Próximamente</h2>
          <p className="text-text-muted text-sm mt-2">Esta sección está en construcción</p>
        </div>
      )}
    </Layout>
  )
}

export default App