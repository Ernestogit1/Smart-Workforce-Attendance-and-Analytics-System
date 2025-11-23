import { Grid, Box, Alert, Skeleton, Stack, Button, Tooltip } from '@mui/material'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import TableViewIcon from '@mui/icons-material/TableView'
import { useRef, useCallback } from 'react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import InsightCards from './subAnaytic/InsightCards'
import HealthScore from './subAnaytic/HealthScore'
import ChartsSection from './subAnaytic/ChartsSection'
import EmployeeRanking from './subAnaytic/EmployeeRanking'
import { useAnalytics } from '../../hooks/analythicDashboard.hook'

export default function AnalyticDashboard() {
  const { data, loading, error, reload } = useAnalytics()
  const exportRef = useRef<HTMLDivElement | null>(null)

  const handleExportPDF = useCallback(async () => {
    if (!exportRef.current) return
    const node = exportRef.current

    // Use html2canvas to capture the dashboard content
    const canvas = await html2canvas(node, {
      scale: window.devicePixelRatio || 2,
      backgroundColor: '#ffffff',
      useCORS: true,
    })

    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p', 'mm', 'a4')
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()

    const imgWidth = pageWidth
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    let heightLeft = imgHeight
    let position = 0

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST')
    heightLeft -= pageHeight

    while (heightLeft > 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST')
      heightLeft -= pageHeight
    }

    const ts = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')
    pdf.save(`analytics-dashboard-${ts}.pdf`)
  }, [])

  const handleExportCSV = useCallback(() => {
    const monthly = data?.monthlyTrend ?? []
    const ranking = data?.ranking ?? []

    const lines: string[] = []
    const escape = (v: any) => {
      const s = String(v ?? '')
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
    }

    // Section 1: Monthly Attendance Trend
    lines.push('Monthly Attendance Trend')
    lines.push(['Month', 'Present', 'Late', 'Absent'].map(escape).join(','))
    monthly.forEach((m) => {
      lines.push([m.month, m.present ?? 0, m.late ?? 0, m.absent ?? 0].map(escape).join(','))
    })
    lines.push('') // blank line

    // Section 2: Employee Ranking
    lines.push('Employee Ranking')
    lines.push(['Rank', 'Name', 'Attendance Score', 'Total Absences', 'Total Lates'].map(escape).join(','))
    ranking.forEach((r) => {
      lines.push([
        r.rank ?? '',
        r.name,
        r.score ?? 0,
        r.absences ?? 0,
        r.lates ?? 0,
      ].map(escape).join(','))
    })

    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    const ts = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')
    a.href = url
    a.download = `analytics-dashboard-${ts}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [data])

  if (error) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      </Box>
    )
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }} ref={exportRef}>
      <Stack direction="row" justifyContent="flex-end" spacing={1}>
        <Tooltip title="Export as CSV">
          <span>
            <Button
              size="small"
              variant="outlined"
              color="primary"
              startIcon={<TableViewIcon />}
              onClick={handleExportCSV}
              disabled={loading}
            >
              Export CSV
            </Button>
          </span>
        </Tooltip>
        <Tooltip title="Export as PDF">
          <span>
            <Button
              size="small"
              variant="contained"
              color="secondary"
              startIcon={<PictureAsPdfIcon />}
              onClick={handleExportPDF}
              disabled={loading}
            >
              Export PDF
            </Button>
          </span>
        </Tooltip>
      </Stack>

      {/* Insights */}
      {loading ? <Skeleton variant="rounded" height={140} /> : <InsightCards items={data?.insights ?? []} />}

      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          {loading ? <Skeleton variant="rounded" height={180} /> : <HealthScore score={data?.score ?? 0} />}
        </Grid>
        <Grid item xs={12} md={8}>
          {loading ? <Skeleton variant="rounded" height={180} /> : (
            <ChartsSection
              monthly={data?.monthlyTrend ?? []}
              breakdown={data?.absenteeismBreakdown ?? []}
              leaveTrend={data?.leaveUsageTrend ?? []}
              lateness={data?.latenessByEmployee ?? []}
              radar={data?.radar ?? []}
            />
          )}
        </Grid>
      </Grid>

      {loading ? <Skeleton variant="rounded" height={360} /> : (
        <EmployeeRanking rows={data?.ranking ?? []} loading={loading} />
      )}
    </Box>
  )
}