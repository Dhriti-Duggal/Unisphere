const { Client } = require("@botpress/client");

let client = null;

// Initialize client with the provided Bot API Key
client = new Client({
  token: process.env.BOTPRESS_PAT || "bp_bak_wB3b775m6tyHfKSCK7rp8pCzYuZ9JIq5xlwN",
  botId: "061c725e-6ae7-47cc-b126-509d9a0f1202",
  workspaceId: "wkspace_01KS20GJ49C1QA3RDKB7J177VE",
});

/**
 * Syncs the user's generated context to the 'UserContext' table in Botpress.
 * Requires the table to be created in Botpress Studio with at least:
 * - userId (String)
 * - contextSummary (String)
 */
async function syncUserContextToBotpress(userId, contextData) {
  if (!client) {
    console.warn("[Botpress] Skipping sync: BOTPRESS_PAT is not configured in environment.");
    return;
  }

  try {
    // 1. Find the UserContext table
    const { tables } = await client.listTables({});
    const contextTable = tables.find(t => t.name.toLowerCase() === "usercontext");

    if (!contextTable) {
      console.warn("[Botpress] Skipping sync: Table 'UserContext' not found in workspace. Please create it.");
      return;
    }

    // 2. Check if a row already exists for this user
    const { rows } = await client.findTableRows({
      table: contextTable.id,
      filter: { userId: userId }
    });

    // 3. Insert or Update the row
    if (rows && rows.length > 0) {
      const rowId = rows[0].id;
      await client.updateTableRows({
        table: contextTable.id,
        rows: [{ 
          id: rowId, 
          userId: userId, 
          contextSummary: contextData.contextSummary 
        }]
      });
      console.log(`[Botpress] Updated existing context row for user ${userId}`);
    } else {
      await client.createTableRows({
        table: contextTable.id,
        rows: [{ 
          userId: userId, 
          contextSummary: contextData.contextSummary 
        }]
      });
      console.log(`[Botpress] Created new context row for user ${userId}`);
    }
  } catch (error) {
    console.error("[Botpress] Failed to sync context to table:", error.message);
  }
}

module.exports = {
  syncUserContextToBotpress
};
