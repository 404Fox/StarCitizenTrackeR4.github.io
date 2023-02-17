# Setup

Install [Jekyll](https://jekyllrb.com/) and Bundler:

    gem install jekyll bundler
    bundle install

Install rbenv:

    curl -fsSL https://github.com/rbenv/rbenv-installer/raw/HEAD/bin/rbenv-installer | bash
    

Update ruby:

    rbenv install 3.1.2
    rbenv global 3.1.2

You can now run site:

    rake serve

Site is now running at [localhost:4000](http://localhost:4000)

# Tests

    rake test

# todo

- remove misc
- human readable data
