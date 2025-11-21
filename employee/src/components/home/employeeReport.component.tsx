import { useMemo, useRef, useState } from 'react'
import {
  Box,
  Typography,
  Select,
  MenuItem,
  Chip,
  Tooltip,
  CircularProgress,
  Skeleton,
  Fade,
  Button,
} from '@mui/material'
import {
  TrendingUp,
  EventAvailable,
  WatchLater,
  DoNotDisturbOn,
  QueryStats,
  Insights as InsightsIcon,
  CalendarMonth,
  Timeline,
  Assessment,
  PictureAsPdf,
} from '@mui/icons-material'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { useEmployeeReport } from '../../hooks/employeeReport.hooks'
import {
  ReportContainer,
  HeaderSection,
  Section,
  KpiGrid,
  KpiCard,
  KpiIconBox,
  TimelineWrapper,
  TimelineHeader,
  ScrollArea,
  TimelineRow,
  MonthSummaryBox,
  SummaryRow,
  HeatmapWrapper,
  HeatmapGrid,
  HeatCell,
  InsightsBox,
  ComparisonBox,
  ComparisonRow,
  MonthSelector,
  StatusChipColor,
  HeatColor,
  HeaderGradientText,
  SectionTitle,
} from '../../styles/employeeReport.style'

function fmtTime(str?: string | null) {
  if (!str) return '—'
  try {
    const d = new Date(str)
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  } catch {
    return '—'
  }
}

function shortDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function fullDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

export default function EmployeeReport() {
  const { data, loading, error, month, changeMonth } = useEmployeeReport()
  const reportRef = useRef<HTMLDivElement>(null)
  const [exporting, setExporting] = useState(false)

  // Month options (already fixed)
  const monthOptions = useMemo(() => {
    const now = new Date()
    const y = now.getFullYear()
    const currentMonthIdx = now.getMonth()
    const opts: string[] = []
    for (let m = 0; m <= currentMonthIdx; m++) {
      opts.push(`${y}-${String(m + 1).padStart(2, '0')}`)
    }
    return opts.reverse()
  }, [])

  // Fallback: upgrade past neutral "—" days to "Absent" (only weekdays, passed days)
  const patchedHeatmap = useMemo(() => {
    if (!data) return []
    const today = new Date()
    return data.heatmap.map(h => {
      const d = new Date(h.date)
      const isPast = d <= today
      const weekday = d.getDay() >= 1 && d.getDay() <= 5 // Mon-Fri
      if (h.status === '—' && isPast && weekday) {
        return { ...h, status: 'Absent' }
      }
      return h
    })
  }, [data])

  const handleExportPdf = async () => {
    if (!reportRef.current) return
    try {
      setExporting(true)
      // Hide elements marked 'no-pdf' while capturing
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        ignoreElements: (el) => {
          return (el as HTMLElement)?.classList?.contains('no-pdf') || false
        },
        scrollY: -window.scrollY,
      })
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      const imgWidth = pdfWidth
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      let heightLeft = imgHeight
      let position = 0

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST')
      heightLeft -= pdfHeight

      while (heightLeft > 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST')
        heightLeft -= pdfHeight
      }

      const fileMonth = month || new Date().toISOString().slice(0, 7)
      pdf.save(`EmployeeReport_${fileMonth}.pdf`)
    } catch (e) {
      console.error('Export PDF failed:', e)
    } finally {
      setExporting(false)
    }
  }

  const selectedMonthLabel = useMemo(() => {
    if (!month) return ''
    const [year, monthNum] = month.split('-')
    const date = new Date(parseInt(year), parseInt(monthNum) - 1, 1)
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }, [month])

  return (
    <ReportContainer ref={reportRef}>
      {/* Header */}
      <HeaderSection>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography sx={HeaderGradientText}>
              Analytics & Report
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748b', mt: 1, fontWeight: 500 }}>
              Comprehensive overview of your attendance and performance metrics
            </Typography>
          </Box>

          {/* Right-side controls */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <MonthSelector>
              <CalendarMonth sx={{ color: '#667eea', fontSize: 28 }} />
              <Select
                size="small"
                value={month}
                onChange={e => changeMonth(e.target.value)}
                sx={{
                  minWidth: 180,
                  fontWeight: 600,
                  border: 'none',
                  '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                }}
              >
                {monthOptions.map(m => {
                  const [year, monthNum] = m.split('-')
                  const label = new Date(parseInt(year), parseInt(monthNum) - 1, 1).toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric'
                  })
                  return <MenuItem key={m} value={m}>{label}</MenuItem>
                })}
              </Select>
            </MonthSelector>

            <Button
              className="no-pdf"
              onClick={handleExportPdf}
              variant="contained"
              color="primary"
              startIcon={<PictureAsPdf />}
              disabled={exporting}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 700,
                boxShadow: '0 6px 18px rgba(102,126,234,0.35)',
                bgcolor: '#6366f1',
                '&:hover': { bgcolor: '#4f46e5' },
              }}
            >
              {exporting ? 'Exporting…' : 'Export PDF'}
            </Button>
          </Box>
        </Box>
      </HeaderSection>

      {/* KPIs */}
      <Section>
        {loading && !data && (
          <KpiGrid>
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} variant="rounded" height={140} sx={{ borderRadius: 3 }} />
            ))}
          </KpiGrid>
        )}

        {error && (
          <Box sx={{ 
            p: 3, 
            borderRadius: 3, 
            background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)', 
            color: '#991b1b', 
            fontWeight: 600,
            boxShadow: '0 4px 20px rgba(239, 68, 68, 0.2)',
          }}>
            {error}
          </Box>
        )}

        {data && (
          <Fade in timeout={600}>
            <KpiGrid>
              <KpiCard>
                <KpiIconBox sx={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                  <EventAvailable />
                </KpiIconBox>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Days Present
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 900, color: '#1e293b' }}>
                  {data.kpis.totalPresent}
                </Typography>
              </KpiCard>

              <KpiCard>
                <KpiIconBox sx={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }}>
                  <DoNotDisturbOn />
                </KpiIconBox>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Absences
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 900, color: '#1e293b' }}>
                  {data.kpis.totalAbsent}
                </Typography>
              </KpiCard>

              <KpiCard>
                <KpiIconBox sx={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
                  <WatchLater />
                </KpiIconBox>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Late Arrivals
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 900, color: '#1e293b' }}>
                  {data.kpis.totalLate}
                </Typography>
              </KpiCard>

              <KpiCard>
                <KpiIconBox sx={{ background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' }}>
                  <QueryStats />
                </KpiIconBox>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Leave Requests
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 900, color: '#1e293b' }}>
                  {data.kpis.totalLeaveRequests}
                </Typography>
              </KpiCard>
            </KpiGrid>
          </Fade>
        )}
      </Section>

      {/* Timeline */}
      <Section>
        <Fade in timeout={800}>
          <TimelineWrapper>
            <TimelineHeader>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Timeline />
                <Typography variant="h6" sx={{ fontWeight: 800 }}>Recent Attendance Timeline</Typography>
              </Box>
              {loading && <CircularProgress size={24} sx={{ color: '#fff' }} />}
            </TimelineHeader>
            <ScrollArea>
              <TimelineRow sx={{ fontWeight: 800, background: 'linear-gradient(90deg, #f8fafc 0%, #f1f5f9 100%)' }}>
                <Box>Date</Box>
                <Box>Status</Box>
                <Box>Time In</Box>
                <Box>Time Out</Box>
                <Box>Hours</Box>
              </TimelineRow>
              {data?.recentAttendance.map((r, idx) => (
                <Fade in key={r.id} timeout={300 + idx * 50}>
                  <TimelineRow>
                    <Box sx={{ fontWeight: 700 }}>{shortDate(r.date)}</Box>
                    <Box>
                      <Chip
                        size="small"
                        label={r.status || '—'}
                        sx={{
                          height: 26,
                          fontSize: 12,
                          fontWeight: 700,
                          background: `${StatusChipColor(r.status)}15`,
                          color: StatusChipColor(r.status),
                          border: `2px solid ${StatusChipColor(r.status)}40`,
                        }}
                      />
                    </Box>
                    <Box>{fmtTime(r.timeIn)}</Box>
                    <Box>{fmtTime(r.timeOut)}</Box>
                    <Box sx={{ fontWeight: 600 }}>{r.hoursWorked || '00:00:00'}</Box>
                  </TimelineRow>
                </Fade>
              ))}
              {data && data.recentAttendance.length === 0 && (
                <Box sx={{ p: 6, textAlign: 'center', color: '#94a3b8' }}>
                  <Timeline sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>No attendance records found.</Typography>
                </Box>
              )}
            </ScrollArea>
          </TimelineWrapper>
        </Fade>
      </Section>

      {/* Monthly Summary + Heatmap */}
      <Section>
        <Box sx={{ display: 'grid', gap: 4, gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, 1fr)' } }}>
          <Fade in timeout={1000}>
            <MonthSummaryBox>
              <Typography sx={SectionTitle}>
                <Assessment />
                Monthly Summary
              </Typography>
              {data ? (
                <>
                  <SummaryRow>
                    <Typography sx={{ fontWeight: 700, color: '#475569' }}>Present</Typography>
                    <Chip 
                      size="medium" 
                      label={data.monthSummary.present} 
                      sx={{ 
                        bgcolor: '#10b98115', 
                        color: '#10b981', 
                        fontWeight: 800,
                        border: '2px solid #10b98140',
                      }} 
                    />
                  </SummaryRow>
                  <SummaryRow>
                    <Typography sx={{ fontWeight: 700, color: '#475569' }}>Late</Typography>
                    <Chip 
                      size="medium" 
                      label={data.monthSummary.late} 
                      sx={{ 
                        bgcolor: '#f59e0b15', 
                        color: '#f59e0b', 
                        fontWeight: 800,
                        border: '2px solid #f59e0b40',
                      }} 
                    />
                  </SummaryRow>
                  <SummaryRow>
                    <Typography sx={{ fontWeight: 700, color: '#475569' }}>Absent</Typography>
                    <Chip 
                      size="medium" 
                      label={data.monthSummary.absent} 
                      sx={{ 
                        bgcolor: '#ef444415', 
                        color: '#ef4444', 
                        fontWeight: 800,
                        border: '2px solid #ef444440',
                      }} 
                    />
                  </SummaryRow>
                  <SummaryRow>
                    <Typography sx={{ fontWeight: 700, color: '#475569' }}>Avg Time-In</Typography>
                    <Typography sx={{ fontWeight: 700, color: '#667eea', fontSize: '1.1rem' }}>
                      {data.monthSummary.averageTimeIn || '—'}
                    </Typography>
                  </SummaryRow>
                </>
              ) : (
                Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} height={36} />)
              )}
            </MonthSummaryBox>
          </Fade>

          <Fade in timeout={1200}>
            <HeatmapWrapper>
              <Typography sx={SectionTitle}>
                <CalendarMonth />
                Attendance Heatmap
              </Typography>
              <HeatmapGrid>
                {patchedHeatmap.map(d => {
                  const dd = new Date(d.date).getDate()
                  return (
                    <Tooltip key={d.date} title={`${d.date} • ${d.status}`} arrow>
                      <HeatCell sx={{ background: HeatColor(d.status), color: d.status === '—' ? '#94a3b8' : '#fff' }}>
                        {dd}
                      </HeatCell>
                    </Tooltip>
                  )
                })}
                {!data && Array.from({ length: 35 }).map((_, i) => (
                  <HeatCell key={i} sx={{ background: '#f1f5f9' }} />
                ))}
              </HeatmapGrid>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
                {[
                  { label: 'Present', color: '#10b981' },
                  { label: 'Late', color: '#f59e0b' },
                  { label: 'Absent', color: '#ef4444' },
                ].map(s => (
                  <Box key={s.label} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ 
                      width: 20, 
                      height: 20, 
                      borderRadius: 1.5, 
                      background: `linear-gradient(135deg, ${s.color} 0%, ${s.color}dd 100%)`,
                      boxShadow: `0 4px 12px ${s.color}40`,
                    }} />
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#475569' }}>{s.label}</Typography>
                  </Box>
                ))}
              </Box>
            </HeatmapWrapper>
          </Fade>
        </Box>
      </Section>

      {/* Insights & Comparisons */}
      <Section>
        <Box sx={{ display: 'grid', gap: 4, gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, 1fr)' } }}>
          <Fade in timeout={1400}>
            <InsightsBox>
              <Typography sx={SectionTitle}>
                <InsightsIcon />
                 Insights
              </Typography>
              {data?.insights.length ? data.insights.map((i, idx) => (
                <Fade in key={idx} timeout={600 + idx * 100}>
                  <Box
                    sx={{
                      fontSize: 14,
                      padding: '16px 20px',
                      borderRadius: 3,
                      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                      border: '2px solid #e2e8f0',
                      lineHeight: 1.6,
                      fontWeight: 500,
                      color: '#475569',
                      position: 'relative',
                      pl: 5,
                      '&::before': {
                        content: '"💡"',
                        position: 'absolute',
                        left: 16,
                        fontSize: 18,
                      },
                    }}
                  >
                    {i}
                  </Box>
                </Fade>
              )) : <Typography variant="body2" sx={{ color: '#94a3b8', fontStyle: 'italic' }}>No insights available yet.</Typography>}
            </InsightsBox>
          </Fade>

          <Fade in timeout={1600}>
            <ComparisonBox>
              <Typography sx={SectionTitle}>
                <TrendingUp />
                Month Comparison
              </Typography>
              <ComparisonRow sx={{ fontWeight: 800, color: '#475569', borderBottom: '2px solid #e2e8f0', pb: 2 }}>
                <Box>Metric</Box>
                <Box>Previous</Box>
                <Box>Current</Box>
                <Box>Trend</Box>
              </ComparisonRow>
              {data && Object.entries(data.comparisons).map(([key, val]) => {
                const diff = val.current - val.previous
                const improved = (key === 'absent' || key === 'late') ? diff < 0 : diff > 0
                return (
                  <Fade in key={key} timeout={800}>
                    <ComparisonRow>
                      <Box sx={{ textTransform: 'capitalize', fontWeight: 700, color: '#475569' }}>{key}</Box>
                      <Box sx={{ fontWeight: 600 }}>{val.previous}</Box>
                      <Box sx={{ fontWeight: 600 }}>{val.current}</Box>
                      <Box>
                        <Chip
                          size="small"
                          label={diff === 0 ? 'No change' : (improved ? '↑ Improved' : '↓ Worse')}
                          sx={{
                            fontWeight: 700,
                            bgcolor: diff === 0 ? '#f1f5f9' : (improved ? '#10b98115' : '#ef444415'),
                            color: diff === 0 ? '#64748b' : (improved ? '#10b981' : '#ef4444'),
                            border: `2px solid ${diff === 0 ? '#e2e8f0' : (improved ? '#10b98140' : '#ef444440')}`,
                          }}
                        />
                      </Box>
                    </ComparisonRow>
                  </Fade>
                )
              })}
              {!data && Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} height={40} />)}
            </ComparisonBox>
          </Fade>
        </Box>
      </Section>
    </ReportContainer>
  )
}