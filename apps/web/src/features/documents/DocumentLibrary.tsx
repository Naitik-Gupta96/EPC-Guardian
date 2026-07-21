import { useEffect } from 'react'
import { useStore } from '../../state/store'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { EmptyState } from '../../components/ui/EmptyState'

const typeIcons: Record<string, string> = {
  specification: '📄',
  submittal: '📋',
}

export function DocumentLibrary() {
  const { documents, fetchDocuments } = useStore()

  useEffect(() => { fetchDocuments() }, [])

  return (
    <div className="max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-text-primary">Document Library</h1>
          <p className="text-sm text-text-muted">{documents.length} documents ingested</p>
        </div>
      </div>

      {documents.length === 0 ? (
        <Card>
          <EmptyState
            title="No documents"
            description="Ingested specification and submittal documents will appear here."
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc) => (
            <Card key={doc.id} hover>
              <div className="flex items-start gap-3">
                <span className="text-2xl">{typeIcons[doc.document_type] || '📄'}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-text-primary truncate">{doc.filename}</div>
                  <div className="text-xs text-text-muted mt-0.5 font-mono">{doc.id}</div>
                  <div className="mt-2">
                    <Badge variant={doc.parse_status === 'parsed' ? 'success' : doc.parse_status === 'uploaded' ? 'warning' : 'default'}>
                      {doc.parse_status}
                    </Badge>
                    <Badge variant="info" className="ml-1.5">{doc.document_type}</Badge>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
