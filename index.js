require("dotenv").config();

const {
  launchInstagram,
  openChat,
  fetchMessages,
  getMessageRequest,
  triggerMessageRequest,
  loadMessages,
  watchNewMessages,
} = require("./instagram");

async function main() {
  const { page } = await launchInstagram();

  await fetchMessages(page);

  await openChat(page, "informal girl");

  await triggerMessageRequest(page);

  const request = getMessageRequest();

  const history = await loadMessages(page, request, 3);

  console.log(`Loaded ${history.length} messages`);

  console.log("Watching for new messages...");

  await watchNewMessages(page, "subi", async (message) => {
    console.log("New message received!");
    console.log(message);

    // AI reply will go here
  });

  page.on("close", () => {
    console.log("Browser closed.");
  });

  await new Promise(() => {});
}

main().catch(console.error);
