const { GRAPHQL } = require("./constants");
const { parseGraphQLResponse } = require("./parser");

let messageRequest = null;
let requestHandler = null;

async function fetchMessages(page) {
  messageRequest = null;

  // Remove any previous listener
  if (requestHandler) {
    page.off("request", requestHandler);
  }

  requestHandler = (request) => {
    // Already captured
    if (messageRequest) {
      page.off("request", requestHandler);
      requestHandler = null;
      return;
    }

    if (!request.url().includes("/api/graphql")) return;

    const params = new URLSearchParams(request.postData() || "");

    if (params.get("fb_api_req_friendly_name") !== GRAPHQL.MESSAGE_LIST) {
      return;
    }

    messageRequest = {
      url: request.url(),
      headers: request.headers(),
      form: Object.fromEntries(params.entries()),
    };

    console.log("Captured IGDMessageListOffMsysQuery");

    // Stop listening forever.
    page.off("request", requestHandler);
    requestHandler = null;
  };

  page.on("request", requestHandler);
}

function getMessageRequest() {
  return messageRequest;
}

async function triggerMessageRequest(page) {
  const chat = page.locator('[data-pagelet="IGDMessagesList"]');

  await chat.waitFor();

  while (!messageRequest) {
    await chat.hover();
    await page.mouse.wheel(0, -800);
    await page.waitForTimeout(300);
  }

  console.log("GraphQL request captured automatically.");

  // Return to newest messages
  for (let i = 0; i < 8; i++) {
    await page.mouse.wheel(0, 1200);
    await page.waitForTimeout(100);
  }

  console.log("Returned to latest messages.");
}

async function executeGraphQL(page, requestInfo, form) {
  return await page.evaluate(
    async ({ url, form }) => {
      const body = new URLSearchParams(form).toString();

      const response = await fetch(url, {
        method: "POST",
        credentials: "include",
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          "x-fb-friendly-name": form.fb_api_req_friendly_name,
          "x-fb-lsd": form.lsd,
        },
        body,
      });

      return await response.text();
    },
    {
      url: requestInfo.url,
      form,
    },
  );
}

async function loadLatest20Messages(page, requestInfo) {
  const form = { ...requestInfo.form };
  console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++");
  console.log(JSON.parse(requestInfo.form.variables));
  const result = await executeGraphQL(page, requestInfo, form);

  const json = JSON.parse(result.replace("for (;;);", ""));

  const { messages } = parseGraphQLResponse(json);

  messages.sort((a, b) => a.timestamp - b.timestamp);

  return messages.map(({ timestamp, ...message }) => message);
}

async function loadMessages(page, requestInfo, pages = 3) {
  const allMessages = [];

  let after = JSON.parse(requestInfo.form.variables).after;

  for (let i = 0; i < pages; i++) {
    const form = { ...requestInfo.form };

    const variables = JSON.parse(form.variables);

    variables.after = after;

    form.variables = JSON.stringify(variables);

    const result = await executeGraphQL(page, requestInfo, form);

    const json = JSON.parse(result.replace("for (;;);", ""));

    const { messages, pageInfo } = parseGraphQLResponse(json);

    console.log(`Fetched page ${i + 1}: ${messages.length} messages`);

    allMessages.push(...messages);

    if (!pageInfo.has_next_page) {
      break;
    }

    after = pageInfo.end_cursor;
  }

  allMessages.sort((a, b) => a.timestamp - b.timestamp);

  return allMessages.map(({ timestamp, ...message }) => message);
}

module.exports = {
  fetchMessages,
  getMessageRequest,
  triggerMessageRequest,
  executeGraphQL,
  loadLatest20Messages,
  loadMessages,
};
