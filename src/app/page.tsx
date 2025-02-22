'use client';

import { useState, useCallback, useEffect } from 'react';
import { NotesAPI, LLMAPI } from '@/services/api';
import { Box, Grid } from '@mui/material';
import GraphDisplay from '@/components/GraphDisplay';
import NoteEditor from '@/components/NoteEditor';
import SidePanel from '@/components/SidePanel';
import { Note, GraphData, LLMResponse } from '@/types';

export default function Home() {
  const [selectedNote, setSelectedNote] = useState<Note | undefined>();
  const [llmResponse, setLLMResponse] = useState<LLMResponse | undefined>();
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [] });

  // Fetch all notes and create graph data with tag-based connections
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const notes = await NotesAPI.getAllNotes();
        
        // Convert notes to nodes
        const nodes = notes.map(note => ({
          id: note.id,
          title: note.title,
          tags: note.tags,
        }));

        // Create links between notes that share tags
        const links: Array<{ source: string; target: string; weight: number }> = [];
        for (let i = 0; i < notes.length; i++) {
          for (let j = i + 1; j < notes.length; j++) {
            const sharedTags = notes[i].tags.filter(tag => 
              notes[j].tags.includes(tag)
            );
            
            if (sharedTags.length > 0) {
              links.push({
                source: notes[i].id,
                target: notes[j].id,
                // Weight is based on number of shared tags
                weight: sharedTags.length,
              });
            }
          }
        }

        setGraphData({ nodes, links });
      } catch (error) {
        console.error('Failed to fetch notes:', error);
      }
    };

    fetchNotes();
  }, []);

  const handleNodeClick = useCallback(async (nodeId: string) => {
    try {
      const note = await NotesAPI.getNote(nodeId);
      setSelectedNote(note);

      // Get LLM analysis for the note
      const analysis = await LLMAPI.analyzeContent(note.content);
      setLLMResponse(analysis);
    } catch (error) {
      console.error('Failed to fetch note details:', error);
    }
  }, []);

  const handleSaveNote = useCallback(async (note: Partial<Note>) => {
    try {
      let savedNote;
      if (note.id) {
        savedNote = await NotesAPI.updateNote(note.id, note);
      } else {
        savedNote = await NotesAPI.createNote(note);
      }

      // Update graph data with new/updated note and its connections
      setGraphData(prev => {
        // Update nodes
        const nodes = prev.nodes.filter(n => n.id !== savedNote.id);
        nodes.push({
          id: savedNote.id,
          title: savedNote.title,
          tags: savedNote.tags,
        });

        // Remove old links connected to this note
        const links = prev.links.filter(
          link => link.source !== savedNote.id && link.target !== savedNote.id
        );

        // Create new links based on shared tags
        nodes.forEach(node => {
          if (node.id !== savedNote.id) {
            const sharedTags = savedNote.tags.filter(tag =>
              node.tags.includes(tag)
            );
            
            if (sharedTags.length > 0) {
              links.push({
                source: savedNote.id,
                target: node.id,
                weight: sharedTags.length,
              });
            }
          }
        });

        return { nodes, links };
      });

      setSelectedNote(savedNote);
    } catch (error) {
      console.error('Failed to save note:', error);
    }
  }, []);

  const handleAddSuggestion = useCallback((suggestion: string) => {
    if (selectedNote) {
      const updatedNote = {
        ...selectedNote,
        content: `${selectedNote.content}\n\n${suggestion}`,
        updatedAt: new Date().toISOString(),
      };
      handleSaveNote(updatedNote);
    }
  }, [selectedNote, handleSaveNote]);

  return (
    <Box className="h-screen p-4 bg-gray-50">
      <Grid container spacing={2} className="h-full">
        {/* Graph Visualization */}
        <Grid item xs={12} md={8} className="h-full">
          <Box className="h-full bg-white rounded-lg shadow-md overflow-hidden">
            <GraphDisplay
              data={graphData}
              onNodeClick={handleNodeClick}
            />
          </Box>
        </Grid>

        {/* Right Panel */}
        <Grid item xs={12} md={4} className="h-full">
          <Box className="h-full flex flex-col gap-4">
            {/* Note Editor */}
            <Box className="flex-1 bg-white rounded-lg shadow-md overflow-hidden">
              <NoteEditor
                note={selectedNote}
                onSave={handleSaveNote}
              />
            </Box>

            {/* Side Panel */}
            <Box className="flex-1 bg-white rounded-lg shadow-md overflow-hidden">
              <SidePanel
                note={selectedNote}
                llmResponse={llmResponse}
                onAddSuggestion={handleAddSuggestion}
              />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
