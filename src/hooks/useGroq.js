const GROQ_API_KEY = process.env.REACT_APP_GROQ_API_KEY;
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

export async function callGroq(prompt, systemPrompt = '') {
  if (!GROQ_API_KEY || GROQ_API_KEY === 'your_groq_api_key_here') {
    throw new Error('Add your GROQ_API_KEY in .env file');
  }
  const res = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
    model: 'llama-3.3-70b-versatile',
      messages: [
        ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
        { role: 'user', content: prompt },
      ],
      max_tokens: 1024,
      temperature: 0.7,
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Groq API error ${res.status}`);
  }
  const data = await res.json();
  return data.choices[0]?.message?.content || '';
}

export function buildHintPrompt(problem, difficulty, depth, language, topics) {
  const topicStr = topics.length ? ` Topic tags: ${topics.join(', ')}.` : '';
  const depthInstructions = {
    1: `Give 1-2 very gentle nudges only. Ask Socratic guiding questions like "what data structure tracks frequency?" Do NOT reveal the approach. Absolutely NO code snippets.`,
    2: `Give 2-3 hints about the general approach and pattern. Name the technique (e.g. sliding window, two pointers, BFS). Explain why this pattern fits but do NOT show algorithm steps. NO code.`,
    3: `Walk through: (1) brute force idea, (2) key insight for optimization, (3) optimal approach direction, (4) time/space complexity to aim for. Still NO solution code — just direction.`,
  };
  return `You are a DSA mentor helping a student solve a ${difficulty} problem in ${language}.${topicStr}

PROBLEM:
${problem}

INSTRUCTIONS: ${depthInstructions[depth]}

Format your response using ### headings for each hint section. Keep it encouraging and Socratic. NEVER give the full solution or paste working code.`;
}

export function buildComplexityPrompt(problem) {
  return `Analyze this DSA problem:

PROBLEM: ${problem}

Provide:
### Time Complexity
Brute force vs optimal. Explain briefly why using Big-O notation like \`O(n)\`.

### Space Complexity
What space tradeoffs exist? What should the student aim for?

### Pattern Recognition
What algorithmic pattern does this belong to? (e.g. sliding window, two pointers, BFS, DP, greedy, divide & conquer)

### Similar Problems
Name 2-3 classic problems with the same pattern.

Be concise. No solution code.`;
}

export function buildApproachPrompt(problem, difficulty, language) {
  return `For this ${difficulty} DSA problem (in ${language}):

PROBLEM: ${problem}

### Brute Force Direction
How should they think about a naive O(n²) or O(n³) solution first?

### Key Optimization Insight
What single observation unlocks the better solution? (hint only — no code)

### Edge Cases to Consider
List 3-4 specific edge cases they must handle.

### Step-by-Step Logic
Number the high-level steps to think through. Pure logic — absolutely no code.

### Confidence Check
Ask 2 questions the student should be able to answer before coding.`;
}
