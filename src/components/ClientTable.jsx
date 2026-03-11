import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import ClientForm from './ClientForm'

export default function ClientTable() {
    const [clients, setClients] = useState([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editingClient, setEditingClient] = useState(null)

    // Cargar clientes
    const fetchClients = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('clientes')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error:', error)
        } else {
            setClients(data)
        }
        setLoading(false)
    }

    // Eliminar cliente
    const handleDelete = async (id) => {
        if (!confirm('¿Estás seguro de eliminar este cliente?')) return

        const { error } = await supabase
            .from('clientes')
            .delete()
            .eq('id', id)

        if (error) {
            console.error('Error al eliminar:', error)
            alert('Error al eliminar el cliente')
        } else {
            fetchClients()
            alert('Cliente eliminado correctamente')
        }
    }

    // Editar cliente
    const handleEdit = (client) => {
        setEditingClient(client)
        setShowForm(true)
    }

    // Formulario cerrado/actualizado
    const handleCloseForm = (refresh = false) => {
        setShowForm(false)
        setEditingClient(null)
        if (refresh) fetchClients()
    }

    useEffect(() => {
        fetchClients()
    }, [])

    return (
        <div className="p-6 bg-primary-50 min-h-screen">
            <div className="max-w-6xl mx-auto">
                {/* Encabezado */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-primary-600">
                        📋 Gestión de Clientes
                    </h1>
                    <button
                        onClick={() => setShowForm(true)}
                        className="bg-success-soft hover:bg-success-hover text-white px-6 py-2 rounded-lg font-medium transition"
                    >
                        + Nuevo Cliente
                    </button>
                </div>

                {/* Tabla */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center text-gray-500">Cargando...</div>
                    ) : clients.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            No hay clientes registrados
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead className="bg-primary-100">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-primary-600">ID</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-primary-600">Nombre</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-primary-600">Email</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-primary-600">Teléfono</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-primary-600">Empresa</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-primary-600">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-primary-100">
                                {clients.map((client) => (
                                    <tr key={client.id} className="hover:bg-primary-50">
                                        <td className="px-6 py-4 text-sm text-gray-700">{client.id}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700">{client.nombre}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700">{client.email}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700">{client.telefono}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700">{client.empresa}</td>
                                        <td className="px-6 py-4 text-sm">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEdit(client)}
                                                    className="bg-primary-500 hover:bg-primary-600 text-white px-3 py-1 rounded text-xs transition"
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(client.id)}
                                                    className="bg-danger-soft hover:bg-danger-hover text-white px-3 py-1 rounded text-xs transition"
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Modal del Formulario */}
            {showForm && (
                <ClientForm
                    client={editingClient}
                    onClose={handleCloseForm}
                />
            )}
        </div>
    )
}