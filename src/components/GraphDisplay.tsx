'use client';

import React, { useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import { GraphData } from '@/types';

// Import ForceGraph2D dynamically to avoid SSR issues
const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), {
  ssr: false,
});

// Define node type according to force-graph-2d requirements
type ForceGraphNode = {
  id?: string | number;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number;
  fy?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //yokuwakaran
  [key: string]: any;
};

interface GraphNode extends ForceGraphNode {
  id: string;
  title: string;
  tags: string[];
}

interface GraphDisplayProps {
  data: GraphData;
  onNodeClick?: (nodeId: string) => void;
  onNodeHover?: (nodeId: string | null) => void;
}

const GraphDisplay: React.FC<GraphDisplayProps> = ({
  data,
  onNodeClick,
  onNodeHover,
}) => {
  // Using any for the ref type since ForceGraph2D's type definitions are complex
  // and the actual ForceGraphMethods type isn't easily accessible
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const graphRef = useRef<any>(null);

  const handleNodeClick = useCallback((node: ForceGraphNode) => {
    if (onNodeClick && node?.id && typeof node.id === 'string') {
      onNodeClick(node.id);
    }
  }, [onNodeClick]);

  const handleNodeHover = useCallback((node: ForceGraphNode | null) => {
    if (onNodeHover) {
      onNodeHover(node?.id && typeof node.id === 'string' ? node.id : null);
    }
  }, [onNodeHover]);

  return (
    <div className="w-full h-full">
      <ForceGraph2D
        ref={graphRef}
        graphData={data}
        nodeLabel={(node: ForceGraphNode) => (node as GraphNode).title || ''}
        nodeColor={(node: ForceGraphNode) => ((node as GraphNode).tags?.length ? '#4CAF50' : '#1976D2')}
        nodeRelSize={6}
        linkWidth={2}
        linkColor={() => '#999'}
        onNodeClick={handleNodeClick}
        onNodeHover={handleNodeHover}
        cooldownTicks={50}
        d3VelocityDecay={0.1}
      />
    </div>
  );
};

export default GraphDisplay;
