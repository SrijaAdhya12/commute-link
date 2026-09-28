import { useState } from 'react'
import Alert from '../components/Alert'
import FormField from '../components/FormField'
import { api } from '../services/api'

export default function OfferRide({ employee, nodalPoints, timeSlots }) {
    const [form, setForm] = useState({ type: '', nodalPointId: String(employee?.nodalPointId || ''), timeSlotId: '' })
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(null)
    const [loading, setLoading] = useState(false)

    const update = (field, value) => setForm((current) => ({ ...current, [field]: value }))

    async function submit(event) {
        event.preventDefault()
        setError('')
        setSuccess(null)
        if (!form.type || !form.nodalPointId || !form.timeSlotId) {
            setError('Please select the car type, nodal point and time slot.')
            return
        }
        try {
            setLoading(true)
            const car = await api.createCar({
                ownerId: employee.id,
                type: form.type,
                nodalPointId: Number(form.nodalPointId),
                timeSlotId: Number(form.timeSlotId),
            })
            setSuccess(car)
            setForm((current) => ({ ...current, type: '', timeSlotId: '' }))
        } catch (e) {
            setError(e.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
            <p className="text-sm font-bold text-blue-600">Offer a ride</p>
            <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-900">Share your car</h1>
            <p className="mt-2 text-sm text-slate-500">Add your route so colleagues can reserve a seat.</p>

            <div className="mt-6 space-y-3">
                <Alert message={error} onClose={() => setError('')} />
                {success && <Alert type="success" message={`Car #${success.id} added. ${success.vacancies} seats are available.`} />}
            </div>

            <form onSubmit={submit} className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-soft sm:p-8">
                <div className="grid gap-5 sm:grid-cols-2">
                    <FormField label="Car type" required>
                        <select value={form.type} onChange={(e) => update('type', e.target.value)} className="field">
                            <option value="">Select car type</option>
                            <option value="HATCHBACK">Hatchback · 4 seats</option>
                            <option value="SEDAN">Sedan · 4 seats</option>
                            <option value="SUV">SUV · 6 seats</option>
                        </select>
                    </FormField>
                    <FormField label="Nodal point" required>
                        <select value={form.nodalPointId} onChange={(e) => update('nodalPointId', e.target.value)} className="field">
                            <option value="">Select nodal point</option>
                            {nodalPoints.map((point) => <option key={point.id} value={point.id}>{point.name}</option>)}
                        </select>
                    </FormField>
                    <FormField label="Time slot" required>
                        <select value={form.timeSlotId} onChange={(e) => update('timeSlotId', e.target.value)} className="field sm:col-span-2">
                            <option value="">Select time slot</option>
                            {timeSlots.map((slot) => <option key={slot.id} value={slot.id}>{slot.label}</option>)}
                        </select>
                    </FormField>
                </div>

                <div className="mt-6 rounded-xl bg-slate-50 p-4 text-sm">
                    <p className="font-bold text-slate-800">Destination</p>
                    <p className="mt-1 text-slate-500">TCS Yeshwantpur</p>
                </div>

                <button disabled={loading} className="mt-6 w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-extrabold text-white hover:bg-blue-700 disabled:opacity-60">
                    {loading ? 'Adding car...' : 'Offer this ride'}
                </button>
            </form>
        </div>
    )
}
