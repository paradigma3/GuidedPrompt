/*
  Warnings:

  - Made the column `embed_config_id` on table `FAQ` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateTable
CREATE TABLE "Suggestion" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "url" TEXT,
    "faq_id" INTEGER NOT NULL,
    CONSTRAINT "Suggestion_faq_id_fkey" FOREIGN KEY ("faq_id") REFERENCES "FAQ" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Widget" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "label" TEXT,
    "url" TEXT,
    "images" TEXT,
    "faq_id" INTEGER NOT NULL,
    CONSTRAINT "Widget_faq_id_fkey" FOREIGN KEY ("faq_id") REFERENCES "FAQ" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

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
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
