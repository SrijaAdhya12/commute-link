export default function CarCard({ car, onBook, booking }) {
    const full = car.vacancies <= 0
    const ownCar = booking?.employeeId === car.ownerId

    return (
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg">
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="grid h-12 w-12 place-items-center rounded-xl bg-slate-100 text-xl">🚗</div>
                    <div>
                        <h3 className="font-extrabold text-slate-900">{car.type}</h3>
                        <p className="text-sm text-slate-500">Driven by {car.ownerName}</p>
                    </div>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${full ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-700"}`}>
                    {full ? "Full" : `${car.vacancies} seats left`}
                </span>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs text-slate-400">Nodal point</p>
                    <p className="mt-1 font-bold text-slate-700">{car.nodalPoint}</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs text-slate-400">Time slot</p>
                    <p className="mt-1 font-bold text-slate-700">{car.timeSlot}</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs text-slate-400">Capacity</p>
                    <p className="mt-1 font-bold text-slate-700">{car.seats} seats</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs text-slate-400">Destination</p>
                    <p className="mt-1 font-bold text-slate-700">TCS Yeshwantpur</p>
                </div>
            </div>

            <button
                onClick={() => onBook(car)}
                disabled={full || ownCar}
                className="mt-5 w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400"
            >
                {ownCar ? "Your car" : full ? "No seats available" : "Book a seat"}
            </button>
        </article>
    )
}
