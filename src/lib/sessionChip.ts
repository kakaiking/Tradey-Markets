/** Returns the forex session that is typically open at the given UTC hour. */
export function getOpenSession(date = new Date()): {
    name: "Tokyo" | "London" | "New York" | "Quiet";
    label: string;
} {
    const hour = date.getUTCHours();

    // Rough session windows in UTC
    const tokyo = hour >= 0 && hour < 9;
    const london = hour >= 7 && hour < 16;
    const newYork = hour >= 12 && hour < 21;

    if (london && newYork) {
        return { name: "London", label: "London · New York overlap" };
    }
    if (tokyo && london) {
        return { name: "Tokyo", label: "Tokyo · London overlap" };
    }
    if (newYork) {
        return { name: "New York", label: "New York session open" };
    }
    if (london) {
        return { name: "London", label: "London session open" };
    }
    if (tokyo) {
        return { name: "Tokyo", label: "Tokyo session open" };
    }
    return { name: "Quiet", label: "Between sessions" };
}
