import React from 'react';
import { Container, Box } from '@mui/material';
import Header from '../components/common/Header';
import ActionList from '../components/ActionList/ActionList';

const ActionListPage = () => {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'grey.100', width: '100%' }}>
      <Header />
      <Container component="main" sx={{ flex: 1, py: 3, px: { xs: 1, sm: 2, md: 3 }, maxWidth: '100%' }}>
        <ActionList />
      </Container>
    </Box>
  );
};

export default ActionListPage;