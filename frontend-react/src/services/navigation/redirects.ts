
/**
 * Esta funcion ayuda a asignar la ruta de redireccion de dashboard
 * segun el rol del usuario
 * @param role rol del usuario
 * @returns ruta de la dashboard
 */
export const getDashboardRouteFromRole = (role: string) => {
  switch (role) {
    case "guest": return "/dashboard-guest"
    case "interested": return "/dashboard-interested"
    case "member": return "/dashboard-member"
    case "coordinator": return "/dashboard-coordinator"
    case "mentor": return "/dashboard-mentor"
    default: return "/dashboard-guest"
  }
}
