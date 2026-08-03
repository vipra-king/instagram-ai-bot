require("dotenv").config();

const {
  launchInstagram,
  openChat,
  fetchMessages,
  getMessageRequest,
  triggerMessageRequest,
  loadMessages,
  watchNewMessages,
  sendMessage,
} = require("./instagram");

const {
  Conversation,
  History,
  MessageQueue,
  Memory,
  ContextEngine,
  waitToReply,
} = require("./bot");

const { generateReply } = require("./ai");

// Profile
const profile = require("./profiles/informal-girl");

// Style
const style = require("./style/vipra-style.json");
const habits = require("./style/vipra-habits.json");
const phrases = require("./style/vipra-phrases.json");
const examples = require("./style/vipra-examples.json");

async function main() {
  const { page } = await launchInstagram();

  // Capture GraphQL once
  await fetchMessages(page);

  // Open chat
  await openChat(page, "informal girl");

  // Capture request and load history
  await triggerMessageRequest(page);

  const request = getMessageRequest();

  const previousMessages = await loadMessages(page, request, 3);

  console.log(`Loaded ${previousMessages.length} messages`);

  // -----------------------------
  // Conversation
  // -----------------------------

  const conversation = new Conversation();
  conversation.addMany(previousMessages);

  const history = new History(conversation);

  // -----------------------------
  // Memory
  // -----------------------------

  const memory = new Memory({
    profile,
    style,
    habits,
    phrases,
    examples,
  });

  // -----------------------------
  // Queue
  // -----------------------------

  const queue = new MessageQueue(2000);

  let isProcessing = false;

  console.log("Watching for new messages...");

  await watchNewMessages(page, async (message) => {
    // Ignore duplicate DOM events
    if (!conversation.add(message)) {
      return;
    }

    // Ignore my own messages
    if (message.sender === "me") {
      return;
    }

    queue.add(message, async (messages) => {
      if (isProcessing) return;

      isProcessing = true;

      try {
        const latest = messages.at(-1);

        console.log("================================");
        console.log(`${messages.length} new message(s)`);

        messages.forEach((m) => console.log(m));

        console.log(`Conversation contains ${conversation.size()} messages`);

        const context = ContextEngine.build(history, latest);

        const reply = await generateReply(context, memory, latest, messages);

        console.log("AI Reply:");
        console.log(reply);

        await waitToReply(latest.text, reply);

        await sendMessage(page, reply);

        conversation.add({
          id: `local-${Date.now()}`,
          sender: "me",
          text: reply,
        });

        console.log("Reply sent.");

        // Don't add a fake local message.
        // Instagram will render it in the DOM.
      } catch (error) {
        console.error("AI Error:", error);
      } finally {
        isProcessing = false;
      }
    });
  });

  page.on("close", () => {
    console.log("Browser closed.");
  });

  await new Promise(() => {});
}

main().catch(console.error);
