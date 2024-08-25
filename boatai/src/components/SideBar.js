
import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemText, Box, ListItemButton, Divider, Button } from '@mui/material';

const SideBar = ({ pastConversations, setConversation,setIsOpen,isOpen }) => {
 

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setIsOpen(open);
  };

  return (
    <>
    
      <Drawer
        anchor="left"
        open={isOpen}
        onClose={toggleDrawer(false)}
      >
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
            <Button
            sx={{
              width: '100%',
              backgroundColor: 'primary.main',
              color: 'white',
              '&:hover': {
                backgroundColor: 'primary.dark',
              }
            }}
          >
            Past Conversations
          </Button>
          <List>
            {pastConversations.map((chat, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton onClick={() => setConversation(chat.messages)}>
                  <ListItemText primary={`Chat on ${new Date(chat.id).toLocaleString()}`} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      </>
  
  );
}

export default SideBar;