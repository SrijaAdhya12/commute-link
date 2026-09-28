export default function Dashboard({ employee, bookingCount, onNavigate }) {
    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <section className="overflow-hidden rounded-3xl bg-slate-950 p-7 text-white shadow-soft sm:p-10">
                <div className="max-w-2xl">
                    <p className="text-sm font-bold text-blue-300">Good to have you here</p>
                    <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Hi, {employee.name.split(' ')[0]} 👋</h1>
                    <p className="mt-4 text-sm leading-6 text-slate-300 sm:text-base">Find a colleague travelling from {employee.nodalPoint}, or offer your own seat on the way to TCS Yeshwantpur.</p>
                    <div className="mt-7 flex flex-wrap gap-3">
                        <button onClick={() => onNavigate('find')} className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold hover:bg-blue-500">Find a ride</button>
                        <button onClick={() => onNavigate('offer')} className="rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-bold hover:bg-white/15">Offer a ride</button>
                    </div>
                </div>
            </section>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Nodal point</p>
                    <p className="mt-2 text-xl font-black text-slate-900">{employee.nodalPoint}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Destination</p>
                    <p className="mt-2 text-xl font-black text-slate-900">TCS Yeshwantpur</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Active booking</p>
                    <p className="mt-2 text-xl font-black text-slate-900">{bookingCount ? '1 ride' : 'None'}</p>
                </div>
            </div>

            <section className="mt-8">
                <h2 className="text-xl font-black text-slate-900">How it works</h2>
                <div className="mt-4 grid gap-4 md:grid-cols-3">
                    {[
                        ['01', 'Choose your route', 'Select a nodal point and time slot that works for you.'],
                        ['02', 'Find or offer a seat', 'Browse available cars or register your own car.'],
                        ['03', 'Travel together', 'Book a seat and meet at the selected nodal point.'],
                    ].map(([number, title, text]) => (
                        <div key={number} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
                            <span className="text-xs font-black text-blue-600">{number}</span>
                            <h3 className="mt-3 font-extrabold text-slate-900">{title}</h3>
                            <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}
