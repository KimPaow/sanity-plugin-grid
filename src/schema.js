import SanityGrid from "../lib";
import Tabs from "sanity-plugin-tabs";

const customFields = [
  {
    title: "Title",
    name: "username",
    type: "string"
  },
  {
    title: "Grid Image",
    name: "gridimg",
    type: "image"
  }
];

const base = [
  { title: "Default", value: "inital" },
  { title: "Start", value: "start" },
  { title: "End", value: "end" },
  { title: "Center", value: "center" },
  { title: "Stretch", value: "stretch" }
];

const space = [
  { title: "Space Around", value: "space-around" },
  { title: "Space Between", value: "space-between" },
  { title: "Space Evenly", value: "space-evenly" }
];

const gridItemBase = [
  {
    title: "Width",
    description: "Width in number of columns.",
    name: "width",
    type: "number"
  },
  {
    title: "Height",
    description: "Height in number of rows.",
    name: "height",
    type: "number"
  },
  {
    title: "Column",
    description: "What column to position the item at.",
    name: "posX",
    type: "number"
  },
  {
    title: "Row",
    description: "What row to position the item at.",
    name: "posY",
    type: "number"
  }
];

export default {
  title: "Sanity Grid",
  name: "sanitygrid",
  type: "object",
  inputComponent: Tabs,
  fieldsets: [
    { name: "content", title: "Content" },
    { name: "settings", title: "Settings" }
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
            ...customFields,
            {
              name: "settings",
              type: "object",
              fields: [...gridItemBase]
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
      title: "Columns",
      name: "columns",
      fieldset: "settings",
      type: "number"
    },
    {
      title: "Rows",
      name: "rows",
      fieldset: "settings",
      type: "number"
    }
    // THIS SHOULD NOT BE HANDLED BY THE PLUGIN IMO
    // {
    //   title: "Justify Items",
    //   description: "Aligns grid items along the inline (row) axis",
    //   name: "justifyItems",
    //   fieldset: "settings",
    //   type: "string",
    //   options: {
    //     list: [...base]
    //   }
    // },
    // {
    //   title: "Align Items",
    //   description: "Aligns grid items along the block (column) axis",
    //   name: "alignItems",
    //   fieldset: "settings",
    //   type: "string",
    //   options: {
    //     list: [...base]
    //   }
    // },
    // {
    //   title: "Justify Content",
    //   name: "justifyContent",
    //   fieldset: "settings",
    //   type: "string",
    //   options: {
    //     list: [...base, ...space]
    //   }
    // },
    // {
    //   title: "Align Content",
    //   name: "alignContent",
    //   fieldset: "settings",
    //   type: "string",
    //   options: {
    //     list: [...base, ...space]
    //   }
    // }
  ]
};
