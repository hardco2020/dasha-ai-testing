const dasha = require("@dasha.ai/sdk");

const app = await dasha.deploy("path/to/app");

await app.start();

const conv = app.createConversation();
await dasha.chat.createConsoleChat(conv);
await conv.execute({ channel: "text" });

await app.stop();
app.dispose();