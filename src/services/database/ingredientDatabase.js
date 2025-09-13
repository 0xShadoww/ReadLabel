class IngredientDatabase {
  constructor() {
    this.database = null
    this.initialized = false
  }

  async initialize() {
    if (this.initialized) return

    try {
      // Load the ingredient database
      const response = await import('../../data/ingredientDatabase.json')
      this.database = response.default || response
      this.initialized = true
      console.log(`Ingredient database loaded: ${Object.keys(this.database.ingredients).length} ingredients`)
    } catch (error) {
      console.error('Failed to load ingredient database:', error)
      // Initialize with minimal fallback data
      this.database = { ingredients: {}, categories: {} }
      this.initialized = true
    }
  }

  async getIngredientRisk(ingredientName) {
    await this.initialize()
    
    if (!ingredientName || typeof ingredientName !== 'string') {
      return 'safe' // Default for invalid input
    }

    const normalizedName = this.normalizeIngredientName(ingredientName)
    
    // Check direct matches first
    const directMatch = this.database.ingredients[normalizedName]
    if (directMatch) {
      return directMatch.category || 'safe'
    }

    // Check for partial matches and common variations
    const risk = this.findPartialMatch(normalizedName)
    return risk
  }

  async getIngredientInfo(ingredientName) {
    await this.initialize()
    
    const normalizedName = this.normalizeIngredientName(ingredientName)
    const info = this.database.ingredients[normalizedName]
    
    if (info) {
      return {
        name: ingredientName,
        category: info.category || 'safe',
        description: info.description || 'No additional information available',
        warning: info.warning || null,
        alternatives: info.alternatives || []
      }
    }

    // Return fallback info based on partial matching
    return this.generateFallbackInfo(ingredientName, normalizedName)
  }

  normalizeIngredientName(name) {
    return name
      .toLowerCase()
      .trim()
      // Remove parentheses and brackets content
      .replace(/\([^)]*\)/g, '')
      .replace(/\[[^\]]*\]/g, '')
      // Normalize spaces and punctuation
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  }

  findPartialMatch(normalizedName) {
    // High-concern keywords (order matters - check most specific first)
    const highConcernPatterns = [
      /trans\s*fat/i,
      /partially\s*hydrogenated/i,
      /hydrogenated.*oil/i,
      /e102|tartrazine/i,
      /e110|sunset yellow/i,
      /e122|carmoisine/i,
      /e124|ponceau/i,
      /e129|allura red/i,
      /e211|sodium benzoate/i,
      /e223|sodium metabisulfite/i,
      /e320|bha/i,
      /e321|bht/i,
      /aspartame/i,
      /sodium nitrite/i,
      /sodium nitrate/i
    ]

    // Moderate concern patterns
    const moderateConcernPatterns = [
      /palm\s*oil/i,
      /msg|monosodium glutamate/i,
      /high fructose corn syrup/i,
      /corn syrup/i,
      /artificial\s*(color|flavou?r|preservative)/i,
      /e\d{3,4}/i, // Generic E-number pattern
      /sodium/i,
      /potassium sorbate/i,
      /citric acid/i,
      /natural flavou?ring/i
    ]

    // Check high concern first
    for (const pattern of highConcernPatterns) {
      if (pattern.test(normalizedName)) {
        return 'highConcern'
      }
    }

    // Check moderate concern
    for (const pattern of moderateConcernPatterns) {
      if (pattern.test(normalizedName)) {
        return 'moderate'
      }
    }

    // Safe by default for unrecognized ingredients
    return 'safe'
  }

  generateFallbackInfo(originalName, normalizedName) {
    const category = this.findPartialMatch(normalizedName)
    
    let description = 'This ingredient was not found in our database.'
    let warning = null

    if (category === 'highConcern') {
      description = 'This ingredient may pose significant health risks and should be consumed with caution.'
      warning = 'Consider avoiding products with this ingredient or consuming them rarely.'
    } else if (category === 'moderate') {
      description = 'This ingredient may have some health concerns when consumed regularly.'
      warning = 'Consume in moderation as part of a balanced diet.'
    } else {
      description = 'This appears to be a generally safe ingredient based on common food safety guidelines.'
    }

    return {
      name: originalName,
      category,
      description,
      warning,
      alternatives: []
    }
  }

  // Get statistics about the database
  getStats() {
    if (!this.initialized || !this.database.ingredients) {
      return { total: 0, safe: 0, moderate: 0, highConcern: 0 }
    }

    const ingredients = Object.values(this.database.ingredients)
    return {
      total: ingredients.length,
      safe: ingredients.filter(i => i.category === 'safe').length,
      moderate: ingredients.filter(i => i.category === 'moderate').length,
      highConcern: ingredients.filter(i => i.category === 'highConcern').length
    }
  }

  // Search for ingredients by name
  async searchIngredients(query, limit = 10) {
    await this.initialize()
    
    if (!query || query.length < 2) {
      return []
    }

    const normalizedQuery = this.normalizeIngredientName(query)
    const results = []

    for (const [name, info] of Object.entries(this.database.ingredients)) {
      if (name.includes(normalizedQuery) && results.length < limit) {
        results.push({
          name: info.displayName || name,
          category: info.category,
          description: info.description
        })
      }
    }

    return results.sort((a, b) => {
      // Sort by category risk level (high concern first)
      const riskOrder = { highConcern: 3, moderate: 2, safe: 1 }
      return riskOrder[b.category] - riskOrder[a.category]
    })
  }

  // Batch analyze multiple ingredients
  async analyzeIngredientList(ingredientList) {
    const results = {
      safe: [],
      moderate: [],
      highConcern: [],
      total: 0
    }

    for (const ingredient of ingredientList) {
      if (typeof ingredient === 'string' && ingredient.trim()) {
        const category = await this.getIngredientRisk(ingredient)
        results[category].push(ingredient.trim())
        results.total++
      }
    }

    return results
  }
}

// Create singleton instance
export const ingredientDatabase = new IngredientDatabase()

export default ingredientDatabase