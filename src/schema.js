import SanityGrid from "../lib";
import Tabs from "../../components/tabs";

export default {
  title: "Sanity Grid",
  name: "sanitygrid",
  type: "object",
  inputComponent: Tabs,
  fieldsets: [
    { name: "content", title: "Content" },
    { name: "settings", title: "Settings" }
  ],
  fields: [
    // Grid Item
    {
      title: "Content",
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
              title: "Grid Column",
              description:
                "<start-line> / <end-line> | <start-line> / span <value>",
              name: "grid_column",
              type: "string"
            },
            {
              title: "Grid Row",
              description:
                "<start-line> / <end-line> | <start-line> / span <value>",
              name: "grid_row",
              type: "string"
            }
          ]
        }
      ],
      inputComponent: SanityGrid
    },
    // Grid Settings
    {
      title: "Settings",
      fieldset: "gridsettings",
      name: "settings",
      type: "object",
      fields: [
        {
          title: "Grid Template Columns",
          description: "e.g. repeat(12, 1fr)",
          name: "template_columns",
          type: "string"
        },
        {
          title: "Grid Template Rows",
          description: "e.g. repeat(12, 1fr)",
          name: "template_row",
          type: "string"
        }
      ]
    }
  ]
};
