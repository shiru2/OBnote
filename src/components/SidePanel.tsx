import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Collapse,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { Note, LLMResponse } from '@/types';

interface SidePanelProps {
  note?: Note;
  llmResponse?: LLMResponse;
  onAddSuggestion?: (suggestion: string) => void;
}

const SidePanel: React.FC<SidePanelProps> = ({
  note,
  llmResponse,
  onAddSuggestion,
}) => {
  const [expanded, setExpanded] = React.useState({
    summary: true,
    keywords: true,
    suggestions: true,
  });

  const toggleSection = (section: keyof typeof expanded) => {
    setExpanded(prev => ({ ...prev, [section]: !prev[section] }));
  };

  if (!note && !llmResponse) {
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
      {note && (
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
        </Box>
      )}

      {llmResponse && (
        <Box className="p-4">
          <Box className="mb-4">
            <Box
              className="flex items-center cursor-pointer"
              onClick={() => toggleSection('summary')}
            >
              <Typography variant="subtitle1" className="flex-grow font-medium">
                AI Summary
              </Typography>
              {expanded.summary ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </Box>
            <Collapse in={expanded.summary}>
              <Typography variant="body2" className="mt-2">
                {llmResponse.summary}
              </Typography>
            </Collapse>
          </Box>

          <Box className="mb-4">
            <Box
              className="flex items-center cursor-pointer"
              onClick={() => toggleSection('keywords')}
            >
              <Typography variant="subtitle1" className="flex-grow font-medium">
                Related Keywords
              </Typography>
              {expanded.keywords ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </Box>
            <Collapse in={expanded.keywords}>
              <Box className="flex flex-wrap gap-1 mt-2">
                {llmResponse.keywords.map((keyword) => (
                  <Chip key={keyword} label={keyword} size="small" />
                ))}
              </Box>
            </Collapse>
          </Box>

          <Box>
            <Box
              className="flex items-center cursor-pointer"
              onClick={() => toggleSection('suggestions')}
            >
              <Typography variant="subtitle1" className="flex-grow font-medium">
                AI Suggestions
              </Typography>
              {expanded.suggestions ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </Box>
            <Collapse in={expanded.suggestions}>
              <List dense>
                {llmResponse.suggestions.map((suggestion, index) => (
                  <ListItem
                    key={index}
                    secondaryAction={
                      onAddSuggestion && (
                        <IconButton
                          edge="end"
                          size="small"
                          onClick={() => onAddSuggestion(suggestion)}
                        >
                          <AddIcon />
                        </IconButton>
                      )
                    }
                  >
                    <ListItemText
                      primary={suggestion}
                      primaryTypographyProps={{ variant: 'body2' }}
                    />
                  </ListItem>
                ))}
              </List>
            </Collapse>
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default SidePanel;
