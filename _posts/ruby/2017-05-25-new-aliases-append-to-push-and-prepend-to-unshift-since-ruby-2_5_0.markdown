---
layout: post
lang: "en"
title: 'New aliases "append" to Array#push, and "prepend" to Array#unshift (since Ruby 2.5.0)'
author: "bogdanvlviv"
date: 2017-05-25 08:30:00 +0300
categories: posts ruby
permalink: /:categories/:title.html
---

Ruby introduces new methods aliases [`Array#append`](https://docs.ruby-lang.org/en/trunk/Array.html#method-i-append) to [`Array#push`](https://docs.ruby-lang.org/en/trunk/Array.html#method-i-push) and [`Array#prepend`](https://docs.ruby-lang.org/en/trunk/Array.html#method-i-prepend) to [`Array#unshift`](https://docs.ruby-lang.org/en/trunk/Array.html#method-i-unshift) since the version 2.5.0.

[Feature [#12746](https://bugs.ruby-lang.org/issues/12746)]

[Commit [f57d515d69b7a35477b9ba5d08fe117df1f1e275](https://github.com/ruby/ruby/commit/f57d515d69b7a35477b9ba5d08fe117df1f1e275)]

Let's refresh our knowledge about the methods [`Array#push`](https://docs.ruby-lang.org/en/trunk/Array.html#method-i-push) and [`Array#unshift`](https://docs.ruby-lang.org/en/trunk/Array.html#method-i-unshift) and keep in mind about the aliases!

> **push(obj, ... )** => **ary**
>
> Append — Pushes the given object(s) on to the end of this array. This expression returns the array itself, so several appends may be chained together. See also [#pop](https://docs.ruby-lang.org/en/trunk/Array.html#method-i-pop) for the opposite effect.

```ruby
a = [ "a", "b", "c" ]
a.push("d", "e", "f")
        #=> ["a", "b", "c", "d", "e", "f"]
[1, 2, 3].push(4).push(5)
        #=> [1, 2, 3, 4, 5]
```

> **unshift(obj, ...)** => **ary**
>
> Prepends objects to the front of self, moving other elements upwards. See also [#shift](https://docs.ruby-lang.org/en/trunk/Array.html#method-i-shift) for the opposite effect.

```ruby
a = [ "b", "c", "d" ]
a.unshift("a")   #=> ["a", "b", "c", "d"]
a.unshift(1, 2)  #=> [ 1, 2, "a", "b", "c", "d"]
```

[Active Support](https://github.com/rails/rails/tree/3-2-stable/activesupport) Core Extensions provide aliases [`Array#append`](https://docs.ruby-lang.org/en/trunk/Array.html#method-i-append) and [`Array#prepend`](https://docs.ruby-lang.org/en/trunk/Array.html#method-i-prepend) since [Rails 3.2.0 (January 20, 2012)](https://github.com/rails/rails/blob/3-2-stable/activesupport/CHANGELOG.md#rails-320-january-20-2012).
Since Ruby 2.5.0 [Active Support Core Extensions](https://github.com/rails/rails/tree/master/activesupport/lib/active_support/core_ext/array) prevent creating aliases `Array#append` and `Array#prepend` in favor of the implementation of them in Ruby [Pull Request [#28638](https://github.com/rails/rails/pull/28638)].

[Active Support](https://github.com/rails/rails/tree/master/activesupport) helps to bring new ideas/futures in the Ruby, it is one of the main reason to respect it.
