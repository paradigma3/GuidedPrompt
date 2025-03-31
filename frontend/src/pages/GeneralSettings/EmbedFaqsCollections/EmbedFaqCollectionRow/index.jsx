// frontend/src/pages/GeneralSettings/EmbedFaqsCollections/EmbedFaqCollectionRow/index.jsx
import React from "react";
import { DotsThreeOutline, LinkSimple } from "@phosphor-icons/react";
import paths from "@/utils/paths";
import { nFormatter } from "@/utils/numbers";

export default function EmbedFaqCollectionRow({ collection }) {

  return (
    <tr className="bg-transparent text-white text-opacity-80 text-sm">
      <th
        scope="row"
        className="px-6 py-4 whitespace-nowrap flex item-center gap-x-1"
      >
        <a
          href={paths.workspace.chat(collection.workspace.slug)} // Link to workspace chat
          target="_blank"
          rel="noreferrer"
          className="text-white flex items-center hover:underline"
        >
          <LinkSimple className="mr-2 w-5 h-5" /> {collection.workspace.name}
        </a>
        <p className="ml-2 text-theme-text-secondary text-xs">Embed ID: {collection.uuid}</p>
      </th>
      <td className="px-6 py-4">
        {nFormatter(collection._count.faqs)}
      </td>
      <td className="px-6 py-4 text-right">
        <button
          onClick={() => window.location.href = paths.settings.embedFaqs(collection.id)} // Link to Embed FAQs Page
          className="font-medium text-blue-600 dark:text-blue-300 px-2 py-1 rounded-lg hover:bg-blue-50 hover:dark:bg-blue-800 hover:dark:bg-opacity-20"
        >
          Manage FAQs
        </button>
      </td>
    </tr>
  );
}
