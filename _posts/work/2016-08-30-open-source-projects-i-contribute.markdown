---
layout: post
lang: "en"
title: "Open source projects I contribute"
author: "bogdanvlviv"
date: 2016-08-30 15:23:00 +0300
categories: posts work
permalink: /:categories/:title.html
---

<ul>
  {%- for project in site.data.open-source-projects-i-contribute -%}
  <li>
    <a href="{{ project.link }}">{{ project.title }}</a>
    <ul>
      {%- for link in project.links -%}
      <li>
        <a href="{{ link }}">{{ link }}</a>
      </li>
      {%- endfor -%}
    </ul>
  </li>
  {%- endfor -%}
</ul>
