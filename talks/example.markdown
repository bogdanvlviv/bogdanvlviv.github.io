---
layout: talks/default
lang: "en"
title: "Example"
author: "bogdanvlviv"
date: 2018-05-28 22:31:31 +0300
categories: talks
permalink: /talks/example.html
---

{::options parse_block_html="true" /}

<div class="talk-slide">
# Example

This this is default example of my slides.

## Navigation

- In order to expand slides
  - press "e"
- In order to reduce slides
  - press "r"
- In order to go to the next slide
  - click the link "Next slide(j, l)"
  - press "j"
  - press "l"
  - press "PageDown"
  - press "ArrowRight"
- In order to go to the previous slide
  - click the link "Previous slide(h, k)"
  - press "k"
  - press "h"
  - press "PageUp"
  - press "ArrowLeft"
- In order to enable the dark theme
  - press "d"
- In order to disable the dark theme
  - press "s"
</div>

<div class="talk-slide">
##  Text

# This is h1

## This is h2

### This is h3

#### This is h4

##### This is h5

###### This is h6

This is p.

This is p with <mark>mark</mark>ed word.
</div>

<div class="talk-slide">
## Table

<table>
  <thead>
    <tr>
      <th>Head 1</th>
      <th>Head 2</th>
      <th>Head 3</th>
    </tr>
  </thead>

  <tbody>
    <tr>
      <td>Body 1.1</td>
      <td>Body 1.2</td>
      <td>Body 1.3</td>
    </tr>

    <tr>
      <td>Body 2.1</td>
      <td>Body 2.2</td>
      <td>Body 2.3</td>
    </tr>

    <tr>
      <td>Body 3.1</td>
      <td>Body 3.2</td>
      <td>Body 3.3</td>
    </tr>
  </tbody>
</table>
</div>

<div class="talk-slide">
## Tweet

{::options parse_block_html="false" /}
<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">today was a good day. <a href="https://t.co/2O5spcCCn3">pic.twitter.com/2O5spcCCn3</a></p>&mdash; Bogdan (@bogdanvlviv) <a href="https://twitter.com/bogdanvlviv/status/973236422005141504?ref_src=twsrc%5Etfw">March 12, 2018</a></blockquote>
{::options parse_block_html="true" /}
</div>

<div class="talk-slide">
## Image

<img src="{{ "/images/talks/example/lviv-town-hall.jpg" | absolute_url }}" title="Lviv Town Hall">
</div>

<div class="talk-slide">
## Code

```ruby
class User
  def initialize(first_name:, last_name:, birthday:)
    @first_name = first_name
    @last_name = last_name
    @birthday = birthday
  end

  attr_accessor :first_name, :last_name, :birthday
end
```

```ruby
class UserDecorator < SimpleDelegator
  def full_name
    "#{first_name} #{last_name}"
  end

  def age
    # 60 * 60 * 24 * 365.25 is 31557600
    # 31557600 is one year in seconds
    ((Time.now - birthday) / 31557600).floor
  end
end
```
</div>

<div class="talk-slide">
## Alignment

Left

Left

<div class="talk-slide-center">
  Center

  Center
</div>

<div class="talk-slide-right">
  Right

  Right
</div>
</div>

<div class="talk-slide">
## Thanks!
</div>
