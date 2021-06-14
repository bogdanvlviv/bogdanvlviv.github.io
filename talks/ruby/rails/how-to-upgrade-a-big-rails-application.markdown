---
layout: talks/default
lang: "en"
title: "How to upgrade a big Rails application"
author: "bogdanvlviv"
image: "/images/talks/ruby/rails/how-to-upgrade-a-big-rails-application/dmitrij-paskevic-631210-unsplash.jpg"
date: 2019-03-22 19:05:00 +0200
categories: talks ruby rails
permalink: /talks/ruby/rails/how-to-upgrade-a-big-rails-application.html
---

{::options parse_block_html="true" /}

<div class="talk-slide">
# How to upgrade a big Rails application

<img src="{{ "/images/talks/ruby/rails/how-to-upgrade-a-big-rails-application/dmitrij-paskevic-631210-unsplash.jpg" | absolute_url }}" title="https://unsplash.com/photos/6ZFtDDRW82w">
</div>

<div class="talk-slide">
## About me

<img src="{{ "/images/talks/ruby/rails/how-to-upgrade-a-big-rails-application/rails_contributors-bogdanvlviv-2019-03-16.png" | absolute_url }}" title="https://contributors.rubyonrails.org/contributors/bogdanvlviv/commits">

[https://contributors.rubyonrails.org/contributors/bogdanvlviv/commits](https://contributors.rubyonrails.org/contributors/bogdanvlviv/commits)
</div>

<div class="talk-slide">
## Why should we upgrade applications?

- Software development issues
  - Security issues
  - [Dependency hell](https://en.wikipedia.org/wiki/Dependency_hell)
  - New software
  - Improved APIs
  - New features
  - Performance
- Involving new people
  - Developers
  - Novice Developers
</div>

<div class="talk-slide">
## About upgrading applications

Upgrading an application especially a big one is a complicated task, but it shouldn't be so. It should be easy!

It's an opportunity to learn something new.

It's a good chance to contribute to Open Source.
</div>

<div class="talk-slide">
## Long-running branch strategy

<img src="{{ "/images/talks/ruby/rails/how-to-upgrade-a-big-rails-application/upgrade-to-rails-5_0.png" | absolute_url }}" title="Long-running branch">

> Long-Running Branches Considered Harmful - New Relic Blog: [https://blog.newrelic.com/culture/long-running-branches-considered-harmful/](https://blog.newrelic.com/culture/long-running-branches-considered-harmful/)
</div>

<div class="talk-slide">
## Shopify's Rails upgrade story

<div class="talk-slide-center">
  {::options parse_block_html="false" /}
  <blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">In &#39;17 it took us 1y to upgrade from <a href="https://twitter.com/rails?ref_src=twsrc%5Etfw">@rails</a> 4.2 to 5.0. <a href="https://twitter.com/kirshatrov?ref_src=twsrc%5Etfw">@kirshatrov</a> <a href="https://twitter.com/rafaelfranca?ref_src=twsrc%5Etfw">@rafaelfranca</a> <a href="https://twitter.com/DaroudeDudek?ref_src=twsrc%5Etfw">@DaroudeDudek</a> were happy but not satisfied. Why doesn&#39;t this take a week instead of a year? Today, we are running <a href="https://twitter.com/rails?ref_src=twsrc%5Etfw">@rails</a> 6.0 in production *before* it releases.</p>&mdash; Jean-Michel Lemieux (@jmwind) <a href="https://twitter.com/jmwind/status/1100759716022636545?ref_src=twsrc%5Etfw">February 27, 2019</a></blockquote>
  {::options parse_block_html="true" /}
</div>

> [Shopify is one of the largest Ruby on Rails codebases in existence](https://engineering.shopify.com/blogs/engineering/deconstructing-monolith-designing-software-maximizes-developer-productivity) - [Shopify Engineering Blog](https://engineering.shopify.com)
</div>

<div class="talk-slide">
## RailsConf 2017: Upgrading a big application to Rails 5 by [Rafael França](https://github.com/rafaelfranca)

<iframe src="https://www.youtube.com/embed/I-2Xy3RS1ns" frameborder="0" allowfullscreen></iframe>

Link: [https://www.youtube.com/watch?v=I-2Xy3RS1ns](https://www.youtube.com/watch?v=I-2Xy3RS1ns)

> Upgrading Shopify to Rails 5: [https://engineering.shopify.com/blogs/engineering/upgrading-shopify-to-rails-5-0](https://engineering.shopify.com/blogs/engineering/upgrading-shopify-to-rails-5-0)
</div>

<div class="talk-slide">
## Dual boot strategy

Dual boot is the process of booting your application with a different set of dependencies.
</div>

<div class="talk-slide">
## Dual boot: BUNDLE_GEMFILE

```ruby
# Gemfile
gem "rails", "~> 5.2.2"
eval_gemfile "Gemfile.common"
```

```ruby
# Gemfile.next
gem 'rails', '~> 6.0.0.beta3'
eval_gemfile "Gemfile.common"
```

```ruby
# Gemfile.common
source "https://rubygems.org"

ruby "2.6.2"

# ...
```

```bash
$ bundle install # Gemfile.lock
$ BUNDLE_GEMFILE=Gemfile.next bundle install # Gemfile.next.lock
```

```bash
$ rails runner "p Rails.version"
"5.2.2.1"
$ BUNDLE_GEMFILE=Gemfile.next rails runner "p Rails.version"
"6.0.0.beta3"
```
</div>

<div class="talk-slide">
## Dual boot: BUNDLE_GEMFILE

You need to deal with three Gemfiles and the [confusion](https://github.com/bundler/bundler/issues/6777#issuecomment-436771340) that comes with it:

`Gemfile`, `Gemfile.next`, `Gemfile.common` vs. `Gemfile`

You need to ensure that all the lockfiles are in sync whenever a developer updates or adds a dependency:

```bash
$ bundle install # Gemfile.lock
$ BUNDLE_GEMFILE=Gemfile.next bundle install # Gemfile.next.lock
```

vs.

```bash
$ bundle install # Gemfile.lock, Gemfile.next.lock
```

<img src="{{ "/images/talks/ruby/rails/how-to-upgrade-a-big-rails-application/boot.png" | absolute_url }}" title="https://github.githubassets.com/images/icons/emoji/unicode/1f462.png">
<img src="{{ "/images/talks/ruby/rails/how-to-upgrade-a-big-rails-application/boot.png" | absolute_url }}" title="https://github.githubassets.com/images/icons/emoji/unicode/1f462.png">
</div>

<div class="talk-slide">
## [https://github.com/Shopify/bootboot](https://github.com/Shopify/bootboot)

Bootboot is a [Bundler plugin](https://bundler.io/v1.17/guides/bundler_plugins.html#what-is-a-plugin) meant to help dual boot your ruby application.

### Installation
1. In your `Gemfile`, add this
```ruby
plugin "bootboot", "~> 0.1.2"
```
2. Run `bundle install`
4. Run `bundle bootboot`
5. Commit the `Gemfile` and the `Gemfile_next.lock`
</div>

<div class="talk-slide">
## Dual boot: Shopify/bootboot

```diff
diff --git a/Gemfile b/Gemfile
-gem 'rails', '~> 5.2.2'
+if ENV['DEPENDENCIES_NEXT']
+ gem 'rails', '~> 6.0.0.beta3'
+else
+ gem 'rails', '~> 5.2.2'
+end
```

```bash
$ DEPENDENCIES_NEXT=1 bundle update rails # Gemfile_next.lock
```

```bash
$ rails runner "p Rails.version"
"5.2.2.1"
$ DEPENDENCIES_NEXT=1 rails runner "p Rails.version"
"6.0.0.beta3"
```
</div>

<div class="talk-slide">
## Dual boot: Make it work

```bash
$ rails test
```

```bash
$ DEPENDENCIES_NEXT=1 rails test
```

```ruby
if ENV['DEPENDENCIES_NEXT']
  def execute
    # ...
  end
else
  def execute
    # ...
  end
end
```
</div>

<div class="talk-slide">
## Dual boot: Rollout to production

```bash
$ RAILS_ENV=production rails server
```

```bash
$ DEPENDENCIES_NEXT=1 RAILS_ENV=production rails server
```

> Upgrading GitHub to Rails 3 with Zero Downtime: [http://shayfrendt.com/posts/upgrading-github-to-rails-3-with-zero-downtime/](http://shayfrendt.com/posts/upgrading-github-to-rails-3-with-zero-downtime/)

> Upgrading a Rails application incrementally: [http://www.recursion.org/incremental-rails-upgrade/](http://www.recursion.org/incremental-rails-upgrade/)
</div>

<div class="talk-slide">
## Dual boot: Gradual rollout to production

```nginx
# https://nginx.org/en/docs/http/load_balancing.html#nginx_weighted_load_balancing
upstream myapp1 {
  server srv1.example.com weight=99;
  server srv2.example.com weight=1;
}
```

```bash
srv1.example.com:~/myapp1$ RAILS_ENV=production rails server
```

```bash
srv2.example.com:~/myapp1$ DEPENDENCIES_NEXT=1 RAILS_ENV=production rails server
```

If you have lots of servers in production, you can just roll out the app with the next dependencies on 1% of servers and on the 99% servers run the app with the current dependencies and gradually change the ratio.

Once you are 100% in production with the app that uses the next dependencies, then it's time to remove all `if ENV['DEPENDENCIES_NEXT']` conditions from the codebase and prepare to the next upgrade.
</div>


<div class="talk-slide">
## RailsConf 2018: Upgrading Rails at Scale by [Edouard Chin](https://github.com/Edouard-chin)

<iframe src="https://www.youtube.com/embed/N2B5V4ozc6k" frameborder="0" allowfullscreen></iframe>

Link: [https://www.youtube.com/watch?v=N2B5V4ozc6k](https://www.youtube.com/watch?v=N2B5V4ozc6k)

> Eliminate deprecations from your codebase: [https://github.com/Shopify/deprecation_toolkit](https://github.com/Shopify/deprecation_toolkit)
</div>

<div class="talk-slide">
## Thanks!

<div class="talk-slide-center">
  <img src="{{ "/images/talks/ruby/rails/how-to-upgrade-a-big-rails-application/qrcode.png" | absolute_url }}" title="qrcode">
</div>
<div>
