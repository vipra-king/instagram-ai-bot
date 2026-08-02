async function sendMessage(page, message) {
  const input = page.locator('div[contenteditable="true"][role="textbox"]');

  await input.waitFor({
    state: "visible",
  });

  await input.click();

  // Clear anything already typed
  await input.fill("");

  // Type the message
  await input.fill(message);

  // Send
  await input.press("Enter");
}

module.exports = {
  sendMessage,
};
