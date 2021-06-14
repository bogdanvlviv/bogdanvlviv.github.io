---
layout: post
lang: "en"
title: "What is new in Rails 6.0"
author: "bogdanvlviv"
image: "/images/posts/ruby/rails/what-is-new-in-rails-6_0/rails460x460.png"
date: 2018-10-08 11:42:00 +0300
categories: posts ruby rails
permalink: /:categories/:title.html
---

<div class="picture">
  <img src="{{ "/images/posts/ruby/rails/what-is-new-in-rails-6_0/rails160x160.png" | absolute_url }}" title="Rails" loading="lazy">
</div>

Hello!

This post about news and some changes that have been done in Rails 6.0.

## Table of Contents

- [Rails 6.0 requires Ruby 2.5.0 or newer](#rails-60-requires-ruby-250-or-newer)
- [Parallel testing](#parallel-testing)
- [ActiveRecord::Relation#pick as shorthand for single-value plucks](#activerecordrelationpick-as-shorthand-for-single-value-plucks)
- [ActiveRecord::Relation#create_or_find_by/! to lean on unique constraints](#activerecordrelationcreate_or_find_by-to-lean-on-unique-constraints)
- [Action Mailbox](#action-mailbox)
- [Action Text](#action-text)
- [Action Cable testing](#action-cable-testing)
- [Other links](#other-links)

### [Rails 6.0 requires Ruby 2.5.0 or newer](#rails-60-requires-ruby-250-or-newer)

Pull Requests:
- [Rails 6 requires Ruby 2.4.1+](https://github.com/rails/rails/pull/32034)
- [Require Ruby 2.5 for Rails 6](https://github.com/rails/rails/pull/34754)

### [Parallel testing](#parallel-testing)

Pull Requests:
- [Parallel testing](https://github.com/rails/rails/pull/31900)
- [Add option to set parallel test worker count to the physical core count of the machine](https://github.com/rails/rails/pull/34735)

You know that class `ActiveSupport::TestCase` uses [minitest](https://github.com/seattlerb/minitest) under the hood (`Minitest::Test` is the superclass of the class).
To `ActiveSupport::TestCase` was added `parallelize` method.
It allows you to parallelize your test suite with forked processes.
Running tests in parallel reduces the time it takes your entire test suite to run.

Running test in threads is supported as well, but note that it doesn't make your test run faster (read ["Minitest Parallelization and You"](http://www.zenspider.com/ruby/2012/12/minitest-parallelization-and-you.html) since it uses [`Minitest::Parallel::Executor`](https://github.com/seattlerb/minitest/blob/master/lib/minitest/parallel.rb)).

The default parallelization method is to [fork](https://docs.ruby-lang.org/en/2.5.0/Kernel.html#method-i-fork) processes using Ruby's [DRb](https://docs.ruby-lang.org/en/2.5.0/DRb.html) system.

To enable parallelization with forked processes add the following to your `test/test_helper.rb`:

 ```ruby
class ActiveSupport::TestCase
  parallelize(workers: 3, with: :processes)
end
```

The `:workers` option controls how many times the the process is forked or how many threads are used.
The default number of workers is the actual physical core count on the machine you are on:

```ruby
class ActiveSupport::TestCase
  parallelize(workers: :number_of_processors)
end
```

If you would like to parallelize your test suite with threads, you should set `:with` option to `:threads`:

```ruby
class ActiveSupport::TestCase
  parallelize(workers: 3, with: :threads)
end
```

You can also use environment variable `PARALLEL_WORKERS` to easily change the number of workers a test run should use.
This is useful for CI environments or other environments where you may need more or less workers than you do for local testing:

```
PARALLEL_WORKERS=6 bin/rails test
```
When parallelizing test with processes, Active Record automatically handles creating a database and loading the schema into the database for each process. The databases will be suffixed with the number corresponding to the worker.
For example, if you have 2 workers the tests will create `test_database-0` and `test_database-1` databases respectively.
If the number of workers passed is 1 or fewer the processes will not be forked and the tests will not be parallelized and the tests will use the original `test_database` database.
Also, two hooks are provided, one runs when the process is forked but before the tests run, and one runs before the forked process is closed.
These can be useful if your app uses multiple databases or perform other tasks that depend on the number of workers.
The `parallelize_setup` method is called right after the process is forked. The `parallelize_teardown` method is called right before the process is closed:

 ```ruby
class ActiveSupport::TestCase
  parallelize_setup do |worker|
    # code
  end

  parallelize_teardown do |worker|
    # code
  end

  parallelize(workers: 2)
end
```

Note that these methods are not available with the threaded parallelization.

### [ActiveRecord::Relation#pick as shorthand for single-value plucks](#activerecordrelationpick-as-shorthand-for-single-value-plucks)

Pull Requests:
- [Add Relation#pick as short-hand for single-value plucks](https://github.com/rails/rails/pull/31941)

I am sure you know about the method `#pluck` that [has been in Rails since version 3.2.0](https://github.com/rails/rails/pull/1915).
Let's refresh our knowledge.
`#pluck` is a shortcut to select one or more attributes without loading a bunch of records just to grab the attributes you want:

```ruby
User.pluck(:name)
# SELECT "users"."name" FROM "users"
# => ["Bogdan", "David"]

User.where(id: 1).pluck(:name, :email)
# SELECT "users"."name", "users"."email" FROM "users" WHERE "users"."id" = ?  [["id", 1]]
# => [["Bogdan", "bogdanvlviv@gmail.com"]]

User.where("1=0").pluck(:name)
# SELECT "users"."name" FROM "users" WHERE (1=0)
# => []
```

But sometimes you just need single value(s) from the result. To get this you can do something like:

```ruby
User.limit(1).pluck(:name).first
# SELECT "users"."name" FROM "users" LIMIT ?  [["LIMIT", 1]]
# => "Bogdan"

User.where(id: 1).limit(1).pluck(:name, :email).first
# SELECT "users"."name", "users"."email" FROM "users" WHERE "users"."id" = ? LIMIT ?  [["id", 1], ["LIMIT", 1]]
# => ["Bogdan", "bogdanvlviv@gmail.com"]
```

Since Rails 6.0 you can use the method `#pick`, it is shorthand for `limit(1).pluck(*column_names).first`:

```ruby
User.pick(:name)
# SELECT "users"."name" FROM "users" LIMIT ?  [["LIMIT", 1]]
# => "Bogdan"

User.where(id: 1).pick(:name, :email)
# SELECT "users"."name", "users"."email" FROM "users" WHERE "users"."id" = ? LIMIT ?  [["id", 1], ["LIMIT", 1]]
# => ["Bogdan", "bogdanvlviv@gmail.com"]

User.pick(Arel.sql("UPPER(name)"))
# SELECT UPPER(name) FROM "users" LIMIT ?  [["LIMIT", 1]]
# => "BOGDAN"

User.where("1=0").pick(:name)
# SELECT "users"."name" FROM "users" WHERE (1=0) LIMIT ?  [["LIMIT", 1]]
# => nil
```

You probably noticed that the method `#pluck` does not guarantee the order of the returned value(s) by any column.
So note that `#pick` does not guarantee to return the value(s) of the first row ordered by any column either.
For instance, if you want to get value(s) of the first row ordered by `id` column, you should apply `order(:id)` before `pick`:

```ruby
User.order(:id).pick(:name)
# SELECT "users"."name" FROM "users" ORDER BY "users"."id" ASC LIMIT ?  [["LIMIT", 1]]
# => "Bogdan"
```

### [ActiveRecord::Relation#create_or_find_by/! to lean on unique constraints](#activerecordrelationcreate_or_find_by-to-lean-on-unique-constraints)

Pull Requests:
- [Add #create_or_find_by to lean on unique constraints](https://github.com/rails/rails/pull/31989)
- [#create_or_find_by/!: add more tests and fix docs](https://github.com/rails/rails/pull/34653)

`#create_or_find_by` attempts to create a record with the given attributes in a table that has a unique constraint
on one or several of its columns.
If a row already exists with one or several of these unique constraints, the exception such an insertion would normally raise is caught and the existing record with those attributes is found using [`#find_by!`](https://edgeapi.rubyonrails.org/classes/ActiveRecord/FinderMethods.html#method-i-find_by-21).

This is similar to [`#find_or_create_by`](https://api.rubyonrails.org/v5.2/classes/ActiveRecord/Relation.html#method-i-find_or_create_by), but avoids the problem of stale reads between the `SELECT` and the `INSERT`, as that method needs to first query the table, then attempt to insert a row if none is found.

There are several drawbacks to `#create_or_find_by`, though:

- The underlying table must have the relevant columns defined with unique constraints.
- A unique constraint violation may be triggered by only one, or at least less than all, of the given attributes. This means that the subsequent `#find_by!` may fail to find a matching record, which will then raise an `ActiveRecord::RecordNotFound` exception, rather than a record with the given attributes.
- While we avoid the race condition between `SELECT` -> `INSERT` from `#find_or_create_by`, we actually have another race condition between `INSERT` -> `SELECT`, which can be triggered if a `DELETE` between those two statements is run by another client. But for most applications, that's a significantly less likely condition to hit.
- It relies on exception handling to handle control flow, which may be marginally slower.

This method will return a record if all given attributes are covered by unique constraints (unless the `INSERT` -> `DELETE` -> `SELECT` race condition is triggered), but if creation was attempted and failed due to validation errors it won't be persisted, you get what [`#create`](https://api.rubyonrails.org/v5.2/classes/ActiveRecord/Persistence/ClassMethods.html#method-i-create) returns in such situation.

`#create_or_find_by!` is like `#create_or_find_by`, but calls [`create!`](https://api.rubyonrails.org/v5.2/classes/ActiveRecord/Persistence/ClassMethods.html#method-i-create-21) so an exception is raised if the created record is invalid.

Implementation of these methods look like:

```ruby
def create_or_find_by(attributes, &block)
  transaction(requires_new: true) { create(attributes, &block) }
rescue ActiveRecord::RecordNotUnique
  find_by!(attributes)
 end

def create_or_find_by!(attributes, &block)
  transaction(requires_new: true) { create!(attributes, &block) }
rescue ActiveRecord::RecordNotUnique
  find_by!(attributes)
end
```

Examples using of these methods:

```ruby
User.create_or_find_by(email: "bogdanvlviv@gmail.com") do |user|
  user.name = "Bogdan"
end

User.create_or_find_by!(email: "bogdanvlviv@gmail.com") do |user|
  user.name = "Богдан"
end
```

### [Action Mailbox](#action-mailbox)

Pull Requests:
- [Import Action Mailbox](https://github.com/rails/rails/pull/34786)
- [Add Action Mailbox to guides](https://github.com/rails/rails/pull/34812)
- [Add `--skip-action-mailbox` option to `rails new`](https://github.com/rails/rails/pull/34816)
- [Deprecate ActionMailer::Base.receive in favor of Action Mailbox](https://github.com/rails/rails/commit/e3f832a7433a291a51c5df397dc3dd654c1858cb)
- [Add `rails test:mailboxes`](https://github.com/rails/rails/pull/34828)
- [Add Postmark ingress support to ActionMailbox](https://github.com/rails/rails/pull/34907)
- [Add Exim and Qmail support to Action Mailbox](https://github.com/rails/rails/pull/34928)

[Action Mailbox](https://github.com/rails/rails/tree/6-0-stable/actionmailbox) allows you to route incoming emails to controller-like mailboxes.
You can read more about Action Mailbox in the [Action Mailbox Basics](https://guides.rubyonrails.org/v6.0/action_mailbox_basics.html) guide.

### [Action Text](#action-text)

Pull Requests:
- [Import Action Text](https://github.com/rails/rails/pull/34873)
- [Add Action Text to guides](https://github.com/rails/rails/pull/34878)
- [Add `--skip-action-text` option to `rails new`](https://github.com/rails/rails/pull/34879)

[Action Text](https://github.com/rails/rails/tree/6-0-stable/actiontext) brings rich text content and editing to Rails.
It includes the [Trix editor](https://trix-editor.org) that handles everything from formatting to links to quotes to lists to embedded images and galleries.
The rich text content generated by the Trix editor is saved in its own RichText model that's associated with any existing Active Record model in the application.
Any embedded images (or other attachments) are automatically stored using Active Storage and associated with the included RichText model.

You can read more about Action Text in the [Action Text Overview](https://guides.rubyonrails.org/v6.0/action_text_overview.html) guide.

### [Action Cable testing](#action-cable-testing)

Pull Requests:
- [Action cable testing](https://github.com/rails/rails/pull/33659)
- [Add ActionCable::Channel::TestCase](https://github.com/rails/rails/pull/33969)
- [Add streams assert methods to ActionCable channel test case](https://github.com/rails/rails/pull/34740)
- [Add ActionCable::Connection::TestCase](https://github.com/rails/rails/pull/34845)
- [Add Action Cable testing guides and generators](https://github.com/rails/rails/pull/34933)
- [Add `rails test:channels` and fix Action Cable templates](https://github.com/rails/rails/pull/34947)

### [Other links](#other-links)

[Start Rails 6.0 development!!!](https://github.com/rails/rails/commit/1c383df324fdf0b68b3f54a649eb7d2a4f55bcb7)

[Introduce custom serializers to ActiveJob arguments](https://github.com/rails/rails/pull/30941)

[Deprecate update_attributes and update_attributes!](https://github.com/rails/rails/commit/5645149d3a27054450bd1130ff5715504638a5f5)

[`String#strip_heredoc` preserves frozenness`](https://github.com/rails/rails/pull/32037)

[String#truncate_bytes](https://github.com/rails/rails/pull/27319)

[Add support for timezones to Active Job](https://github.com/rails/rails/pull/32085)

[Add `:private` option to ActiveSupport's `Module#delegate`](https://github.com/rails/rails/pull/31944)

[Don't enforce UTF-8 by default](https://github.com/rails/rails/pull/32125)

[Support i18n key at translation of value in submit tag](https://github.com/rails/rails/pull/26799)

[Add "rails routes --expanded" mode](https://github.com/rails/rails/pull/32130)

[Enable select tag helper to mark `prompt` option as `selected` and/or `disabled` for `required` field](https://github.com/rails/rails/pull/32087)

[Introduce explicit rails server handler option](https://github.com/rails/rails/pull/32058)

[Add `before?` and `after?` methods to date and time classes](https://github.com/rails/rails/pull/32185)

[Disable ActionView::Template finalizers in test environment](https://github.com/rails/rails/pull/32418)

[Add AR::Base.base_class? predicate](https://github.com/rails/rails/pull/32417)

[Deprecate controller level force_ssl](https://github.com/rails/rails/pull/32277)

[Add #dig to ActionDispatch::Request::Session](https://github.com/rails/rails/pull/32446)

[Deprecate support for using `HOST` environment to specify server IP](https://github.com/rails/rails/pull/32540)

[Define callbacks on descendants](https://github.com/rails/rails/pull/31913)

[Introduce ActionDispatch::DebugExceptions interceptors](https://github.com/rails/rails/pull/23868)

[Add `touch_all` method to `ActiveRecord::Relation`](https://github.com/rails/rails/pull/31513)

[Part 1 Easy Multi db in Rails: Add basic rake tasks for multi db setup](https://github.com/rails/rails/pull/32274)
[Fix two-level database configurations with URLs](https://github.com/rails/rails/pull/32396)
[Fix structure:dump for multiple databases](https://github.com/rails/rails/commit/0a353a97869b2af256d4253533beeb38303cf753)
[Allow schema/structure load for multiple databases](https://github.com/rails/rails/commit/48d58494dbfaab759531c168f0103542e4f73614)
[Add multidb application test](https://github.com/rails/rails/commit/fa5a028ed9fccf54bb320e6a99a5a539de4c57ba)
[Don't create namespaced tasks if single db application](https://github.com/rails/rails/commit/5ddcda6d5f560d27bbae877d6ba8fb687d1b1a3b)
[Db schema cache dump and clear multi db](https://github.com/rails/rails/pull/34181)
[Part 5: Multi db improvements, Fix query cache for multiple connections](https://github.com/rails/rails/pull/34491)
[Part 7: Multi db improvements, Add ability to block writes to a database](https://github.com/rails/rails/pull/34505)
[Part 8: Multi db improvements, Adds basic automatic database switching to Rails](https://github.com/rails/rails/pull/35073)
[Add ability to change the names of the default handlers](https://github.com/rails/rails/pull/35132)
[Add ActiveRecord::Base.connected_to?](https://github.com/rails/rails/pull/34680)

[Use ImageProcessing gem for ActiveStorage variants](https://github.com/rails/rails/pull/32471)

[Merge Arel](https://github.com/rails/arel)

[Update 'rails_welcome.png' to reflect a more diverse population](https://github.com/rails/rails/pull/32735)
<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">rails link: Update &#39;rails_welcome.png&#39; to reflect a more diverse population<a href="https://t.co/oyUMkGwuBk">https://t.co/oyUMkGwuBk</a> <a href="https://t.co/LYKTsZ8NK4">pic.twitter.com/LYKTsZ8NK4</a></p>&mdash; Bogdan (@bogdanvlviv) <a href="https://twitter.com/bogdanvlviv/status/989618779628990464?ref_src=twsrc%5Etfw">April 26, 2018</a></blockquote>

[Changes Rails Welcome image on localhost:3000](https://github.com/rails/rails/pull/33191)

[Loaded associations should not run a new query when size is called](https://github.com/rails/rails/pull/32617)

[has_(one/many)_attached presence validation](https://github.com/rails/rails/pull/31956)

[Allow usage of strings as locals for partial renderer](https://github.com/rails/rails/pull/30647)

[Add Enumerable#index_with](https://github.com/rails/rails/pull/32523)

[Allow to override the full_message error format](https://github.com/rails/rails/pull/32956)

[Add `year_format` option to date_select tag.](https://github.com/rails/rails/pull/32190)

[Allow call `assert_enqueued_with` and `assert_enqueued_email_with` with no block ](https://github.com/rails/rails/pull/33258)

[Allow `queue` option to `assert_no_enqueued_jobs`](https://github.com/rails/rails/pull/33265)

[Allow configurable attribute name on `#has_secure_password`](https://github.com/rails/rails/pull/26764)

[Adds `Rails::Command::NotesCommand` and makes `rake notes` use it under the hood](https://github.com/rails/rails/pull/33220)

[Pass along arguments to underlying `get` method in `follow_redirect!`](https://github.com/rails/rails/pull/33299)

[Store newly-uploaded files on save rather than assignment](https://github.com/rails/rails/pull/33303)

[rails server: Allow to explicitly specify whether to output Rails's log to stdout](https://github.com/rails/rails/pull/28266)

[Add implicit to path conversion to uploaded file](https://github.com/rails/rails/pull/28676)

[Add a foreign-key constraint to the active_storage_attachments table for blobs](https://github.com/rails/rails/pull/33405)

[Show nested exceptions on the debug view](https://github.com/rails/rails/pull/32410)

[Add cpu time, idle time, and allocations features to log subscriber events](https://github.com/rails/rails/pull/33449)
[Add event object subscriptions to AS::Notifications](https://github.com/rails/rails/pull/33451)

[Bundler binstubs](https://github.com/rails/rails/pull/33202)

[Add Purpose Metadata to Cookies](https://github.com/rails/rails/pull/32937)

[33515 invert remove foreign key support "to_table"](https://github.com/rails/rails/pull/33530)

[Fix AM::Serializers::JSON#as_json method for timestamps](https://github.com/rails/rails/pull/31503)

[Add `Array#extract!`](https://github.com/rails/rails/pull/33137)

[Move `dev:cache` rake task to use Rails::Command](https://github.com/rails/rails/pull/33559)

[Allow `perform_enqueued_jobs` to be called without a block.](https://github.com/rails/rails/pull/33626)

[Improve Active Job test helpers](https://github.com/rails/rails/pull/33635)

[Deprecate calling private model methods from view helpers.](https://github.com/rails/rails/commit/047a893da7a43b8e115b854c73735b9e6475838e)

[Add database configuration to disable advisory locks](https://github.com/rails/rails/pull/33691)

[Omit BEGIN/COMMIT statements for empty transactions](https://github.com/rails/rails/pull/32647)

[Fail more gracefully from ActiveStorage missing file exceptions](https://github.com/rails/rails/pull/33666)

[Part 2: Multi-db improvements, Refactor Active Record configurations](https://github.com/rails/rails/pull/33637)

[Part 3: Multi-db Improvements, identifying replica configurations](https://github.com/rails/rails/pull/33770)

[Emit warning for unknown inflection rule when generating model.](https://github.com/rails/rails/pull/33766)

[Make null_store the default cache store in test environment config ](https://github.com/rails/rails/pull/33773)

[Add hooks to ActiveJob around retries and discards](https://github.com/rails/rails/pull/33751)

[Deprecate most methods which were never used in `DatabaseLimits`](https://github.com/rails/rails/pull/33799)

[Maintain html_safe? on sliced HTML safe strings](https://github.com/rails/rails/pull/33808)

[https://github.com/rails/rails/pull/33798](ActionCable: add id option to redis adapter config )

[trace autoloads, and document hints for troubleshooting](https://github.com/rails/rails/commit/c03bba4f1f03bad7dc034af555b7f2b329cf76f5)

[update I18n fallbacks configuration to be compatible with i18n 1.1.0](https://github.com/rails/rails/pull/33574)

[Configuration item `config.filter_parameters` could also filter out sensitive values of database columns when call `#inspect`.](https://github.com/rails/rails/pull/33756)
[Implement AR#inspect using ParameterFilter](https://github.com/rails/rails/pull/34208)

[Add #unfreeze_time to ActiveSupport::Testing::TimeHelpers](https://github.com/rails/rails/pull/33813)

[Make sure there are no duplicated nested records with create_with](https://github.com/rails/rails/pull/33639)

[Use utf8mb4 character set by default for MySQL database](https://github.com/rails/rails/pull/33608)
[Bump minimum MySQL version to 5.5.8.](https://github.com/rails/rails/pull/33853)

[Skip delivery notification when perform_deliveries is false.](https://github.com/rails/rails/pull/33824)

[TaggedLogging to return a new logger instance](https://github.com/rails/rails/pull/27792)

[Include test helpers in ActionDispatch::IntegrationTest](https://github.com/rails/rails/pull/33849)

[Use faster globs for template resolving](https://github.com/rails/rails/pull/33860)

[Allow subclasses to redefine autosave callbacks for associated records.](https://github.com/rails/rails/pull/33378)

[SQLite3 adapter supports expression indexes.](https://github.com/rails/rails/pull/33874)
[SQLite3: Support multiple args function for expression indexes](https://github.com/rails/rails/commit/af653ef72190c6cd3e6b2a86786a981ad4bdb44e)

[Configure Active Storage route prefix](https://github.com/rails/rails/pull/33883)

[PostgreSQL: prepare for pg-1.1](https://github.com/rails/rails/pull/33188)

[Don't update counter cache unless the record is actually saved](https://github.com/rails/rails/pull/33913)

[Deprecate ActiveRecord::Result#to_hash in favor of #to_a](https://github.com/rails/rails/pull/33912)

[Add support for multi environment credentials.](https://github.com/rails/rails/pull/33521)
[Restructure credentials after environment overrides.](https://github.com/rails/rails/pull/33962)

[Error when using "recyclable" cache keys with a store that does not support it](https://github.com/rails/rails/pull/33932)

[index option added for change_table migrations](https://github.com/rails/rails/pull/23593)

[Encode Content-Disposition filenames on send_data and send_file](https://github.com/rails/rails/pull/33829)

[Fix `transaction` reverting for migrations](https://github.com/rails/rails/pull/31604)

[Allow assert_enqueued_with/assert_performed_with methods to accept a proc for the args argument. This is useful to check if only a subset of arguments matches your expectations.](https://github.com/rails/rails/pull/33995)

[Add `ActionController::Parameters#each_value`](https://github.com/rails/rails/pull/33979)

[Add migrations_paths option to migration generator](https://github.com/rails/rails/pull/33760)
[Add migrations_paths option to model generator](https://github.com/rails/rails/pull/33994)
[Refactor migrations_path command option to database](https://github.com/rails/rails/pull/34021)

[Treat `#delete_prefix`, `#delete_suffix` and `#unicode_normalize` results as non-`html_safe`. Ensure safety of arguments for `#insert`, `#[]=` and `#replace` calls on `html_safe` Strings.](https://github.com/rails/rails/pull/33990)

[Add deprecation warning when String#first and String#last receive negative integers](https://github.com/rails/rails/pull/33058)

[Make Webpacker the default JavaScript compiler for Rails 6](https://github.com/rails/rails/pull/33079)

[Deprecate the use of `LoggerSilence` in favor of `ActiveSupport::LoggerSilence`](https://github.com/rails/rails/pull/34045)

[Rename `Module#parent`, `Module#parents`, and `Module#parent_name` to `module_parent`, `module_parents`, and `module_parent_name`](https://github.com/rails/rails/pull/34051)

[Parameterized mailers can configure delivery job](https://github.com/rails/rails/pull/34097)
[Add MailDeliveryJob for unified mail delivery](https://github.com/rails/rails/pull/34591)
[Move MailDeliveryJob default to 6.0 defaults](https://github.com/rails/rails/pull/34692)

[Deprecate `ActionDispatch::Http::ParameterFilter` in favor of `ActiveSupport::ParameterFilter`](https://github.com/rails/rails/pull/34039)

[Add multi-db support to rails db:migrate:status](https://github.com/rails/rails/pull/34137)

[Fix inconsistent behavior by clearing QueryCache when reloading associations](https://github.com/rails/rails/pull/34094)

[Enum raises on invalid definition values](https://github.com/rails/rails/pull/34110)

[Add allocations to template renderer subscription](https://github.com/rails/rails/pull/34136)

[Part 4: Multi db improvements, Basic API for connection switching](https://github.com/rails/rails/pull/34052)
[Add support for hash and url configs to be used in connected_to](https://github.com/rails/rails/pull/34196)

[Deprecate `ActiveSupport::Multibyte::Unicode#downcase/upcase/swapcase` in favor of `String#downcase/upcase/swapcase`](https://github.com/rails/rails/pull/34123)
[Deprecate `ActiveSupport::Multibyte::Unicode#normalize` and `ActiveSuppport::Multibyte::Chars#normalize` in favor of `String#unicode_normalize`](https://github.com/rails/rails/pull/34202)

[Include deserialized arguments in job instances returned from `assert_enqueued_with` and `assert_performed_with`](https://github.com/rails/rails/pull/34204)

[Fix duration being rounded to a full second](https://github.com/rails/rails/pull/34135)

[Use Ids instead of memory addresses when displaying references in scaffold views](https://github.com/rails/rails/pull/29204)

[Deprecate ActiveSupport::Multibyte::Chars.consumes?](https://github.com/rails/rails/pull/34215)

[Deprecate `ActiveSupport::Multibyte::Unicode#pack_graphemes(array)` and `ActiveSuppport::Multibyte::Unicode#unpack_graphemes(string)` in favor of `array.flatten.pack("U*")` and `string.scan(/\X/).map(&:codepoints)`, respectively](https://github.com/rails/rails/pull/34254)

[Support default expression and expression indexes for MySQL](https://github.com/rails/rails/pull/34307)

[ActiveStorage: Don’t include an undefined X-CSRF-Token header when creating a blob record](https://github.com/rails/rails/pull/34810)

[Make ActiveStorage::Blob keys lowercase](https://github.com/rails/rails/pull/34818)

[Permit generating variants of TIFF images](https://github.com/rails/rails/pull/34824)

[Permit sending Active Storage purge and analysis jobs to separate queues](https://github.com/rails/rails/pull/34838)
[Send Active Storage analysis and purge jobs to dedicated queues by default](https://github.com/rails/rails/pull/34863)

[Fix the need of `#protect_against_forgery?` method defined in `ActionView::Base` subclasses](https://github.com/rails/rails/pull/34797)

[Add `ActiveModel::Errors#of_kind?`](https://github.com/rails/rails/pull/34866)

[Convert ActionCable javascript to ES2015 modules with a modern build environment](https://github.com/rails/rails/pull/34177)

[Keep executions for each specific exception](https://github.com/rails/rails/pull/34352)
[Support in-flight jobs stored before individual execution counters for `retry_on`](https://github.com/rails/rails/pull/34731)
[Run exception tests for all ActiveJob adapters and fix issue with individual counters and Resque](https://github.com/rails/rails/pull/34890)

[Move all npm packages to @rails scope](https://github.com/rails/rails/pull/34905)

[Add support for endless ranges introduces in Ruby 2.6](https://github.com/rails/rails/pull/34906)

[Refactor calculating beginning_of_quarter and end_of_quarter](https://github.com/rails/rails/pull/34927)

[Allow permitted instance of `ActionController::Parameters` as argument of `ActiveRecord::Relation#exists?`](https://github.com/rails/rails/pull/34891)

[Guard Enums against definitions with blank label names](https://github.com/rails/rails/pull/34385)

[Add an :if_not_exists option to create_table](https://github.com/rails/rails/pull/31382)

[Remove asset paths from autoload_paths](https://github.com/rails/rails/pull/34400)

[Add support for UNLOGGED Postgresql tables](https://github.com/rails/rails/pull/34221)

[Arel: Implemented DB-aware NULL-safe comparison](https://github.com/rails/rails/pull/34451)

[Prevent TextHelper#word_wrap from stripping white space on the left side of long lines; Fixes #34487](https://github.com/rails/rails/pull/34488)

[ActionMailer: support overriding template name in multipart](https://github.com/rails/rails/pull/22534)

[Refs #28025 nullify *_type column on polymorphic associations on :nulify polymorphic *_type column on dependent: :nullify strategy](https://github.com/rails/rails/pull/28078)

[Add rails db:system:change command](https://github.com/rails/rails/pull/34832)

[Seed database with inline ActiveJob job adapter](https://github.com/rails/rails/pull/34953)

[Make `t.timestamps` with precision by default](https://github.com/rails/rails/pull/34970)

[Remove all code deprecated in Rails 5.2](https://github.com/rails/rails/pull/34954)

[All of queries should return correct result even if including large number](https://github.com/rails/rails/pull/30000)

[Fix deeply nested namespace command printing](https://github.com/rails/rails/pull/35033)

[Make `t.timestamps` with precision by default](https://github.com/rails/rails/pull/34970)

[MySQL: Support `:size` option to change text and blob size](https://github.com/rails/rails/pull/35071)

[Action Cable: move channel_name to Channel.broadcasting_for](https://github.com/rails/rails/pull/35021)

[`ActionDispatch::SystemTestCase.driven_by` can now be called with a block to define specific browser capabilities](https://github.com/rails/rails/pull/35081)

[Support before_reset callback in CurrentAttributes](https://github.com/rails/rails/pull/35063)

[Improve performance of blank? and present? in an ActiveRecord::Base instance](https://github.com/rails/rails/commit/cc2d614e6310337a9d34ede3e67d634d84561cde)

[Move compiled ERB to an AV::Base subclass](https://github.com/rails/rails/pull/35036)

[Fix elapsed time calculations](https://github.com/rails/rails/pull/34618)

[Add 'Hash#deep_transform_values', and 'Hash#deep_transform_values!'](https://github.com/rails/rails/commit/b8dc06b8fdc16874160f61dcf58743fcc10e57db)

[Add slice! method to ActiveModel::Errors](https://github.com/rails/rails/pull/34489)

[Allow all assertion helpers that have a `only` and `except` keyword to accept Procs](https://github.com/rails/rails/pull/34339)

[Bump the minimum version of PostgreSQL to 9.3](https://github.com/rails/rails/pull/34520)

[Make it possible to override the implicit order column](https://github.com/rails/rails/pull/34480)

[option to disable all scopes that `ActiveRecord.enum` generates](https://github.com/rails/rails/pull/34605)

[Allow using parsed_body in ActionController::TestCase](https://github.com/rails/rails/pull/34717)

[Introduce guard against DNS rebinding attacks](https://github.com/rails/rails/pull/33145)

[Add option to set parallel test worker count to the physical core count of the machine](https://github.com/rails/rails/pull/34735)

[SQLite3: Implement `add_foreign_key` and `remove_foreign_key`](https://github.com/rails/rails/pull/35212)

[Zeitwerk integration](https://github.com/rails/rails/pull/35235)

[Adding enque time tracking and logging to a job](https://github.com/rails/rails/commit/ac68550ae6d117b1d257f5df38ba76e03b7e2cf4)

[Add delete_by/destroy_by as relation methods](https://github.com/rails/rails/pull/35316)

[Ensure `update_all` series cares about optimistic locking](https://github.com/rails/rails/pull/35352)

[Add negative scopes for all enum values](https://github.com/rails/rails/pull/35381)

[Add reselect method](https://github.com/rails/rails/pull/33611)

[Deprecate mismatched collation comparison for uniqueness validator](https://github.com/rails/rails/pull/35350)

[Allow `truncate` for SQLite3 adapter and add `rails db:seed:replant`, `rails db:truncate_all`](https://github.com/rails/rails/pull/34779)

[Add `insert_all`/`insert_all!`/`upsert_all` methods to `ActiveRecord::Persistence`, allowing bulk inserts akin to the bulk updates provided by `update_all` and bulk deletes by `delete_all`](https://github.com/rails/rails/pull/35077)

[Added Array#including, Array#excluding, Enumerable#including, Enumerable#excluding](https://github.com/rails/rails/commit/bfaa3091c3c32b5980a614ef0f7b39cbf83f6db3)

[Add locale option to #parameterize](https://github.com/rails/rails/pull/35571)

[Fall back to parent locale before falling back to the :errors namespace](https://github.com/rails/rails/pull/35424)

[Support Optimizer Hints](https://github.com/rails/rails/pull/35615)

[Add `-e/--environment` option to `rails initializers`](https://github.com/rails/rails/pull/35637)

[Fix `Time#advance` to work with dates before 1001-03-07](https://github.com/rails/rails/pull/35659)

[Add ActiveSupport::Notifications instrumentation of the processing of each middleware in the stack](https://github.com/rails/rails/commit/04ae0b0b5e594e0bb99c5cd608921745977bcdcd)

[Add Relation#annotate for SQL commenting](https://github.com/rails/rails/pull/35617)

[Update `ActiveSupport::Notifications::Instrumenter#instrument to make passing a block optional](https://github.com/rails/rails/pull/35705)

[Add config.disable_sandbox option to Rails console](https://github.com/rails/rails/pull/35723)

[Type cast falsy boolean symbols on boolean attribute as false](https://github.com/rails/rails/pull/35794)

[Add `ActiveRecord::Relation#extract_associated` for extracting associated record](https://github.com/rails/rails/pull/35784)

[Only clear ActionView caches in dev when files change](https://github.com/rails/rails/pull/35629)

[Add `after_save_commit` callback shortcut](https://github.com/rails/rails/pull/35804)

[Add `rails db:prepare` to migrate or setup a database](https://github.com/rails/rails/pull/35768)

[Use `execute_batch2` rather than `execute_batch` to fix performance regression for fixture loading](https://github.com/rails/rails/pull/35844)
