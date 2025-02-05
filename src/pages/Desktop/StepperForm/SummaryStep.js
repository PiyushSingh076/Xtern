
import React, { useState } from 'react'
import {
  Grid,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Avatar,
  Divider,
  Box,
  Button,
  Rating,
  Container,
  Stack,
  Chip,
  Tooltip,
  IconButton,
  Snackbar
} from '@mui/material'
import { styled } from '@mui/material/styles'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium'
import ShareIcon from '@mui/icons-material/Share'
import BadgeModal from './Badge-modal'
import { getAuth } from "firebase/auth"; // Import Firebase Auth
import { getFirestore, doc, getDoc } from "firebase/firestore"; // Import Firestore

const StyledCard = styled(Card)(({ theme }) => ({
  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
  border: '1px solid rgba(0, 0, 0, 0.1)',
  borderRadius: theme.shape.borderRadius,
  height: '100%',
}));

const StyledCardHeader = styled(CardHeader)(({ theme }) => ({
  backgroundColor: theme.palette.grey[50],
  padding: theme.spacing(1.5),
  '& .MuiCardHeader-title': {
    fontSize: '1.1rem',
    fontWeight: 600
  }
}))

const CompactCardContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(2),
  '&:last-child': {
    paddingBottom: theme.spacing(2)
  }
}))

const ShareButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(1),
  right: theme.spacing(1),
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const SummaryStep = ({
  FirstName,
  LastName,
  Xpert,
  Experience,
  profileImg,
  selectedCity,
  selectedState,
  Badges = [],
  Education = [],
  Work = [],
  Skills = [],
  Projects = [],
  Services = [],
  ConsultingPrice,
}) => {
  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState(false)
  const [earnedBadges, setEarnedBadges] = useState([])
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false)

  const handleEarnBadge = (badgeId) => {
    setEarnedBadges([...earnedBadges, badgeId])
  }

  const handleShareProfile = async () => {
    try {
      const auth = getAuth(); // Initialize Firebase Auth
      const user = auth.currentUser; // Get the logged-in user
  
      if (!user) {
        console.error("No user is logged in");
        return;
      }
  
      const userId = user.uid; // Get the user's unique ID
  
      // Optionally, fetch additional profile data from Firestore if needed
      const db = getFirestore();
      const userDocRef = doc(db, "users", userId);
      const userDoc = await getDoc(userDocRef);
  
      if (userDoc.exists()) {
        const userData = userDoc.data(); // Get user data from Firestore
      }
  
      const shareableLink = `https://xpert.works/profile/${userId}`;
      await navigator.clipboard.writeText(shareableLink);
  
      setIsSnackbarOpen(true); // Notify the user that the link was copied
    } catch (error) {
      console.error("Error generating shareable link:", error);
    }
  };

  return (
    <Container maxWidth={false} sx={{ py: 2, px: 0 }}>
      <Grid container spacing={2}>
        {/* Left Column - Profile Summary */}
        <Grid item xs={12} md={3}>
          <StyledCard>
            <CompactCardContent>
              <Box position="relative">
                <Tooltip title="Share Profile">
                  <ShareButton onClick={handleShareProfile}>
                    <ShareIcon />
                  </ShareButton>
                </Tooltip>
                <Stack spacing={2} alignItems="center">
                  <Avatar
                     src={
                      profileImg
                        ? profileImg
                        : "https://static.vecteezy.com/system/resources/previews/020/213/738/non_2x/add-profile-picture-icon-upload-photo-of-social-media-user-vector.jpg"
                    }
                    sx={{
                      width: 150,
                      height: 150,
                    }}
                  />
                  <Stack spacing={0.5} alignItems="center">
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                      {FirstName} {LastName}
                    </Typography>
                    <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 500 }}>
                      {Xpert}
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <LocationOnIcon color="action" fontSize="small" />
                      <Typography variant="body2" color="text.secondary">
                        {selectedCity}, {selectedState}
                      </Typography>
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                      {Experience} {parseInt(Experience) === 1 ? 'Year' : 'Years'} of Experience
                    </Typography>
                    {ConsultingPrice && (
                      <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 1 }}>
                        <AttachMoneyIcon color="success" fontSize="small" />
                        <Typography color="success.main" variant="body2" sx={{ fontWeight: 500 }}>
                          Consulting Rate: ₹{ConsultingPrice}/min
                        </Typography>
                      </Stack>
                    )}
                  </Stack>
                </Stack>
              </Box>
            </CompactCardContent>
          </StyledCard>
        </Grid>

        {/* Right Column - Detailed Information */}
        <Grid item xs={12} md={9}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Stack spacing={2}>
                {/* Skills Section */}
                <StyledCard>
                  <StyledCardHeader title="Skills" />
                  <Divider />
                  <CompactCardContent>
                    <Grid container spacing={1}>
                      {Skills.map((skill, index) => (
                        <Grid item xs={6} key={index}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2">{skill.skill}</Typography>
                            <Rating value={skill.skillRating} readOnly size="small" />
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </CompactCardContent>
                </StyledCard>

                {/* Badges Section */}
                <StyledCard>
                  <StyledCardHeader title="Badges" />
                  <Divider />
                  <CompactCardContent>
                    <Box
                      sx={{
                        backgroundColor: 'rgba(25, 118, 210, 0.1)', // Light blue tint for highlighting
                        border: '1px solid',
                        borderColor: 'primary.light',
                        borderRadius: 2,
                        padding: 2,
                        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)', // Subtle shadow
                      }}
                    >
                      {Badges.length > 0 ? (
                        <Grid container spacing={1}>
                          {Badges.map((badge, index) => (
                            <Grid item key={index}>
                              <Chip
                                label={badge.name}
                                color={badge.color}
                                size="medium"
                                icon={<WorkspacePremiumIcon />}
                              />
                            </Grid>
                          ))}
                        </Grid>
                      ) : (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          You haven't earned any badges yet. Start achieving milestones to unlock badges!
                        </Typography>
                      )}
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        sx={{
                          mt: 2,
                          textTransform: 'none',
                        }}
                        onClick={() => setIsBadgeModalOpen(true)}
                      >
                        Earn More Badges
                      </Button>
                    </Box>
                  </CompactCardContent>
                </StyledCard>

              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack spacing={2}>
                {/* Education Section */}
                <StyledCard>
                  <StyledCardHeader title="Education" />
                  <Divider />
                  <CompactCardContent>
                    <Stack spacing={1}>
                      {Education.map((edu, index) => (
                        <Box key={index}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            {edu.degree} in {edu.stream}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {edu.college} | {edu.startDate} - {edu.endDate} | CGPA: {edu.cgpa}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  </CompactCardContent>
                </StyledCard>

                {/* Work Experience Section */}
                <StyledCard>
                  <StyledCardHeader title="Work Experience" />
                  <Divider />
                  <CompactCardContent>
                    <Stack spacing={1}>
                      {Work.map((work, index) => (
                        <Box key={index}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            {work.position} at {work.company}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {work.startDate} - {work.endDate}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  </CompactCardContent>
                </StyledCard>
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <StyledCard>
                    <StyledCardHeader title="Projects" />
                    <Divider />
                    <CompactCardContent>
                      <Stack spacing={1}>
                        {Projects.map((project, index) => (
                          <Box key={index}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                              {project.projectName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {project.duration} | {project.liveLink && (
                                <a href={project.liveLink} target="_blank" rel="noopener noreferrer">
                                  Live Link
                                </a>
                              )}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              <div dangerouslySetInnerHTML={{ __html: project.description}} ></div>
                            </Typography>
                          </Box>
                        ))}
                      </Stack>
                    </CompactCardContent>
                  </StyledCard>
                </Grid>
                <Grid item xs={12} md={6}>
                  <StyledCard>
                    <StyledCardHeader title="Services" />
                    <Divider />
                    <CompactCardContent>
                      <Stack spacing={1}>
                        {Services.map((service, index) => (
                          <Box key={index}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                              {service.serviceName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                            <div dangerouslySetInnerHTML={{ __html: service.serviceDescription}} ></div>
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Price: ₹{service.servicePrice} | Timeline: {service.duration} {service.durationType}
                            </Typography>
                          </Box>
                        ))}
                      </Stack>
                    </CompactCardContent>
                  </StyledCard>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <BadgeModal
        open={isBadgeModalOpen}
        onClose={() => setIsBadgeModalOpen(false)}
        earnedBadges={earnedBadges}
        onEarnBadge={handleEarnBadge}
      />
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={isSnackbarOpen}
        autoHideDuration={3000}
        onClose={() => setIsSnackbarOpen(false)}
        message="Profile link copied to clipboard!"
      />
    </Container>
  )
}

export default SummaryStep

