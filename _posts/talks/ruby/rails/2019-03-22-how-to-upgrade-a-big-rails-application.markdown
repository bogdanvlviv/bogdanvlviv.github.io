---
layout: post
lang: "en"
title: "How to upgrade a big Rails application"
author: "bogdanvlviv"
image: "/images/posts/talks/ruby/rails/how-to-upgrade-a-big-rails-application/dmitrij-paskevic-631210-unsplash.jpg"
date: 2019-03-22 19:05:00 +0200
categories: posts talks ruby rails
permalink: /:categories/:title.html
---

<div class="picture">
  <img src="{{ "/images/posts/talks/ruby/rails/how-to-upgrade-a-big-rails-application/dmitrij-paskevic-631210-unsplash.jpg" | absolute_url }}" title="https://unsplash.com/photos/6ZFtDDRW82w" loading="lazy">
</div>

\- Hello everyone!

\- I'm going to talk about why we should upgrade applications, *long-running branch* and *dual boot* strategies as approaches for upgrading Rails applications.

\- But first, I'm going to introduce myself.

## About me

<div class="picture">
  <img src="{{ "/images/posts/talks/ruby/rails/how-to-upgrade-a-big-rails-application/rails_contributors-bogdanvlviv-2019-03-16.png" | absolute_url }}" title="https://contributors.rubyonrails.org/contributors/bogdanvlviv/commits" loading="lazy">
</div>

[https://contributors.rubyonrails.org/contributors/bogdanvlviv/commits](https://contributors.rubyonrails.org/contributors/bogdanvlviv/commits)

\- My name is [Bogdan]({{ site.url }}). I'm a Ruby developer. And yeah, I enjoy collaborating with people from around the world on Open Source. Usually, I contribute to [Ruby on Rails](https://rubyonrails.org/).

\- Back to the topic.

## Why should we upgrade applications?

\- Let's find out why we should upgrade applications.

\- Actually, there are lots of reasons to do so.

\- The most important reason is *security issues* because if an application is vulnerable, the business and its clients are vulnerable as well.

\- Also, there are other *software development issues* like:

- [Dependency hell](https://en.wikipedia.org/wiki/Dependency_hell): For instance, you might need to upgrade some dependency but you can't because of incompatibilities with some other dependencies.
- New software: You might need to use some new software, but you can't because a software you use doesn't support it or isn't compatible with it.
- Improved APIs: You would like to improve API of a library you use.
- New features: You would like to use new features that are added to a newer version of a library you use.
- Performance: For instance, an application has got performance issues and upgrading of software would solve it.

\- Another important reason to upgrade is *involving new people* to a project. *Developers* prefer to work with technologies on the latest versions so it is easier to hire them on a project that upgrades. Just imagine that in 2019, someone tries to hire you on a project that uses Rails 2.3 or something. Also, it is easier to involve *novice developers* to a project that upgrades because, usually, they've only studied technologies on the latest versions.

## About upgrading applications

\- Upgrading an application especially a big one is a complicated task, but it shouldn't be so. It should be easy! Just try to involve as much as possible people into upgrading and make everyone's concern.

\- Also, upgrading an application is an opportunity to learn something new and a good chance to contribute to Open Source.

\- Let's have a look at strategies to upgrade Rails applications.

## Long-running branch strategy

<img src="{{ "/images/posts/talks/ruby/rails/how-to-upgrade-a-big-rails-application/upgrade-to-rails-5_0.png" | absolute_url }}" title="Long-running branch" loading="lazy">

> Long-Running Branches Considered Harmful - New Relic Blog: [https://blog.newrelic.com/culture/long-running-branches-considered-harmful/](https://blog.newrelic.com/culture/long-running-branches-considered-harmful/)

\- You probably know about the *long-running branch strategy* and its drawbacks.  In short, this is when you make a large chunk of work that takes lots of time and lots of code changes in a separate branch and then you ship it to production.

\- I upgraded a small Rails application that had near 2 thousand test cases from version 4.2 to 5.0 by using this strategy once, and you know I succeeded. It took me about 1-2 weeks, the size of the work I'd done was almost acceptable to review.

\- After deploying the upgraded app to production I got about 2-3 bugs that I managed to fix quickly, but... There were some issues I didn't notice: only I was involved in upgrading the app, and I didn't ask myself very important questions like - "How would we roll back the upgrade in production if needed?", "How can we be sure that the app will work well in production after rollback of the upgrade?". I think there are no good answers for those questions if use this strategy.

\- Because I was lucky to succeed at that time, I didn't learn any lessons, so when I got a chance to upgrade a bigger Rails application that had near 40 thousand test cases from version 4.2 to 5.0 I tried to apply the same strategy. So, here we are. I faced a bunch of long-running branch's drawbacks like - it's hard to review the changes, wasting lots of time on resolving conflicts, it's hard to involve people in the process or delegate work. And I asked myself those two important questions.

\- The best answer was just to find another approach that would eliminate all mentioned issues.

## Shopify's Rails upgrade story

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">In &#39;17 it took us 1y to upgrade from <a href="https://twitter.com/rails?ref_src=twsrc%5Etfw">@rails</a> 4.2 to 5.0. <a href="https://twitter.com/kirshatrov?ref_src=twsrc%5Etfw">@kirshatrov</a> <a href="https://twitter.com/rafaelfranca?ref_src=twsrc%5Etfw">@rafaelfranca</a> <a href="https://twitter.com/DaroudeDudek?ref_src=twsrc%5Etfw">@DaroudeDudek</a> were happy but not satisfied. Why doesn&#39;t this take a week instead of a year? Today, we are running <a href="https://twitter.com/rails?ref_src=twsrc%5Etfw">@rails</a> 6.0 in production *before* it releases.</p>&mdash; Jean-Michel Lemieux (@jmwind) <a href="https://twitter.com/jmwind/status/1100759716022636545?ref_src=twsrc%5Etfw">February 27, 2019</a></blockquote>

> [Shopify is one of the largest Ruby on Rails codebases in existence](https://engineering.shopify.com/blogs/engineering/deconstructing-monolith-designing-software-maximizes-developer-productivity) - [Shopify Engineering Blog](https://engineering.shopify.com)

\- Luckily, there are companies that share own experience, some pieces of their work and even ready solutions with the rest of the world.

\- As you may know, [Shopify is one of the largest Ruby on Rails codebases in existence](https://engineering.shopify.com/blogs/engineering/deconstructing-monolith-designing-software-maximizes-developer-productivity). It is easy to figure out that they are experts in upgrading big Rails applications, just read the last sentence of the tweet: "Today, we are running @rails 6.0 in production *before* it releases." - It's amazing.

## RailsConf 2017: Upgrading a big application to Rails 5 by [Rafael França](https://github.com/rafaelfranca)

<iframe src="https://www.youtube.com/embed/I-2Xy3RS1ns" frameborder="0" allowfullscreen></iframe>

Link: [https://www.youtube.com/watch?v=I-2Xy3RS1ns](https://www.youtube.com/watch?v=I-2Xy3RS1ns)

> Upgrading Shopify to Rails 5: [https://engineering.shopify.com/blogs/engineering/upgrading-shopify-to-rails-5-0](https://engineering.shopify.com/blogs/engineering/upgrading-shopify-to-rails-5-0)

\- You can find a lot of information about how they upgrade the Rails monolith, and I highly recommend to take a look.

\- So, here I just want you to have a quick look at the strategy they use. It's the dual boot strategy.

## Dual boot strategy

\- Dual boot is the process of booting your application with a different set of dependencies.

\- For instance, you have a Rails application that runs on version 5.0, but you also can run it on version 5.1 and it works in the same way.

\- Let's have a look at how to implement dual booting.

## Dual boot: BUNDLE_GEMFILE

\- Actually, it is easy to implement.

\- You can create three Gemfiles.

\- One with current production dependencies:

```ruby
# Gemfile
gem "rails", "~> 5.2.2"
eval_gemfile "Gemfile.common"
```

\- a second with an alternate next set of dependencies:

```ruby
# Gemfile.next
gem 'rails', '~> 6.0.0.beta3'
eval_gemfile "Gemfile.common"
```

\- a third containing the dependencies that both Gemfiles have in common:

```ruby
# Gemfile.common
source "https://rubygems.org"

ruby "2.6.2"

# ...
```

\- Then you should synchronize Lockfiles:

```bash
$ bundle install # Gemfile.lock
$ BUNDLE_GEMFILE=Gemfile.next bundle install # Gemfile.next.lock
```

\- After, it should be possible to run the Rails application with the next set of dependencies by using `BUNDLE_GEMFILE` environment variable:

```bash
$ rails runner "p Rails.version"
"5.2.2.1"
$ BUNDLE_GEMFILE=Gemfile.next rails runner "p Rails.version"
"6.0.0.beta3"
```

## Dual boot: BUNDLE_GEMFILE

\- There are some issues with this implementation:

\- You need to deal with three Gemfiles and the [confusion](https://github.com/bundler/bundler/issues/6777#issuecomment-436771340) that comes with it:

> `Gemfile`, `Gemfile.next`, `Gemfile.common` vs. `Gemfile`

\- You need to ensure that all the lockfiles are in sync whenever a developer updates or adds a dependency:

```bash
$ bundle install # Gemfile.lock
$ BUNDLE_GEMFILE=Gemfile.next bundle install # Gemfile.next.lock
```

vs.

```bash
$ bundle install # Gemfile.lock, Gemfile.next.lock
```

\- There is a tool that eliminates those issues - [Bootboot](https://github.com/Shopify/bootboot).

## [https://github.com/Shopify/bootboot](https://github.com/Shopify/bootboot)

\- It is a [Bundler plugin](https://bundler.io/v1.17/guides/bundler_plugins.html#what-is-a-plugin) meant to help dual boot your ruby application.

\- Let's see how it works.

\- We need to register this plugin in `Gemfile`:

```ruby
plugin "bootboot", "~> 0.1.2"
```

\- then run `bundle install` to install [Bootboot](https://github.com/Shopify/bootboot).
\- then run `bundle bootboot`, it should add  a new lockfile `Gemfile_next.lock`.

## Dual boot: Shopify/bootboot

\- Then go to `Gemfile` and specify an alternate next set of dependencies by using the simple condition:

```diff
diff --git a/Gemfile b/Gemfile
-gem 'rails', '~> 5.2.2'
+if ENV['DEPENDENCIES_NEXT']
+ gem 'rails', '~> 6.0.0.beta3'
+else
+ gem 'rails', '~> 5.2.2'
+end
```

\- and then you should synchronize the `Gemfile_next.lock file:

```bash
$ DEPENDENCIES_NEXT=1 bundle update rails # Gemfile_next.lock
```

\- Now you should be able to run the application with the next set of dependencies by using `DEPENDENCIES_NEXT` environment variable:

```bash
$ rails runner "p Rails.version"
"5.2.2.1"
$ DEPENDENCIES_NEXT=1 rails runner "p Rails.version"
"6.0.0.beta3"
```

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

\- The next step is to make the app work well with both sets of dependencies.

\- Dual booting allows you to do it by usual for your team way. For instance, you can do it by small Pull Requests, you can run a new CI build to test the app on the next dependencies, you can easily involve people in the upgrading process by asking them to make tests green for the code they are familiar with, and so on.

## Dual boot: Rollout to production

```bash
$ RAILS_ENV=production rails server
```

```bash
$ DEPENDENCIES_NEXT=1 RAILS_ENV=production rails server
```

\- Once all tests are green, it's time to roll out the app on the next dependencies to production. If it causes failures, then you can restart the app to make it use old dependencies, explore and fix new failures and then repeat the rollout.

> Upgrading GitHub to Rails 3 with Zero Downtime: [http://shayfrendt.com/posts/upgrading-github-to-rails-3-with-zero-downtime/](http://shayfrendt.com/posts/upgrading-github-to-rails-3-with-zero-downtime/)

> Upgrading a Rails application incrementally: [http://www.recursion.org/incremental-rails-upgrade/](http://www.recursion.org/incremental-rails-upgrade/)

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

\- Of course, a better idea would be to do gradual rollout to production to reduce the number of unexpected failures due to upgrading. For that, you need at least two servers in production. So you can run on the first one the app with the current dependencies and on the second one the app with the next set of dependencies. Then configure your load balancer to deliver 99% of request to the app with old dependencies and 1% of requests to the app with the next dependencies and gradually change this ratio.

\- If you have lots of servers in production, you can just roll out the app with the next dependencies on 1% of servers and on the 99% servers run the app with the current dependencies and gradually change the ratio.

\- Once you are 100% in production with the app that uses the next dependencies, then it's time to remove all `if ENV['DEPENDENCIES_NEXT']` conditions from the codebase and prepare to the next upgrade.

## RailsConf 2018: Upgrading Rails at Scale by [Edouard Chin](https://github.com/Edouard-chin)

<iframe src="https://www.youtube.com/embed/N2B5V4ozc6k" frameborder="0" allowfullscreen></iframe>

Link: [https://www.youtube.com/watch?v=N2B5V4ozc6k](https://www.youtube.com/watch?v=N2B5V4ozc6k)

> Eliminate deprecations from your codebase: [https://github.com/Shopify/deprecation_toolkit](https://github.com/Shopify/deprecation_toolkit)

\- If you are interested in such things, then I highly recommend you to go through all the references in this talk.

## Thanks!

\- That's it. Thank you!

## Links

Slides: ["How to upgrade a big Rails application"]({{ "/talks/ruby/rails/how-to-upgrade-a-big-rails-application.html" | absolute_url }}).

## Pivorak 38

"Pivorak 38 : Spring Edition": [https://www.facebook.com/events/399347927493363](https://www.facebook.com/events/399347927493363).

<div class="picture">
  <img src="{{ "/images/posts/talks/ruby/rails/how-to-upgrade-a-big-rails-application/pivorak_38-bogdanvlviv.jpg" | absolute_url }}" title="Pivorak 38: bogdanvlviv" loading="lazy">
</div>

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">tomorrow 😱 <a href="https://t.co/pQFfKYn6u9">pic.twitter.com/pQFfKYn6u9</a></p>&mdash; Bogdan (@bogdanvlviv) <a href="https://twitter.com/bogdanvlviv/status/1108819194500530176?ref_src=twsrc%5Etfw">March 21, 2019</a></blockquote>

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr"><a href="https://twitter.com/hashtag/Pivorak?src=hash&amp;ref_src=twsrc%5Etfw">#Pivorak</a> 38 : Spring Edition 🔥🔥🔥<br>Thank you for being with us💕 <a href="https://t.co/9CqRerxTuI">pic.twitter.com/9CqRerxTuI</a></p>&mdash; Pivorak (@pivorakmeetup) <a href="https://twitter.com/pivorakmeetup/status/1109495621092823045?ref_src=twsrc%5Etfw">March 23, 2019</a></blockquote>

Video: [https://www.youtube.com/watch?v=Xx8W6IQtyU0](https://www.youtube.com/watch?v=Xx8W6IQtyU0).

<iframe src="https://www.youtube.com/embed/Xx8W6IQtyU0" frameborder="0" allowfullscreen></iframe>
