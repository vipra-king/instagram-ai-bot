async function watchNewMessages(page, friendName, onMessage) {
  await page.exposeFunction("onInstagramMessage", async (message) => {
    await onMessage(message);
  });

  await page.evaluate((friendName) => {
    const chat = document.querySelector('[data-pagelet="IGDMessagesList"]');

    if (!chat) return;

    // Remember messages we've already emitted
    const seen = new Set();

    function parseMessage(group) {
      const allTexts = [...group.querySelectorAll("*")]
        .map((n) => n.textContent?.trim())
        .filter(Boolean);

      const unique = [...new Set(allTexts)];

      const hasProfile = !!group.querySelector('a[href^="/"]');

      if (unique.length === 0) return null;

      let message;

      if (unique[0].startsWith("You replied to")) {
        message = {
          sender: "me",
          text: unique.at(-1),
          replyTo: unique.length >= 3 ? unique[unique.length - 2] : null,
        };
      } else if (unique[0].includes("replied to you")) {
        message = {
          sender: friendName,
          text: unique.at(-1),
          replyTo: unique.length >= 3 ? unique[unique.length - 2] : null,
        };
      } else if (unique.length > 1) {
        const reactedWith =
          unique[2] && !unique[2].startsWith("IGD ") ? unique[2] : undefined;

        message = {
          sender: hasProfile ? friendName : "me",
          text: unique[1],
          ...(reactedWith && { reactedWith }),
        };
      } else {
        message = {
          sender: hasProfile ? friendName : "me",
          text: unique[0],
        };
      }

      return message;
    }

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (!(node instanceof HTMLElement)) continue;

          const group = node.matches?.('div[role="group"]')
            ? node
            : node.querySelector?.('div[role="group"]');

          if (!group) continue;

          const message = parseMessage(group);

          if (!message) continue;

          // Ignore my own messages
          if (message.sender === "me") continue;

          // Ignore duplicates
          const key = `${message.sender}:${message.text}`;

          if (seen.has(key)) continue;

          seen.add(key);

          window.onInstagramMessage(message);
        }
      }
    });

    observer.observe(chat, {
      childList: true,
      subtree: true,
    });

    window.__instagramObserver = observer;
  }, friendName);
}

async function stopWatching(page) {
  await page.evaluate(() => {
    if (window.__instagramObserver) {
      window.__instagramObserver.disconnect();
      window.__instagramObserver = null;
    }
  });
}

module.exports = {
  watchNewMessages,
  stopWatching,
};
