---
layout: post
lang: "en"
title: "How to install the latest Vim on Ubuntu 16.04"
author: "bogdanvlviv"
image: "/images/posts/vim/how-to-install-the-latest-vim-on-ubuntu-16_04/vim.png"
date: 2017-10-25 17:55:00 +0300
categories: posts vim
permalink: /:categories/:title.html
---

<div class="picture">
  <img src="{{ "/images/posts/vim/how-to-install-the-latest-vim-on-ubuntu-16_04/vim.png" | absolute_url }}" title="Vim" loading="lazy">
</div>

## What is Vim?

Vim is a highly configurable text editor built to enable efficient text editing. It is an improved version of the vi editor distributed with most UNIX systems. [Read more](https://vim.sourceforge.io/about.php).

## Install the download and build dependencies

We can download package information from all configured sources:

```bash
$ sudo apt update
```

We need to install [Git](https://git-scm.com) in order to download the latest version of Vim from [the official repository](https://github.com/vim/vim):

```bash
$ sudo apt install -y git
```

In order to get the latest version of Vim, we'll be compiling and installing the software from source. We need to satisfy the build dependencies so that we can compile the software.
To do this, we can install the `build-essential` package:

```bash
$ sudo apt install -y build-essential
```

## Download, compile and install Vim

We need to choose the target directory where we'll download Vim.
Let's download in the `/tmp/vim`. Before downloading we need to try to remove `/tmp/vim` to ensure that this directory isn't busy:

```bash
$ rm -fr /tmp/vim
```

Download Vim to `/tmp/vim`:

```bash
$ git clone https://github.com/vim/vim.git /tmp/vim
```

Compile the Vim binaries:

```bash
$ make -C /tmp/vim
```

Install the binaries into the system:

```bash
$ sudo make install -C /tmp/vim
```

We don't need to keep the downloaded Vim binaries, so we can remove `/tmp/vim`:

```bash
$ rm -fr /tmp/vim
```

Successfully finishing all steps above we can use the latest `vim`. Enjoy!

All steps together:

```bash
#!/usr/bin/env bash

sudo apt update

sudo apt install -y git

sudo apt install -y build-essential

rm -fr /tmp/vim

git clone https://github.com/vim/vim.git /tmp/vim

make -C /tmp/vim

sudo make install -C /tmp/vim

rm -fr /tmp/vim
```
