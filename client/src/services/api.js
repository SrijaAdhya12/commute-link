import seedDatabase from '../data/db.json'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080').replace(/\/$/, '')
const FALLBACK_STORAGE_KEY = 'tcs-carpool-fallback-db'
let fallbackNoticeShown = false

async function request(path, options = {}) {
    let response
    try {
        response = await fetch(`${API_BASE_URL}${path}`, {
            ...options,
            headers: {
                ...(options.body ? { 'Content-Type': 'application/json' } : {}),
                ...(options.headers || {}),
            },
        })
    } catch (error) {
        if (!(error instanceof TypeError)) throw error

        if (!fallbackNoticeShown) {
            console.info('Backend unavailable; using the local car-pool database fallback.')
            fallbackNoticeShown = true
        }
        return handleFallbackRequest(path, options)
    }

    const contentType = response.headers.get('content-type') || ''
    const data = contentType.includes('application/json')
        ? await response.json()
        : await response.text()

    if (!response.ok) {
        const message = typeof data === 'object' && data?.message
            ? data.message
            : data || `Request failed with status ${response.status}`
        throw new Error(message)
    }

    return data
}

function readFallbackDatabase() {
    const stored = localStorage.getItem(FALLBACK_STORAGE_KEY)
    const database = stored ? JSON.parse(stored) : structuredClone(seedDatabase)
    database.nodalPoints = structuredClone(seedDatabase.nodalPoints)
    database.timeSlots = structuredClone(seedDatabase.timeSlots)
    database.employees = mergeSeedRecords(database.employees, seedDatabase.employees)
    database.cars = mergeSeedRecords(database.cars, seedDatabase.cars)
    return database
}

function mergeSeedRecords(records, seedRecords) {
    const recordIds = new Set(records.map((record) => record.id))
    return [...records, ...structuredClone(seedRecords.filter((record) => !recordIds.has(record.id)))]
}

function saveFallbackDatabase(database) {
    localStorage.setItem(FALLBACK_STORAGE_KEY, JSON.stringify(database))
}

function fallbackError(message) {
    throw new Error(message)
}

function handleFallbackRequest(path, options) {
    const database = readFallbackDatabase()
    const url = new URL(path, window.location.origin)
    const method = (options.method || 'GET').toUpperCase()
    const body = options.body ? JSON.parse(options.body) : {}
    const id = Number(url.pathname.split('/').filter(Boolean).at(-1))
    let result

    if (url.pathname === '/health' && method === 'GET') {
        result = { status: 'UP' }
    } else if (url.pathname === '/api/nodal-points' && method === 'GET') {
        result = database.nodalPoints
    } else if (url.pathname === '/api/time-slots' && method === 'GET') {
        result = database.timeSlots
    } else if (url.pathname === '/api/employees' && method === 'POST') {
        const nodalPoint = database.nodalPoints.find((point) => point.id === Number(body.nodalPointId))
        if (!nodalPoint) fallbackError('Please select a valid nodal point.')
        if (database.employees.some((employee) => employee.phone === body.phone)) {
            fallbackError('An employee with this phone number already exists.')
        }
        result = {
            id: nextId(database.employees),
            name: body.name,
            phone: body.phone,
            homeAddress: body.homeAddress,
            nodalPointId: nodalPoint.id,
            nodalPoint: nodalPoint.name,
        }
        database.employees.push(result)
    } else if (/^\/api\/employees\/\d+$/.test(url.pathname) && method === 'GET') {
        result = database.employees.find((employee) => employee.id === id)
        if (!result) fallbackError('Employee not found.')
    } else if (url.pathname === '/api/cars' && method === 'POST') {
        const owner = database.employees.find((employee) => employee.id === Number(body.ownerId))
        const nodalPoint = database.nodalPoints.find((point) => point.id === Number(body.nodalPointId))
        const timeSlot = database.timeSlots.find((slot) => slot.id === Number(body.timeSlotId))
        if (!owner || !nodalPoint || !timeSlot) fallbackError('Please provide a valid owner, nodal point and time slot.')
        const seats = body.type === 'SUV' ? 6 : 4
        result = {
            id: nextId(database.cars),
            ownerId: owner.id,
            ownerName: owner.name,
            type: body.type,
            nodalPointId: nodalPoint.id,
            nodalPoint: nodalPoint.name,
            timeSlotId: timeSlot.id,
            timeSlot: timeSlot.label,
            seats,
            vacancies: seats,
            dropLocation: 'TCS Yeshwantpur',
        }
        database.cars.push(result)
    } else if (url.pathname === '/api/cars' && method === 'GET') {
        result = database.cars.filter((car) => (
            car.vacancies > 0
            && (!url.searchParams.has('nodalPointId') || car.nodalPointId === Number(url.searchParams.get('nodalPointId')))
            && (!url.searchParams.has('timeSlotId') || car.timeSlotId === Number(url.searchParams.get('timeSlotId')))
        ))
    } else if (url.pathname === '/api/bookings' && method === 'POST') {
        const employee = database.employees.find((item) => item.id === Number(body.employeeId))
        const car = database.cars.find((item) => item.id === Number(body.carId))
        if (!employee || !car) fallbackError('Employee or car not found.')
        if (employee.id === car.ownerId) fallbackError('You cannot book your own car.')
        if (car.vacancies < 1) fallbackError('No seats are available for this car.')
        if (database.bookings.some((booking) => booking.employeeId === employee.id)) {
            fallbackError('You already have an active booking.')
        }
        car.vacancies -= 1
        result = {
            id: nextId(database.bookings),
            employeeId: employee.id,
            carId: car.id,
            carType: car.type,
            ownerName: car.ownerName,
            nodalPoint: car.nodalPoint,
            timeSlot: car.timeSlot,
            dropLocation: car.dropLocation,
            seats: car.seats,
            vacancies: car.vacancies,
        }
        database.bookings.push(result)
    } else if (url.pathname === '/api/bookings' && method === 'GET') {
        result = database.bookings.filter((booking) => (
            !url.searchParams.has('employeeId')
            || booking.employeeId === Number(url.searchParams.get('employeeId'))
        ))
    } else if (/^\/api\/bookings\/\d+$/.test(url.pathname) && method === 'DELETE') {
        const index = database.bookings.findIndex((booking) => booking.id === id)
        if (index < 0) fallbackError('Booking not found.')
        const [booking] = database.bookings.splice(index, 1)
        const car = database.cars.find((item) => item.id === booking.carId)
        if (car) car.vacancies = Math.min(car.seats, car.vacancies + 1)
        result = { message: 'Booking cancelled successfully.' }
    } else {
        fallbackError(`No local fallback is defined for ${method} ${url.pathname}.`)
    }

    if (method !== 'GET' && !(url.pathname === '/health')) saveFallbackDatabase(database)
    return result
}

function nextId(items) {
    return items.reduce((max, item) => Math.max(max, item.id), 0) + 1
}

export const api = {
    health: () => request("/health"),
    getNodalPoints: () => request("/api/nodal-points"),
    getTimeSlots: () => request("/api/time-slots"),
    createEmployee: (payload) =>
        request("/api/employees", {
            method: "POST",
            body: JSON.stringify(payload),
        }),
    getEmployee: (id) => request(`/api/employees/${id}`),
    createCar: (payload) =>
        request("/api/cars", {
            method: "POST",
            body: JSON.stringify(payload),
        }),
    getCars: ({ nodalPointId, timeSlotId, userId } = {}) => {
        const params = new URLSearchParams();
        if (nodalPointId) params.set("nodalPointId", nodalPointId);
        if (timeSlotId) params.set("timeSlotId", timeSlotId);
        const query = params.toString();
        return request(`/api/cars${query ? `?${query}` : ""}`, {
            headers: {
                ...(userId ? { "user-id": userId } : {}),
            },
        });
    },
    createBooking: (payload) =>
        request("/api/bookings", {
            method: "POST",
            body: JSON.stringify(payload),
        }),
    getBookings: (employeeId) =>
        request(
            employeeId
                ? `/api/bookings?employeeId=${employeeId}`
                : "/api/bookings",
        ),
    deleteBooking: (id) => request(`/api/bookings/${id}`, { method: "DELETE" }),
};

export { API_BASE_URL }
