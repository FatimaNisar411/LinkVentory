// Simple fuzzy search utility
export function fuzzySearch(query: string, text: string): boolean {
  if (!query.trim()) return true
  
  const normalizedQuery = query.toLowerCase().trim()
  const normalizedText = text.toLowerCase()
  
  // Direct substring match (highest priority)
  if (normalizedText.includes(normalizedQuery)) {
    return true
  }
  
  // For short queries (1-2 characters), be more strict - only substring matches
  if (normalizedQuery.length <= 2) {
    return false
  }
  
  // Fuzzy character matching for longer queries
  let queryIndex = 0
  let consecutiveMatches = 0
  let maxConsecutive = 0
  
  for (let i = 0; i < normalizedText.length && queryIndex < normalizedQuery.length; i++) {
    if (normalizedText[i] === normalizedQuery[queryIndex]) {
      queryIndex++
      consecutiveMatches++
      maxConsecutive = Math.max(maxConsecutive, consecutiveMatches)
    } else {
      consecutiveMatches = 0
    }
  }
  
  // Require that we matched all characters AND have some consecutive matches
  return queryIndex === normalizedQuery.length && maxConsecutive >= Math.min(3, normalizedQuery.length / 2)
}

// Search through link properties
export function searchLinks(links: any[], query: string) {
  if (!query.trim()) return links
  
  return links.filter(link => {
    const searchableText = [
      link.title,
      link.url,
      link.note || ''
    ].join(' ')
    
    return fuzzySearch(query, searchableText)
  })
}
