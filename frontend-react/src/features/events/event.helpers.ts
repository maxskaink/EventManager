export const translateEventModality = (modality: string) => {
    switch (modality) {
        case "presencial":
            return "Presencial";
        case "virtual":
            return "Virtual";
        case "mixta":
            return "Mixta (Híbrida)";
        default:
            return "No se ha definido un modalidad";
    }
}

export const translateEventStatus = (status: string) => {
    switch (status) {
        case "activo":
            return "Activo";
        case "inactivo":
            return "Inactivo";
        case "pendiente":
            return "Pendiente";
        case "cancelado":
            return "Cancelado";
        default:
            return "No se ha definido un estado";
    }
}

export const translateEventType = (type: string) => {
    switch (type) {
        case "charla":
            return "Charla";
        case "taller":
            return "Taller";
        case "conferencia":
            return "Conferencia";
        case "semillero":
            return "Semillero";
        default:
            return "No se ha definido un tipo";
    }
}

export const isEventUpcoming = (event: API.Event) => {
    const today = new Date();
    const eventDate = new Date(event.start_date);
    const todayTime = today.getTime();
    const eventTime = eventDate.getTime();
    const daysToBeUpcoming = 5
    return eventTime - todayTime <= daysToBeUpcoming * 24 * 60 * 60 * 1000;
}