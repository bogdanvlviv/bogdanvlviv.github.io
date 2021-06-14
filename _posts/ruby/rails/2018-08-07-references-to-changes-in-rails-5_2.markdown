---
layout: post
lang: "en"
title: "References to changes in Rails 5.2"
author: "bogdanvlviv"
image: "/images/posts/ruby/rails/references-to-changes-in-rails-5_2/rails460x460.png"
date: 2018-08-07 21:18:00 +0300
categories: posts ruby rails
permalink: /:categories/:title.html
---

<div class="picture">
  <img src="{{ "/images/posts/ruby/rails/references-to-changes-in-rails-5_2/rails160x160.png" | absolute_url }}" title="Rails" loading="lazy">
</div>

This post is a collection of references to some changes that were done during the development of Rails 5.2.

> Read [What is new in Rails 6.0]({{ "/posts/ruby/rails/what-is-new-in-rails-6_0.html" | absolute_url }})

[Start Rails 5.2 development](https://github.com/rails/rails/commit/6c08d480f13d3332c878ca8a120a03fcd78f7ba2)

[Prevent double firing the before save callback of new object when the parent association saved in the callback](https://github.com/rails/rails/pull/28640)

[Fix inconsistency with changed attributes when overriding AR attribute reader](https://github.com/rails/rails/pull/28661)

[Fix ActiveModel::Errors #keys, #values](https://github.com/rails/rails/pull/28584)

[Fix migration tasks](https://github.com/rails/rails/pull/28166)

[Fix destroy with locking_column value null](https://github.com/rails/rails/pull/28926)

[Fix ActiveRecord::Persistence#touch with locking](https://github.com/rails/rails/pull/28914)

[Set consistent typecast ENV["VERBOSE"]](https://github.com/rails/rails/pull/28881)

[Improve the upgrade path of Strong Parameters](https://github.com/rails/rails/pull/28734)

[Define path with \_\_dir\_\_](https://github.com/rails/rails/pull/29176)

[Use respond_to test helpers](https://github.com/rails/rails/pull/31786)

[Keep INNER JOIN when merging relations](https://github.com/rails/rails/pull/27063)

[Enforce frozen string in Rubocop](https://github.com/rails/rails/pull/29540)

[Added time helper method `freeze_time` which is an alias for `travel_to Time.now`](https://github.com/rails/rails/pull/29681)

[Default protect from forgery](https://github.com/rails/rails/pull/29742)

[Add Active Storage to Rails](https://github.com/rails/rails/pull/30020)

[ActiveStorage Guide](https://github.com/rails/rails/pull/31037)

[Provide initialization of Active Storage](https://github.com/rails/rails/pull/30101)

[Don't include Active Storage migrations in new apps](https://github.com/rails/rails/pull/31534)

[ActiveSupport::CurrentAttributes provides a thread-isolated attributes singleton](https://github.com/rails/rails/pull/29180)

[Set Ruby version in Gemfile and .ruby-version by default](https://github.com/rails/rails/pull/30016)

[Remove :sorted test order for isolated tests](https://github.com/rails/rails/pull/30105)

[ Add `--skip-action-cable` option to the plugin generator](https://github.com/rails/rails/pull/30164)

[Add `--skip-yarn` option to the plugin generator](https://github.com/rails/rails/pull/30238)

[Add `binary` fixture helper method](https://github.com/rails/rails/pull/30073)

[Simplify implementation of `MySQLDatabaseTasks`](https://github.com/rails/rails/pull/30414)

[Fix `bin/rails db:setup` and `bin/rails db:test:prepare` create wrong ar_internal_metadata's data for a test database](https://github.com/rails/rails/pull/30579)

[Mirror the API of Ruby stdlib for #prev_day, #next_day, #prev_month, #next_month, #prev_year, #next_year](https://github.com/rails/rails/pull/30620)

[Deprecate `Module#reachable?` method](https://github.com/rails/rails/pull/30624)

[Add Key Rotation to MessageEncryptor and MessageVerifier and simplify the Cookies middleware](https://github.com/rails/rails/pull/29716)

[Fix `bin/rails db:migrate` with specified `VERSION`](https://github.com/rails/rails/pull/30714)

[Implement H2 Early Hints for Rails](https://github.com/rails/rails/pull/30744)

[Add assert_enqueued_email_with to ActionMailer::TestHelper](https://github.com/rails/rails/pull/30695)

[Add headless chrome driver to System Tests](https://github.com/rails/rails/pull/30876)

[Add allow_other_host option to redirect_back method](https://github.com/rails/rails/pull/30850)

[Execute `ConfirmationValidator` validation when `_confirmation`'s value is `false`](https://github.com/rails/rails/pull/31058)

[Allow `Range#include?` on TWZ ranges](https://github.com/rails/rails/pull/31081)

[Require raw SQL fragments to be explicitly marked when used in relation query methods](https://github.com/rails/rails/commit/a1ee43d2170dd6adf5a9f390df2b1dde45018a48)

[Whitelist `NULLS FIRST` and `NULLS LAST` in order clauses too](https://github.com/rails/rails/commit/e4a921a75f8702a7dbaf41e31130fe884dea93f9)

[Built-in Redis cache store](https://github.com/rails/rails/commit/9f8ec3535247ac41a9c92e84ddc7a3b771bc318b)

[Add `#only_up` to database migrations for code that is only relevant when migrating up, e.g. populating a new column](https://github.com/rails/rails/pull/31082)

[Add parameterized invocation of mailers as a way to share before filters and defaults between actions. See ActionMailer::Parameterized for a full example of the benefit](https://github.com/rails/rails/pull/27825)

[Register most popular audio/video/font mime types supported by modern browsers](https://github.com/rails/rails/pull/31251)

[Add `preload_link_tag` helper](https://github.com/rails/rails/pull/31251)

[Add DSL for configuring Content-Security-Policy header](https://github.com/rails/rails/pull/31162)

[Add the ability to disable the global CSP in a controller](https://github.com/rails/rails/commit/619b1b6353a65e1635d10b8f8c6630723a5a6f1a)

[Always yield a CSP policy instance from `content_security_policy`](https://github.com/rails/rails/commit/4ec8bf68ff92f35e79232fbd605012ce1f4e1e6e)

[Added support for managing custom encrypted files from cli](https://github.com/rails/rails/commit/68479d09ba6bbd583055672eb70518c1586ae534)

[Add headless firefox support to System Tests](https://github.com/rails/rails/pull/31365)

[Fix conflicts `counter_cache` with `touch: true` by optimistic locking](https://github.com/rails/rails/pull/31405)

[Fix that association's after_touch is not called with counter cache](https://github.com/rails/rails/commit/f5947d378ffbbcbee4533ef33747a2e807aa5ab9)

[Fix `touch` option to behave consistently with `Persistence#touch` method](https://github.com/rails/rails/pull/33148)

[Fix nested `has many :through` associations on unpersisted parent instances](https://github.com/rails/rails/pull/16314)

[Support hash as first argument in `assert_difference`. This allows to specify multiple numeric differences in the same assertion](https://github.com/rails/rails/pull/31600)

[Consistency between first() and last() with limit](https://github.com/rails/rails/pull/27597)

[Refactor migration to move migrations paths to connection](https://github.com/rails/rails/pull/31727)

[Add locale selector to email preview](https://github.com/rails/rails/pull/31596)

[Allow for custom handling of exceptions that are discarded](https://github.com/rails/rails/pull/30622)

[Support for PostgreSQL foreign tables](https://github.com/rails/rails/pull/31549)

[Add Rack::TempfileReaper to the default middleware stack](https://github.com/rails/rails/commit/cdffab4bc7f9f6d0a46cbd31beed6b4b6dc4855a)

[Consistent behavior for session and cookies with to_h and to_hash method](https://github.com/rails/rails/commit/50a62499e41dfffc2903d468e8b47acebaf9b500)

[Do not lose all multiple `:includes` with options in serialization.](https://github.com/rails/rails/commit/853054bcc7a043eea78c97e7705a46abb603cc44)

[Fix that after commit callbacks on update does not triggered when optimistic locking is enabled](https://github.com/rails/rails/commit/7f9bd034c485c2425ae0164ff5d6374834e3aa1d)

[Fix `dependent: :destroy` issue for has_one/belongs_to relationship where the parent class was getting deleted when the child was not](https://github.com/rails/rails/commit/b0fc04aa3af338d5a90608bf37248668d59fc881)

[Add ability to create/validate invalid foreign keys in Postgres](https://github.com/rails/rails/pull/27756)

[Time column improvements](https://github.com/rails/rails/commit/e4617ac333d3e522478b8c9ba7b4410923892f97)

[Update "Ruby on Rails 5.2 Release Notes" Guide](https://github.com/rails/rails/pull/32222)

[Preparing for 5.2.0 release](https://github.com/rails/rails/commit/375a4143cf5caeb6159b338be824903edfd62836)
