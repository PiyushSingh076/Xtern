import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, Typography, TextField, Grid, Card, CardContent, CardMedia, Button,
  FormControl, InputLabel, Select, MenuItem, Box, styled, keyframes, Skeleton
} from '@mui/material';
import { collection, query, getDocs, doc, getDoc } from 'firebase/firestore';
import Layout from '../components/SEO/Layout';
import { db } from '../firebaseConfig';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Api } from '@mui/icons-material';

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const StyledCard = styled(Card)({
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  border: '1px solid #eaeaea',
  borderRadius: '12px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
  },
});

const StyledCardMedia = styled(CardMedia)({
  height: 140,
  transition: 'transform 0.3s ease-in-out',
  '&:hover': { transform: 'scale(1.05)' },
});

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [userRole, setUserRole] = useState('');
  const [loading, setLoading] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      const q = query(collection(db, 'jobPosting'));
      const querySnapshot = await getDocs(q);
      const jobsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setJobs(jobsData);
      setFilteredJobs(jobsData);
      setLoading(false);
    };

    fetchJobs();

    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const role = userData.typeUser || 'all';
          setUserRole(role);
          setFilter(role); 
        }
      }
    });
  }, []);

  useEffect(() => {
    const filtered = jobs.filter(job => 
      job.title?.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filter === 'all' || (job.skills || []).includes(filter))
    );
    setFilteredJobs(filtered);
  }, [searchTerm, filter, jobs]);

  const handleImageLoad = (jobId) => {
    setImagesLoaded((prev) => ({ ...prev, [jobId]: true }));
  };

  return (
   <>
   <Layout 
         title={"Job"}
         description={"Find and Apply for Internships and Job Opportunities"}
         keywords={"Jobs, Internships, Career, Employment, Hiring, Work Opportunitie"}/>
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4, pt: 3, pb: 6, backgroundColor: '#fafafa', borderRadius: '16px' }}>
      <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold', color: '#1a1a1a', mb: 4, mt: 2 }}>
        Job Listings
      </Typography>

      <Box sx={{ mb: 4, display: 'flex', gap: 2, backgroundColor: 'white', p: 3, borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <TextField
          label="Search Jobs"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ flexGrow: 1 }}
        />
        <FormControl variant="outlined" sx={{ minWidth: 200 }}>
          <InputLabel>Filter by Role</InputLabel>
          <Select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            label="Filter by Role"
          >
            <MenuItem value="all">All Roles</MenuItem>
            <MenuItem value="developer">Developer</MenuItem>
            <MenuItem value="designer">Designer</MenuItem>
            <MenuItem value="intern">Intern</MenuItem>
            <MenuItem value="lawyer">Lawyer</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {loading
          ? Array.from(new Array(6)).map((_, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <StyledCard>
                  <Skeleton variant="rectangular" width="100%" height={140} />
                  <CardContent sx={{ p: 2.5 }}>
                    <Skeleton variant="text" width="80%" height={24} />
                    <Skeleton variant="text" width="60%" height={20} sx={{ mt: 1 }} />
                    <Skeleton variant="rectangular" width="100%" height={36} sx={{ mt: 2, borderRadius: '20px' }} />
                  </CardContent>
                </StyledCard>
              </Grid>
            ))
          : filteredJobs.map((job) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={job.id}>
                <StyledCard>
                  <Box sx={{ position: 'relative', width: '100%', height: 140 }}>
                    {!imagesLoaded[job.id] && <Skeleton variant="rectangular" width="100%" height={140} />}
                    <StyledCardMedia
                      component="img"
                      image={job.image || '/placeholder.png'}
                      alt={job.title}
                      onLoad={() => handleImageLoad(job.id)}
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        opacity: imagesLoaded[job.id] ? 1 : 0,
                        transition: 'opacity 0.3s ease-in-out',
                      }}
                    />
                  </Box>
                  <CardContent sx={{ p: 2.5 }}>
                    <Typography gutterBottom variant="h6" component="div" noWrap>
                      {job.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {job.companyName} - {job.location}
                    </Typography>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      fullWidth
                      sx={{ 
                        mt: 2,
                        borderRadius: '20px',
                        textTransform: 'none',
                        padding: '6px 16px',
                        fontSize: '0.875rem',
                        boxShadow: 'none',
                        '&:hover': {
                          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                        }
                      }}
                      onClick={() => navigate(`/jobs/${job.id}`)}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </StyledCard>
              </Grid>
            ))}
      </Grid>
    </Container>
    </>
    
  );
};

export default Jobs;
