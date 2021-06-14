---
layout: post
lang: "en"
title: "Books I read"
author: "bogdanvlviv"
date: 2018-03-07 23:23:00 +0200
categories: posts life
permalink: /:categories/:title.html
---

## TODO-shelf

<ul>
  {%- assign todo_shelf = site.data.books-i-read | where_exp: "book", "book.progress == 0" | sort: "title" -%}
  {%- for book in todo_shelf -%}
  <li>
    <hr/>

    <p>
    Title: <a href="{{ book.link }}">{{ book.title }}</a>
    </p>

    {%- if book.note -%}
    <p>
    Note: {{ book.note }}
    </p>
    {%- endif -%}
  </li>
  {%- endfor -%}
</ul>

## Books I am reading

<ul>
  {%- assign i_am_reading_books = site.data.books-i-read | where_exp: "book", "book.progress > 0 and book.progress < 100" | sort: "start_date" | reverse -%}
  {%- for book in i_am_reading_books -%}
  <li>
    <hr/>

    <p>
    Title: <a href="{{ book.link }}">{{ book.title }}</a>
    </p>

    <p>
    Progress: {{ book.progress }}%
    </p>

    {%- if book.start_date -%}
    <p>
    Start date: {{ book.start_date }}
    </p>
    {%- endif -%}

    {%- if book.note -%}
    <p>
    Note: {{ book.note }}
    </p>
    {%- endif -%}
  </li>
  {%- endfor -%}
</ul>

## Books I have read

<ul>
  {%- assign i_have_read_books = site.data.books-i-read | where_exp: "book", "book.progress == 100" | sort: "end_date" | reverse -%}
  {%- for book in i_have_read_books -%}
  <li>
    <hr/>

    <p>
    Title: <a href="{{ book.link }}">{{ book.title }}</a>
    </p>

    <p>
    Progress: {{ book.progress }}%
    </p>

    {%- if book.start_date -%}
    <p>
    Start date: {{ book.start_date }}
    </p>
    {%- endif -%}

    {%- if book.end_date -%}
    <p>
    End date: {{ book.end_date }}
    </p>
    {%- endif -%}

    {%- if book.note -%}
    <p>
    Note: {{ book.note }}
    </p>
    {%- endif -%}
  </li>
  {%- endfor -%}
</ul>
