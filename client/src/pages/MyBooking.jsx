import { useEffect, useState } from 'react'
import Alert from '../components/Alert'
import Loading from '../components/Loading'
import { api } from '../services/api'

export default function MyBooking({ employee, refreshKey, onCancelled }) {
    const [booking, setBooking] = useState(null)
    const [loading, setLoading] = useState(true)
    const [cancelling, setCancelling] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    async function load() {
        setLoading(true)
        setError('')
        try {
            const bookings = await api.getBookings(employee.id)
            setBooking(bookings[0] || null)
        } catch (e) {
            setError(e.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { load() }, [employee.id, refreshKey])

    async function cancel() {
        if (!booking) return
        if (!window.confirm('Cancel this booking?')) return
        setCancelling(true)
        setError('')
        try {
            await api.deleteBooking(booking.id)
            setBooking(null)
            setSuccess('Your booking has been cancelled.')
            onCancelled?.()
        } catch (e) {
            setError(e.message)
        } finally {
            setCancelling(false)
        }
    }

    return (
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
            <p className="text-sm font-bold text-blue-600">My booking</p>
            <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-900">Your ride</h1>
            <p className="mt-2 text-sm text-slate-500">You can have one active booking at a time.</p>

            <div className="mt-5 space-y-3">
                <Alert message={error} onClose={() => setError('')} />
                <Alert type="success" message={success} onClose={() => setSuccess('')} />
            </div>

            {loading ? <Loading label="Loading your booking..." /> : !booking ? (
                <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
                    <div className="text-3xl">🪑</div>
                    <h2 className="mt-3 font-black text-slate-900">No active booking</h2>
                    <p className="mt-1 text-sm text-slate-500">Find an available car and reserve a seat.</p>
                </div>
            ) : (
                <article className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
                    <div className="bg-slate-950 p-6 text-white">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-blue-300">Confirmed ride</p>
                                <h2 className="mt-2 text-2xl font-black">{booking.carType}</h2>
                            </div>
                            <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-300">Booked</span>
                        </div>
                    </div>

                    <div className="grid gap-px bg-slate-100 sm:grid-cols-2">
                        {[
                            ['Driver', booking.ownerName],
                            ['Nodal point', booking.nodalPoint],
                            ['Time slot', booking.timeSlot],
                            ['Destination', booking.dropLocation],
                            ['Total seats', booking.seats],
                            ['Seats remaining', booking.vacancies],
                        ].map(([label, value]) => (
                            <div key={label} className="bg-white p-5">
                                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</p>
                                <p className="mt-1 font-extrabold text-slate-800">{value}</p>
                            </div>
                        ))}
                    </div>

                    <div className="p-5">
                        <button onClick={cancel} disabled={cancelling} className="w-full rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700 hover:bg-rose-100 disabled:opacity-60">
                            {cancelling ? 'Cancelling...' : 'Cancel booking'}
                        </button>
                    </div>
                </article>
            )}
        </div>
    )
}
