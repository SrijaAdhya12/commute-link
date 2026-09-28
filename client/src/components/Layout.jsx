export default function Layout({ employee, activePage, onNavigate, onLogout, children }) {
    const nav = [
        ['dashboard', 'Dashboard'],
        ['find', 'Find a Ride'],
        ['offer', 'Offer a Ride'],
        ['booking', 'My Booking'],
    ]

    return (
        <div className="min-h-screen">
            <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur">
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
                    <button onClick={() => onNavigate('dashboard')} className="flex items-center gap-3 text-left">
                        <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-600 text-sm font-black text-white shadow-sm">CL</span>
                        <span>
                            <span className="block text-sm font-black tracking-tight text-slate-900">CommuteLink</span>
                            <span className="hidden text-xs text-slate-500 sm:block">Ride together. Reach together.</span>
                        </span>
                    </button>

                    <nav className="hidden items-center gap-1 md:flex">
                        {nav.map(([id, label]) => (
                            <button
                                key={id}
                                onClick={() => onNavigate(id)}
                                className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${activePage === id ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
                            >
                                {label}
                            </button>
                        ))}
                    </nav>

                    <div className="flex items-center gap-2">
                        <div className="hidden text-right sm:block">
                            <p className="text-sm font-bold text-slate-800">{employee?.name}</p>
                            <p className="text-xs text-slate-500">{employee?.nodalPoint}</p>
                        </div>
                        <button onClick={onLogout} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50">
                            Exit
                        </button>
                    </div>
                </div>

                <div className="flex gap-1 overflow-x-auto border-t border-slate-100 px-4 py-2 md:hidden">
                    {nav.map(([id, label]) => (
                        <button key={id} onClick={() => onNavigate(id)} className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold ${activePage === id ? 'bg-blue-50 text-blue-700' : 'text-slate-600'}`}>
                            {label}
                        </button>
                    ))}
                </div>
            </header>
            <main>{children}</main>
        </div>
    )
}
