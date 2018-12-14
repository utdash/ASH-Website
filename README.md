# ASH-Website
New ASH website (2018) based on the old archive from Weebly like 6 years ago.

When we think this website is good enough to be shared with people, we'll publish it at https://utdash.com/.
Until then, however, it can be found at https://utdash.github.io/ASH-Website/.

# Jekyll
Jekyll is a Ruby Gem supported by GitHub Pages that allows us to compile a static HTML site.

Whenever this repository's master channel is updated, GitHub Pages will automatically rerun Jekyll
and publish the resulting website files. This sometimes takes a minute or two.

Each file in the root directory gets preprocessed by Jekyll and is then output to the root of the site.
For instance:
- `index.html -> https://your.site/index.html`
- `about.md -> https://your.site/about.html`

Normal HTML files will not be changed, and they will appear on the site as expected.

## Jekyll options (in \_config.yml)
Some Jekyll options get overwritten by GitHub Pages when publishing the site. Therefore, it is dangerous to define these settings locally because doing so will cause Jekyll to compile differently locally than it compiles on the server.

Avoid defining these Jekyll settings (ESPECIALLY SOURCE!)
```yml
 lsi: false
 safe: true
 source: [your repo's top level directory]
 incremental: false
 highlighter: rouge
 gist:
   noscript: false
 kramdown:
   math_engine: mathjax
   syntax_highlighter: rouge
```

For more information, visit <https://help.github.com/articles/configuring-jekyll/>.

## Front matter
Each page file can start with a header that looks like this:
```
---
title: Home
layout: default
---
```

This is referred to as "front matter". The `layout` property refers to a file in the `_layouts` folder.
Each layout file contains `{{ content }}` somewhere. When Jekyll processes a page, it inserts all of that page's content
into the location of `{{ content }}` in the specified layout file.

Any file or folder whose name starts with an underscore is completely ignored by Jekyll and **will not** get published.

## Serving the site locally for development
The site has to be compiled by Jekyll before you can view it in a browser.
That means you'll need to be able to compile it locally during development before pushing your changes to GitHub.

### On Linux (Ubuntu with bash)
This is super easy if you have Ubuntu or any Debian-based Linux OS. Just execute `serveLocal.sh`. If something doesn't work, `serveLocal.sh` should be able to tell you what to do.

### On Windows
If only Batch scripts were as useful as Bash scripts. Sigh.

#### Installation of dependencies
1. You'll need to install Ruby: `https://rubyinstaller.org/`
   -  _Make sure to install the MSYS2 toolchain at the end_
   -  _You may need to manually add the path to ruby.exe to the Windows PATH variable._
2. Install Ruby Bundler by running this command at a Windows command prompt: `gem install bundler`
3. Use bundler to install Jekyll: `bundler install`
   
#### Using Jekyll
Use the following command to compile and serve the site on your local PC: `bundler exec jekyll serve`

After compilation, Jekyll will serve the site at an address such as `http://127.0.0.1:4000/`.
Whatever address it gives you, put that in your browser to access the site.

If you make any changes to a file while the server is running (and save the file(s)),
Jekyll will automatically recompile the modified pages so you can see your changes in the browser right away.
