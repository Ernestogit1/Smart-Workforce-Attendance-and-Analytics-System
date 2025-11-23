import { Card, CardContent, Typography, Stack, Box, CircularProgress } from '@mui/material'

type Props = { score: number }

function colorFor(score: number) {
  if (score >= 80) return { color: '#16a34a', bg: '#ecfdf5' }
  if (score >= 60) return { color: '#ca8a04', bg: '#fffbeb' }
  return { color: '#dc2626', bg: '#fef2f2' }
}

export default function HealthScore({ score }: Props) {
  const s = Math.max(0, Math.min(100, Math.round(score || 0)))
  const { color, bg } = colorFor(s)
  return (
    <Card>
      <CardContent>
        <Stack direction="row" alignItems="center" spacing={3}>
          <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress variant="determinate" value={100} sx={{ color: '#e5e7eb' }} size={110} thickness={5} />
            <CircularProgress
              variant="determinate"
              value={s}
              size={110}
              thickness={5}
              sx={{ position: 'absolute', left: 0, top: 0, color }}
            />
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                backgroundColor: bg,
              }}
            >
              <Typography variant="h5" fontWeight={900} sx={{ color }}>{s}</Typography>
            </Box>
          </Box>
          <Box>
            <Typography variant="h6" fontWeight={800}>Attendance Health Score</Typography>
            <Typography variant="body2" color="text.secondary">
              Based on lateness frequency, absences, and leave usage
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  )
}