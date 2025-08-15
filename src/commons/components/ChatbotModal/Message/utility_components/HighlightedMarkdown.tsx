import { SourceMessageMetadata } from "@/commons/types/chat";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import { Code } from "../MessageContainer";
import styles from "../MessageContainer.module.less";
import { useEffect, useRef } from "react";

const normalizeApostrophes = (text: string) =>
    text
        .replace(/[’‘]/g, "'")   // curly single quotes to straight
        .replace(/[“”]/g, '"');  // curly/double Chinese quotes to straight

// Function to highlight text in ReactMarkdown content using useEffect
export const HighlightedMarkdown = ({ 
  content, 
  metadata, 
  noteIndex, 
  hoveredNoteIndex, 
  showSidePanel, 
  currentFollowUpSessionId, 
  // associated_session_ids 
}: { 
  content: string, 
  metadata: SourceMessageMetadata | undefined, 
  noteIndex: number, 
  hoveredNoteIndex: number | null,
  showSidePanel?: boolean,
  currentFollowUpSessionId?: string,
  associated_session_ids?: string[]
}) => {
    const markdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // First, always clear all existing highlights
        if (markdownRef.current) {
          const highlightedSpans = markdownRef.current.querySelectorAll('span[style*="background-color"]');
          highlightedSpans.forEach(span => {
            const parent = span.parentNode;
            if (parent) {
              parent.replaceChild(document.createTextNode(span.textContent || ''), span);
              parent.normalize(); // Merge adjacent text nodes
            }
          });
        }

        // Then, check if we should highlight based on either hovered note or current selected session
        // The parent component (MessageContainer) now ensures that metadata is only passed
        // when this specific message should show highlighting
        const shouldHighlight = hoveredNoteIndex === noteIndex || 
          (showSidePanel && currentFollowUpSessionId && metadata);

        if (markdownRef.current && metadata && metadata.source_message_selected_text && shouldHighlight) {
          const selectedText = metadata.source_message_selected_text;
          const highlightColor = metadata.source_message_hightcolor;

          // Use context-based matching for precise highlighting
          const targetOffset = findExactTextMatch(
            selectedText,
            metadata.source_message_context_before,
            metadata.source_message_context_after,
            metadata.source_message_relative_position
          );

          if (targetOffset !== -1) {
            highlightTextAtOffset(targetOffset, selectedText.length, highlightColor);
          } else {
            // Fallback to old method if context matching fails
            highlightTextByContent(selectedText, highlightColor);
          }
        }
    }, [content, metadata, hoveredNoteIndex, noteIndex, showSidePanel, currentFollowUpSessionId]);

    // Find exact text match using context and position
    const findExactTextMatch = (
      selectedText: string, 
      contextBefore?: string, 
      contextAfter?: string, 
      relativePosition?: number
    ): number => {
      if (!markdownRef.current) return -1;
      
      const fullText = markdownRef.current.textContent || '';
      
      // Find all possible matches
      const candidates: number[] = [];
      let index = 0;
      while ((index = fullText.indexOf(selectedText, index)) !== -1) {
        candidates.push(index);
        index += 1;
      }
      
      // console.log(`Found ${candidates.length} candidates for "${selectedText}":`, candidates);
      
      if (candidates.length === 0) return -1;
      if (candidates.length === 1) return candidates[0];
      
      // Multiple matches - use context to find the right one
      if (contextBefore || contextAfter) {
        for (const candidate of candidates) {
          let score = 0;
          
          // Check context before
          if (contextBefore) {
            const beforeStart = Math.max(0, candidate - contextBefore.length);
            const actualBefore = fullText.substring(beforeStart, candidate);
            if (actualBefore.includes(contextBefore) || contextBefore.includes(actualBefore)) {
              score += 2;
              // console.log(`Context before match for candidate ${candidate}: "${actualBefore}" includes "${contextBefore}"`);
            }
          }
          
          // Check context after
          if (contextAfter) {
            const afterEnd = Math.min(fullText.length, candidate + selectedText.length + contextAfter.length);
            const actualAfter = fullText.substring(candidate + selectedText.length, afterEnd);
            if (actualAfter.includes(contextAfter) || contextAfter.includes(actualAfter)) {
              score += 2;
              // console.log(`Context after match for candidate ${candidate}: "${actualAfter}" includes "${contextAfter}"`);
            }
          }
          
          if (score > 0) {
            // console.log(`Using candidate ${candidate} with context score ${score}`);
            return candidate;
          }
        }
      }
      
      // If context doesn't help, use relative position
      if (relativePosition !== undefined) {
        let bestCandidate = candidates[0];
        let minDistance = Math.abs((candidates[0] / fullText.length) - relativePosition);
        
        for (const candidate of candidates) {
          const candidateRelativePos = candidate / fullText.length;
          const distance = Math.abs(candidateRelativePos - relativePosition);
          if (distance < minDistance) {
            minDistance = distance;
            bestCandidate = candidate;
          }
        }
        
        // console.log(`Using candidate ${bestCandidate} based on relative position (distance: ${minDistance})`);
        return bestCandidate;
      }
      
      // Last resort: return first match
      // console.log(`Using first candidate ${candidates[0]} as fallback`);
      return candidates[0];
    };

    // Highlight text at specific DOM offset
    const highlightTextAtOffset = (offset: number, length: number, color: string) => {
      if (!markdownRef.current) return;
      
      const walker = document.createTreeWalker(
        markdownRef.current,
        NodeFilter.SHOW_TEXT,
        null
      );

      let currentOffset = 0;
      let node;
      
      while (node = walker.nextNode()) {
        const textNode = node as Text;
        const nodeText = textNode.textContent || '';
        const nodeEnd = currentOffset + nodeText.length;
        
        // Check if the target text spans across this node
        if (offset < nodeEnd && offset + length > currentOffset) {
          // Calculate the portion of target text within this node
          const nodeStartOffset = Math.max(0, offset - currentOffset);
          const nodeEndOffset = Math.min(nodeText.length, offset + length - currentOffset);
          
          if (nodeStartOffset < nodeEndOffset) {
            // Split the text node and wrap the target portion
            const beforeText = nodeText.substring(0, nodeStartOffset);
            const targetText = nodeText.substring(nodeStartOffset, nodeEndOffset);
            const afterText = nodeText.substring(nodeEndOffset);
            
            const fragment = document.createDocumentFragment();
            
            if (beforeText) {
              fragment.appendChild(document.createTextNode(beforeText));
            }
            
            if (targetText) {
              const span = document.createElement('span');
              span.style.backgroundColor = color;
              span.style.color = 'white';
              span.style.borderRadius = '3px';
              span.textContent = targetText;
              fragment.appendChild(span);
            }
            
            if (afterText) {
              fragment.appendChild(document.createTextNode(afterText));
            }
            
            textNode.parentNode?.replaceChild(fragment, textNode);
          }
        }
        
        currentOffset = nodeEnd;
        
        if (currentOffset > offset + length) {
          break; // We've passed the target text
        }
      }
    };

    // Fallback highlighting method (original approach)
    const highlightTextByContent = (selectedText: string, highlightColor: string) => {
      if (!markdownRef.current) return;
      
      const walker = document.createTreeWalker(
        markdownRef.current,
        NodeFilter.SHOW_TEXT,
        null
      );

      const textNodes: Text[] = [];
      let node;
      while (node = walker.nextNode()) {
        textNodes.push(node as Text);
      }

      textNodes.forEach(textNode => {
        const text = textNode.textContent || '';
        if (text.toLowerCase().includes(selectedText.toLowerCase())) {
          const escapedText = selectedText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const regex = new RegExp(`(${escapedText})`, 'gi');
          const parts = text.split(regex);

          if (parts.length > 1) {
            const fragment = document.createDocumentFragment();
            parts.forEach((part,_) => {
              if (part.toLowerCase() === selectedText.toLowerCase()) {
                const span = document.createElement('span');
                span.style.backgroundColor = highlightColor;
                span.style.color = 'white';
                span.style.borderRadius = '3px';
                span.textContent = part;
                fragment.appendChild(span);
              } else {
                fragment.appendChild(document.createTextNode(part));
              }
            });
            textNode.parentNode?.replaceChild(fragment, textNode);
          }
        }
      });
    };

    return (
        <div ref={markdownRef}>
        <ReactMarkdown
            className={styles.reactMarkdown}
            children={typeof content === 'string' ? normalizeApostrophes(content) : content}
            remarkPlugins={[remarkMath, remarkGfm]}
            rehypePlugins={[rehypeKatex]}
            components={{
                code: Code, // Custom rendering for <code> blocks
                a: ({ href, children, ...props }) => (
                    <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            transform: "none",
                            scale: "1",
                            display: "inline-block"
                        }}
                        {...props}
                    >
                        {children}
                    </a>
                ),
            }}
        />
        </div>
    );
};