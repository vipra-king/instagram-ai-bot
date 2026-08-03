async function watchNewMessages(page, onMessage) {
  await page.exposeFunction("onInstagramMessage", async (message) => {
    await onMessage(message);
  });

  await page.evaluate(() => {
    const chat = document.querySelector('[data-pagelet="IGDMessagesList"]');

    if (!chat) return;

    let debounceTimer = null;
    let lastFingerprint = "";

    function parseGroup(group) {
      const texts = [...group.querySelectorAll("*")]
        .map((n) => n.textContent?.trim())
        .filter(Boolean);

      const unique = [...new Set(texts)];

      if (unique.length === 0) return null;

      const hasProfile = !!group.querySelector('a[href^="/"]');

      let text = "";
      let replyTo = null;

      if (unique[0].startsWith("You replied to")) {
        text = unique.at(-1);
        replyTo = unique.length >= 3 ? unique.at(-2) : null;
      } else if (unique[0].includes("replied to you")) {
        text = unique.at(-1);
        replyTo = unique.length >= 3 ? unique.at(-2) : null;
      } else if (unique.length > 1) {
        text = unique[1];
      } else {
        text = unique[0];
      }

      return {
        sender: hasProfile ? "friend" : "me",
        text,
        replyTo,
      };
    }

    function getNewestMessage() {
      const groups = [...chat.querySelectorAll('div[role="group"]')];

      for (let i = groups.length - 1; i >= 0; i--) {
        const msg = parseGroup(groups[i]);

        if (msg && msg.text) {
          return msg;
        }
      }

      return null;
    }

    const observer = new MutationObserver(() => {
      clearTimeout(debounceTimer);

      debounceTimer = setTimeout(async () => {
        const message = getNewestMessage();

        if (!message) return;

        // Fingerprint
        const fingerprint =
          message.sender +
          "|" +
          message.text +
          "|" +
          message.replyTo +
          "|" +
          chat.querySelectorAll('div[role="group"]').length;

        if (fingerprint === lastFingerprint) {
          return;
        }

        lastFingerprint = fingerprint;

        await window.onInstagramMessage(message);
      }, 250);
    });

    observer.observe(chat, {
      childList: true,
      subtree: true,
    });

    window.__instagramObserver = observer;
  });
}

async function stopWatching(page) {
  await page.evaluate(() => {
    window.__instagramObserver?.disconnect();
    window.__instagramObserver = null;
  });
}

module.exports = {
  watchNewMessages,
  stopWatching,
};
