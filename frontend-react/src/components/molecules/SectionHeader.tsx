export const SectionHeader = ({ title, actions }: { title: string; actions: React.ReactNode }) => 
  <div className="flex items-center justify-between">
    <h2 className="text-xl font-semibold">{title}</h2>
    <div>{actions}</div>
  </div>

