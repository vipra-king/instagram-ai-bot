function tokenize(text = "") {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function similarity(a, b) {
  const aWords = new Set(tokenize(a));
  const bWords = new Set(tokenize(b));

  let score = 0;

  for (const word of aWords) {
    if (bWords.has(word)) {
      score++;
    }
  }

  return score;
}

function retrieveExamples(latestMessage, examples, limit = 5) {
  if (!examples?.length) return [];

  const query =
    typeof latestMessage === "string" ? latestMessage : latestMessage.text;

  const scored = [];

  for (const example of examples) {
    if (!example.conversation?.length) continue;

    // Look at what "Her" said first
    const firstHer = example.conversation.find(
      (m) => m.sender.toLowerCase() === "her",
    );

    if (!firstHer) continue;

    const score = similarity(query, firstHer.text);

    if (score > 0) {
      scored.push({
        score,
        example,
      });
    }
  }

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((x) => x.example);
}

module.exports = {
  retrieveExamples,
};
