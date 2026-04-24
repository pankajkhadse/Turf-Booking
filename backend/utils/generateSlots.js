// this function takes open time, close time, duration
// and returns an array of slot objects

const generateSlots = (date, openTime, closeTime, durationMinutes) => {
    const slots = []

    // convert "06:00" into minutes → 360
    const toMinutes = (time) => {
        const [hours, minutes] = time.split(':').map(Number)
        return hours * 60 + minutes
    }

    // convert minutes back to "06:00" format
    const toTimeString = (minutes) => {
        const h = Math.floor(minutes / 60).toString().padStart(2, '0')
        const m = (minutes % 60).toString().padStart(2, '0')
        return `${h}:${m}`
    }

    let current = toMinutes(openTime)
    const end = toMinutes(closeTime)

    while (current + durationMinutes <= end) {
        slots.push({
            slot_date:  date,
            start_time: toTimeString(current),
            end_time:   toTimeString(current + durationMinutes)
        })
        current += durationMinutes
    }

    return slots
}

export default generateSlots