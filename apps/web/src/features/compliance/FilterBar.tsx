import { useStore } from '../../state/store'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { Button } from '../../components/ui/Button'

export function FilterBar() {
  const { filters, setFilters, clearFilters, fetchDeviations } = useStore()

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ search: e.target.value })
  }

  return (
    <div className="flex flex-wrap items-end gap-3 mb-6">
      <div className="flex-1 min-w-[200px]">
        <Input
          placeholder="Search deviations..."
          value={filters.search}
          onChange={handleSearch}
        />
      </div>
      <Select
        options={[
          { value: '', label: 'All Severities' },
          { value: 'critical', label: 'Critical' },
          { value: 'major', label: 'Major' },
          { value: 'minor', label: 'Minor' },
        ]}
        value={filters.severity}
        onChange={(e) => setFilters({ severity: e.target.value })}
      />
      <Select
        options={[
          { value: '', label: 'All Statuses' },
          { value: 'open', label: 'Open' },
          { value: 'closed', label: 'Closed' },
        ]}
        value={filters.status}
        onChange={(e) => setFilters({ status: e.target.value })}
      />
      <Button variant="ghost" size="sm" onClick={clearFilters}>Clear</Button>
      <Button size="sm" onClick={fetchDeviations}>Apply</Button>
    </div>
  )
}
