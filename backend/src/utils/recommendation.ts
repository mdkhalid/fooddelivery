/**
 * Recommendation algorithm helpers.
 * These provide the core logic for collaborative filtering and content-based scoring.
 */

interface TasteVector {
  cuisineAffinities: Record<string, number>; // cuisine -> affinity score 0-1
  priceSensitivity: number; // 0=budget, 0.5=mid, 1=premium
  spiceTolerance: number; // 1-5
  dietaryRestrictions: string[];
  allergens: string[];
}

interface RestaurantFeatures {
  id: string;
  cuisineTags: string[];
  rating: number;
  avgPrice: number;
  avgSpiceLevel?: number;
  dietaryOptions: string[];
  allergenInfo: string[];
  distance?: number;
  isOpen: boolean;
}

/**
 * Compute cosine similarity between two vectors.
 */
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;
  let dotProduct = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Score a restaurant based on user's taste profile.
 * Returns a score 0-100 where higher = more relevant.
 */
export function scoreRestaurantForUser(
  restaurant: RestaurantFeatures,
  taste: TasteVector | null,
  lat?: number,
  lng?: number
): number {
  let score = 0;

  if (!taste) {
    // No taste profile — default to popularity + proximity
    score += restaurant.rating * 10;
    score += restaurant.isOpen ? 20 : 0;
    if (restaurant.distance !== undefined) {
      score -= restaurant.distance * 0.5;
    }
    return Math.max(0, score);
  }

  // Cuisine affinity match (0-30 points)
  const cuisineScore = restaurant.cuisineTags.reduce((sum, tag) => {
    return sum + (taste.cuisineAffinities[tag] || 0) * 30;
  }, 0);
  score += cuisineScore;

  // Rating (0-15 points)
  score += restaurant.rating * 3;

  // Open status (0-10 points)
  score += restaurant.isOpen ? 10 : 0;

  // Distance penalty (0 to -25)
  if (restaurant.distance !== undefined) {
    score -= Math.min(restaurant.distance * 1.5, 25);
  }

  // Price sensitivity match (0-10 points)
  const userPriceLevel = taste.priceSensitivity; // 0-1
  const restPriceLevel = restaurant.avgPrice / 50; // Normalize assuming avg max $50
  const priceMatch = 10 - Math.abs(userPriceLevel - restPriceLevel) * 10;
  score += Math.max(0, priceMatch);

  // Dietary match (0-10 points) — penalty if user has restrictions and restaurant doesn't accommodate
  if (taste.dietaryRestrictions.length > 0) {
    const matched = taste.dietaryRestrictions.filter((d) => restaurant.dietaryOptions.includes(d)).length;
    const ratio = matched / taste.dietaryRestrictions.length;
    score += ratio * 10;
  }

  // Spice tolerance match (0-5 points)
  if (restaurant.avgSpiceLevel && taste.spiceTolerance) {
    const spiceDiff = Math.abs(restaurant.avgSpiceLevel - taste.spiceTolerance);
    score += Math.max(0, 5 - spiceDiff * 2);
  }

  // Diversity bonus — avoid same cuisine saturation
  // (Applied externally based on user's recent orders)

  return Math.max(0, Math.min(100, score));
}

/**
 * Compute "users who ordered X also ordered Y" association.
 */
export function computeAssociation(items: string[], orderHistory: { items: string[] }[]): Map<string, Map<string, number>> {
  const coOccurrence = new Map<string, Map<string, number>>();

  for (const order of orderHistory) {
    for (let i = 0; i < order.items.length; i++) {
      for (let j = i + 1; j < order.items.length; j++) {
        const a = order.items[i];
        const b = order.items[j];
        if (!coOccurrence.has(a)) coOccurrence.set(a, new Map());
        if (!coOccurrence.has(b)) coOccurrence.set(b, new Map());
        coOccurrence.get(a)!.set(b, (coOccurrence.get(a)!.get(b) || 0) + 1);
        coOccurrence.get(b)!.set(a, (coOccurrence.get(b)!.get(a) || 0) + 1);
      }
    }
  }

  return coOccurrence;
}

/**
 * Levenshtein distance for search typo correction.
 */
export function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b[i - 1] === a[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

/**
 * Get "did you mean?" suggestion based on edit distance.
 */
export function getSuggestion(query: string, dictionary: string[]): string | null {
  if (dictionary.includes(query)) return null;

  const threshold = 3;
  let bestMatch: string | null = null;
  let bestDistance = Infinity;

  for (const word of dictionary) {
    const dist = levenshteinDistance(query.toLowerCase(), word.toLowerCase());
    if (dist < bestDistance && dist <= threshold) {
      bestDistance = dist;
      bestMatch = word;
    }
  }

  return bestMatch;
}

/**
 * Decay affinity score over time.
 */
export function decayScore(score: number, monthsSinceLastOrder: number): number {
  if (monthsSinceLastOrder <= 0) return score;
  const decayFactor = Math.pow(0.8, monthsSinceLastOrder); // 20% decay per month
  return score * decayFactor;
}
