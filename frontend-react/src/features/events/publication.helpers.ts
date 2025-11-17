export const translatePublicationType = (type: API.PublicationType, defaultValue?: string) => {
    switch (type) {
        case "articulo":
            return "Artículo";
        case "aviso":
            return "Aviso";
        case "comunicado":
            return "Comunicado";
        case "material":
            return "Material";
        case "evento":
            return "Evento";
        default:
            return defaultValue ?? "No se ha definido un tipo";
    }
}
export const translatePublicationStatus = (status: API.PublicationStatus, defaultValue?: string) => {
    switch (status) {
        case "activo":
            return "Activo";
        case "inactivo":
            return "Inactivo";
        case "borrador":
            return "Borrador";
        case "pendiente":
            return "Pendiente";
        default:
            return defaultValue ?? "No se ha definido un estado";
    }
}

export const translatePublicationVisibility = (visibility: API.PublicationVisibility, defaultValue?: string) => {
    switch (visibility) {
        case "public":
            return "Público";
        case "private":
            return "Privado";
        case "role_based":
            return "Role-based";
        default:
            return defaultValue ?? "No se ha definido una visibilidad";
    }
}