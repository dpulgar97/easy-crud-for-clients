import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import ClientForm from './ClientForm'

const STATUS_OPTIONS = {
    en_proceso: { label: 'En Proceso', class: 'bg-yellow-100 text-yellow-700' },
    activo: { label: 'Activo', class: 'bg-green-100 text-green-700' },
    cancelado: { label: 'Cancelado', class: 'bg-red-100 text-red-700' },
}

export default function ClientTable() {
    const [clients, setClients] = useState([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editingClient, setEditingClient] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')

    // Estados para paginación y ordenamiento
    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' })

    const fetchClients = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('clients')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) console.error('Error:', error)
        else setClients(data || [])
        setLoading(false)
    }

    const handleDelete = async (id) => {
        if (!confirm('¿Estás seguro de eliminar este cliente?')) return
        const { error } = await supabase.from('clients').delete().eq('id', id)
        if (error) alert('Error al eliminar')
        else {
            fetchClients()
            alert('Cliente eliminado')
        }
    }

    const handleEdit = (client) => {
        setEditingClient(client)
        setShowForm(true)
    }

    const handleCloseForm = (refresh = false) => {
        setShowForm(false)
        setEditingClient(null)
        if (refresh) fetchClients()
    }

    // Función para ordenar datos
    const requestSort = (key) => {
        let direction = 'asc'
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc'
        }
        setSortConfig({ key, direction })
        setCurrentPage(1) // Resetear a primera página al cambiar sort
    }

    // Filtrar y ordenar datos
    const getFilteredAndSortedClients = () => {
        let filtered = [...clients]

        // Aplicar búsqueda
        if (searchTerm) {
            filtered = filtered.filter(
                (client) =>
                    client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    client.rif?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    client.location?.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        // Aplicar ordenamiento
        if (sortConfig.key) {
            filtered.sort((a, b) => {
                const aVal = a[sortConfig.key]
                const bVal = b[sortConfig.key]

                if (aVal === null) return 1
                if (bVal === null) return -1

                if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1
                if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1
                return 0
            })
        }

        return filtered
    }

    const filteredClients = getFilteredAndSortedClients()

    // Lógica de paginación
    const totalPages = Math.ceil(filteredClients.length / rowsPerPage)
    const startIndex = (currentPage - 1) * rowsPerPage
    const paginatedClients = filteredClients.slice(startIndex, startIndex + rowsPerPage)

    // Indicador visual de ordenamiento
    const getSortIcon = (columnKey) => {
        if (sortConfig.key !== columnKey) return '↕'
        return sortConfig.direction === 'asc' ? '↑' : '↓'
    }

    useEffect(() => {
        fetchClients()
    }, [])

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-semibold text-text-primary">Clientes</h1>
                    <p className="text-sm text-text-secondary mt-1">
                        {filteredClients.length} registros encontrados
                    </p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-accent hover:bg-accent-hover text-white px-5 py-2.5 rounded-lg text-sm font-medium transition shadow-soft"
                >
                    + Nuevo Cliente
                </button>
            </div>

            {/* Buscador */}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Buscar por nombre, RIF o ubicación..."
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value)
                        setCurrentPage(1)
                    }}
                    className="w-full max-w-md px-4 py-2.5 border border-gray-200 rounded-lg 
            focus:outline-none focus:ring-2 focus:ring-accent-light focus:border-accent
            bg-background-card text-sm"
                />
            </div>

            {/* Tabla */}
            <div className="bg-background-card rounded-xl shadow-card overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center">
                        <div className="animate-spin w-6 h-6 border-2 border-accent border-t-transparent rounded-full mx-auto"></div>
                        <p className="text-text-secondary text-sm mt-3">Cargando...</p>
                    </div>
                ) : paginatedClients.length === 0 ? (
                    <div className="p-12 text-center">
                        <p className="text-text-muted text-sm">
                            {searchTerm ? 'No se encontraron resultados' : 'No hay clientes registrados'}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-100">
                                        <th
                                            className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider cursor-pointer hover:text-accent select-none"
                                            onClick={() => requestSort('id')}
                                        >
                                            ID {getSortIcon('id')}
                                        </th>
                                        <th
                                            className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider cursor-pointer hover:text-accent select-none"
                                            onClick={() => requestSort('name')}
                                        >
                                            Nombre {getSortIcon('name')}
                                        </th>
                                        <th
                                            className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider cursor-pointer hover:text-accent select-none"
                                            onClick={() => requestSort('rif')}
                                        >
                                            RIF {getSortIcon('rif')}
                                        </th>
                                        <th
                                            className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider cursor-pointer hover:text-accent select-none"
                                            onClick={() => requestSort('phone_number')}
                                        >
                                            Teléfono {getSortIcon('phone_number')}
                                        </th>
                                        <th
                                            className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider cursor-pointer hover:text-accent select-none"
                                            onClick={() => requestSort('location')}
                                        >
                                            Ubicación {getSortIcon('location')}
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                                            Trabajo
                                        </th>
                                        <th
                                            className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider cursor-pointer hover:text-accent select-none"
                                            onClick={() => requestSort('work_status')}
                                        >
                                            Estatus {getSortIcon('work_status')}
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {paginatedClients.map((client) => (
                                        <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 text-sm text-text-muted">#{client.id}</td>
                                            <td className="px-6 py-4 text-sm font-medium text-text-primary">{client.name}</td>
                                            <td className="px-6 py-4 text-sm text-text-secondary">{client.rif}</td>
                                            <td className="px-6 py-4 text-sm text-text-secondary">{client.phone_number}</td>
                                            <td className="px-6 py-4 text-sm text-text-secondary">{client.location}</td>
                                            <td className="px-6 py-4 text-sm text-text-secondary max-w-xs truncate">{client.work_asigned}</td>
                                            <td className="px-6 py-4 text-sm">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_OPTIONS[client.work_status]?.class || 'bg-gray-100 text-gray-700'}`}>
                                                    {STATUS_OPTIONS[client.work_status]?.label || client.work_status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleEdit(client)}
                                                        className="text-accent hover:text-accent-hover text-sm font-medium transition"
                                                    >
                                                        Editar
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(client.id)}
                                                        className="text-danger hover:text-red-600 text-sm font-medium transition"
                                                    >
                                                        Eliminar
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Paginación */}
                        <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="text-sm text-text-secondary">
                                Mostrando {startIndex + 1} a {Math.min(startIndex + rowsPerPage, filteredClients.length)} de {filteredClients.length} registros
                            </div>

                            <div className="flex items-center gap-4">
                                {/* Selector de filas por página */}
                                <select
                                    value={rowsPerPage}
                                    onChange={(e) => {
                                        setRowsPerPage(Number(e.target.value))
                                        setCurrentPage(1)
                                    }}
                                    className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-text-secondary bg-white focus:outline-none focus:ring-2 focus:ring-accent-light"
                                >
                                    <option value={5}>5 por página</option>
                                    <option value={10}>10 por página</option>
                                    <option value={25}>25 por página</option>
                                    <option value={50}>50 por página</option>
                                </select>

                                {/* Botones de paginación */}
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 text-text-secondary hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                    >
                                        Anterior
                                    </button>

                                    {/* Números de página */}
                                    <div className="flex items-center gap-1">
                                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                            // Lógica para mostrar páginas relevantes
                                            let pageNum
                                            if (totalPages <= 5) {
                                                pageNum = i + 1
                                            } else if (currentPage <= 3) {
                                                pageNum = i + 1
                                            } else if (currentPage >= totalPages - 2) {
                                                pageNum = totalPages - 4 + i
                                            } else {
                                                pageNum = currentPage - 2 + i
                                            }

                                            return (
                                                <button
                                                    key={pageNum}
                                                    onClick={() => setCurrentPage(pageNum)}
                                                    className={`w-8 h-8 text-sm rounded-lg transition ${currentPage === pageNum
                                                            ? 'bg-accent text-white'
                                                            : 'text-text-secondary hover:bg-gray-50'
                                                        }`}
                                                >
                                                    {pageNum}
                                                </button>
                                            )
                                        })}
                                    </div>

                                    <button
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 text-text-secondary hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                    >
                                        Siguiente
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {showForm && <ClientForm client={editingClient} onClose={handleCloseForm} />}
        </div>
    )
}