---
layout: post
lang: "en"
title: "... with __dir__ we can restore order in the Universe"
author: "bogdanvlviv"
image: "/images/posts/ruby/with-__dir__-we-can-restore-order-in-the-universe/dir.jpg"
date: 2017-08-02 08:00:00 +0300
categories: posts ruby
permalink: /:categories/:title.html
---

> "Defining paths relative to a file name has always hurt my soul, with \_\_dir\_\_ we can restore order in the Universe." - by [@fxn](https://twitter.com/fxn).

This post about the method in [Ruby Programming Language](https://www.ruby-lang.org) [`Kernel#__dir__`](https://docs.ruby-lang.org/en/2.4.0/Kernel.html#method-i-__dir__) and restoring order in the Universe.

Let's take a look at the method [`Kernel#__dir__`](https://docs.ruby-lang.org/en/2.4.0/Kernel.html#method-i-__dir__).
> **\_\_dir\_\_ => string**
>
> Returns the canonicalized absolute path of the directory of the file from which this method is called. It means symlinks in the path is resolved. If **\_\_FILE\_\_** is **nil**, it returns **nil**. The return value equals to **File.dirname(File.realpath(\_\_FILE\_\_))**.

This method was introduced in Ruby since version 2.0.0 ([NEWS for Ruby 2.0.0](https://docs.ruby-lang.org/en/2.0.0/NEWS.html)).

More info about development of [`Kernel#__dir__`](https://docs.ruby-lang.org/en/2.4.0/Kernel.html#method-i-__dir__) here: [Feature #1961](https://bugs.ruby-lang.org/issues/1961).

Since [Ruby 2.0.0](https://docs.ruby-lang.org/en/2.0.0) it is time to define relative paths with `__dir__` and refactor all definitions of relative paths with `__FILE__`.

Why is `__dir__` better than `__FILE__` for a definition of path?

Imagine there is folder `project/` that contains files: `Rakefile`, `application.rb`.
Inside the file `Rakefile` need to get the path to the file `application.rb`. We can do it by using `__FILE__`:

```ruby
File.expand_path('../application.rb', __FILE__)
```

There is the definition of path to the file `application.rb` by using `__dir__`:

```ruby
File.expand_path('application.rb', __dir__)
```

By using `__dir__` we get rid of redundant `../`. Looks better, isn't it?
The result of these definitions is the same, but if we need number `5`, we don't type `3+2` or `1+4`.

`__FILE__` is definitely better than `File.expand_path('Rakefile', __dir__)` when inside the file `Rakefile` need to get the path to the file `Rakefile`(the current file).

It is important not to do and get rid of needless things in a code!

Examples of refactoring with `__dir__`:

```diff
-APP_PATH = File.expand_path('../../config/application', __FILE__)
+APP_PATH = File.expand_path('../config/application', __dir__)
```

```diff
-$:.unshift File.expand_path("..", __FILE__)
+$:.unshift __dir__
```

```diff
 namespace :isolated do
   task adapter => "test:env:#{adapter}" do
-    dir = File.dirname(__FILE__)
-    Dir.glob("#{dir}/test/cases/**/*_test.rb").all? do |file|
-      sh(Gem.ruby, "-w", "-I#{dir}/lib", "-I#{dir}/test", file)
+    Dir.glob("#{__dir__}/test/cases/**/*_test.rb").all? do |file|
+     sh(Gem.ruby, "-w", "-I#{__dir__}/lib", "-I#{__dir__}/test", file)
     end || raise("Failures")
   end
 end
```

```diff
-Dir[File.dirname(__FILE__) + "/stubs/*.rb"].each { |file| require file }
+Dir[File.expand_path("stubs/*.rb", __dir__)].each { |file| require file }
```

```diff
-$:.unshift(File.dirname(__FILE__) + "/lib")
-$:.unshift(File.dirname(__FILE__) + "/fixtures/helpers")
-$:.unshift(File.dirname(__FILE__) + "/fixtures/alternate_helpers")
+$:.unshift File.expand_path("lib", __dir__)
+$:.unshift File.expand_path("fixtures/helpers", __dir__)
+$:.unshift File.expand_path("fixtures/alternate_helpers", __dir__)
```

```diff
 def self.base_root
-  File.dirname(__FILE__)
+  __dir__
 end
```

```diff
-source_root File.expand_path("../templates", __FILE__)
+source_root File.expand_path("templates", __dir__)
```

When I was investigating [Rails's sources](https://github.com/rails/rails), I found one [wonderful commit](https://github.com/rails/rails/commit/5b8738c2df003a96f0e490c43559747618d10f5f) related to the using of `__dir__` for definition of relative path.

```bash
rails$ git show 5b8738c2df003a96f0e490c43559747618d10f5f
```

```diff
commit 5b8738c2df003a96f0e490c43559747618d10f5f
Author: Xavier Noria <fxn@hashref.com>
Date:   Sat Mar 5 08:09:20 2016 +0100

    define APP_PATH with __dir__

    Defining paths relative to a file name has always hurt my soul,
    with __dir__ we can restore order in the Universe.

diff --git a/railties/lib/rails/generators/rails/app/templates/bin/rails b/railties/lib/rails/generators/rails/app/templates/bin/rails
index 80ec808..513a2e0 100644
--- a/railties/lib/rails/generators/rails/app/templates/bin/rails
+++ b/railties/lib/rails/generators/rails/app/templates/bin/rails
@@ -1,3 +1,3 @@
-APP_PATH = File.expand_path('../../config/application', __FILE__)
+APP_PATH = File.expand_path('../config/application', __dir__)
 require_relative '../config/boot'
 require 'rails/commands'
```

I got inspiration from [this commit](https://github.com/rails/rails/commit/5b8738c2df003a96f0e490c43559747618d10f5f) and decided to "restore order" in [Rails](https://github.com/rails/rails), [Jekyll](https://github.com/jekyll/jekyll), and own projects.

I made 2 patches and they are already merged:

- Rails: [Define path with \_\_dir\_\_](https://github.com/rails/rails/pull/29176)
- Jekyll: [Define path with \_\_dir\_\_](https://github.com/jekyll/jekyll/pull/6087)

Also, I got applause from [@fxn](https://twitter.com/fxn) for my [Pull Request](https://github.com/rails/rails/pull/29176) in Rails:

<iframe src="https://www.youtube.com/embed/P4hPUAY05nE?start=1553&end=1596" frameborder="0" allowfullscreen></iframe>

Hope you got inspiration from my little story that related to `__dir__` and you will find time for providing a patch with definitions of relative paths with `__dir__` to projects that you often use, it will help to "restore order in the Universe". I am sure that you will get applause too if you do it. ;)
