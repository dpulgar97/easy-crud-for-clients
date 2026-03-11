import { useState } from 'react'
import Sidebar from './Sidebar'

export default function Layout({ children, activeItem, setActiveItem }) {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <div className="flex h-screen bg-background-main">
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                activeItem={activeItem}
                setActiveItem={setActiveItem}
            />

            <div className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Header Móvil */}
                <header className="lg:hidden h-16 bg-background-card border-b border-gray-100 flex items-center justify-between px-4 shrink-0">
                    <h1 className="text-base font-semibold text-text-primary">Mi Sistema</h1>
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 rounded-lg hover:bg-gray-50 transition"
                    >
                        <svg className="w-5 h-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </header>

                <main className="flex-1 overflow-auto p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    )
}