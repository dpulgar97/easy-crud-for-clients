import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function ClientForm({ client, onClose }) {
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        telefono: '',
        empresa: ''
    })
    const [loading, setLoading] = useState(false)

    // Si hay un cliente para editar, cargar sus datos
    useEffect(() => {
        if (client) {
            setFormData({
                nombre: client.nombre || '',
                email: client.email || '',
                telefono: client.telefono || '',
                empresa: client.empresa || ''
            })
        }
    }, [client])

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        let error
        if (client) {
            // Actualizar
            const { error: updateError } = await supabase
                .from('clientes')
                .update(formData)
                .eq('id', client.id)
            error = updateError
        } else {
            // Crear
            const { error: insertError } = await supabase
                .from('clientes')
                .insert([formData])
            error = insertError
        }

        setLoading(false)

        if (error) {
            console.error('Error:', error)
            alert('Error al guardar el cliente')
        } else {
            alert(client ? 'Cliente actualizado' : 'Cliente creado')
            onClose(true)
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
                <h2 className="text-2xl font-bold text-primary-600 mb-4">
                    {client ? '✏️ Editar Cliente' : '➕ Nuevo Cliente'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nombre *
                        </label>
                        <input
                            type="text"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="Nombre del cliente"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="email@ejemplo.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Teléfono
                        </label>
                        <input
                            type="text"
                            name="telefono"
                            value={formData.telefono}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="+00 000 000 000"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Empresa
                        </label>
                        <input
                            type="text"
                            name="empresa"
                            value={formData.empresa}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="Nombre de la empresa"
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => onClose(false)}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-success-soft hover:bg-success-hover text-white px-4 py-2 rounded-lg font-medium transition disabled:opacity-50"
                        >
                            {loading ? 'Guardando...' : client ? 'Actualizar' : 'Guardar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}