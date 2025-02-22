import React, { useCallback, useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import { Box, Paper, TextField, Chip, IconButton } from '@mui/material';
import { Add as AddIcon, Save as SaveIcon } from '@mui/icons-material';
import { Note } from '@/types';

interface NoteEditorProps {
  note?: Note;
  onSave: (note: Partial<Note>) => void;
}

const NoteEditor: React.FC<NoteEditorProps> = ({ note, onSave }) => {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [tags, setTags] = useState<string[]>(note?.tags || []);
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setTags(note.tags);
    }
  }, [note]);

  const handleSave = useCallback(() => {
    onSave({
      title,
      content,
      tags,
      updatedAt: new Date().toISOString(),
    });
  }, [title, content, tags, onSave]);

  const handleAddTag = useCallback(() => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag('');
    }
  }, [newTag, tags]);

  const handleRemoveTag = useCallback((tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  }, [tags]);

  return (
    <Box className="flex flex-col gap-4 p-4 h-full">
      <TextField
        fullWidth
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        variant="outlined"
      />
      
      <Box className="flex items-center gap-2 mb-2">
        <TextField
          size="small"
          label="Add Tag"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
        />
        <IconButton onClick={handleAddTag} size="small">
          <AddIcon />
        </IconButton>
      </Box>
      
      <Box className="flex flex-wrap gap-1 mb-2">
        {tags.map((tag) => (
          <Chip
            key={tag}
            label={tag}
            onDelete={() => handleRemoveTag(tag)}
            size="small"
          />
        ))}
      </Box>

      <Paper elevation={3} className="flex-grow">
        <Editor
          height="100%"
          defaultLanguage="markdown"
          value={content}
          onChange={(value) => setContent(value || '')}
          options={{
            minimap: { enabled: false },
            wordWrap: 'on',
            lineNumbers: 'off',
            padding: { top: 16, bottom: 16 },
          }}
        />
      </Paper>

      <Box className="flex justify-end">
        <IconButton
          color="primary"
          onClick={handleSave}
          disabled={!title || !content}
        >
          <SaveIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default NoteEditor;
