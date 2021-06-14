---
layout: post
lang: "en"
title: "bogdanvlviv.com gets a dark theme"
author: "bogdanvlviv"
date: 2019-10-07 10:00:00 +0300
categories: posts site
permalink: /:categories/:title.html
---

To enable the dark theme press "d", to disable the dark theme press "s".
Also, the dark theme could be enabled by your device's settings.

There is great research that mentions a couple of things in favor of dark mode - [Hello darkness, my old friend](https://web.dev/prefers-color-scheme/).
Despite the things mentioned in the post, I have a couple of own reasons to add the dark theme:
- to reduce eye strain
- I prefer dark mode and I am sure there are lots of people that like dark mode too
- I use this website to build and present [slides]({{ "/talks/example.html" | absolute_url }}), so I often need a dark background

## How does it work?

Imagine we have `dark-theme.css` file that brings "darkness"

```css
/* dark-theme.css */
body {
  background: black !important;
  color: white !important;
}
/* ... */
```

We can use [`prefers-color-scheme`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme) CSS media feature to apply
the CSS when a device's settings are set in favor of a dark theme:

```html
<link id="js-dark-theme" rel="stylesheet" href="/dark-theme.css" media="(prefers-color-scheme: dark)">
<script src="dark-theme.js"></script>
```

To provide an ability to enable or disable the dark theme from a website we should add a little JavaScript code.
For instance, the following code enables the dark theme:

```javascript
document.getElementById("js-dark-theme").media = "";
```

To disable the dark theme we can set the media attribute to `"(prefers-color-scheme: no-preference)"`:

```javascript
document.getElementById("js-dark-theme").media = "(prefers-color-scheme: no-preference)";
```

Another important issue we should solve is retaining a user's settings between pages.
We can either use [`Window.sessionStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage) or [`Window.localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) to achieve this.
We can save settings on enabling the dark theme:

```javascript
window.sessionStorage.setItem("darkTheme", "enable");
```

and on disabling the dark theme:

```javascript
window.sessionStorage.setItem("darkTheme", "disable");
```

Then we should add JavaScript code that executes on every page of the website like:

```javascript
if (window.sessionStorage.getItem("darkTheme") === "enable") {
  document.getElementById("js-dark-theme").media = "";
} else if (window.sessionStorage.getItem("darkTheme") === "disable") {
  document.getElementById("js-dark-theme").media = "(prefers-color-scheme: no-preference)";
}
```

That is it!
