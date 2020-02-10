import SanityGrid from "../lib";
import Tabs from "sanity-plugin-tabs";

export default {
  title: "Sanity Grid",
  name: "sanitygrid",
  type: "object",
  inputComponent: Tabs,
  fieldsets: [
    { name: "content", title: "Grid Content" },
    { name: "settings", title: "Grid Settings" }
  ],
  options: {
    layout: "object"
  },
  fields: [
    // Grid Item
    {
      fieldset: "content",
      name: "grid",
      type: "array",
      of: [
        {
          title: "Grid Item",
          name: "griditem",
          type: "object",
          fields: [
            {
              title: "Username",
              name: "username",
              type: "string"
            },
            {
              title: "Grid Image",
              name: "gridimg",
              type: "image"
            },
            {
              title: "Grid Column",
              description:
                "<start-line> / <end-line> | <start-line> / span <value>",
              name: "columns",
              type: "string"
            },
            {
              title: "Grid Row",
              description:
                "<start-line> / <end-line> | <start-line> / span <value>",
              name: "rows",
              type: "string"
            }
          ],
          preview: {
            select: {
              title: "username",
              gridCol: "grid_column",
              gridRow: "grid_row",
              media: "gridimg"
            }
          }
        }
      ],
      inputComponent: SanityGrid
    },
    // Grid Settings
    {
      fieldset: "settings",
      name: "gridsettings",
      type: "object",
      fields: [
        {
          title: "Grid Template Columns",
          description: "e.g. repeat(12, 1fr)",
          name: "columns",
          type: "string"
        },
        {
          title: "Grid Template Rows",
          description: "e.g. repeat(12, 1fr)",
          name: "rows",
          type: "string"
        }
      ]
    }
  ]
};
