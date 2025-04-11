/*
  Warnings:

  - You are about to drop the column `embedding` on the `FAQ` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `embed_configs` table. All the data in the column will be lost.
  - Made the column `embed_config_id` on table `FAQ` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_FAQ" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "embed_config_id" INTEGER NOT NULL,
    CONSTRAINT "FAQ_embed_config_id_fkey" FOREIGN KEY ("embed_config_id") REFERENCES "embed_configs" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_FAQ" ("answer", "createdAt", "embed_config_id", "id", "question", "updatedAt") SELECT "answer", "createdAt", "embed_config_id", "id", "question", "updatedAt" FROM "FAQ";
DROP TABLE "FAQ";
ALTER TABLE "new_FAQ" RENAME TO "FAQ";
CREATE TABLE "new_embed_configs" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "uuid" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "workspace_id" INTEGER NOT NULL,
    "usersId" INTEGER,
    "allowlist_domains" TEXT,
    "allow_model_override" BOOLEAN NOT NULL DEFAULT false,
    "allow_prompt_override" BOOLEAN NOT NULL DEFAULT false,
    "allow_temperature_override" BOOLEAN NOT NULL DEFAULT false,
    "max_chats_per_day" INTEGER,
    "max_chats_per_session" INTEGER,
    "chat_mode" TEXT NOT NULL DEFAULT 'query',
    "createdBy" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "embed_configs_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "embed_configs_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_embed_configs" ("allow_model_override", "allow_prompt_override", "allow_temperature_override", "allowlist_domains", "chat_mode", "createdAt", "createdBy", "enabled", "id", "max_chats_per_day", "max_chats_per_session", "updatedAt", "usersId", "uuid", "workspace_id") SELECT "allow_model_override", "allow_prompt_override", "allow_temperature_override", "allowlist_domains", "chat_mode", "createdAt", "createdBy", "enabled", "id", "max_chats_per_day", "max_chats_per_session", "updatedAt", "usersId", "uuid", "workspace_id" FROM "embed_configs";
DROP TABLE "embed_configs";
ALTER TABLE "new_embed_configs" RENAME TO "embed_configs";
CREATE UNIQUE INDEX "embed_configs_uuid_key" ON "embed_configs"("uuid");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
