import { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  TextField, 
  Button, 
  Avatar, 
  Grid, 
  Divider, 
  Alert, 
  CircularProgress,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Chip
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const API_URL = '/api';

const Profile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    language: '',
    profilePicture: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // Language options
  const languages = ['English', 'Hindi', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Marathi', 'Bengali', 'Punjabi', 'Gujarati'];

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        language: user.language || '',
        profilePicture: user.profilePicture || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    
    try {
      setLoading(true);
      await axios.put(`${API_URL}/user/updateprofile`, formData);
      
      setSuccess(true);
      // Scroll to top to show success message
      window.scrollTo(0, 0);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>Loading profile...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          My Profile
        </Typography>
        
        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Profile updated successfully!
          </Alert>
        )}
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Paper sx={{ p: 4 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Avatar
                src={formData.profilePicture}
                alt={user.username}
                sx={{ width: 120, height: 120, mb: 2 }}
              >
                {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
              </Avatar>
              
              <Chip 
                label={user.role.toUpperCase()} 
                color={
                  user.role === 'saathi' ? 'success' : 
                  user.role === 'champion' ? 'primary' :
                  user.role === 'admin' ? 'error' : 'default'
                }
                sx={{ mb: 2 }}
              />
              
              <Typography variant="body2" color="textSecondary">
                User ID: {user._id}
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={8}>
              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  margin="normal"
                  fullWidth
                  id="username"
                  name="username"
                  label="Username"
                  value={formData.username}
                  onChange={handleChange}
                />
                
                <TextField
                  margin="normal"
                  fullWidth
                  id="email"
                  name="email"
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                />
                
                <FormControl fullWidth margin="normal">
                  <InputLabel id="language-label">Preferred Language</InputLabel>
                  <Select
                    labelId="language-label"
                    id="language"
                    name="language"
                    value={formData.language}
                    label="Preferred Language"
                    onChange={handleChange}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {languages.map((lang) => (
                      <MenuItem key={lang} value={lang.toLowerCase()}>
                        {lang}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                <TextField
                  margin="normal"
                  fullWidth
                  id="profilePicture"
                  name="profilePicture"
                  label="Profile Picture URL"
                  value={formData.profilePicture}
                  onChange={handleChange}
                  placeholder="https://example.com/profile-picture.jpg"
                />
                
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{ mt: 3 }}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Update Profile'}
                </Button>
              </Box>
            </Grid>
          </Grid>
          
          <Divider sx={{ my: 4 }} />
          
          <Box>
            <Typography variant="h6" gutterBottom>
              Account Information
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="textSecondary">
                  <strong>Account Type:</strong> {user.authSource || 'Standard'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="textSecondary">
                  <strong>Role:</strong> {user.role}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Profile;
