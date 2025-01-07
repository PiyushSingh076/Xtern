import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Paper, 
  Grid, 
  Chip,
  Button,
  Box,
  Skeleton,
} from '@mui/material';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Work, LocationOn, Business, Assessment, Schedule, CalendarToday } from '@mui/icons-material';

const SingleJob = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJob = async () => {
      if (!jobId) return;

      try {
        const jobDoc = await getDoc(doc(db, 'jobPosting', jobId));
        if (jobDoc.exists()) {
          setJob(jobDoc.data());
        } else {
          console.log('No such job!');
        }
      } catch (error) {
        console.error('Error fetching job:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId]);

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Skeleton variant="rectangular" width="100%" height={200} />
        <Skeleton variant="text" sx={{ mt: 2 }} />
        <Skeleton variant="text" />
        <Skeleton variant="text" />
      </Container>
    );
  }

  if (!job) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4">Job not found</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Typography variant="h4" gutterBottom>{job.title}</Typography>
            <Typography variant="h6" color="textSecondary" gutterBottom>
              <Business sx={{ mr: 1, verticalAlign: 'middle' }} />
              {job.companyName}
            </Typography>
            <Typography variant="body1" color="textSecondary" gutterBottom>
              <LocationOn sx={{ mr: 1, verticalAlign: 'middle' }} />
              {job.location}
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box
              component="img"
              sx={{
                width: '100%',
                height: 'auto',
                maxHeight: 200,
                objectFit: 'contain',
              }}
              alt={job.title}
              src={job.image || '/placeholder.png'}
            />
          </Grid>
        </Grid>

        <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>Job Description</Typography>
        <Typography variant="body1" paragraph>{job.description}</Typography>

        <Typography variant="h6" gutterBottom>Required Skills</Typography>
        <Box sx={{ mb: 2 }}>
          {job.skills.map((skill, index) => (
            <Chip key={index} label={skill} sx={{ mr: 1, mb: 1 }} />
          ))}
        </Box>

        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">
              <Work sx={{ mr: 1, verticalAlign: 'middle' }} />
              Experience: {job.experienceLevel}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">
              <Schedule sx={{ mr: 1, verticalAlign: 'middle' }} />
              Duration: {job.duration}
            </Typography>
          </Grid>
        </Grid>

        <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>Assessment Details</Typography>
        <Typography variant="body1" paragraph>{job.assessmentDetail}</Typography>

        <Typography variant="body1">
          <Assessment sx={{ mr: 1, verticalAlign: 'middle' }} />
          Assessment Duration: {job.assessmentDuration}
        </Typography>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
          <Button variant="outlined" onClick={() => navigate('/jobs')}>
            Back to Jobs
          </Button>
          <Button variant="contained" color="primary" onClick={() => navigate(`/applyjob/${jobId}`)}>
            Apply Now
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default SingleJob;
