import React from 'react';
import { selectFlow } from '../../features/flow/selector';
import { useSelector } from 'react-redux';
import { Box, useMantineTheme } from '@mantine/core';
import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { sankeyLinkHorizontal } from 'd3-sankey';
const SankeyDiagram = () => {
    const containerRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [selectedNode, setSelectedNode] = useState(null);
    const [selectedLink, setSelectedLink] = useState(null);
    const data = useSelector(selectFlow);
    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                setDimensions({
                    width: containerRef.current.offsetWidth,
                    height: containerRef.current.offsetHeight,
                });
            }
        };
        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);
    useEffect(() => {
        if (data && dimensions.width > 0 && dimensions.height > 0) {
            renderSankey(selectedNode, selectedLink);
        }
    }, [data, dimensions, selectedNode, selectedLink]);
    const theme = useMantineTheme();
    const colors = [
        theme.colors.red[5],
        theme.colors.violet[5],
        theme.colors.cyan[5],
        theme.colors.lime[5],
        theme.colors.pink[5],
        theme.colors.indigo[5],
        theme.colors.teal[5],
        theme.colors.yellow[5],
        theme.colors.grape[5],
        theme.colors.blue[5],
        theme.colors.green[5],
        theme.colors.orange[5],
    ];
    const getName = (name) => {
        return name.replace(/^(in|ex)-(.*\.)?/, '');
    };
    const renderSankey = (selectedNode, selectedLink) => {
        const container = d3.select(containerRef.current);
        // Clear any existing content
        container.select('svg').remove();
        // Create the SVG element
        const svg = container.append('svg').attr('width', dimensions.width).attr('height', dimensions.height);
        const { nodes, links } = data;
        const NODE_WIDTH = 40;
        const MIN_NODE_PADDING = 0;
        // Group nodes by column
        const uniqueColumns = [...new Set(nodes.map((n) => n.x0))].sort((a, b) => a - b);
        const numColumns = uniqueColumns.length;
        // Calculate spacing between columns
        const totalWidth = dimensions.width;
        const columnSpacing = (totalWidth - NODE_WIDTH) / (numColumns - 1);
        // Find the maximum total height across all columns (including padding)
        const columnHeights = uniqueColumns.map((col) => {
            const columnNodes = nodes.filter((node) => node.x0 === col);
            const totalNodeHeight = columnNodes.reduce((sum, node) => sum + (node.y1 - node.y0), 0);
            const totalPadding = MIN_NODE_PADDING * (columnNodes.length - 1);
            return totalNodeHeight + totalPadding;
        });
        const maxColumnHeight = Math.max(...columnHeights);
        // Adjust the scaling factor to ensure no column exceeds dimensions.height
        const globalScalingFactor = Math.min(dimensions.height / maxColumnHeight, 1);
        // Adjust node positions and heights globally
        const updatedNodes = uniqueColumns.flatMap((col, columnIndex) => {
            const columnNodes = nodes.filter((node) => node.x0 === col);
            const totalNodeHeight = columnNodes.reduce((sum, node) => sum + (node.y1 - node.y0), 0);
            // Calculate remaining space for additional padding
            const totalPadding = MIN_NODE_PADDING * (columnNodes.length - 1);
            const scaledTotalHeight = totalNodeHeight * globalScalingFactor + totalPadding;
            const extraSpace = dimensions.height - scaledTotalHeight;
            // Calculate the new spacing between nodes
            const additionalPadding = extraSpace / (columnNodes.length + 1);
            let currentY = additionalPadding; // Start with the first extra padding
            return columnNodes.map((node) => {
                const normalizedHeight = (node.y1 - node.y0) * globalScalingFactor;
                const updatedNode = {
                    ...node,
                    x0: columnIndex * columnSpacing,
                    x1: columnIndex * columnSpacing + NODE_WIDTH,
                    y0: currentY,
                    y1: currentY + normalizedHeight,
                    width: NODE_WIDTH,
                    height: normalizedHeight,
                };
                currentY += normalizedHeight + MIN_NODE_PADDING + additionalPadding; // Add padding and spacing
                return updatedNode;
            });
        });
        const categories = [
            ...new Set(updatedNodes.map((node) => {
                if (node.name.includes('.')) {
                    return node.name.split('.')[0].split('-')[1];
                }
            })),
        ].filter((category) => category !== undefined);
        const accounts = [
            ...new Set(updatedNodes.map((node) => {
                if (!node.name.includes('-')) {
                    return node.name;
                }
            })),
        ].filter((account) => account !== undefined);
        const colorFromNode = (node) => {
            let category = '';
            if (node.name.includes('.')) {
                category = node.name.split('.')[0].split('-')[1];
            }
            else if (node.name.includes('-')) {
                category = node.name.split('-')[1];
            }
            if (category !== '') {
                return colors[categories.indexOf(category) % colors.length];
            }
            return colors[accounts.indexOf(node.name) % colors.length];
        };
        const updatedLinks = links
            .map((link, index) => {
            return {
                index,
                source: updatedNodes[link.source],
                target: updatedNodes[link.target],
                value: link.value * globalScalingFactor,
                width: link.value * globalScalingFactor,
                y0: updatedNodes[link.source].y0 + link.y0 * globalScalingFactor,
                y1: updatedNodes[link.target].y0 + link.y1 * globalScalingFactor,
            };
        })
            .filter((link) => link.source.name.startsWith('in-') || link.target.name.startsWith('ex-'));
        // Draw links
        svg
            .append('g')
            .selectAll('path')
            .data(updatedLinks)
            .join('path')
            .attr('d', sankeyLinkHorizontal())
            .attr('fill', 'none')
            .attr('stroke', (d) => {
            if (d.source.name.startsWith('in')) {
                return colorFromNode(d.source);
            }
            else if (d.target.name.startsWith('ex')) {
                return colorFromNode(d.target);
            }
            return colorFromNode(d.source);
        })
            .attr('stroke-opacity', (d) => selectedLink === d.index ? 1 : selectedNode === d.source.name || selectedNode === d.target.name ? 1 : 0.5)
            .attr('stroke-width', (d) => Math.max(1, d.width ?? 0))
            .style('cursor', 'pointer')
            .on('click', (event, d) => {
            setSelectedLink(selectedLink === d.index ? null : d.index);
            setSelectedNode(null);
        })
            .append('title')
            .text((d) => `${d.source.name} -> ${d.target.name}\n$ ${d.value.toFixed(2)}`);
        // Draw nodes
        const nodeGroup = svg
            .append('g')
            .selectAll('g')
            .data(updatedNodes)
            .join('g')
            .on('click', (_, d) => {
            setSelectedNode(selectedNode === d.name ? null : d.name);
            setSelectedLink(null);
        });
        // Update rectangle styling to reflect selection state
        nodeGroup
            .append('rect')
            .attr('x', (d) => d.x0)
            .attr('y', (d) => d.y0)
            .attr('width', (d) => d.width)
            .attr('height', (d) => d.height)
            .attr('fill', (d) => {
            return colorFromNode(d);
        })
            .attr('opacity', (d) => {
            return selectedNode === d.name ? 1 : 0.5;
        })
            .attr('stroke', theme.colors.gray[9])
            .attr('stroke-width', 1)
            .style('cursor', 'pointer')
            .append('title')
            .text((d) => `${getName(d.name)}${d.name.includes('-') ? `\n$ ${d.value.toFixed(2)}` : ''}`);
        // Add labels to nodes only if they fit
        nodeGroup
            .append('text')
            .attr('x', (d) => (d.x0 + d.x1) / 2)
            .attr('y', (d) => (d.y0 + d.y1) / 2)
            .attr('dy', '0.35em')
            .attr('text-anchor', 'middle')
            .attr('transform', (d) => `rotate(-90, ${(d.x0 + d.x1) / 2}, ${(d.y0 + d.y1) / 2})`)
            .text((d) => {
            // Calculate available space (node height since text is rotated)
            const availableSpace = d.height;
            // Approximate text width (you may need to adjust this)
            const textLength = getName(d.name).length * 7; // rough estimate of 7px per character
            return textLength <= availableSpace ? getName(d.name) : '';
        })
            .attr('font-size', '12px')
            .attr('font-weight', 'bold')
            .attr('fill', '#333');
    };
    return React.createElement(Box, { ref: containerRef, w: "100%", h: "100%" });
};
export default SankeyDiagram;
