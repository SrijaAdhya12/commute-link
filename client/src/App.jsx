import { useEffect, useState } from 'react'
import Layout from './components/Layout'
import Loading from './components/Loading'
import Alert from './components/Alert'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import FindRide from './pages/FindRide'
import OfferRide from './pages/OfferRide'
import MyBooking from './pages/MyBooking'
import { api } from './services/api'

const STORAGE_KEY = 'tcs-carpool-employee-id'

export default function App() {
    const [employee, setEmployee] = useState(null)
    const [nodalPoints, setNodalPoints] = useState([])
    const [timeSlots, setTimeSlots] = useState([])
    const [page, setPage] = useState('dashboard')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [bookingCount, setBookingCount] = useState(0)
    const [bookingRefresh, setBookingRefresh] = useState(0)

    useEffect(() => {
        async function bootstrap() {
            try {
                const [points, slots] = await Promise.all([api.getNodalPoints(), api.getTimeSlots()])
                setNodalPoints(points)
                setTimeSlots(slots)

                const savedId = localStorage.getItem(STORAGE_KEY)
                if (savedId) {
                    try {
                        const currentEmployee = await api.getEmployee(savedId)
                        setEmployee(currentEmployee)
                        const bookings = await api.getBookings(currentEmployee.id)
                        setBookingCount(bookings.length)
                    } catch {
                        localStorage.removeItem(STORAGE_KEY)
                    }
                }
            } catch (e) {
                setError(`Could not connect to the backend. ${e.message}`)
            } finally {
                setLoading(false)
            }
        }
        bootstrap()
    }, [])

    async function register(payload) {
        const created = await api.createEmployee(payload)
        localStorage.setItem(STORAGE_KEY, String(created.id))
        setEmployee(created)
        setPage('dashboard')
    }

    async function refreshBooking() {
        if (!employee) return
        try {
            const bookings = await api.getBookings(employee.id)
            setBookingCount(bookings.length)
            setBookingRefresh((value) => value + 1)
        } catch (e) {
            setError(e.message)
        }
    }

    function logout() {
        localStorage.removeItem(STORAGE_KEY)
        setEmployee(null)
        setBookingCount(0)
        setPage('dashboard')
    }

    if (loading) {
        return <Loading label="Connecting to CommuteLink..." />
    }

    if (!employee) {
        return (
            <>
                {error && <div className="mx-auto max-w-2xl px-4 pt-5"><Alert message={error} /></div>}
                <Register nodalPoints={nodalPoints} onRegister={register} />
            </>
        )
    }

    let content
    if (page === 'find') {
        content = <FindRide employee={employee} nodalPoints={nodalPoints} timeSlots={timeSlots} onBookingCreated={refreshBooking} />
    } else if (page === 'offer') {
        content = <OfferRide employee={employee} nodalPoints={nodalPoints} timeSlots={timeSlots} />
    } else if (page === 'booking') {
        content = <MyBooking employee={employee} refreshKey={bookingRefresh} onCancelled={refreshBooking} />
    } else {
        content = <Dashboard employee={employee} bookingCount={bookingCount} onNavigate={setPage} />
    }

    return (
        <Layout employee={employee} activePage={page} onNavigate={setPage} onLogout={logout}>
            {error && <div className="mx-auto max-w-7xl px-4 pt-5 sm:px-6 lg:px-8"><Alert message={error} onClose={() => setError('')} /></div>}
            {content}
        </Layout>
    )
}
