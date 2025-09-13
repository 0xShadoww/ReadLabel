export const promptTemplates = {
  ingredientAnalysis: (ingredientText) => `
You are a food safety expert specializing in ingredient analysis for Indian consumers. 
Analyze the following ingredient list and provide a comprehensive health assessment.

INGREDIENT LIST:
${ingredientText}

Please analyze these ingredients according to FSSAI (Food Safety and Standards Authority of India) regulations and international food safety standards.

Focus on:
- Trans fats and harmful oils
- Artificial colors and preservatives (E-numbers)
- High sodium content and MSG
- Artificial sweeteners and additives
- Allergens and potential health risks

Provide your analysis in the following JSON format:
{
  "healthScore": [1-10 integer where 10 is healthiest],
  "totalIngredients": [total count of ingredients identified],
  "categories": {
    "safe": ["list of safe ingredients"],
    "moderate": ["ingredients with moderate health concerns"],
    "highConcern": ["ingredients with high health risks"]
  },
  "advice": "Clear consumption recommendation (one sentence)",
  "warnings": ["specific health warnings as array of strings"],
  "details": {
    "ingredient_name": {
      "risk": "high|moderate|low",
      "description": "Brief explanation of health impact"
    }
  }
}

Key considerations:
- Trans fats should always be high concern
- E102, E110, E122, E124, E129 (artificial colors) are moderate to high concern
- E211, E223, E320, E321 (preservatives) are moderate concern
- MSG and high sodium are moderate concern
- Natural ingredients like flour, water, salt in normal amounts are safe
- Be strict but fair in your assessment
- Provide actionable advice for Indian consumers

Return only valid JSON without any additional text or formatting.
`,

  quickAnalysis: (ingredientText) => `
Quickly analyze these food ingredients for health risks: ${ingredientText}

Rate the overall health impact from 1-10 (10 being healthiest) and identify the 3 most concerning ingredients if any.

Keep response under 100 words and focus on actionable advice for consumers.
`,

  allergenCheck: (ingredientText, allergens) => `
Check the following ingredient list for these allergens: ${allergens.join(', ')}

Ingredient list: ${ingredientText}

List any allergens found and potential cross-contamination risks.
`,

  nutritionalContext: (ingredientText, productType) => `
Analyze these ingredients in the context of a ${productType}: ${ingredientText}

Consider typical nutritional expectations for this product category and highlight any unusual or concerning ingredients.
`
}

export default promptTemplates