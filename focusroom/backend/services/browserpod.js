import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

class BrowserPodService {
  constructor() {
    this.apiKey = process.env.BROWSERPOD_API_KEY;
    this.baseUrl = process.env.BROWSERPOD_URL || 'https://api.browserpod.io';
    
    if (!this.apiKey) {
      console.warn('⚠️  BROWSERPOD_API_KEY not set - URL conversion will fail');
    }
  }

  async extractWebContent(url) {
    if (!this.apiKey) {
      throw new Error('BrowserPod API key not configured');
    }

    try {
      console.log(`📡 Fetching content from: ${url}`);
      
      const response = await axios.post(
        `${this.baseUrl}/v1/browse`,
        {
          apiKey: this.apiKey,
          url: url,
          actions: [
            { type: 'waitForSelector', selector: 'body' },
            { 
              type: 'evaluate', 
              script: this.getExtractionScript()
            }
          ]
        },
        {
          timeout: 30000, // 30 second timeout
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.data || !response.data.result) {
        throw new Error('No result returned from BrowserPod');
      }

      console.log(`✓ Successfully extracted content (${response.data.result.wordCount} words)`);
      
      return response.data.result;
    } catch (error) {
      console.error('BrowserPod error:', error.message);
      
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }
      
      console.log('⚠️ Falling back to simpleFetch due to BrowserPod API error...');
      try {
        return await this.simpleFetch(url);
      } catch (fallbackError) {
        throw new Error(`Failed to extract web content (BrowserPod and Fallback failed): ${error.message}`);
      }
    }
  }

  getExtractionScript() {
    return `
      // Remove all noise elements
      const noiseSelectors = [
        'script', 'style', 'nav', 'aside', 'header', 'footer',
        '.ad', '.advertisement', '.sidebar', '.menu', '.navigation',
        '.social-share', '.comments', '.related-posts', '[role="banner"]',
        '[role="navigation"]', '[role="complementary"]'
      ];
      
      noiseSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => el.remove());
      });
      
      // Find main content area
      const mainContent = 
        document.querySelector('main') ||
        document.querySelector('article') ||
        document.querySelector('[role="main"]') ||
        document.querySelector('.content') ||
        document.querySelector('#content') ||
        document.querySelector('.post-content') ||
        document.querySelector('.article-content') ||
        document.body;
      
      // Extract structured content
      const title = document.querySelector('h1')?.innerText || document.title;
      
      const headings = Array.from(mainContent.querySelectorAll('h2, h3, h4'))
        .map(h => ({
          level: h.tagName,
          text: h.innerText.trim()
        }))
        .filter(h => h.text.length > 0);
      
      const paragraphs = Array.from(mainContent.querySelectorAll('p'))
        .map(p => p.innerText.trim())
        .filter(t => t.length > 30); // Filter out short snippets
      
      const lists = Array.from(mainContent.querySelectorAll('ul, ol'))
        .map(list => 
          Array.from(list.querySelectorAll('li')).map(li => li.innerText.trim())
        )
        .filter(list => list.length > 0);
      
      // Combine into clean text
      const cleanText = paragraphs.join('\\n\\n');
      const wordCount = cleanText.split(/\\s+/).filter(w => w.length > 0).length;
      
      return {
        title: title.trim(),
        headings: headings,
        paragraphs: paragraphs,
        lists: lists,
        content: cleanText,
        wordCount: wordCount,
        url: window.location.href
      };
    `;
  }

  // Fallback: Simple fetch for static pages (when BrowserPod not available)
  async simpleFetch(url) {
    try {
      const response = await axios.get(url, {
        timeout: 10000,
        headers: {
          'User-Agent': 'FocusRoom/1.0 (Educational Tool)'
        }
      });

      // Very basic HTML parsing (not as good as BrowserPod)
      const html = response.data;
      const text = html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      return {
        title: 'Extracted Content',
        content: text,
        wordCount: text.split(/\s+/).length,
        url: url,
        method: 'simple_fetch'
      };
    } catch (error) {
      throw new Error(`Simple fetch failed: ${error.message}`);
    }
  }
}

export default new BrowserPodService();
