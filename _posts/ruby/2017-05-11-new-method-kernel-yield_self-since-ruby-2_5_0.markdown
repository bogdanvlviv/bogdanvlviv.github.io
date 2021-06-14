---
layout: post
lang: "en"
title: "New method Kernel#yield_self (since Ruby 2.5.0)"
author: "bogdanvlviv"
date: 2017-05-11 21:44:00 +0300
categories: posts ruby
permalink: /:categories/:title.html
---

Ruby introduces new method [`Kernel#yield_self`](https://docs.ruby-lang.org/en/trunk/Object.html#method-i-yield_self) [Feature [#6721](https://bugs.ruby-lang.org/issues/6721)] since the version 2.5.0.

[`Kernel#yield_self`](https://docs.ruby-lang.org/en/trunk/Object.html#method-i-yield_self) works similarly to the method [`Object#tap`](https://docs.ruby-lang.org/en/2.4.0/Object.html#method-i-tap), but they return different values.

[`Object#tap`](https://docs.ruby-lang.org/en/2.4.0/Object.html#method-i-tap) yields self to the block and then returns self. The primary purpose of this method is to “tap into” a method chain, in order to perform operations on intermediate results within the chain.

Example:

```ruby
(1..10)                   .tap { |x| puts "original: #{x}" }
  .to_a                   .tap { |x| puts "array:    #{x}" }
  .select { |x| x.even? } .tap { |x| puts "evens:    #{x}" }
  .map { |x| x*x }        .tap { |x| puts "squares:  #{x}" }
# => original: 1..10
# => array:    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
# => evens:    [2, 4, 6, 8, 10]
# => squares:  [4, 16, 36, 64, 100]
```

[`Kernel#yield_self`](https://docs.ruby-lang.org/en/trunk/Object.html#method-i-yield_self) yields self to the block and then returns the result of the block execution.

Example:

```ruby
User = Struct.new(:name, :sex) do
  def male?
    sex == "male"
  end
end

user = User.new("Bogdan", "male")

user.yield_self { |u| u.male? ? "Mr. #{u.name}" : "Ms. #{u.name}" } # => "Mr. Bogdan"
user.yield_self { |u| "Hi, #{u.name.upcase!}" } # => "Hi, BOGDAN"
user.name # => "BOGDAN"
```

> Read ["Using `yield_self` for composable ActiveRecord relations"](https://robots.thoughtbot.com/using-yieldself-for-composable-activerecord-relations).
