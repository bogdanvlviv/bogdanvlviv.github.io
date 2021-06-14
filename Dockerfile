ARG RUBY_VERSION
FROM ruby:$RUBY_VERSION

ARG BUNDLER_VERSION

RUN apt-get update && apt-get upgrade -y

ENV BUNDLE_JOBS=4
ENV BUNDLE_RETRY=3

RUN gem update --system && gem install bundler:$BUNDLER_VERSION

RUN mkdir -p /app
WORKDIR /app
