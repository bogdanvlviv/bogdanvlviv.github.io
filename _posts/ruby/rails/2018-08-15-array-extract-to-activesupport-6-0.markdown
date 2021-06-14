---
layout: post
lang: "en"
title: "Array#extract! to Active Support 6.0"
author: "bogdanvlviv"
image: "/images/posts/ruby/rails/array-extract-to-activesupport-6-0/rails460x460.png"
date: 2018-08-15 17:30:00 +0300
categories: posts ruby rails
permalink: /:categories/:title.html
---

> TL;DR? [#33137](https://github.com/rails/rails/pull/33137).

I have worked on a task, which included handling an array of data, recently.
I needed to **extract** a data that satisfy some condition from the array, without losing the rest of the data that do not satisfy the condition, and then handle those arrays of data differently.

There are a lot of instance methods in the [`Array`](https://ruby-doc.org/core-2.5.1/Array.html) class, so I started looking for an appropriate method that would help me easily to do that.

I looked at [`Array#select!`](https://ruby-doc.org/core-2.5.1/Array.html#method-i-select-21), but it did not work in my case since it

> Invokes the given block passing in successive elements from `self`, deleting elements for which the block returns a `false` value.
>
> If changes were made, it will return `self`, otherwise it returns `nil`.
>
> If no block is given, an [`Enumerator`](https://ruby-doc.org/core-2.5.1/Enumerator.html) is returned instead.

```ruby
numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
odd_numbers = numbers.select! { |number| number.odd? } # => [1, 3, 5, 7, 9]
numbers # => [1, 3, 5, 7, 9]
numbers.object_id == odd_numbers.object_id # => true
```

Then looked at [`Array#reject!`](https://ruby-doc.org/core-2.5.1/Array.html#method-i-reject-21)

> Deletes every element of `self` for which the block evaluates to `true`.
>
> If changes were made, it will return `self`, otherwise it returns `nil`.
>
> If no block is given, an [`Enumerator`](https://ruby-doc.org/core-2.5.1/Enumerator.html) is returned instead.

```ruby
numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
not_odd_numbers = numbers.reject! { |number| number.odd? } # => [0, 2, 4, 6, 8]
numbers # => [0, 2, 4, 6, 8]
numbers.object_id == not_odd_numbers.object_id # => true
```

Then looked at [`Array#keep_if`](https://ruby-doc.org/core-2.5.1/Array.html#method-i-keep_if)

> Deletes every element of `self` for which the given block evaluates to `false`.
>
> If no block is given, an [`Enumerator`](https://ruby-doc.org/core-2.5.1/Enumerator.html) is returned instead.

```ruby
numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
odd_numbers = numbers.keep_if { |number| number.odd? } # => [1, 3, 5, 7, 9]
numbers # => [1, 3, 5, 7, 9]
numbers.object_id == odd_numbers.object_id # => true
```

and [`Array#delete_if`](https://ruby-doc.org/core-2.5.1/Array.html#method-i-delete_if)

> Deletes every element of `self` for which block evaluates to `true`.
>
> If no block is given, an [`Enumerator`](https://ruby-doc.org/core-2.5.1/Enumerator.html) is returned instead.

```ruby
numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
not_odd_numbers = numbers.delete_if { |number| number.odd? } # => [0, 2, 4, 6, 8]
numbers # => [0, 2, 4, 6, 8]
numbers.object_id == not_odd_numbers.object_id # => true
```

and even looked at [`Array#slice!`](https://ruby-doc.org/core-2.5.1/Array.html#method-i-slice-21) and more - all of them did not work in my case either.

Finally, I found the method that fit the most in my case, it is [`Enumerable#partition`](https://ruby-doc.org/core-2.5.1/Enumerable.html#method-i-partition).

> Returns two arrays, the first containing the elements of enum for which the block evaluates to `true`, the second containing the rest.
>
> If no block is given, an [`Enumerator`](https://ruby-doc.org/core-2.5.1/Enumerator.html) is returned instead.

```ruby
numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
odd_numbers, numbers = numbers.partition { |number| number.odd? } # => [[1, 3, 5, 7, 9], [0, 2, 4, 6, 8]]
```

I was a bit surprised that there is no the appropriate method because using [`Enumerable#partition`](https://ruby-doc.org/core-2.5.1/Enumerable.html#method-i-partition) looks a bit complicated in that case.

Then I lookded for the method in [Active Support](https://github.com/rails/rails/tree/master/activesupport), but I did not find it there either.
I did grep [the Rails code base](https://github.com/rails/rails) in order to see whether we use [`Enumerable#partition`](https://ruby-doc.org/core-2.5.1/Enumerable.html#method-i-partition) in the similar cases:

```bash
rails$ git grep --extended-regexp "\.partition(\s*\{|\s+do|\(?\s*(&:|method))"
actionpack/lib/action_dispatch/http/parameter_filter.rb:          deep_regexps, regexps = regexps.partition { |r| r.to_s.include?("\\.".freeze) }
actionpack/lib/action_dispatch/http/parameter_filter.rb:          deep_strings, strings = strings.partition { |s| s.include?("\\.".freeze) }
actionpack/lib/action_dispatch/journey/router.rb:          routes.partition { |r|
actionpack/lib/action_dispatch/routing/mapper.rb:            constraints.partition do |key, requirement|
actionview/lib/action_view/dependency_tracker.rb:          wildcards, explicits = dependencies.partition { |dependency| dependency[-1] == "*" }
activemodel/lib/active_model/attribute_methods.rb:            matchers = attribute_method_matchers.partition(&:plain?).reverse.flatten(1)
activerecord/lib/active_record/associations/join_dependency.rb:          }.partition(&:first)
activerecord/lib/active_record/connection_adapters/postgresql/oid/type_map_initializer.rb:            mapped, nodes = nodes.partition { |row| @store.key? row["typname"] }
activerecord/lib/active_record/connection_adapters/postgresql/oid/type_map_initializer.rb:            ranges, nodes = nodes.partition { |row| row["typtype"] == "r".freeze }
activerecord/lib/active_record/connection_adapters/postgresql/oid/type_map_initializer.rb:            enums, nodes = nodes.partition { |row| row["typtype"] == "e".freeze }
activerecord/lib/active_record/connection_adapters/postgresql/oid/type_map_initializer.rb:            domains, nodes = nodes.partition { |row| row["typtype"] == "d".freeze }
activerecord/lib/active_record/connection_adapters/postgresql/oid/type_map_initializer.rb:            arrays, nodes = nodes.partition { |row| row["typinput"] == "array_in".freeze }
activerecord/lib/active_record/connection_adapters/postgresql/oid/type_map_initializer.rb:            composites, nodes = nodes.partition { |row| row["typelem"].to_i != 0 }
activerecord/lib/active_record/connection_adapters/postgresql/schema_statements.rb:              sqls, procs = Array(send(method, table, *arguments)).partition { |v| v.is_a?(String) }
activerecord/lib/active_record/connection_adapters/postgresql/schema_statements.rb:          sqls, procs = Array(change_column_for_alter(table_name, column_name, type, options)).partition { |v| v.is_a?(String) }
activerecord/lib/active_record/relation/predicate_builder/array_handler.rb:        nils, values = values.partition(&:nil?)
activerecord/lib/active_record/relation/predicate_builder/array_handler.rb:        ranges, values = values.partition { |v| v.is_a?(Range) }
railties/lib/rails/api/generator.rb:      core_exts, classes = classes.partition { |klass| core_extension?(klass) }
```

I saw that 11 from 18 cases using of [`Enumerable#partition`](https://ruby-doc.org/core-2.5.1/Enumerable.html#method-i-partition) in [the Rails code base](https://github.com/rails/rails) are similar to the case I had - **extract** a data that satisfy some condition from an array, without losing the rest of the data that do not satisfy the condition.

Since we use [Active Support](https://github.com/rails/rails/tree/master/activesupport) in order to make [Rails](https://github.com/rails/rails) maintenance easier, I decided to add [`Array#extract!`](https://api.rubyonrails.org/v6.0/classes/Array.html#method-i-extract-21) method to [Active Support](https://github.com/rails/rails/tree/master/activesupport) in order to simplify those 11 cases.

Pull Request: [Add `Array#extract!`](https://github.com/rails/rails/pull/33137).

> The method removes and returns the elements for which the block returns a `true` value.
>
> If no block is given, an [`Enumerator`](https://ruby-doc.org/core-2.5.1/Enumerator.html) is returned instead.

```ruby
numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
odd_numbers = numbers.extract! { |number| number.odd? } # => [1, 3, 5, 7, 9]
numbers # => [0, 2, 4, 6, 8]
```

Examples using of [`Array#extract!`](https://api.rubyonrails.org/v6.0/classes/Array.html#method-i-extract-21):

```diff
diff --git a/actionpack/lib/action_dispatch/http/parameter_filter.rb b/actionpack/lib/action_dispatch/http/parameter_filter.rb
index 1d58964862..de11939fa8 100644
--- a/actionpack/lib/action_dispatch/http/parameter_filter.rb
+++ b/actionpack/lib/action_dispatch/http/parameter_filter.rb
@@ -1,6 +1,7 @@
 # frozen_string_literal: true

 require "active_support/core_ext/object/duplicable"
+require "active_support/core_ext/array/extract"

 module ActionDispatch
   module Http
@@ -38,8 +39,8 @@ def self.compile(filters)
             end
           end

-          deep_regexps, regexps = regexps.partition { |r| r.to_s.include?("\\.".freeze) }
-          deep_strings, strings = strings.partition { |s| s.include?("\\.".freeze) }
+          deep_regexps = regexps.extract! { |r| r.to_s.include?("\\.".freeze) }
+          deep_strings = strings.extract! { |s| s.include?("\\.".freeze) }

           regexps << Regexp.new(strings.join("|".freeze), true) unless strings.empty?
           deep_regexps << Regexp.new(deep_strings.join("|".freeze), true) unless deep_strings.empty?
diff --git a/activerecord/lib/active_record/connection_adapters/postgresql/oid/type_map_initializer.rb b/activerecord/lib/active_record/connection_adapters/postgresql/oid/type_map_initializer.rb
index 231278c184..79351bc3a4 100644
--- a/activerecord/lib/active_record/connection_adapters/postgresql/oid/type_map_initializer.rb
+++ b/activerecord/lib/active_record/connection_adapters/postgresql/oid/type_map_initializer.rb
@@ -1,5 +1,7 @@
 # frozen_string_literal: true

+require "active_support/core_ext/array/extract"
+
 module ActiveRecord
   module ConnectionAdapters
     module PostgreSQL
@@ -16,12 +18,12 @@ def initialize(store)

           def run(records)
             nodes = records.reject { |row| @store.key? row["oid"].to_i }
-            mapped, nodes = nodes.partition { |row| @store.key? row["typname"] }
-            ranges, nodes = nodes.partition { |row| row["typtype"] == "r".freeze }
-            enums, nodes = nodes.partition { |row| row["typtype"] == "e".freeze }
-            domains, nodes = nodes.partition { |row| row["typtype"] == "d".freeze }
-            arrays, nodes = nodes.partition { |row| row["typinput"] == "array_in".freeze }
-            composites, nodes = nodes.partition { |row| row["typelem"].to_i != 0 }
+            mapped = nodes.extract! { |row| @store.key? row["typname"] }
+            ranges = nodes.extract! { |row| row["typtype"] == "r".freeze }
+            enums = nodes.extract! { |row| row["typtype"] == "e".freeze }
+            domains = nodes.extract! { |row| row["typtype"] == "d".freeze }
+            arrays = nodes.extract! { |row| row["typinput"] == "array_in".freeze }
+            composites = nodes.extract! { |row| row["typelem"].to_i != 0 }

             mapped.each     { |row| register_mapped_type(row)    }
             enums.each      { |row| register_enum_type(row)      }
diff --git a/activerecord/lib/active_record/relation/predicate_builder/array_handler.rb b/activerecord/lib/active_record/relation/predicate_builder/array_handler.rb
index 64bf83e3c1..e5191fa38a 100644
--- a/activerecord/lib/active_record/relation/predicate_builder/array_handler.rb
+++ b/activerecord/lib/active_record/relation/predicate_builder/array_handler.rb
@@ -1,5 +1,7 @@
 # frozen_string_literal: true

+require "active_support/core_ext/array/extract"
+
 module ActiveRecord
   class PredicateBuilder
     class ArrayHandler # :nodoc:
@@ -11,8 +13,8 @@ def call(attribute, value)
         return attribute.in([]) if value.empty?

         values = value.map { |x| x.is_a?(Base) ? x.id : x }
-        nils, values = values.partition(&:nil?)
-        ranges, values = values.partition { |v| v.is_a?(Range) }
+        nils = values.extract!(&:nil?)
+        ranges = values.extract! { |v| v.is_a?(Range) }

         values_predicate =
           case values.length
diff --git a/railties/lib/rails/api/generator.rb b/railties/lib/rails/api/generator.rb
index 3405560b74..126d4d0438 100644
--- a/railties/lib/rails/api/generator.rb
+++ b/railties/lib/rails/api/generator.rb
@@ -1,6 +1,7 @@
 # frozen_string_literal: true

 require "sdoc"
+require "active_support/core_ext/array/extract"

 class RDoc::Generator::API < RDoc::Generator::SDoc # :nodoc:
   RDoc::RDoc.add_generator self
@@ -11,7 +12,7 @@ def generate_class_tree_level(classes, visited = {})
     # since they aren't nested under a definition of the `ActiveStorage` module.
     if visited.empty?
       classes = classes.reject { |klass| active_storage?(klass) }
-      core_exts, classes = classes.partition { |klass| core_extension?(klass) }
+      core_exts = classes.extract! { |klass| core_extension?(klass) }

       super.unshift([ "Core extensions", "", "", build_core_ext_subtree(core_exts, visited) ])
     else
```

Looks more readable if use [`Array#extract!`](https://api.rubyonrails.org/v6.0/classes/Array.html#method-i-extract-21), doesn't it?

I hope to see [`Array#extract!`](https://api.rubyonrails.org/v6.0/classes/Array.html#method-i-extract-21) and [`Hash#extract!`](https://api.rubyonrails.org/v5.2/classes/Hash.html#method-i-extract-21), which [was added to Active Support in 2009](https://github.com/rails/rails/commit/8dcf91ca113579646e95b0fd7a864dfb6512a53b), in [Ruby](https://github.com/ruby/ruby) itself, because both are very useful.

> I have tried to add Active Support's `Array#extract!` as `Array#extract` to Ruby, see [Feature #15831: "Add `Array#extract`, `Hash#extract`, and `ENV.extract`"](https://bugs.ruby-lang.org/issues/15831).
>
> I have tried to add Active Support's `Hash#extract!` as `Hash#slice!` to Ruby, see [Feature #15863: "Add `Hash#slice!` and `ENV.slice!`"](https://bugs.ruby-lang.org/issues/15863).

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">It&#39;s lovely when Active Support can serve as an experimental lab for future core features in Ruby ❤️👌 <a href="https://t.co/JCHAdxCaHI">https://t.co/JCHAdxCaHI</a></p>&mdash; DHH (@dhh) <a href="https://twitter.com/dhh/status/871034291786002433?ref_src=twsrc%5Etfw">June 3, 2017</a></blockquote>
