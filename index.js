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
  Memory,
  ContextEngine,
  waitToReply,
} = require("./bot");

const { generateReply } = require("./ai");

const profile = require("./profiles/informal-girl");

async function main() {
  const { page } = await launchInstagram();

  await fetchMessages(page);

  await openChat(page, "informal girl");

  await triggerMessageRequest(page);

  const request = getMessageRequest();

  const previousMessages = await loadMessages(page, request, 3);

  console.log(`Loaded ${previousMessages.length} messages`);

  const conversation = new Conversation();
  conversation.addMany(previousMessages);

  const history = new History(conversation);

  const memory = new Memory(profile);

  let isProcessing = false;

  console.log("Watching for new messages...");

  await watchNewMessages(page, "subi", async (message) => {
    // Ignore duplicate messages
    if (!conversation.add(message)) {
      return;
    }

    // Ignore messages sent by me
    if (message.sender === "me") {
      return;
    }

    // Don't process another message while AI is replying
    if (isProcessing) {
      console.log("Already processing a message. Ignoring...");
      return;
    }

    isProcessing = true;

    try {
      console.log("New message received!");
      console.log(message);

      console.log(`Conversation contains ${conversation.size()} messages`);

      const context = ContextEngine.build(history, message);

      const reply = await generateReply(context, memory, message);

      console.log("AI Reply:");
      console.log(reply);

      await waitToReply(message.text, reply);

      await sendMessage(page, reply);

      console.log("Reply sent.");

      // Save AI reply locally
      conversation.add({
        id: `local-${Date.now()}`,
        sender: "me",
        text: reply,
      });
    } catch (error) {
      console.error("AI Error:", error);
    } finally {
      isProcessing = false;
    }
  });

  page.on("close", () => {
    console.log("Browser closed.");
  });

  await new Promise(() => {});
}

main().catch(console.error);
