---
layout: post
lang: "en"
title: "Design Patterns in Ruby"
author: "bogdanvlviv"
image: "/images/posts/ruby/patterns/design-patterns-in-ruby/main.jpg"
date: 2016-12-18 01:17:00 +0200
categories: posts ruby patterns
permalink: /:categories/:title.html
---

This post is based on design patterns, that are described in the excellent book - ["Design Patterns in Ruby" (by Russ Olsen)](https://www.amazon.com/Design-Patterns-Ruby-Addison-Wesley-Professional/dp/0321490452).

> NOTE: [I asked about permission](https://twitter.com/bogdanvlviv/status/807289812805963776) to use content from ["Design Patterns in Ruby" (by Russ Olsen)](https://www.amazon.com/Design-Patterns-Ruby-Addison-Wesley-Professional/dp/0321490452) in this post.

> NOTE:  Not all of the patterns are covered in the book ["Design Patterns in Ruby" (by Russ Olsen)](https://www.amazon.com/Design-Patterns-Ruby-Addison-Wesley-Professional/dp/0321490452). There really was a number of reasons. Read the post ["The Lost Patterns"](http://designpatternsinruby.com/blog/2015/01/13/lost/) for more information.

Read ["Object-Oriented Design Patterns in Life"](https://www.sihui.io/design-patterns).

## Patterns

- Creational
  - [Abstract Factory](#abstract-factory)
  - [Builder](#builder)
  - [Factory Method](#factory-method)
  - [Prototype](#prototype)
  - [Singleton](#singleton)
- Structural
  - [Adapter](#adapter)
  - [Bridge](#bridge)
  - [Composite](#composite)
  - [Decorator](#decorator)
  - [Facade](#facade)
  - [Flyweight](#flyweight)
  - [Proxy](#proxy)
- Behavioral
  - [Chain of responsibility](#chain-of-responsibility)
  - [Command](#command)
  - [Interpreter](#interpreter)
  - [Iterator](#iterator)
  - [Mediator](#mediator)
  - [Memento](#memento)
  - [Observer](#observer)
  - [State](#state)
  - [Strategy](#strategy)
  - [Template Method](#template-method)
  - [Visitor](#visitor)

### Abstract Factory

Creates an instance of several families of classes. Provide an interface for creating families of related or dependent objects without specifying their concrete classes.

<div class="picture">
  <img src="{{ "/images/posts/ruby/patterns/design-patterns-in-ruby/abstract-factory_pattern.png" | absolute_url }}" title="Abstract Factory pattern" loading="lazy">
</div>

Example:

```ruby
class Animal
  attr_accessor :name

  def initialize(name)
    @name = name
  end

  def eat
  end

  def speak
  end

  def sleep
  end
end
```

```ruby
class Tiger < Animal
  def eat
    puts "Tiger #{name} is eating anything it wants."
  end

  def speak
    puts "Tiger #{name} Roars!"
  end

  def sleep
    puts "Tiger #{name} sleeps anywhere it wants."
  end
end
```

```ruby
class Plant
  attr_accessor :name

  def initialize(name)
    @name = name
  end

  def grow
  end
end
```

```ruby
class Tree < Plant
  def grow
    puts "The tree #{name} grows tall."
  end
end
```

```ruby
class Habitat
  def initialize(organism_factory, number_animals: 0, number_plants: 0)
    @organism_factory = organism_factory

    @animals = []
    number_animals.times do |i|
      animal = @organism_factory.new_animal("Animal#{i}")
      @animals << animal
    end

    @plants = []
    number_plants.times do |i|
      plant  = @organism_factory.new_plant("Plant#{i}")
      @plants << plant
    end
  end

  def simulate_one_day
    @plants.each { |plant| plant.grow }
    @animals.each { |animal| animal.speak }
    @animals.each { |animal| animal.eat }
    @animals.each { |animal| animal.sleep }
  end
end
```

```ruby
class JungleOrganismFactory
  def new_animal(name)
    Tiger.new(name)
  end

  def new_plant(name)
    Tree.new(name)
  end
end
```

```ruby
class PondOrganismFactory
  def new_animal(name)
    Frog.new(name)
  end

  def new_plant(name)
    Algae.new(name)
  end
end
```

```ruby
jungle = Habitat.new(JungleOrganismFactory.new, number_animals: 1, number_plants: 4)
jungle.simulate_one_day

pond = Habitat.new(PondOrganismFactory.new, number_animals: 2, number_plants: 4)
pond.simulate_one_day
```

Read ["Design Patterns in Ruby: Abstract Factory"](https://medium.com/@dljerome/design-patterns-in-ruby-abstract-factory-82b74682e04e).

### Builder

Separates object construction from its representation. Separate the construction of a complex object from its representation so that the same construction processes can create different representations.

<div class="picture">
  <img src="{{ "/images/posts/ruby/patterns/design-patterns-in-ruby/builder_pattern.png" | absolute_url }}" title="Builder pattern" loading="lazy">
</div>

Example:

```ruby
class CPU
end

class BasicCPU < CPU
end

class TurboCPU < CPU
end
```

```ruby
class Motherboard
  attr_accessor :cpu
  attr_accessor :memory_size

  def initialize(cpu=BasicCPU.new, memory_size=1024)
    @cpu = cpu
    @memory_size = memory_size
  end
end
```

```ruby
class Drive
  attr_reader :type # either :cd, :dvd or :hard_disk
  attr_reader :size # in Mb
  attr_reader :writable # true if this drive is writable

  def initialize(type, size, writable)
    @type = type
    @size = size
    @writable = writable
  end
end
```

```ruby
class Computer
  attr_accessor :display
  attr_accessor :motherboard
  attr_reader   :drives

  def initialize(display=:crt, motherboard=Motherboard.new, drives=[])
    @motherboard = motherboard
    @drives = drives
    @display = display
  end
end
```

```ruby
class ComputerBuilder
  attr_reader :computer

  def initialize
    @computer = Computer.new
  end

  def basic_cpu
    computer.motherboard.cpu = BasicCPU.new
  end

  def turbo_cpu
    computer.motherboard.cpu = TurboCPU.new
  end

  def display=(display)
    computer.display = display
  end

  def memory_size=(size_in_mb)
    computer.motherboard.memory_size = size_in_mb
  end

  def add_cd(writer=false)
    computer.drives << Drive.new(:cd, 760, writer)
  end

  def add_dvd(writer=false)
    computer.drives << Drive.new(:dvd, 4000, writer)
  end

  def add_hard_disk(size_in_mb)
    computer.drives << Drive.new(:hard_disk, size_in_mb, true)
  end
end
```

```ruby
builder = ComputerBuilder.new
builder.turbo_cpu
builder.add_hard_disk(1_000_000)
builder.memory_size = 16000
builder.add_cd(true)
builder.add_dvd
computer = builder.computer
```

Read ["Design Patterns in Ruby: Builder"](https://medium.com/@dljerome/design-patterns-in-ruby-builder-6c6d172e8de8).

Read ["Builder design pattern in Ruby"](https://medium.com/kkempin/builder-design-pattern-in-ruby-dfa2d557ff1b).

### Factory Method

Creates an instance of several derived classes. Define an interface for creating an object, but let subclasses decide which class to instantiate. Factory Method lets a class defer instantiation to subclasses.

<div class="picture">
  <img src="{{ "/images/posts/ruby/patterns/design-patterns-in-ruby/factory-method_pattern.png" | absolute_url }}" title="Factory Method pattern" loading="lazy">
</div>

Example:

```ruby
class Animal
  attr_accessor :name

  def initialize(name)
    @name = name
  end

  def eat
  end

  def speak
  end

  def sleep
  end
end
```

```ruby
class Duck < Animal
  def eat
    puts "Duck #{name} is eating."
  end

  def speak
    puts "Duck #{name} says Quack!"
  end

  def sleep
    puts "Duck #{name} sleeps quietly."
  end
end
```

```ruby

class Frog < Animal
  def eat
    puts "Frog #{name} is eating."
  end

  def speak
    puts "Frog #{name} says Crooooaaaak!"
  end

  def sleep
    puts "Frog #{name} doesn't sleep, he croaks all night!"
  end
end
```

```ruby
class Plant
  attr_accessor :name

  def initialize(name)
    @name = name
  end

  def grow
  end
end
```

```ruby
class Algae < Plant
  def grow
    puts "The Algae #{name} soaks up the sun and grows."
  end
end
```

```ruby
class WaterLily < Plant
  def grow
    puts "The water lily #{name} floats, soaks up the sun and grows."
  end
end
```

```ruby
class Pond
  def initialize(number_animals: 0, number_plants: 0)
    @animals = []
    number_animals.times do |i|
      animal = new_organism(:animal, "Animal#{i}")
      @animals << animal
    end

    @plants = []
    number_plants.times do |i|
      plant = new_organism(:plant, "Plant#{i}")
      @plants << plant
    end
  end

  def simulate_one_day
    @plants.each { |plant| plant.grow }
    @animals.each { |animal| animal.speak }
    @animals.each { |animal| animal.eat }
    @animals.each { |animal| animal.sleep }
  end
end
```

```ruby
class DuckWaterLilyPond < Pond
  def new_organism(type, name)
    if type == :animal
      Duck.new(name)
    elsif type == :plant
      WaterLily.new(name)
    else
      raise "Unknown organism type: #{type}"
    end
  end
end
```

```ruby
class FrogAlgaePond < Pond
  def new_organism(type, name)
    if type == :animal
      Frog.new(name)
    elsif type == :plant
      Algae.new(name)
    else
      raise "Unknown organism type: #{type}"
    end
  end
end
```

```ruby
DuckWaterLilyPond.new(number_animals: 4, number_plants: 2)
FrogAlgaePond.new(number_animals: 3, number_plants: 7)
```

Read ["Design Patterns in Ruby: Factory Method"](https://medium.com/@dljerome/design-patterns-in-ruby-factory-method-e4e4cd995254).

### Prototype

A fully initialized instance to be copied or cloned. Specify the kinds of objects to create using a prototypical instance and create new objects by copying this prototype.

Read ["Design Patterns in Ruby: Prototype"](https://medium.com/@dljerome/design-patterns-in-ruby-prototype-342cb26ea75).

### Singleton

A class of which only a single instance can exist. Ensure a class only has one instance and provide a global point of access to it.

You can use [`Singleton`](https://docs.ruby-lang.org/en/2.3.0/Singleton.html) module for building Singleton pattern in Ruby.

Read ["Design Patterns in Ruby: Singleton"](https://medium.com/@dljerome/design-patterns-in-ruby-singleton-8c132da6a9ce).

### Adapter

Match interfaces of different classes. Convert the interface of a class into another interface clients expect. Adapter lets classes work together that couldn’t otherwise because of incompatible interfaces.

<div class="picture">
  <img src="{{ "/images/posts/ruby/patterns/design-patterns-in-ruby/adapter_pattern.png" | absolute_url }}" title="Adapter pattern" loading="lazy">
</div>

Example:

```ruby
class Encrypter
  def initialize(key)
    @key = key
  end

  def encrypt(reader, writer)
    key_index = 0
    while not reader.eof?
      clear_char = reader.getc
      encrypted_char = clear_char.ord ^ @key[key_index].ord
      writer.putc(encrypted_char.chr)
      key_index = (key_index + 1) % @key.size
    end
  end
end
```

```ruby
class StringIOAdapter
  def initialize(string)
    @string = string
    @position = 0
  end

  def getc
    if @position >= @string.length
      raise EOFError
    end
    ch = @string[@position]
    @position += 1
    return ch
  end

  def eof?
    return @position >= @string.length
  end
end
```

```ruby
encrypter = Encrypter.new('SECRET_KEY')

reader = File.open('message.txt')
writer = File.open('message.encrypted','w')
encrypter.encrypt(reader, writer)

reader = StringIOAdapter.new('We attack at dawn')
writer = File.open('out.txt', 'w')
encrypter.encrypt(reader, writer)
```

Read ["Design Patterns in Ruby: Adapter"](https://medium.com/@dljerome/design-patterns-in-ruby-adapter-89a482c26d8c).

### Bridge

Separates an object’s interface from its implementation. Decouple an abstraction from its implementation so that the two can vary independently.

Read ["Design Patterns in Ruby: Bridge"](https://medium.com/@dljerome/design-patterns-in-ruby-bridge-7aebb1b7bbc6).

### Composite

A tree structure of simple and composite objects. Compose objects into tree structures to represent part-whole hierarchies. Composite lets clients treat individual objects and compositions of objects uniformly.

<div class="picture">
  <img src="{{ "/images/posts/ruby/patterns/design-patterns-in-ruby/composite_pattern.png" | absolute_url }}" title="Composite pattern" loading="lazy">
</div>

Example:

```ruby
class Task
  attr_accessor :name, :parent

  def initialize(name)
    @name = name
    @parent = nil
  end

  def get_time_required
    0.0
  end
end
```

```ruby
class CompositeTask < Task
  def initialize(name)
    super(name)
    @sub_tasks = []
  end

  def add_sub_task(task)
    @sub_tasks << task
    task.parent = self
  end

  def remove_sub_task(task)
    @sub_tasks.delete(task)
    task.parent = nil
  end

  def get_time_required
    time = 0.0
    @sub_tasks.each { |task| time += task.get_time_required }
    time
  end
end
```

```ruby
class AddDryIngredientsTask < Task
  def initialize
    super('Add dry ingredients')
  end

  def get_time_required
    1.0
  end
end

class MixTask < Task
  def initialize
    super('Mix that batter up')
  end

  def get_time_required
    3.0
  end
end

class AddLiquidsTask < Task
  def initialize
    super('Add Liquids')
  end

  def get_time_required
    4.0
  end
end

class MakeBatterTask < CompositeTask
  def initialize
    super('Make batter')
    add_sub_task(AddDryIngredientsTask.new)
    add_sub_task(AddLiquidsTask.new)
    add_sub_task(MixTask.new)
  end
end

class FillPanTask < Task
  def initialize
    super('Fill pan')
  end

  def get_time_required
    2.0
  end
end

class FrostTask < Task
  def initialize
    super('Frost')
  end

  def get_time_required
    2.0
  end
end

class BakeTask < Task
  def initialize
    super('Bake')
  end

  def get_time_required
    2.0
  end
end

class LickSpoonTask < Task
  def initialize
    super('Bake')
  end

  def get_time_required
    100.0
  end
end

class MakeCakeTask < CompositeTask
  def initialize
    super('Make cake')
    add_sub_task(MakeBatterTask.new)
    add_sub_task(FillPanTask.new)
    add_sub_task(BakeTask.new)
    add_sub_task(FrostTask.new)
    add_sub_task(LickSpoonTask.new)
  end
end
```
Read ["Design Patterns in Ruby: Composite"](https://medium.com/@dljerome/design-patterns-in-ruby-composite-e815a25467b5).

### Decorator

Add responsibilities to objects dynamically. Attach additional responsibilities to an object dynamically. Decorators provide a flexible alternative to subclassing for extending functionality.

<div class="picture">
  <img src="{{ "/images/posts/ruby/patterns/design-patterns-in-ruby/decorator_pattern.png" | absolute_url }}" title="Decorator pattern" loading="lazy">
</div>

You can use [`SimpleDelegator`](https://docs.ruby-lang.org/en/2.3.0/SimpleDelegator.html) class for building Decorator pattern in Ruby.
Read my post ["Decorator Pattern in Ruby"]({{ "/posts/ruby/patterns/decorator-pattern-in-ruby.html" | absolute_url }}) for more information.

Read ["Design Patterns in Ruby: Decorator"](https://medium.com/@dljerome/design-patterns-in-ruby-decorator-b7f2da4153b0).

### Facade

A single class that represents an entire subsystem. Provide a unified interface to a set of interfaces in a system. Facade defines a higher-level interface that makes the subsystem easier to use.

Read ["Design Patterns in Ruby: Facade"](https://medium.com/@dljerome/design-patterns-in-ruby-facade-a88e6b3949bb).

Read ["Facade design pattern in Ruby on Rails"](https://medium.com/kkempin/facade-design-pattern-in-ruby-on-rails-710aa88326f).

### Flyweight

A fine-grained instance used for efficient sharing. Use sharing to support large numbers of fine-grained objects efficiently. A flyweight is a shared object that can be used in multiple contexts simultaneously. The flyweight acts as an independent object in each context — it’s indistinguishable from an instance of the object that’s not shared.

Read ["Design Patterns in Ruby: Flyweight"](https://medium.com/@dljerome/design-patterns-in-ruby-flyweight-64b4d57a6f89).

### Proxy

An object representing another object. Provide a surrogate or placeholder for another object to control access to it.

<div class="picture">
  <img src="{{ "/images/posts/ruby/patterns/design-patterns-in-ruby/proxy_pattern.png" | absolute_url }}" title="Proxy pattern" loading="lazy">
</div>

Example:

```ruby
class Account
  attr_reader :balance

  def initialize(starting_balance=0)
    @balance = starting_balance
  end

  def deposit(amount)
    @balance += amount
  end

  def withdraw(amount)
    @balance -= amount
  end
end
```

```ruby
require 'etc'

class AccountProtectionProxy
  def initialize(real_account, owner_name)
    @subject = real_account
    @owner_name = owner_name
  end

  def deposit(amount)
    check_access
    return @subject.deposit(amount)
  end

  def withdraw(amount)
    check_access
    return @subject.withdraw(amount)
  end

  def balance
    check_access
    return @subject.balance
  end

  def check_access
    if Etc.getlogin != @owner_name
      raise "Illegal access: #{Etc.getlogin} cannot access account."
    end
  end
end
```

```ruby
account = Account.new(100)
account.deposit(50)
account.withdraw(10)

proxy = AccountProtectionProxy.new(account, 'russolsen')
proxy.deposit(50)
proxy.withdraw(10)
```

Read ["Design Patterns in Ruby: Proxy"](https://medium.com/@dljerome/design-patterns-in-ruby-proxy-48a379a3b8d3).

### Chain of responsibility

A way of passing a request between a chain of objects. Avoid coupling the sender of a request to its receiver by giving more than one object a chance to handle the request. Chain the receiving objects and pass the request along the chain until an object handles it.

Read ["Design Patterns in Ruby: Chain of Responsibility"](https://medium.com/@dljerome/design-patterns-in-ruby-chain-of-responsibility-2868e40fe8c9).

Read ["Chain of responsibility design pattern in Ruby"](https://medium.com/kkempin/chain-of-responsibility-design-pattern-in-ruby-e0b756d4bb3b).

### Command

Encapsulate a command request as an object. Encapsulate a request as an object, thereby letting you parameterize clients with different requests, queue or log requests, and support undoable operations.

<div class="picture">
  <img src="{{ "/images/posts/ruby/patterns/design-patterns-in-ruby/command_pattern.png" | absolute_url }}" title="Command pattern" loading="lazy">
</div>

Example:

```ruby
class Command
  attr_reader :description

  def initialize(description)
    @description = description
  end

  def execute
  end
end
```

```ruby
class CreateFile < Command
  def initialize(path, contents)
    super("Create file: #{path}")
    @path = path
    @contents = contents
  end

  def execute
    f = File.open(@path, "w")
    f.write(@contents)
    f.close
  end
end
```

```ruby
class DeleteFile < Command
  def initialize(path)
    super("Delete file: #{path}")
    @path = path
  end

  def execute
    File.delete(@path)
  end
end
```

```ruby
require 'fileutils'

class CopyFile < Command
  def initialize(source, target)
    super("Copy file: #{source} to #{target}")
    @source = source
    @target = target
  end

  def execute
    FileUtils.copy(@source, @target)
  end
end
```

Read ["Design Patterns in Ruby: Command"](https://medium.com/@dljerome/design-patterns-in-ruby-command-802b785d1bbd).

### Interpreter

A way to include language elements in a program. Given a language, define a representation for its grammar along with an interpreter that uses the representation to interpret sentences in the language.

<div class="picture">
  <img src="{{ "/images/posts/ruby/patterns/design-patterns-in-ruby/interpreter_pattern.png" | absolute_url }}" title="Interpreter pattern" loading="lazy">
</div>

Example:

```ruby
class Expression
  def |(other)
    Or.new(self, other)
  end

  def &(other)
    And.new(self, other)
  end
end
```

```ruby
require 'find'

class All < Expression
  def evaluate(dir)
    results = []
    Find.find(dir) do |p|
      next unless File.file?(p)
      results << p
    end
    results
  end
end
```

```ruby
require 'find'

class FileName < Expression
  def initialize(pattern)
    @pattern = pattern
  end

  def evaluate(dir)
    results = []
    Find.find(dir) do |p|
      next unless File.file?(p)
      name = File.basename(p)
      results << p if File.fnmatch(@pattern, name)
    end
    results
  end
end
```

```ruby
class Not < Expression
  def initialize(expression)
    @expression = expression
  end

  def evaluate(dir)
    All.new.evaluate(dir) - @expression.evaluate(dir)
  end
end
```

```ruby
require 'find'

class Bigger < Expression
  def initialize(size)
    @size = size
  end

  def evaluate(dir)
    results = []
    Find.find(dir) do |p|
      next unless File.file?(p)
      results << p if(File.size(p) > @size)
    end
    results
  end
end
```

```ruby
require 'find'

class Writable < Expression
  def evaluate(dir)
    results = []
    Find.find(dir) do |p|
      next unless File.file?(p)
      results << p if(File.writable?(p))
    end
    results
  end
end
```

```ruby
class Or < Expression
  def initialize(expression1, expression2)
    @expression1 = expression1
    @expression2 = expression2
  end

  def evaluate(dir)
    result1 = @expression1.evaluate(dir)
    result2 = @expression2.evaluate(dir)
    (result1 + result2).sort.uniq
  end
end
```

```ruby
class And < Expression
  def initialize(expression1, expression2)
    @expression1 = expression1
    @expression2 = expression2
  end

  def evaluate(dir)
    result1 = @expression1.evaluate(dir)
    result2 = @expression2.evaluate(dir)
    (result1 & result2)
  end
end
```

```ruby
module ExpressionSugar
  def all
    All.new
  end

  def bigger(size)
    Bigger.new(size)
  end

  def file_name(pattern)
    FileName.new(pattern)
  end

  def except(expression)
    Not.new(expression)
  end

  def writable
    Writable.new
  end
end
```

```ruby
expression1 = Or.new(
  And.new(Bigger.new(2000), Not.new(Writable.new)),
  FileName.new('*.mp3')
)

expression1.evaluate('.')

include ExpressionSugar

expression2 = (bigger(2000) & except(writable)) | file_name('*.mp3')

expression2.evaluate('.')
```

Read ["Design Patterns in Ruby: Interpreter"](https://medium.com/@dljerome/design-patterns-in-ruby-interpreter-4b5375062897).

### Iterator

Sequentially access the elements of a collection. Provide a way to access the elements of an aggregate object sequentially without exposing its underlying representation.

In Ruby the [`Enumerable`](https://docs.ruby-lang.org/en/2.3.0/Enumerable.html) mixin provides collection classes with several traversal and searching methods, and with the ability to sort. The class must provide a method `each`, which yields successive members of the collection. If `Enumerable#max`, `#min`, or `#sort` is used, the objects in the collection must also implement a meaningful `<=>` operator, as these methods rely on an ordering between members of the collection.

Example:

```ruby
class Account
  attr_accessor :name, :balance

  def initialize(name, balance)
    @name = name
    @balance = balance
  end

  def <=>(other)
    balance <=> other.balance
  end
end
```

```ruby
class Portfolio
  include Enumerable

  def initialize
    @accounts = []
  end

  def each(&block)
    @accounts.each(&block)
  end

  def add_account(account)
    @accounts << account
  end
end
```

```ruby
my_portfolio =  Portfolio.new
my_portfolio.add_account(Account.new('Bonds', 200))
my_portfolio.add_account(Account.new('Stocks', 100))
my_portfolio.add_account(Account.new('Real Estate', 1000))

my_portfolio.any? { |account| account.balance > 2000 }
my_portfolio.all? { |account| account.balance >= 10 }
my_portfolio.each { |account| puts "#{account.name}: #{account.balance}" }
my_portfolio.map { |account| account.balance }
my_portfolio.max
my_portfolio.min
```

Read ["Design Patterns in Ruby: Iterator"](https://medium.com/@dljerome/design-patterns-in-ruby-iterator-beead2c6492).

### Mediator

Defines simplified communication between classes. Define an object that encapsulates how a set of objects interact. Mediator promotes loose coupling by keeping objects from referring to each other explicitly and it lets you vary their interaction independently.

Read ["Design Patterns in Ruby: Mediator"](https://medium.com/@dljerome/design-patterns-in-ruby-mediator-169e77710e37).

### Memento

Capture and restore an object's internal state. Without violating encapsulation, capture and externalize an object’s internal state so that the object can be restored to this state later.

Read ["Design Patterns in Ruby: Memento"](https://medium.com/@dljerome/design-patterns-in-ruby-memento-1287f926fd0a).

### Observer

A way of notifying change to a number of classes. Define a one-to-many dependency between objects so that when one object changes state, all its dependents are notified and updated automatically.

<div class="picture">
  <img src="{{ "/images/posts/ruby/patterns/design-patterns-in-ruby/observer_pattern.png" | absolute_url }}" title="Observer pattern" loading="lazy">
</div>

Example:

```ruby
module Subject
  def initialize
    @observers = []
  end

  def add_observer(observer)
    @observers << observer
  end

  def delete_observer(observer)
    @observers.delete(observer)
  end

  def notify_observers
    @observers.each do |observer|
      observer.update(self)
    end
  end
end
```

```ruby
class Employee
  include Subject

  attr_reader :name, :address
  attr_reader :salary

  def initialize(name, title, salary)
   super()
   @name = name
   @title = title
   @salary = salary
  end

  def salary=(new_salary)
    @salary = new_salary
    notify_observers
  end
end
```

```ruby
class Payroll
  def update(changed_employee)
    puts "Cut a new check for #{changed_employee.name}!"
    puts "His salary is now #{changed_employee.salary}!"
  end
end

class TaxMan
  def update(changed_employee)
    puts "Send #{changed_employee.name} a new tax bill!"
  end
end

fred = Employee.new('Fred', 'Crane Operator', 30000.0)

payroll = Payroll.new
tax_man = TaxMan.new

fred.add_observer(payroll)
fred.add_observer(tax_man)

fred.salary = 90000.0
```

The Ruby standard library comes with a fine, prebuilt [`Observable`](https://docs.ruby-lang.org/en/2.3.0/Observable.html) module that provides all of the support you need to make your object, well, observable.
You can use [`Observable`](https://docs.ruby-lang.org/en/2.3.0/Observable.html) module for building Observer pattern in Ruby.

Read ["Design Patterns in Ruby: Observer"](https://medium.com/@dljerome/design-patterns-in-ruby-observer-a6e8fe2e5c0a).

### State

Alter an object's behavior when its state changes. Allow an object to alter its behavior when its internal state changes. The object will appear to change its class.

### Strategy

Encapsulates an algorithm inside a class. Define a family of algorithms, encapsulate each one, and make them interchangeable. Strategy lets the algorithm vary independently from clients that use it.

<div class="picture">
  <img src="{{ "/images/posts/ruby/patterns/design-patterns-in-ruby/strategy_pattern.png" | absolute_url }}" title="Strategy pattern" loading="lazy">
</div>

Example:

```ruby
class Formatter
  def output_report(context)
    raise 'Abstract method called'
  end
end
```

```ruby
class HTMLFormatter < Formatter
  def output_report(context)
    puts('<html>')
    puts('  <head>')
    puts("    <title>#{context.title}</title>")
    puts('  </head>')
    puts('  <body>')
    context.text.each do |line|
      puts("    <p>#{line}</p>")
    end
    puts('  </body>')
    puts('</html>')
  end
end
```

```ruby
class PlainTextFormatter < Formatter
  def output_report(context)
    puts("***** #{context.title} *****")
    context.text.each do |line|
      puts(line)
    end
  end
end
```

```ruby
class Report
  attr_reader :title, :text

  attr_accessor :formatter

  def initialize(formatter)
    @title = 'Monthly Report'
    @text =  ['Things are going', 'really, really well.']
    @formatter = formatter
  end

  def output_report
    @formatter.output_report(self)
  end
end
```

```ruby
report = Report.new(HTMLFormatter.new)
report.output_report

report = Report.new(PlainTextFormatter.new)
report.output_report
```

Read ["Design Patterns in Ruby: Strategy"](https://medium.com/@dljerome/design-patterns-in-ruby-strategy-1189135d2ce7).

### Template Method

Defer the exact steps of an algorithm to a subclass. Define the skeleton of an algorithm in an operation, deferring some steps to subclasses. Template Method lets subclasses redefine certain steps of an algorithm without changing the algorithm’s structure.

<div class="picture">
  <img src="{{ "/images/posts/ruby/patterns/design-patterns-in-ruby/template_method_pattern.png" | absolute_url }}" title="Template Method pattern" loading="lazy">
</div>

Example:

```ruby
class Report
  def initialize
    @title = 'Monthly Report'
    @text =  ['Things are going', 'really, really well.']
  end

  def output_report
    output_start
    output_head
    output_body_start
    output_body
    output_body_end
    output_end
  end

  def output_body
    @text.each do |line|
      output_line(line)
    end
  end

  def output_start
    raise 'Called abstract method: output_start'
  end

  def output_head
    raise 'Called abstract method: output_head'
  end

  def output_body_start
    raise 'Called abstract method: output_body_start'
  end

  def output_line(line)
    raise 'Called abstract method: output_line'
  end

  def output_body_end
    raise 'Called abstract method: output_body_end'
  end

  def output_end
    raise 'Called abstract method: output_end'
  end
end
```

```ruby
class HTMLReport < Report
  def output_start
    puts('<html>')
  end

  def output_head
    puts('  <head>')
    puts("    <title>#{@title}</title>")
    puts('  </head>')
  end

  def output_body_start
    puts('<body>')
  end

  def output_line(line)
    puts("  <p>#{line}</p>")
  end

  def output_body_end
    puts('</body>')
  end

  def output_end
    puts('</html>')
  end
end
```

```ruby
class PlainTextReport < Report
  def output_start
  end

  def output_head
    puts("**** #{@title} ****")
    puts
  end

  def output_body_start
  end

  def output_line(line)
    puts line
  end

  def output_body_end
  end

  def output_end
  end
end
```

```ruby
report = HTMLReport.new
report.output_report

report = PlainTextReport.new
report.output_report
```

Read ["Design Patterns in Ruby: Template Method"](https://medium.com/@dljerome/design-patterns-in-ruby-template-method-753443f5a1c8).

### Visitor

Defines a new operation to a class without change. Represent an operation to be performed on the elements of an object structure. Visitor lets you define a new operation without changing the classes of the elements on which it operates.

Read ["Visitor design pattern in Ruby"](https://medium.com/kkempin/visitor-design-pattern-in-ruby-bc07395c4abc).

## Acknowledgment
<div class="picture">
  <img src="{{ "/images/posts/ruby/patterns/design-patterns-in-ruby/main.jpg"  | absolute_url }}" title='"Design Patterns in Ruby" (by Russ Olsen)' loading="lazy">
</div>

Thanks for the book [@russolsen](https://twitter.com/russolsen)!
