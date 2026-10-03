import { useEffect, useState } from 'react'
import Alert from '../components/Alert'
import CarCard from '../components/CarCard'
import Loading from '../components/Loading'
import FormField from '../components/FormField'
import { api } from '../services/api'

export default function FindRide({ employee, nodalPoints, timeSlots, onBookingCreated }) {
    const [nodalPointId, setNodalPointId] = useState(String(employee?.nodalPointId || ''))
    const [timeSlotId, setTimeSlotId] = useState('')
    const [cars, setCars] = useState([])
    const [loading, setLoading] = useState(true)
    const [bookingId, setBookingId] = useState(null)
    const [error, setError] = useState('')

    async function loadCars() {
        setError('')
        setLoading(true)
        try {
            const data = await api.getCars({ nodalPointId, timeSlotId, userId: employee.id })
            setCars(data)
        } catch (e) {
            setError(e.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { loadCars() }, [])

    async function book(car) {
        setError('')
        setBookingId(car.id)
        try {
            await api.createBooking({ employeeId: employee.id, carId: car.id })
            await loadCars()
            onBookingCreated()
        } catch (e) {
            setError(e.message)
        } finally {
            setBookingId(null)
        }
    }

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div>
                <p className="text-sm font-bold text-blue-600">Find a ride</p>
                <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-900">Available cars</h1>
                <p className="mt-2 text-sm text-slate-500">Every ride goes to TCS Yeshwantpur.</p>
            </div>

            <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
                <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
                    <FormField label="Nodal point">
                        <select value={nodalPointId} onChange={(e) => setNodalPointId(e.target.value)} className="field">
                            <option value="">All nodal points</option>
                            {nodalPoints.map((point) => <option key={point.id} value={point.id}>{point.name}</option>)}
                        </select>
                    </FormField>
                    <FormField label="Time slot">
                        <select value={timeSlotId} onChange={(e) => setTimeSlotId(e.target.value)} className="field">
                            <option value="">All time slots</option>
                            {timeSlots.map((slot) => <option key={slot.id} value={slot.id}>{slot.label}</option>)}
                        </select>
                    </FormField>
                    <button onClick={loadCars} className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white hover:bg-slate-800">Search</button>
                </div>
            </section>

            <div className="mt-5"><Alert message={error} onClose={() => setError('')} /></div>

            {loading ? <Loading label="Finding available rides..." /> : cars.length === 0 ? (
                <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
                    <div className="text-3xl">🚙</div>
                    <h2 className="mt-3 font-black text-slate-900">No cars found</h2>
                    <p className="mt-1 text-sm text-slate-500">Try another nodal point or time slot.</p>
                </div>
            ) : (
                <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {cars.map((car) => <CarCard key={car.id} car={car} onBook={book} booking={{ employeeId: employee.id, loadingCarId: bookingId }} />)}
                </div>
            )}
        </div>
    )
}
