export default function Sidebar({ isOpen, onClose, activeItem, setActiveItem }) {
    const menuItems = [
        { id: 'clientes', label: 'Gestión de Clientes' },
        { id: 'otros', label: 'Otros' },
    ]

    return (
        <>
            {/* Overlay para móvil */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-30 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-background-card border-r shadow-[50px_0px_40px_-48px_rgba(0,_0,_0,_0.1)] border-gray-100
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
            >
                <div className="flex flex-col h-full">

                    {/* Header */}
                    <div className="h-20 flex items-center px-6 border-b border-gray-200 shrink-0">
                        <h1 className="text-lg font-semibold text-text-primary">
                            Mi Sistema
                        </h1>
                    </div>

                    {/* Menú */}
                    <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                        {menuItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => {
                                    setActiveItem(item.id)
                                    if (window.innerWidth < 1024) onClose()
                                }}
                                className={`
                  w-full text-left px-4 py-2.5 rounded-lg
                  transition-all duration-200 text-sm font-medium
                  ${activeItem === item.id
                                        ? 'bg-accent-light text-accent'
                                        : 'text-text-secondary hover:bg-gray-50 hover:text-text-primary'
                                    }
                `}
                            >
                                {item.label}
                            </button>
                        ))}
                    </nav>

                    {/* Footer */}
                    <div className="p-4 border-t border-gray-200 shrink-0">
                        <button
                            className="w-full text-left px-4 py-2.5 rounded-lg
                text-danger hover:bg-red-50
                transition-all duration-200 text-sm font-medium"
                            onClick={() => alert('Cerrar sesión próximamente')}
                        >
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </aside>
        </>
    )
}