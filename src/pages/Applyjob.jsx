import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useFetchUserData from '../hooks/Auth/useFetchUserData';
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Box,
  Chip,
  CircularProgress,
  styled,
  Alert,
} from '@mui/material';
import { Link as MuiLink, Description, GitHub, VideoCall, ArrowBack } from '@mui/icons-material';
import { collection, doc, getDoc, addDoc, serverTimestamp, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { getAuth } from 'firebase/auth';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  background: '#fff',
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  backgroundColor: '#f5f5f5',
  borderRadius: '4px',
}));

const ApplyJob = () => {
  const [jobData, setJobData] = useState(null);
  const [deploymentUrl, setDeploymentUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [videoDemoUrl, setVideoDemoUrl] = useState('');
  const [description, setDescription] = useState('');
  const [formError, setFormError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const { userData } = useFetchUserData();


  const navigate = useNavigate();
  const { jobId } = useParams();
  const auth = getAuth();

  useEffect(() => {
    const fetchJobData = async () => {
      try {
        const jobDoc = await getDoc(doc(collection(db, 'jobPosting'), jobId));
        if (jobDoc.exists()) {
          setJobData(jobDoc.data());
        } else {
          setFormError('Job not found');
        }
      } catch (error) {
        console.error('Error fetching job data:', error);
        setFormError('Error loading job data');
      } finally {
        setLoading(false);
      }
    };

    fetchJobData();
  }, [jobId]);

  const validateUrl = (url) => {
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    return urlPattern.test(url);
  };

  const validateGithubUrl = (url) => {
    const githubPattern = /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+$/;
    return githubPattern.test(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);

    try {
        if (!deploymentUrl) throw new Error('Please fill in the Deployment URL');
        if (!githubUrl) throw new Error('Please fill in the GitHub Repository URL');
        if (!videoDemoUrl) throw new Error('Please fill in the Video Demo URL');
        if (!description.trim()) throw new Error('Please provide a project description');

      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('You must be logged in to apply');
      }

      // Get user details
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      if (!userDoc.exists()) {
        throw new Error('User profile not found');
      }
      const userData = userDoc.data();

      // Create application document
      const applicationData = {
        jobId,
        jobTitle: jobData.title,
        companyName: jobData.companyName,
        applicantId: currentUser.uid,
        name: userData.firstName,
        // applicantName: userData.name || currentUser.displayName,
        // applicantEmail: currentUser.email,
        deploymentUrl,
        githubUrl,
        videoDemoUrl,
        description,
        status: 'pending',
        appliedAt: serverTimestamp(),
        // Include any relevant job or applicant details
        // applicantDetails: {
        //   phoneNumber: userData.phoneNumber,
        //   typeUser: userData.typeUser,
        //   // Add any other relevant user details
        // },
        // jobDetails: {
        //   jobId,
        //   title: jobData.title,
        //   companyName: jobData.companyName,
        //   // Add any other relevant job details you want to store
        // }
      };

      // Add to appliedJobs collection
      const applicationRef = await addDoc(collection(db, 'RealWorldSubmissions'), applicationData);
      const jobRef = await getDoc(doc(collection(db, 'jobPosting'), jobId));
      await updateDoc(jobRef.ref, { applicants: arrayUnion(applicationRef.id) });

      setSubmitSuccess(true);
      // Navigate after successful submission
      setTimeout(() => {
        navigate('/jobs');
      }, 2000);

    } catch (error) {
      console.error('Application submission error:', error);
      setFormError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (submitSuccess) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Alert severity="success" sx={{ mb: 2 }}>
          Your application has been submitted successfully!
        </Alert>
        <Typography align="center">
          Redirecting to your Jobs...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button 
        onClick={() => navigate(-1)} 
        startIcon={<ArrowBack />} 
        sx={{ 
          mb: 3,
          color: '#0066CC',
          '&:hover': {
            backgroundColor: 'rgba(0, 102, 204, 0.04)'
          }
        }}
      >
        BACK TO JOB DETAILS
      </Button>

      <Typography variant="h5" align="center" gutterBottom sx={{ mb: 4 }}>
        Apply for {jobData?.title}
      </Typography>

      <StyledPaper>
        <Grid container spacing={4}>
          {/* Left Section */}
          <Grid item xs={12} md={4}>
            <Box>
              <Box
                component="img"
                src={jobData?.image || '/placeholder.png'}
                alt={jobData?.title}
                sx={{
                  width: '100%',
                  height: 200,
                  objectFit: 'cover',
                  borderRadius: 1,
                  mb: 2
                }}
              />
              <Typography variant="h5" gutterBottom>
                {jobData?.title}
              </Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                {jobData?.companyName}
              </Typography>
              <Box my={2}>
                {jobData?.skills.map((skill, index) => (
                  <StyledChip key={index} label={skill} />
                ))}
              </Box>
            </Box>
          </Grid>

          {/* Right Section */}
          <Grid item xs={12} md={8}>
            <Typography variant="h5" gutterBottom>
              Application Steps
            </Typography>
            
            <Box mb={4}>
              <Typography variant="body1" paragraph>
                1. Enter the <strong>Deployment Link</strong> for your completed project.
              </Typography>
              <Typography variant="body1" paragraph>
                2. Provide the <strong>GitHub Repository URL</strong> with your project code.
              </Typography>
              <Typography variant="body1" paragraph>
                3. Upload a <strong>Video Demo</strong> showcasing your project and enter the URL.
              </Typography>
              <Typography variant="body1" paragraph>
                4. Add a brief description of your project and implementation.
              </Typography>
            </Box>

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                margin="normal"
                label="Deployment Link"
                value={deploymentUrl}
                onChange={(e) => setDeploymentUrl(e.target.value)}
                InputProps={{
                  startAdornment: <MuiLink sx={{ mr: 1 }} />,
                }}
                required
                disabled={submitting}
              />
              <TextField
                fullWidth
                margin="normal"
                label="GitHub Repository URL"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                InputProps={{
                  startAdornment: <GitHub sx={{ mr: 1 }} />,
                }}
                required
                disabled={submitting}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Video Demo URL"
                value={videoDemoUrl}
                onChange={(e) => setVideoDemoUrl(e.target.value)}
                InputProps={{
                  startAdornment: <VideoCall sx={{ mr: 1 }} />,
                }}
                required
                disabled={submitting}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Project Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                multiline
                rows={4}
                required
                disabled={submitting}
              />
              {formError && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {formError}
                </Alert>
              )}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={submitting}
                sx={{ 
                  mt: 3,
                  bgcolor: '#0066CC',
                  '&:hover': {
                    bgcolor: '#0052A3'
                  }
                }}
              >
                {submitting ? 'Submitting...' : 'Submit Application'}
              </Button>
            </form>
          </Grid>
        </Grid>
      </StyledPaper>
    </Container>
  );
};

export default ApplyJob;

