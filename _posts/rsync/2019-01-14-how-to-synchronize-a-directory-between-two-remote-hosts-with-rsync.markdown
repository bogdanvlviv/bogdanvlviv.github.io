---
layout: post
lang: "en"
title: "How to synchronize a directory between two remote hosts with rsync"
author: "bogdanvlviv"
image: "/images/posts/rsync/how-to-synchronize-a-directory-between-two-remote-hosts-with-rsync/rsynclogo.jpg"
date: 2019-01-14 20:00:00 +0200
categories: posts rsync
permalink: /:categories/:title.html
---

<div class="picture">
  <img src="{{ "/images/posts/rsync/how-to-synchronize-a-directory-between-two-remote-hosts-with-rsync/rsynclogo.jpg" | absolute_url }}" title="rsync" loading="lazy">
</div>

I usually work by using a laptop, but technically write code, run a development web server, etc. on another host by connecting to it via [SSH](https://en.wikipedia.org/wiki/Secure_Shell).
With lovely [Vim](https://www.vim.org/about.php) and [tmux](https://github.com/tmux/tmux/blob/master/README), I can easily do bigger percentage of my work in a [terminal emulator](https://en.wikipedia.org/wiki/Terminal_emulator).

Sometimes I get some work that related to handling some specific files.
It can be done by using some specific desktop applications. After handling those files I have to put them into source of a project I am working on and this project on the remote host.
It means that I should provide some way to transfer data between my laptop and the remote host.
Good idea to synchronize a directory between the hosts.
We can do it with [rsync](https://rsync.samba.org/).

I use `rsync` of version `3.1.2` in this post:

```bash
bogdanvlviv@laptop:~$ rsync --version
rsync  version 3.1.2  protocol version 31
Copyright (C) 1996-2015 by Andrew Tridgell, Wayne Davison, and others.
Web site: http://rsync.samba.org/
Capabilities:
    64-bit files, 64-bit inums, 64-bit timestamps, 64-bit long ints,
    socketpairs, hardlinks, symlinks, IPv6, batchfiles, inplace,
    append, ACLs, xattrs, iconv, symtimes, prealloc

rsync comes with ABSOLUTELY NO WARRANTY.  This is free software, and you
are welcome to redistribute it under certain conditions.  See the GNU
General Public Licence for details.
```

Let's get started!


Go to the remote host:

```bash
bogdan@server:~$
```

and choose a directory you would like to synchronize with the laptop:

```bash
bogdan@server:~$ mkdir synced-data
```

then choose a directory on the laptop that will mirror the directory on the remote server:

```bash
bogdanvlviv@laptop:~$ mkdir synced-data
```

Create `sync_data.sh` file on the laptop:

```bash
#!/usr/bin/env bash

rsync --verbose -e "ssh -p 22" --recursive --update --times --archive --compress bogdan@server:/home/bogdan/synced-data/ /home/bogdanvlviv/synced-data
rsync --verbose -e "ssh -p 22" --recursive --update --times --archive --compress /home/bogdanvlviv/synced-data/ bogdan@server:/home/bogdan/synced-data
```

> NOTE: You have to change ssh port, username and server name to your own to make it work!

> NOTE: You can read about `rsync` options via `man rsync`.

To keep the directory synchronized between the hosts we should execute this file with some interval.
You can use `watch` to achieve this, for instance, the next command will execute this file every 3 seconds:

```bash
bogdanvlviv@laptop:~$ watch --interval 3 "bash sync_data.sh"
```

While the command `watch --interval 3 "bash sync_data.sh"` is running, the directory is being synchronized.

> NOTE: You can read about `watch` options via `man watch`.

To check that all is working well, we can go to the remote server and create a new file in the directory we are synchronizing:

```bash
bogdan@server:~$ touch synced-data/new_file.md
```

then go to the synchronized directory on the laptop and to check that the `new_file.md` file is there:

```bash
bogdanvlviv@laptop:~$ ls synced-data/
new_file.md
```

write something to that file:

```bash
bogdanvlviv@laptop:~$ echo "rsync is powerful!" > synced-data/new_file.md
```

and check the file on the server:

```bash
bogdan@server:~$ cat synced-data/new_file.md
rsync is powerful!
```

That is it!
