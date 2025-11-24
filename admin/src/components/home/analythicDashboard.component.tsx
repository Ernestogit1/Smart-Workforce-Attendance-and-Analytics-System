import { Grid, Box, Alert, Skeleton, Stack, Button, Tooltip, Typography, alpha } from '@mui/material'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import TableViewIcon from '@mui/icons-material/TableView'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
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
    
    try {
      const node = exportRef.current
      
      // Capture the dashboard content
      const canvas = await html2canvas(node, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
        logging: false,
        windowWidth: node.scrollWidth,
        windowHeight: node.scrollHeight,
        // Ignore anything marked as "no-pdf"
        ignoreElements: (el) =>
          el?.classList?.contains('no-pdf') ||
          el?.getAttribute?.('data-no-pdf') === 'true' ||
          el?.getAttribute?.('data-html2canvas-ignore') === 'true',
      })

      const imgData = canvas.toDataURL('image/png', 0.95)
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
    } catch (err) {
      console.error('PDF export failed:', err)
    }
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
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header Section - Won't appear in PDF */}
      <Box
        className="no-pdf"
        data-no-pdf="true"
        data-html2canvas-ignore="true"
        sx={{ mb: 4 }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
          <Box>
            <Typography 
              variant="h3" 
              fontWeight={900} 
              sx={{ 
                mb: 1,
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Analytics Dashboard
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <TrendingUpIcon sx={{ color: '#10b981', fontSize: 20 }} />
              <Typography variant="body1" color="text.secondary" fontWeight={600}>
                Real-time attendance insights and performance metrics
              </Typography>
            </Stack>
          </Box>
          
          <Stack direction="row" spacing={1.5}>
            <Tooltip title="Export data as CSV spreadsheet" arrow>
              <Button
                className="no-pdf"
                data-no-pdf="true"
                data-html2canvas-ignore="true"
                variant="outlined"
                color="primary"
                startIcon={<TableViewIcon />}
                onClick={handleExportCSV}
                disabled={loading}
                sx={{
                  borderRadius: 2.5,
                  textTransform: 'none',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  px: 2.5,
                  py: 1.2,
                  borderWidth: 2,
                  '&:hover': {
                    borderWidth: 2,
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                Export CSV
              </Button>
            </Tooltip>
            <Tooltip title="Export dashboard as PDF report" arrow>
              <Button
                className="no-pdf"
                data-no-pdf="true"
                data-html2canvas-ignore="true"
                variant="contained"
                startIcon={<PictureAsPdfIcon />}
                onClick={handleExportPDF}
                disabled={loading}
                sx={{
                  borderRadius: 2.5,
                  textTransform: 'none',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  px: 2.5,
                  py: 1.2,
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 16px rgba(239, 68, 68, 0.4)',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                Export PDF
              </Button>
            </Tooltip>
          </Stack>
        </Stack>
      </Box>

      {/* Content for PDF Export */}
      <Box ref={exportRef} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Insights */}
        {loading ? (
          <Skeleton variant="rounded" height={180} sx={{ borderRadius: 3 }} />
        ) : (
          <InsightCards items={data?.insights ?? []} />
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            {loading ? (
              <Skeleton variant="rounded" height={200} sx={{ borderRadius: 3 }} />
            ) : (
              <HealthScore score={data?.score ?? 0} />
            )}
          </Grid>
          <Grid item xs={12} md={8}>
            {loading ? (
              <Skeleton variant="rounded" height={200} sx={{ borderRadius: 3 }} />
            ) : (
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

        {loading ? (
          <Skeleton variant="rounded" height={400} sx={{ borderRadius: 3 }} />
        ) : (
          <EmployeeRanking rows={data?.ranking ?? []} loading={loading} />
        )}
      </Box>
    </Box>
  )
}