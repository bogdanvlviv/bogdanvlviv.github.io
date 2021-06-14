---
layout: post
lang: "en"
title: "bogdanvlviv.com hosts on GitLab.com with GitLab Pages"
author: "bogdanvlviv"
date: 2019-09-11 10:40:00 +0300
categories: posts site
permalink: /:categories/:title.html
---

Since [launching]({{ "/posts/welcome.html" | absolute_url }}) my website on May 24, 2016 till these days I was using [GitHub Pages](https://pages.github.com) for hosting.

First of all, I want to say thank you GitHub for hosting my website during all those years, for free!
With GitHub Pages, it is really easily to make a static site publicly available, and I will definitely use it when needed.

## Reason for my moving to GitLab Pages

The main reason for my moving to [GitLab Pages](https://docs.gitlab.com/ee/user/project/pages) is that [it allows configuring a build of a site](https://about.gitlab.com/2016/04/07/gitlab-pages-setup/).
It means that now it is possible to use any tool to build a website, even your own tool.

Despite I have been using [Jekyll](https://jekyllrb.com) to build my website, have no plans to change the tool yet, and that GitHub Pages supports Jekyll, it uses [GitHub Pages Ruby Gem](https://github.com/github/pages-gem) to build static websites on Jekyll. That means that it is not possible to use a new version of Jekyll or Ruby  unless [pages-gem](https://github.com/github/pages-gem) supports it. I often update Jekyll and Ruby for my website...

I wish GitHub Pages allowed configuring a build of a site.

I wish GitLab Pages supported CNAME as [GitHub Pages does](https://github.blog/2009-01-21-cname-support-for-github-pages/).
