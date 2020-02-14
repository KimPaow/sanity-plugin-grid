# Sanity Grid

This is a custom input component for arrays. It allows you to display your array items inside a css grid.

DISCLAIMER: This is still in beta. At the moment it depends on Azzlack's Tabs plugin, I plan to make this work on it's own as well eventually.

![preview image](/src/images/preview.png)

## Installation

1. `sanity install grid`
2. `sanity install tabs`
3. In your schema:

```js
import SanityGrid, { basic } from "sanity-plugin-grid/lib";
import Tabs from "sanity-plugin-tabs";

const customItemFields = [
  // These are your optional custom fields
  {
    title: "Username",
    name: "username",
    type: "string"
  },
  {
    title: "Profile Photo",
    name: "userimg",
    type: "image"
  }
];

...,
{
  title: "Sanity Grid",
  name: "sanitygrid",
  type: "object",
  inputComponent: Tabs,
  fieldsets: [
    { name: "content", title: "Content" },
    { name: "settings", title: "Settings" } // dont change name unless you plan to implement your own basic.settings
  ],
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
            ...customItemFields,
            {
              name: "settings",
              type: "object",
              fields: [...basic.item]
            }
          ],
          preview: {
            select: {
              title: "username",
              media: "userimg"
            }
          }
        }
      ],
      inputComponent: SanityGrid
    },
    // Grid Settings
    ...basic.settings
  ]
},
...
```
