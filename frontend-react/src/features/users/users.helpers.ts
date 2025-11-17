

/**
 * Translates api user role to human readable string
 * @param role API user 
 */
export const translateUserRole = (role: API.UserRole) => {
    switch (role) {
        case "interested":
            return "Interesado";
        case "active-member":
            return "Miembro Activo";
        case "coordinator":
            return "Coordinador";
        case "mentor":
            return "Mentor";
        case "seed":
            return "Semilla";
        default:
            return "No se ha definido un rol";
    }
}