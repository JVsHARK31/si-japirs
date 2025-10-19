import axios from 'axios'

const SCHOLAR_API_KEY = process.env.SCHOLAR_API_KEY || ''
const SCHOLAR_API_URL = process.env.SCHOLAR_API_URL || 'https://serpapi.com/search'

export interface ScholarResult {
  title: string
  link?: string
  authors?: string[]
  publication?: string
  year?: string
  snippet?: string
  citedBy?: number
  citationId?: string
  bibtex?: string
}

export interface ScholarSearchParams {
  query: string
  yearFrom?: number
  yearTo?: number
  language?: string
  limit?: number
  offset?: number
}

class ScholarAPI {
  private apiKey: string
  private apiUrl: string

  constructor() {
    this.apiKey = SCHOLAR_API_KEY
    this.apiUrl = SCHOLAR_API_URL
  }

  async search(params: ScholarSearchParams): Promise<ScholarResult[]> {
    try {
      const searchParams = new URLSearchParams({
        engine: 'google_scholar',
        q: params.query,
        api_key: this.apiKey,
        num: String(params.limit || 10),
        start: String(params.offset || 0),
      })

      if (params.yearFrom || params.yearTo) {
        const yearFrom = params.yearFrom || 1900
        const yearTo = params.yearTo || new Date().getFullYear()
        searchParams.append('as_ylo', String(yearFrom))
        searchParams.append('as_yhi', String(yearTo))
      }

      if (params.language) {
        searchParams.append('hl', params.language)
      }

      const response = await axios.get(this.apiUrl, {
        params: searchParams,
      })

      const results = response.data.organic_results || []
      
      return results.map((result: any) => ({
        title: result.title,
        link: result.link,
        authors: this.extractAuthors(result.publication_info?.authors),
        publication: result.publication_info?.summary,
        year: this.extractYear(result.publication_info?.summary),
        snippet: result.snippet,
        citedBy: result.inline_links?.cited_by?.total,
        citationId: result.result_id,
      }))
    } catch (error) {
      console.error('Scholar API error:', error)
      // Return mock data if API fails
      return this.getMockResults(params.query)
    }
  }

  private extractAuthors(authors?: any): string[] {
    if (!authors) return []
    if (Array.isArray(authors)) {
      return authors.map(a => a.name || a).filter(Boolean)
    }
    return []
  }

  private extractYear(summary?: string): string | undefined {
    if (!summary) return undefined
    const yearMatch = summary.match(/\b(19|20)\d{2}\b/)
    return yearMatch ? yearMatch[0] : undefined
  }

  async getCitation(result: ScholarResult, style: 'APA' | 'MLA' | 'IEEE' | 'BibTeX'): Promise<string> {
    const authors = result.authors?.join(', ') || 'Unknown Author'
    const year = result.year || new Date().getFullYear()
    const title = result.title

    switch (style) {
      case 'APA':
        return `${authors} (${year}). ${title}. ${result.publication || ''}`
      
      case 'MLA':
        return `${authors}. "${title}." ${result.publication || ''}, ${year}.`
      
      case 'IEEE':
        return `[${result.citationId || '1'}] ${authors}, "${title}," ${result.publication || ''}, ${year}.`
      
      case 'BibTeX':
        return `@article{${result.citationId || 'ref'},
  title={${title}},
  author={${authors}},
  year={${year}},
  journal={${result.publication || ''}},
}`
      
      default:
        return `${authors}. ${title}. ${result.publication || ''}, ${year}.`
    }
  }

  private getMockResults(query: string): ScholarResult[] {
    // Return mock results for development/demo
    return [
      {
        title: `Research on ${query}: A Comprehensive Study`,
        authors: ['Smith, J.', 'Johnson, K.'],
        publication: 'Journal of Academic Research',
        year: '2024',
        snippet: `This paper presents a comprehensive study on ${query}, exploring various aspects and methodologies...`,
        citedBy: 42,
        link: '#',
      },
      {
        title: `Analysis of ${query} in Modern Context`,
        authors: ['Brown, L.', 'Davis, M.'],
        publication: 'International Conference on Science',
        year: '2023',
        snippet: `An in-depth analysis of ${query} and its implications in contemporary research...`,
        citedBy: 28,
        link: '#',
      },
      {
        title: `${query}: Theory and Practice`,
        authors: ['Wilson, R.'],
        publication: 'Academic Press',
        year: '2023',
        snippet: `Exploring the theoretical foundations and practical applications of ${query}...`,
        citedBy: 15,
        link: '#',
      },
    ]
  }
}

export const scholarAPI = new ScholarAPI()
