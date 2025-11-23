import { Grid, Card, CardContent, Typography, Stack, Chip, Box } from '@mui/material'
import ThumbUpAlt from '@mui/icons-material/ThumbUpAlt'
import WarningAmber from '@mui/icons-material/WarningAmber'
import Report from '@mui/icons-material/Report'
import Bolt from '@mui/icons-material/Bolt'
import Lightbulb from '@mui/icons-material/Lightbulb'
import type { InsightItem, Severity } from '../../../api/analythicDashboard'

type Props = {
  items: InsightItem[]
}

const bgBySeverity: Record<Severity, { bg: string; fg: string; Icon: any; label: string }> = {
  green:  { bg: '#ecfdf5', fg: '#065f46', Icon: ThumbUpAlt, label: 'Good' },
  yellow: { bg: '#fffbeb', fg: '#92400e', Icon: Lightbulb, label: 'Caution' },
  orange: { bg: '#fff7ed', fg: '#9a3412', Icon: WarningAmber, label: 'Attention' },
  red:    { bg: '#fef2f2', fg: '#991b1b', Icon: Report, label: 'Critical' },
  low:    { bg: '#ecfdf5', fg: '#065f46', Icon: ThumbUpAlt, label: 'Low' },
  medium: { bg: '#fffbeb', fg: '#92400e', Icon: Lightbulb, label: 'Medium' },
  high:   { bg: '#fff7ed', fg: '#9a3412', Icon: WarningAmber, label: 'High' },
  critical: { bg: '#fef2f2', fg: '#991b1b', Icon: Report, label: 'Critical' },
}

export default function InsightCards({ items }: Props) {
  return (
    <Grid container spacing={2}>
      {items.slice(0, 8).map((ins, idx) => {
        const sev = (ins.severity || 'green') as Severity
        const { bg, fg, Icon, label } = bgBySeverity[sev] || bgBySeverity.green
        return (
          <Grid item xs={12} sm={6} md={3} key={`${ins.title}-${idx}`}>
            <Card sx={{ height: '100%', backgroundColor: bg, border: `1px solid ${fg}20` }}>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Icon sx={{ color: fg }} />
                  <Typography variant="subtitle1" fontWeight={800} color={fg}>
                    {ins.title}
                  </Typography>
                </Stack>
                <Typography variant="body2" sx={{ mt: 1, color: fg }}>
                  {ins.detail}
                </Typography>
                <Box sx={{ mt: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip size="small" label={label} sx={{ color: fg, borderColor: `${fg}55` }} variant="outlined" />
                  <Typography variant="caption" sx={{ color: fg, opacity: 0.9 }}>
                    Action: {ins.recommendation}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )
      })}
    </Grid>
  )
}