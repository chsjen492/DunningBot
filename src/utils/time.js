export const getCurrentWeek = date => {
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    const dayNum = d.getDay() || 7
    d.setDate(d.getDate() + 4 - dayNum)
    const yearStart = new Date(d.getFullYear(), 0, 1)
    return Math.ceil(((d - yearStart) / 86400000 + 1) / 7)
}

export const getNextWeek = currentWeek => {
    return currentWeek === 52 ? 1 : currentWeek + 1
}
