

export const getDashboardRouteFromRole = (role: API.User["role"]) => {
  switch (role) {
    case "guest": return "/dashboard-guest"
    case "interested": return "/dashboard-member"
    case "member": return "/dashboard-member"
    case "coordinator": return "/dashboard-coordinator"
    case "mentor": return "/dashboard-mentor"
    default: return "/dashboard-member"
  }
}
