/**
 * Simple HTML sanitizer to remove potentially dangerous content
 * This is a basic implementation - for production, consider using a library like DOMPurify
 */
export const sanitizeHtml = (html: string): string => {
    if (!html) return '';
    
    // Remove script tags and their content
    html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    
    // Remove event handlers (onclick, onload, etc.)
    html = html.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');
    
    // Remove javascript: URLs
    html = html.replace(/javascript:/gi, '');
    
    // Remove data: URLs (except for images)
    html = html.replace(/data:(?!image\/)/gi, '');
    
    // Remove iframe tags
    html = html.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
    
    // Remove object and embed tags
    html = html.replace(/<(object|embed)\b[^<]*(?:(?!<\/(object|embed)>)<[^<]*)*<\/(object|embed)>/gi, '');
    
    // Preserve spacing around hr tags
    html = html.replace(/<hr\s*\/?>/gi, '<hr style="margin: 12px 0; border: none; border-top: 1px solid #000000;" />');
    
    // Convert email addresses to clickable links if they're not already
    html = html.replace(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g, '<a href="mailto:$1" style="color: #1a73e8; text-decoration: underline;">$1</a>');
    
    return html;
};

/**
 * Extract plain text from HTML content
 */
export const htmlToText = (html: string): string => {
    if (!html) return '';
    
    // Create a temporary div to parse HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    // Get text content
    return tempDiv.textContent || tempDiv.innerText || '';
}; 