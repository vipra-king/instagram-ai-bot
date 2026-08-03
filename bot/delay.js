function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function calculateTypingDelay(receivedMessage, reply) {
  const receivedLength = receivedMessage.trim().length;
  const replyLength = reply.trim().length;

  // Use whichever is longer
  const length = Math.max(receivedLength, replyLength);

  let delay;

  if (length <= 5) {
    delay = random(1000, 2000);
  } else if (length <= 15) {
    delay = random(2000, 3500);
  } else if (length <= 30) {
    delay = random(3500, 5000);
  } else if (length <= 60) {
    delay = random(5000, 7000);
  } else {
    delay = random(7000, 10000);
  }

  return delay;
}

async function waitToReply(receivedMessage, reply) {
  const delay = calculateTypingDelay(receivedMessage, reply);

  console.log(`Typing for ${(delay / 1000).toFixed(1)}s...`);

  return new Promise((resolve) => setTimeout(resolve, delay));
}

module.exports = {
  waitToReply,
};
