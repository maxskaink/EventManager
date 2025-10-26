import { BNavBarCoordinator } from "../ui/b-navbar-coordinator"
import { BNavBarGuest } from "../ui/b-navbar-guest"
import { BNavBarInterested } from "../ui/b-navbar-interested"
import { BNavBarMember } from "../ui/b-navbar-member"
import { BNavBarMentor } from "../ui/b-navbar-mentor"

interface Props {
  role: string
}
/**
 * Este es un componente wrapper que decide que navbar renderizar dependiendo del role
 * pasado como propiedad
 */
export default function BottomNavbarWrapper({ role }: Props) {
  switch (role) {
    case "coordinator": return <BNavBarCoordinator />
    case "member": return <BNavBarMember />
    case "mentor": return <BNavBarMentor />
    case "interested": return <BNavBarInterested />

    default: return <BNavBarGuest />
  }
}
