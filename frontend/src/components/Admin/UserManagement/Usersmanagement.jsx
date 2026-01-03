import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
  Chip,
  Grid,
  Card,
  CardContent,
  Avatar,
  Menu,
} from '@mui/material';
import { Edit, DeleteForever, GridView, FormatListBulleted, MoreVert } from '@mui/icons-material';

import './Userm.css';

const UserManagementTable = () => {
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [filterRole, setFilterRole] = useState('All');
  const [confirmDelete, setConfirmDelete] = useState({ open: false, userId: null });
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
  // State for grid view menu
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/v1/users/getallusers');
      if (response.data && response.data.users) {
        setUsers(response.data.users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);+
      showSnackbar('Failed to fetch users.');
    }
  };

  const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setOpenSnackbar(true);
  };

  const handleEditClick = (user) => {
    setEditUser({ ...user });
    setOpenEdit(true);
  };

  const handleEditChange = (e) => {
    setEditUser({ ...editUser, [e.target.name]: e.target.value });
  };

  const handleSaveEdit = async () => {
    try {
      await axios.put(`http://localhost:5000/api/v1/users/update-user/${editUser._id}`, editUser);
      setUsers(users.map((user) => (user._id === editUser._id ? editUser : user)));
      setOpenEdit(false);
      showSnackbar('User updated successfully.');
      handleMenuClose(); // Close menu if open
    } catch (error) {
      console.error('Failed to update user:', error);
      showSnackbar('Failed to update user.');
    }
  };

  const handleDeleteClick = (userId) => {
    setConfirmDelete({ open: true, userId });
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/v1/users/delete-user/${confirmDelete.userId}`);
      setUsers(users.filter((user) => user._id !== confirmDelete.userId));
      setConfirmDelete({ open: false, userId: null });
      showSnackbar('User deleted successfully.');
      handleMenuClose(); // Close menu if open
    } catch (error) {
      console.error('Failed to delete user:', error);
      showSnackbar('Failed to delete user.');
    }
  };

  const handleDeleteCancel = () => {
    setConfirmDelete({ open: false, userId: null });
  };

  // Grid view: Open menu for selected user
  const handleMenuOpen = (event, user) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  const getRoleChip = (role) => {
    let bgColor, textColor;
    switch (role) {
      case 'admin':
        bgColor = '#ffcccb';   // Light red
        textColor = '#b71c1c';  // Dark red
        break;
      case 'subscriber':
        bgColor = '#90ee90';   // Light green
        textColor = '#1b5e20';  // Dark green
        break;
      case 'curator':
        bgColor = '#add8e6';   // Light blue
        textColor = '#0d47a1';  // Dark blue
        break;
      default:
        bgColor = '#ccc';
        textColor = 'black';
        break;
    }
    return (
      <Chip
        label={role}
        style={{
          backgroundColor: bgColor,
          color: textColor,
          borderRadius: '20px',
          fontWeight: 'bold',
          fontSize: '0.65rem',
        }}
      />
    );
  };

  // Returns avatar with profile image if available; otherwise, first letter.
  const getUserAvatar = (user) => {
    if (user.profilePicture) {
      return (
        <Avatar alt={user.username} src={user.profilePicture.path} sx={{ width: 60, height: 60 }} />
      );
    } else {
      return (
        <Avatar sx={{ width: 70, height: 70 }}>
          {user.username.charAt(0).toUpperCase()}
        </Avatar>
      );
    }
  };

  const filteredUsers = filterRole === 'All' ? users : users.filter((user) => user.role === filterRole);

  return (
    <div style={{ padding: '20px' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="20px">
        <Box
          sx={{
            backgroundColor: 'white',
            p: 2,
            borderRadius: '8px', // adjust border radius if needed
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          <Typography
            variant="h5"
            sx={{
              background: 'linear-gradient(to right, #1E3A8A, #3B82F6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
          <b>  USER MANAGEMENT</b>
          </Typography>
        </Box>

        <Box display="flex" alignItems="center">
          <FormControl className="filter-dropdown" style={{ minWidth: 300, marginRight: '20px' }}>
            <InputLabel style={{ color: "#1E3A8A" }}>Filter by Role</InputLabel>
            <Select
              label="Filter by Role"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              style={{ height: '40px', width: "220px" }}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="subscriber">Subscriber</MenuItem>
              <MenuItem value="curator">Curator</MenuItem>
            </Select>
          </FormControl>
          <IconButton onClick={() => setViewMode('grid')} color={viewMode === 'grid' ? "primary" : "default"}>
            <GridView />
          </IconButton>
          <IconButton onClick={() => setViewMode('list')} color={viewMode === 'list' ? "primary" : "default"}>
            <FormatListBulleted />
          </IconButton>
        </Box>
      </Box>

      {viewMode === 'list' ? (
        <TableContainer component={Paper} className="custom-table" style={{ boxShadow: '0 4px 17px rgba(0, 0, 0, 0.6)' }}>
          <Table>
            <TableHead>
              <TableRow style={{ background: 'linear-gradient(to right, #1E3A8A, #3B82F6)' }}>
                <TableCell>
                  <strong style={{ color: 'white' }}>Profile</strong>
                </TableCell>
                <TableCell>
                  <strong style={{ color: 'white' }}>Username</strong>
                </TableCell>
                <TableCell>
                  <strong style={{ color: 'white' }}>Email</strong>
                </TableCell>
                <TableCell>
                  <strong style={{ color: 'white' }}>Role</strong>
                </TableCell>
                <TableCell>
                  <strong style={{ color: 'white' }}>Subscription Status</strong>
                </TableCell>
                <TableCell>
                  <strong style={{ color: 'white' }}>Actions</strong>
                </TableCell>
              </TableRow>

            </TableHead>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user._id} className="hover-row animated-row">
                  <TableCell>
                    {user.profilePicture ? (
                      <img src={user.profilePicture.path} alt={user.username} className="user-profile-img" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                    ) : (
                      <div className="user-profile-placeholder" style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{getRoleChip(user.role)}</TableCell>
                  <TableCell>{user.subscriptionStatus}</TableCell>
                  <TableCell>
                    <IconButton size="small" color="primary" onClick={() => handleEditClick(user)}>
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDeleteClick(user._id)}>
                      <DeleteForever fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {filteredUsers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">No users found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        // Grid View: Card with circular profile on left, condensed details on right, and 3-dots menu for actions.
        <Grid container spacing={3}>
          {filteredUsers.map((user) => (
            <Grid item xs={12} sm={6} md={4} key={user._id}>
              <Card
                sx={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  height: 90,
                  borderRadius: '20px',
                  boxShadow: 3,
                }}
              >
                {/* Three-dot menu at top right */}
                <IconButton
                  size="small"
                  sx={{ position: 'absolute', top: 4, right: 4 }}
                  onClick={(e) => handleMenuOpen(e, user)}
                >
                  <MoreVert fontSize="small" />
                </IconButton>

                {/* Avatar on left */}
                <Box sx={{ pl: 2 }}>
                  {getUserAvatar(user)}
                </Box>

                {/* Username, Email, and Role in details */}
                <CardContent
                  sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start',
                    pl: 1,
                    pr: 1,
                    pt: 1,
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', p: 0, mt: 3 }}></CardContent>
                  <Typography variant="subtitle2" component="div" noWrap>
                    {user.username}
                  </Typography>
                  <Typography variant="caption" color="textSecondary" noWrap>
                    {user.email}
                  </Typography>
                  <Box mt={0.5}>
                    {getRoleChip(user.role)}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
          {filteredUsers.length === 0 && (
            <Grid item xs={12}>
              <Typography align="center">No users found.</Typography>
            </Grid>
          )}
        </Grid>


      )}

      {/* Menu for Grid view actions */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem
          onClick={() => {
            handleEditClick(selectedUser);
            handleMenuClose();
          }}
        >
          Update
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleDeleteClick(selectedUser._id);
            handleMenuClose();
          }}
        >
          Delete
        </MenuItem>
      </Menu>

      {editUser && (
        <Dialog
          open={openEdit}
          onClose={() => setOpenEdit(false)}
          PaperProps={{
            sx: {
              borderRadius: 2,
              boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)',
              padding: '20px',
              maxWidth: '400px',
              width: '100%',
            },
          }}
        >
          <DialogTitle
            sx={{
              textAlign: 'center',
              fontWeight: 'bold',
              color: '#1E3A8A',
              mb: 1,
              height: "10px"
            }}
          >
            Edit User
          </DialogTitle>
          <DialogContent
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              mt: 1,
            }}
          >
            <TextField
              fullWidth
              variant="outlined"
              label="Username"
              name="username"
              value={editUser.username}
              onChange={handleEditChange}
              InputProps={{
                sx: {
                  borderRadius: '8px',
                },
              }}
            />
            <TextField
              fullWidth
              variant="outlined"
              label="Email"
              name="email"
              value={editUser.email}
              onChange={handleEditChange}
              InputProps={{
                sx: {
                  borderRadius: '8px',
                },
              }}
            />
            <FormControl fullWidth variant="outlined">
              <InputLabel id="role-select-label">Role</InputLabel>
              <Select
                labelId="role-select-label"
                name="role"
                value={editUser.role}
                onChange={handleEditChange}
                label="Role"
                sx={{
                  borderRadius: '8px',
                }}
              >
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="subscriber">Subscriber</MenuItem>
                <MenuItem value="curator">Curator</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center', mt: 2 }}>
            <Button onClick={() => setOpenEdit(false)} sx={{ color: '#1E3A8A' }}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveEdit}
              variant="contained"
              sx={{
                backgroundColor: '#1E3A8A',
                '&:hover': { backgroundColor: '#3B82F6' },
              }}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
      )}

      <Dialog open={confirmDelete.open} onClose={handleDeleteCancel}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>Are you sure you want to delete this user?</DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} variant="contained" color="error">Delete</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={openSnackbar} autoHideDuration={4000} onClose={() => setOpenSnackbar(false)} message={snackbarMessage} />
    </div>
  );
};

export default UserManagementTable;
