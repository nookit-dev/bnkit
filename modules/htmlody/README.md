## Dynamic HTML Generation with `htmlody-utils`

### Introduction

The provided code offers a dynamic approach to generating HTML content based on JSON configurations. By leveraging TypeScript and JSON structures, users can define HTML elements, attributes, and content in a declarative manner. The system also supports the integration of popular libraries like TailwindCSS and htmx to enhance the styling and interactivity of the generated pages.

### Key Features

1. **Dynamic HTML Generation**: Convert JSON structures into valid HTML strings.
2. **TailwindCSS Integration**: Optionally use TailwindCSS for styling by providing a Tailwind configuration.
3. **htmx Integration**: Embed interactive components using htmx by defining them in the JSON structure.
4. **Flexible Configuration**: Define and customize HTML nodes, attributes, and content using a well-defined JSON structure.

### Input

#### JSON Configuration for HTML Generation

The primary input to the system is a JSON configuration that defines the structure, content, and attributes of the HTML to be generated.

For instance, here's a sample configuration:

```javascript
const example = {
  div: {
    content: "Hello World",
    attributes: {
      class: "title-class",
      id: "title-id",
    },
  },
};
```

In this configuration, a `div` element with content "Hello World" and attributes `class` and `id` is defined.

### Output

Given the above configuration, the system will produce the following HTML:

```html
<div class="title-class" id="title-id">Hello World</div>
```

### Examples

#### Basic Example

Input JSON:

```javascript
{
  h1: {
    content: "Hello World",
    attributes: {
      class: "title-class",
      id: "title-id",
    },
    tag: "h1",
  },
  p: { content: "This is a description", tag: "p" }
}
```

Output HTML:

```html
<h1 class="title-class" id="title-id">Hello World</h1>
<p>This is a description</p>
```

#### Advanced Example with htmx

Input JSON:

```javascript
{
  h1: {
    content: "Hello World",
    attributes: {
      class: "title-class",
      id: "title-id",
    },
    tag: "h1",
  },
  div_1: {
    tag: "div",
    attributes: {
      class: "bg-red-500",
    },
    children: {
      button_1: {
        content: "Click Me",
        attributes: {
          "hx-post": "/clicked",
          "hx-trigger": "click",
          "hx-target": "#clicked",
          "hx-swap": "outerHTML",
        },
        tag: "button",
      },
      div_1: {
        tag: "div",
        content: "Hello World",
      },
    },
  },
}
```

Output HTML:

```html
<h1 class="title-class" id="title-id">Hello World</h1>
<div class="bg-red-500">
  <button hx-post="/clicked" hx-trigger="click" hx-target="#clicked" hx-swap="outerHTML">Click Me</button>
  <div>Hello World</div>
</div>
```

## Build Dynamic Fully SSR'd Apps or Export Static Assets

Build simple dynamic apps like control panels very quickly.  (and coming soon) Generate static html pages that you can serve on free hosts like
GitHub Pages
