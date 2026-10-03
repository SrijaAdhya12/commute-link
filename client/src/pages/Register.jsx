import { useState } from 'react'
import Alert from '../components/Alert'
import FormField from '../components/FormField'

const initial = { name: '', phone: '', homeAddress: '', nodalPointId: '' }

export default function Register({ nodalPoints, onRegister }) {
    const [form, setForm] = useState(initial)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const update = (field, value) => setForm((current) => ({ ...current, [field]: value }))

    async function submit(event) {
        event.preventDefault()
        setError('')
        if (!form.name.trim() || !form.phone.trim() || !form.homeAddress.trim() || !form.nodalPointId) {
            setError('Please complete all required fields.')
            return
        }
        if (!/^\d{10}$/.test(form.phone)) {
            setError('Phone number must contain exactly 10 digits.')
            return
        }
        try {
            setLoading(true)
            await onRegister({ ...form, nodalPointId: Number(form.nodalPointId) })
        } catch (e) {
            setError(e.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-5xl overflow-hidden rounded-3xl bg-white shadow-soft lg:grid-cols-[0.9fr_1.1fr]">
                <section className="hidden bg-slate-950 p-10 text-white lg:flex lg:flex-col lg:justify-between">
                    <div>
                        <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-600 text-sm font-black text-white">
                            CL
                        </div>
                        <h1 className="mt-12 text-4xl font-black leading-tight">
                            Your daily ride,
                            <br />
                            made simpler.
                        </h1>
                        <p className="mt-5 max-w-sm text-sm leading-6 text-slate-300">
                            Connect with colleagues travelling from the same
                            nodal point to TCS Yeshwantpur.
                        </p>
                    </div>
                </section>

                <section className="p-6 sm:p-10 lg:p-12">
                    <div className="mb-8 lg:hidden">
                        <div className="grid h-11 w-11 place-items-center rounded-xl bg-blue-600 text-sm font-black text-white">
                            CL
                        </div>
                    </div>
                    <p className="text-sm font-bold text-blue-600">
                        CommuteLink
                    </p>
                    <h2 className="mt-1 text-3xl font-black tracking-tight text-slate-900">
                        Set up your commute profile
                    </h2>
                    <p className="mt-2 text-sm text-slate-500">
                        Add your details to book or offer rides with colleagues.
                    </p>

                    <div className="mt-6">
                        <Alert message={error} />
                    </div>

                    <form onSubmit={submit} className="mt-6 space-y-5">
                        <FormField label="Full name" required>
                            <input
                                value={form.name}
                                onChange={(e) => update("name", e.target.value)}
                                className="field"
                                placeholder="e.g. Srija Adhya"
                            />
                        </FormField>
                        <FormField
                            label="Phone number"
                            required
                            hint="10 digits, without spaces."
                        >
                            <input
                                value={form.phone}
                                onChange={(e) =>
                                    update(
                                        "phone",
                                        e.target.value
                                            .replace(/\D/g, "")
                                            .slice(0, 10),
                                    )
                                }
                                className="field"
                                inputMode="numeric"
                                placeholder="7980923700"
                            />
                        </FormField>
                        <FormField label="Home address" required>
                            <input
                                value={form.homeAddress}
                                onChange={(e) =>
                                    update("homeAddress", e.target.value)
                                }
                                className="field"
                                placeholder="Mathikere, Rajaji Nagar, Bengaluru"
                            />
                        </FormField>
                        <FormField label="Nodal point" required>
                            <select
                                value={form.nodalPointId}
                                onChange={(e) =>
                                    update("nodalPointId", e.target.value)
                                }
                                className="field"
                            >
                                <option value="">
                                    Select your nodal point
                                </option>
                                {nodalPoints.map((point) => (
                                    <option key={point.id} value={point.id}>
                                        {point.name}
                                    </option>
                                ))}
                            </select>
                        </FormField>
                        <button
                            disabled={loading}
                            className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-extrabold text-white hover:bg-blue-700 disabled:opacity-60"
                        >
                            {loading
                                ? "Setting up your profile..."
                                : "Continue"}
                        </button>
                    </form>
                </section>
            </div>
        </div>
    );
}
