'use client'

import { useState } from 'react'
import { useSessionStore } from '@/store/sessionStore'

interface ExportFormat {
  id: 'csv' | 'json' | 'pdf'
  label: string
  description: string
  icon: string
}

export default function DataExport() {
  const { currentSession, personalCoherence } = useSessionStore()
  const [exportFormat, setExportFormat] = useState<'csv' | 'json' | 'pdf'>('csv')
  const [exporting, setExporting] = useState(false)
  const [dateRange, setDateRange] = useState<'session' | 'week' | 'month' | 'all'>('session')

  const formats: ExportFormat[] = [
    {
      id: 'csv',
      label: 'CSV',
      description: 'Spreadsheet-compatible format',
      icon: '📊',
    },
    {
      id: 'json',
      label: 'JSON',
      description: 'Structured data format',
      icon: '📄',
    },
    {
      id: 'pdf',
      label: 'PDF Report',
      description: 'Formatted report with charts',
      icon: '📑',
    },
  ]

  const getSessionData = () => {
    if (!currentSession) return null

    const history = JSON.parse(localStorage.getItem('sync_session_history') || '[]')
    const sessionData = {
      sessionId: currentSession.sessionId,
      startedAt: new Date(currentSession.startedAt).toISOString(),
      duration: currentSession.duration,
      participantCount: currentSession.participantCount,
      personalCoherence: personalCoherence,
      groupMetrics: currentSession.groupMetrics,
      audioTrack: currentSession.audioTrack,
      intention: localStorage.getItem('sync_last_intention') || null,
    }

    return dateRange === 'session'
      ? [sessionData]
      : history.filter((h: any) => {
          const sessionDate = new Date(h.date)
          const now = new Date()
          if (dateRange === 'week') {
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
            return sessionDate >= weekAgo
          } else if (dateRange === 'month') {
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
            return sessionDate >= monthAgo
          }
          return true
        })
  }

  const exportToCSV = (data: any[]) => {
    if (data.length === 0) return

    const headers = [
      'Session ID',
      'Date',
      'Duration (ms)',
      'Participant Count',
      'Personal Coherence',
      'Average Coherence',
      'Peak Coherence',
      'Chant Name',
      'Intention',
    ]

    const rows = data.map((session) => [
      session.sessionId || session.id || '',
      session.date || session.startedAt || '',
      session.duration || 0,
      session.participantCount || 0,
      session.personalCoherence || session.peakCoherence || 0,
      session.averageCoherence || session.groupMetrics?.averageCoherence || 0,
      session.peakCoherence || session.groupMetrics?.peakCoherence || 0,
      session.chantName || session.audioTrack?.name || '',
      session.intention || '',
    ])

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `sync-sessions-${dateRange}-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  const exportToJSON = (data: any[]) => {
    const jsonContent = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `sync-sessions-${dateRange}-${new Date().toISOString().split('T')[0]}.json`
    link.click()
  }

  const exportToPDF = async (data: any[]) => {
    // In production, use a library like jsPDF or pdfmake
    // For now, create a formatted text report
    const report = `
SYNC - COLLECTIVE COHERENCE PLATFORM
Session Data Report
Generated: ${new Date().toLocaleString()}
Date Range: ${dateRange}

SUMMARY
Total Sessions: ${data.length}
Average Coherence: ${data.length > 0 ? (data.reduce((sum, s) => sum + (s.averageCoherence || s.groupMetrics?.averageCoherence || 0), 0) / data.length).toFixed(2) : 0}%
Peak Coherence: ${data.length > 0 ? Math.max(...data.map((s) => s.peakCoherence || s.groupMetrics?.peakCoherence || 0)) : 0}%
Total Participants: ${data.reduce((sum, s) => sum + (s.participantCount || 0), 0)}

SESSION DETAILS
${data
  .map(
    (session, index) => `
Session ${index + 1}
  ID: ${session.sessionId || session.id || 'N/A'}
  Date: ${session.date || session.startedAt || 'N/A'}
  Duration: ${Math.floor((session.duration || 0) / 60000)} minutes
  Participants: ${session.participantCount || 0}
  Personal Coherence: ${session.personalCoherence || session.peakCoherence || 0}%
  Group Average: ${session.averageCoherence || session.groupMetrics?.averageCoherence || 0}%
  Peak Coherence: ${session.peakCoherence || session.groupMetrics?.peakCoherence || 0}%
  Chant: ${session.chantName || session.audioTrack?.name || 'N/A'}
  Intention: ${session.intention || 'N/A'}
`
  )
  .join('\n')}

---
This report was generated by Sync Platform
For research purposes only
    `.trim()

    const blob = new Blob([report], { type: 'text/plain;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `sync-report-${dateRange}-${new Date().toISOString().split('T')[0]}.txt`
    link.click()
  }

  const handleExport = async () => {
    setExporting(true)
    const data = getSessionData()

    if (!data || data.length === 0) {
      alert('No data available to export')
      setExporting(false)
      return
    }

    try {
      switch (exportFormat) {
        case 'csv':
          exportToCSV(data)
          break
        case 'json':
          exportToJSON(data)
          break
        case 'pdf':
          await exportToPDF(data)
          break
      }
    } catch (error) {
      console.error('Export error:', error)
      alert('Error exporting data. Please try again.')
    } finally {
      setExporting(false)
    }
  }

  const data = getSessionData()
  const hasData = data && data.length > 0

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h3 className="text-xl font-semibold mb-4">📥 Export Your Data</h3>

      {/* Date Range Selection */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-300 mb-2">Date Range</label>
        <div className="flex gap-2">
          {(['session', 'week', 'month', 'all'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors capitalize ${
                dateRange === range
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Format Selection */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-300 mb-2">Export Format</label>
        <div className="grid grid-cols-3 gap-3">
          {formats.map((format) => (
            <button
              key={format.id}
              onClick={() => setExportFormat(format.id)}
              className={`p-4 rounded-lg border-2 transition-all text-center ${
                exportFormat === format.id
                  ? 'border-purple-500 bg-purple-900/30'
                  : 'border-gray-700 hover:border-gray-600'
              }`}
            >
              <div className="text-2xl mb-2">{format.icon}</div>
              <div className="font-semibold text-white">{format.label}</div>
              <div className="text-xs text-gray-400 mt-1">{format.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Data Preview */}
      {hasData && (
        <div className="mb-4 p-3 bg-gray-900 rounded-lg">
          <div className="text-sm text-gray-300">
            <strong>{data.length}</strong> session{data.length !== 1 ? 's' : ''} will be exported
          </div>
        </div>
      )}

      {/* Export Button */}
      <button
        onClick={handleExport}
        disabled={!hasData || exporting}
        className={`w-full px-6 py-3 rounded-lg font-semibold transition-colors ${
          hasData && !exporting
            ? 'bg-purple-600 hover:bg-purple-700 text-white'
            : 'bg-gray-700 text-gray-400 cursor-not-allowed'
        }`}
      >
        {exporting ? 'Exporting...' : `Export as ${exportFormat.toUpperCase()}`}
      </button>

      {!hasData && (
        <p className="text-sm text-gray-400 text-center mt-4">
          Complete sessions to export your data
        </p>
      )}
    </div>
  )
}

