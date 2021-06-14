---
layout: post
lang: "en"
title: "How to install the latest tmux on Ubuntu 16.04"
author: "bogdanvlviv"
image: "/images/posts/tmux/how-to-install-the-latest-tmux-on-ubuntu-16_04/tmux.png"
date: 2017-11-02 19:50:00 +0200
categories: posts tmux
permalink: /:categories/:title.html
---

<div class="picture">
  <img src="{{ "/images/posts/tmux/how-to-install-the-latest-tmux-on-ubuntu-16_04/tmux.png" | absolute_url }}" title="tmux" loading="lazy">
</div>

## What is tmux?

tmux is a "terminal multiplexer", it enables a number of terminals (or windows) to be accessed and controlled from a single terminal. tmux is intended to be a simple, modern, BSD-licensed alternative to programs such as GNU screen. [Read more](https://github.com/tmux/tmux/blob/master/README).

## Install the download, build and tmux dependencies

We can download package information from all configured sources:

```bash
$ sudo apt update
```

We need to install [Git](https://git-scm.com) in order to download the latest version of tmux from [the official repository](https://github.com/tmux/tmux):

```bash
$ sudo apt install -y git
```

In order to get the latest version of tmux, we'll be compiling and installing the software from source. We need to satisfy the build and tmux dependencies so that we can compile the software.
To do this, we can install the `automake`, `bison`, `build-essential`, `pkg-config`, `libevent-dev`, `libncurses5-dev` packages:

```bash
$ sudo apt install -y automake
$ sudo apt install -y bison
$ sudo apt install -y build-essential
$ sudo apt install -y pkg-config
$ sudo apt install -y libevent-dev
$ sudo apt install -y libncurses5-dev
```

## Download, compile and install tmux

We need to choose the target directory where we'll download tmux.
Let's download in the `/tmp/tmux`. Before downloading we need to try to remove `/tmp/tmux` to ensure that this directory isn't busy:

```bash
$ rm -fr /tmp/tmux
```

Download tmux to `/tmp/tmux`:

```bash
$ git clone https://github.com/tmux/tmux.git /tmp/tmux
```

Go to the `/tmp/tmux` directory:

```bash
$ cd /tmp/tmux
```

Choose the version of tmux you want to install from [the list](https://github.com/tmux/tmux/tags) (e.g. `2.7`, `2.8`, `master`).
Note that `master` points to the latest not stable version of tmux:

```bash
git checkout master
```

Execute `autogen.sh` file:

```bash
$ sh autogen.sh
```

Configure and compile the tmux binaries:

```bash
$ ./configure && make
```

Install the binaries into the system:

```bash
$ sudo make install
```

Go back the previous directory:

```bash
$ cd -
```

We don't need to keep the downloaded tmux binaries, so we can remove `/tmp/tmux`:

```bash
rm -fr /tmp/tmux
```

Successfully finishing all steps above we can use the latest `tmux`. Enjoy!

All steps together:

```bash
#!/usr/bin/env bash

sudo apt update

sudo apt install -y git

sudo apt install -y automake
sudo apt install -y bison
sudo apt install -y build-essential
sudo apt install -y pkg-config
sudo apt install -y libevent-dev
sudo apt install -y libncurses5-dev

rm -fr /tmp/tmux

git clone https://github.com/tmux/tmux.git /tmp/tmux

cd /tmp/tmux

git checkout master

sh autogen.sh

./configure && make

sudo make install

cd -

rm -fr /tmp/tmux
```
