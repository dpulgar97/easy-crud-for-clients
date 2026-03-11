import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

const STATUS_OPTIONS = [
    { value: 'en_proceso', label: 'En Proceso' },
    { value: 'activo', label: 'Activo' },
    { value: 'cancelado', label: 'Cancelado' },
]

export default function ClientForm({ client, onClose }) {
    const [formData, setFormData] = useState({
        name: '',
        rif: '',
        phone_number: '',
        location: '',
        work_asigned: '',
        work_status: 'en_proceso',
    })
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (client) {
            setFormData({
                name: client.name || '',
                rif: client.rif || '',
                phone_number: client.phone_number || '',
                location: client.location || '',
                work_asigned: client.work_asigned || '',
                work_status: client.work_status || 'en_proceso',
            })
        }
    }, [client])

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        console.log('Datos a guardar:', formData)

        let error
        if (client) {
            console.log('Actualizando cliente ID:', client.id)
            const { data, error: updateError } = await supabase
                .from('clients')
                .update(formData)
                .eq('id', client.id)
                .select()
            error = updateError
            console.log('Respuesta update:', { data, error })
        } else {
            console.log('Insertando nuevo cliente')
            const { data, error: insertError } = await supabase
                .from('clients')
                .insert([formData])
                .select()
            error = insertError
            console.log('Respuesta insert:', { data, error })
        }

        setLoading(false)

        if (error) {
            console.error('Error completo:', error)
            alert(`Error: ${error.message}`)
        } else {
            alert(client ? 'Cliente actualizado' : 'Cliente creado')
            onClose(true)
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center p-4 z-50">
            <div className="bg-background-card rounded-xl shadow-card max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
                <h2 className="text-lg font-semibold text-text-primary mb-6">
                    {client ? 'Editar Cliente' : 'Nuevo Cliente'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Nombre */}
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1.5">
                            Nombre *
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-accent-light focus:border-accent
                text-sm text-text-primary"
                            placeholder="Ingrese el nombre"
                        />
                    </div>

                    {/* RIF */}
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1.5">
                            RIF
                        </label>
                        <input
                            type="text"
                            name="rif"
                            value={formData.rif}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-accent-light focus:border-accent
                text-sm text-text-primary"
                            placeholder="Ej: J-12345678-9"
                        />
                    </div>

                    {/* Teléfono */}
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1.5">
                            Teléfono
                        </label>
                        <input
                            type="text"
                            name="phone_number"
                            value={formData.phone_number}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-accent-light focus:border-accent
                text-sm text-text-primary"
                            placeholder="Ej: +58 412 1234567"
                        />
                    </div>

                    {/* Ubicación */}
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1.5">
                            Ubicación
                        </label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-accent-light focus:border-accent
                text-sm text-text-primary"
                            placeholder="Ej: Caracas, Venezuela"
                        />
                    </div>

                    {/* Trabajo asignado */}
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1.5">
                            Trabajo a realizar *
                        </label>
                        <textarea
                            name="work_asigned"
                            value={formData.work_asigned}
                            onChange={handleChange}
                            required
                            rows={3}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-accent-light focus:border-accent
                text-sm text-text-primary resize-none"
                            placeholder="Describa el trabajo que se va a realizar"
                        />
                    </div>

                    {/* Estatus */}
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1.5">
                            Estatus *
                        </label>
                        <select
                            name="work_status"
                            value={formData.work_status}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-accent-light focus:border-accent
                text-sm text-text-primary bg-white"
                        >
                            {STATUS_OPTIONS.map((status) => (
                                <option key={status.value} value={status.value}>
                                    {status.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Botones */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => onClose(false)}
                            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-text-secondary text-sm font-medium hover:bg-gray-50 transition"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-accent hover:bg-accent-hover text-white px-4 py-2.5 rounded-lg text-sm font-medium transition disabled:opacity-50"
                        >
                            {loading ? 'Guardando...' : client ? 'Actualizar' : 'Guardar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}