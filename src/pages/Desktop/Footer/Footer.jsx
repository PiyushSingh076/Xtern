import { Box, Container, Grid, Typography, Link as MuiLink, styled } from '@mui/material';
import { Facebook, Twitter, LinkedIn, Instagram, YouTube } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const footerLinks = [
  {
    title: "About Us",
    links: [
      { name: "Our Story", to: "/our-story" },
      { name: "Careers", to: "/careers" },
    ]
  },
  {
    title: "Services",
    links: [
      { name: "Hire an Xpert", to: "/hire" },
      { name: "Become an Xpert", to: "/become-xpert" },
    ]
  },
  {
    title: "Support",
    links: [
      { name: "Help Center", to: "/help" },
      { name: "Contact Us", to: "/contact" },
      { name: "Privacy Policy", to: "/privacy" },
      { name: "Terms & Conditions", to: "/terms" },
    ]
  },
  {
    title: "Quick Links",
    links: [
      { name: "Home", to: "/" },
      { name: "Sign Up / Login", to: "/login" },
      { name: "Dashboard", to: "/dashboard" },
    ]
  }
];

const socialLinks = [
  { name: "LinkedIn", icon: LinkedIn, href: "#" },
  { name: "Twitter", icon: Twitter, href: "#" },
  { name: "Facebook", icon: Facebook, href: "#" },
  { name: "Instagram", icon: Instagram, href: "#" },
  { name: "YouTube", icon: YouTube, href: "#" },
];

const StyledFooter = styled('footer')(({ theme }) => ({
  backgroundColor: '#0F1729',
  color: theme.palette.grey[300],
  padding: theme.spacing(4, 0),
}));

const SocialIcon = styled(MuiLink)(({ theme }) => ({
  color: theme.palette.grey[400],
  padding: theme.spacing(1),
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '&:hover': {
    color: theme.palette.common.white,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    transform: 'translateY(-2px)',
  },
  transition: 'all 200ms',
}));

const FooterLink = styled(Link)(({ theme }) => ({
  color: theme.palette.grey[300],
  fontSize: '1rem',
  textDecoration: 'none',
  position: 'relative',
  '&:hover': {
    color: theme.palette.common.white,
    '&::after': {
      width: '100%',
    }
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -2,
    left: 0,
    width: 0,
    height: '2px',
    backgroundColor: theme.palette.common.white,
    transition: 'width 200ms ease',
  }
}));

export default function Footer() {
  return (
    <StyledFooter>
      <Container maxWidth="lg" sx={{ px: 2 }}>
        {/* Logo */}
        <Box mb={4}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <Typography
              component="h2"
              sx={{
                color: 'white',
                fontWeight: 'bold',
                '&:hover': { 
                  color: 'grey.200',
                  transform: 'scale(1.05)',
                },
                transition: 'all 200ms',
                display: 'inline-block',
              }}
            >
              <Box component="span" sx={{ fontSize: '3.5rem' }}>x</Box>
              <Box component="span" sx={{ fontSize: '2.2rem' }}>pert</Box>
            </Typography>
          </Link>
        </Box>

        <Grid container spacing={4} mb={4}>
          {footerLinks.map((section) => (
            <Grid item xs={6} md={4} lg={2} key={section.title}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography
                  variant="h6"
                  sx={{
                    color: 'white',
                    fontWeight: 600,
                    letterSpacing: '0.05em',
                    fontSize: '1.2rem',
                  }}
                >
                  {section.title}
                </Typography>
                <Box component="ul" sx={{ m: 0, p: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <FooterLink to={link.to}>
                        {link.name}
                      </FooterLink>
                    </li>
                  ))}
                </Box>
              </Box>
            </Grid>
          ))}

          {/* Connect Section */}
          <Grid item xs={6} md={4} lg={2}>
            <Box sx={{  display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography
                variant="h6"
                sx={{
                  color: 'white',
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                  fontSize: '1.2rem',
                }}
              >
                Connect
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {socialLinks.map((social) => (
                  <SocialIcon
                    key={social.name}
                    href={social.href}
                    aria-label={social.name}
                  >
                    <social.icon sx={{ width: 24, height: 24 }} />
                  </SocialIcon>
                ))}
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Copyright */}
        <Box
          sx={{
            pt: 4,
            borderTop: 1,
            borderColor: 'grey.800',
            textAlign: 'center',
          }}
        >
          <Typography variant="body2" sx={{ color: 'grey.400', fontSize: '0.95rem' }}>
            © {new Date().getFullYear()} Xpert. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </StyledFooter>
  );
}








// import React from 'react';
// import './Footer.css';

// const option = [
//   { "Categories": ["Engineering Manager", "Technology & Programming", "Design", "Project management", "Cloud Devops"] },
//   { "About": ["About us", "Career", "Blogs", "FAQ's", "Contact us"] },
//   { "Services": ["Services", "Projects", "Jobs", "Xterns", "XPerts"] },
//   { "Support": ["Privacy Policy", "Terms of Use", "Help center", "Updates", "Documentation"] },
//   { "Connect": ["Linkedin", "Twitter", "Facebook", "Instagram", "Youtube"] }
// ];

// export default function Footer() {
//   return (
//     <div className='footer-container'>
//       <div className='footer-list-options'>
//         {option.map((item, index) => {
//           const [key, values] = Object.entries(item)[0]; // Get the key and value array from the object
//           return (
//             <div key={index} className='footer-section'>
//               <h4>{key}</h4>
             
//                 {values.map((category, catIndex) => (
//                  <div className='options'>
//                      <span key={catIndex}>{category}</span>
//                  </div>
//                 ))}
             
//             </div>
//           );
//         })}
//       </div>
      
//       <div className='copyright-container'>
//         <span>Xpert</span>
//         <span>© 2024 Xpert. All Rights Reserved.</span>
//       </div>
//     </div>
//   );
// }