import { Typography, Box } from '@mui/material'
import { 
  DashboardContainer, 
  WelcomeCard, 
  StatsGrid, 
  StatCard,
  IconContainer 
} from '../../styles/dashboard.styles'
import { People, Assignment, CheckCircle, TrendingUp } from '@mui/icons-material'

export default function Dashboard() {
  const stats = [
    { 
      label: 'Total Employees', 
      value: '48', 
      icon: <People sx={{ fontSize: 32 }} />,
      colorClass: 'primary'
    },
    { 
      label: 'Active Tasks', 
      value: '12', 
      icon: <Assignment sx={{ fontSize: 32 }} />,
      colorClass: 'info'
    },
    { 
      label: 'Completed', 
      value: '86', 
      icon: <CheckCircle sx={{ fontSize: 32 }} />,
      colorClass: 'success'
    },
    { 
      label: 'Growth', 
      value: '+24%', 
      icon: <TrendingUp sx={{ fontSize: 32 }} />,
      colorClass: 'warning'
    },
  ]

  return (
    <DashboardContainer>
      <WelcomeCard elevation={0}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Welcome Back, Admin
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.95, maxWidth: 600 }}>
          Here's what's happening with your organization today. Check your progress and manage ongoing tasks.
        </Typography>
      </WelcomeCard>

      <StatsGrid>
        {stats.map((stat) => (
          <StatCard key={stat.label} elevation={0}>
            <IconContainer className={stat.colorClass}>
              {stat.icon}
            </IconContainer>
            <Typography variant="h3" fontWeight={700} sx={{ my: 0.5, fontSize: '2rem' }}>
              {stat.value}
            </Typography>
            <Typography variant="body2" color="text.secondary" fontWeight={500}>
              {stat.label}
            </Typography>
          </StatCard>
        ))}
      </StatsGrid>
    </DashboardContainer>
  )
}