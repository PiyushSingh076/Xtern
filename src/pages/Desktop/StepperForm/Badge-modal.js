import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Box,
  IconButton,
  Divider,
  styled
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import StarIcon from '@mui/icons-material/Star';
import TimerIcon from '@mui/icons-material/Timer';
import BuildIcon from '@mui/icons-material/Build';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BadgeAssignment from './Badge-assignment';

const StyledDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialog-paper': {
      zIndex: theme.zIndex.modal + 2, // Ensure it's above the navbar
      marginTop: theme.spacing(15), // Push modal below the navbar
      maxHeight: '80vh', // Set a fixed maximum height
      overflowY: 'auto', // Enable vertical scrolling if content overflows
      width: '90%', // Default width for small screens
      [theme.breakpoints.up('sm')]: {
        width: '70%', // Adjust width for small to medium screens
      },
      [theme.breakpoints.up('md')]: {
        width: '60%', // Adjust width for medium to larger screens
      },
      [theme.breakpoints.up('lg')]: {
        width: '50%', // Keep width smaller on very large screens
      },
    },
  }));
  
  
  

// Dummy badge assignments data
const badgeAssignments = [
  {
    id: 1,
    name: 'Top Rated',
    description: 'Awarded to experts with consistently high ratings and positive client feedback.',
    color: 'success',
    completed: false,
    assignment: {
      question: "What's the key to maintaining a high rating?",
      options: [
        "Ignoring client feedback",
        "Providing exceptional service",
        "Charging high prices",
        "Working as fast as possible"
      ],
      correctAnswer: 1
    }
  },
  {
    id: 2,
    name: 'Quick Responder',
    description: 'Respond promptly to client queries and messages. To earn this badge, maintain an average response time of under 2 hours consistently for 30 days.',
    color: 'primary',
    completed: false,
    assignment: {
      question: "What's an effective way to improve response time?",
      options: [
        "Turn off all notifications",
        "Respond only to urgent messages",
        "Set up auto-responders",
        "Use mobile app for quick replies"
      ],
      correctAnswer: 3
    }
  },
  {
    id: 3,
    name: 'Problem Solver',
    description: "Demonstrate your ability to resolve client issues effectively. This badge is awarded when you receive 20 'Solution Accepted' marks from clients, showcasing your problem-solving expertise.",
    color: 'secondary',
    icon: <BuildIcon />,
    assignment: {
      question: "What's crucial for effective problem-solving?",
      options: [
        "Always providing the quickest solution",
        "Ignoring client's specific needs",
        "Understanding the problem thoroughly",
        "Using complex technical jargon"
      ],
      correctAnswer: 2
    }
  },
 
];

export default function BadgeModal({ open, onClose, earnedBadges, onEarnBadge }) {
  const [selectedBadge, setSelectedBadge] = useState(null);

  const handleBadgeClick = (badgeId) => {
    setSelectedBadge(badgeId);
  };

  const handleCloseAssignment = () => {
    setSelectedBadge(null);
  };

  const handleEarnBadge = (badgeId) => {
    onEarnBadge(badgeId);
    setSelectedBadge(null);
  };

  return (
    <StyledDialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">Badge Assignments</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <List>
          {badgeAssignments.map((badge) => (
            <React.Fragment key={badge.id}>
              <ListItem 
                button 
                onClick={() => handleBadgeClick(badge.id)}
                disabled={earnedBadges.includes(badge.id)}
              >
                <ListItemIcon>
                  {earnedBadges.includes(badge.id) ? (
                    <CheckCircleIcon color="success" />
                  ) : (
                    <WorkspacePremiumIcon color={badge.color} />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center" gap={1}>
                      {badge.name}
                      {/* {earnedBadges.includes(badge.id) ? (
                        <Chip label="Completed" size="small" color="success" />
                      ) : (
                        <Chip
                          label={badge.progress}
                          size="small"
                          color={badge.color}
                          variant="outlined"
                        />
                      )} */}
                    </Box>
                  }
                  secondary={badge.description}
                />
              </ListItem>
              <Divider variant="inset" component="li" />
            </React.Fragment>
          ))}
        </List>

        <Box mt={3}>
          <Typography variant="h6" gutterBottom>
            Why Badges Matter?
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Badges showcase your expertise and achievements on the platform. They help build trust with potential clients and demonstrate your commitment to excellence.
          </Typography>
          <Typography variant="subtitle2" gutterBottom>
            Benefits of Earning Badges:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemIcon>
                <StarIcon fontSize="small" color="primary" />
              </ListItemIcon>
              <ListItemText primary="Higher visibility in search results" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <StarIcon fontSize="small" color="primary" />
              </ListItemIcon>
              <ListItemText primary="Increased trust from potential clients" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <StarIcon fontSize="small" color="primary" />
              </ListItemIcon>
              <ListItemText primary="Access to exclusive features and opportunities" />
            </ListItem>
          </List>
        </Box>
      </DialogContent>

      {selectedBadge && (
        <BadgeAssignment
          badge={badgeAssignments.find(b => b.id === selectedBadge)}
          onClose={handleCloseAssignment}
          onEarnBadge={handleEarnBadge}
        />
      )}
    </StyledDialog>
  );
}
