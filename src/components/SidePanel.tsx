import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Chip,
  Divider
} from '@mui/material';
import { Note } from '@/types';

interface SidePanelProps {
  note?: Note;
}

const SidePanel: React.FC<SidePanelProps> = ({
  note
}) => {
  if (!note) {
    return (
      <Paper className="p-4">
        <Typography variant="body2" color="textSecondary">
          Select a node to view details
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper className="h-full overflow-y-auto">
      <Box className="p-4">
        <Typography variant="h6" gutterBottom>
          {note.title}
        </Typography>
        <Box className="flex flex-wrap gap-1 mb-2">
          {note.tags.map((tag) => (
            <Chip key={tag} label={tag} size="small" />
          ))}
        </Box>
        <Typography variant="body2" color="textSecondary" className="mb-2">
          Last updated: {new Date(note.updatedAt).toLocaleString()}
        </Typography>
        <Divider className="my-3" />
        <Typography variant="body1" className="whitespace-pre-wrap">
          {note.content}
        </Typography>
      </Box>
    </Paper>
  );
};

export default SidePanel;
