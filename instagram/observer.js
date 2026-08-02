async function watchNewMessages(page, friendName, onMessage) {
  await page.exposeFunction("onInstagramMessage", async (message) => {
    await onMessage(message);
  });

  await page.evaluate((friendName) => {
    const chat = document.querySelector('[data-pagelet="IGDMessagesList"]');

    if (!chat) return;

    function parseMessage(group) {
      const allTexts = [...group.querySelectorAll("*")]
        .map((n) => n.textContent?.trim())
        .filter(Boolean);

      const unique = [...new Set(allTexts)];

      const hasProfile = !!group.querySelector('a[href^="/"]');

      if (unique.length === 0) return null;

      if (unique[0].startsWith("You replied to")) {
        return {
          sender: "me",
          text: unique.at(-1),
          replyTo: unique.length >= 3 ? unique[unique.length - 2] : null,
        };
      }

      if (unique[0].includes("replied to you")) {
        return {
          sender: friendName,
          text: unique.at(-1),
          replyTo: unique.length >= 3 ? unique[unique.length - 2] : null,
        };
      }

      if (unique.length > 1) {
        const reactedWith =
          unique[2] && !unique[2].startsWith("IGD ") ? unique[2] : undefined;

        return {
          sender: hasProfile ? friendName : "me",
          text: unique[1],
          ...(reactedWith && { reactedWith }),
        };
      }

      return {
        sender: hasProfile ? friendName : "me",
        text: unique[0],
      };
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
