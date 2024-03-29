# React Bun Nookit Plugin

![npm bundle size](https://img.shields.io/bundlephobia/min/%40bnk%2Freact)

## Bun Nookit Plugins

This plugin library provides a collection of easy-to-use, modular plugins to enhance the functionality of Bun Nookit applications. These plugins are not core modules but are built upon the core modules, adding extra features and flexibility to Bun Nookit projects.

## Overview

The main purpose of these plugins is to extend the functionality of Bun Nookit applications and make it more versatile for developers. Some of the plugins available in this library include:

## React-Fetcher: A plugin that provides an easy-to-use fetcher with React hooks for client-side data fetching from APIs and keeping track of the request status. If you're using React, this single plugin will handle all your data fetching needs

Getting Started
To use a plugin in your Bun Nookit project, simply install it as a dependency and import the relevant functions or components:

## Installation

TBD

Available Plugins

### React-Fetcher

A React-based plugin for client-side data fetching. It provides an easy-to-use fetcher with React hooks that handle fetching data from APIs and keeping track of the request status.

Usage example:

js

`import { useFetcher } from '@bnkit/react';`

`const fetch = useFetcher({ url: 'https://api.example.com' });`

// Fetch data using the get method
`fetch.get('/resource');`

// Fetch data using the post method with parameters
`fetch.post('/resource', { params: { test: 'test' } });`

// Get the current status of the fetch request
`fetch.getStatus();`

## Contributing

Contributions to the Bun Nookit plugin library are welcome! If you have an idea for a plugin or would like to improve an existing one, please feel free to submit a pull request or open an issue for discussion.

This should give you a good starting point for your Bun Nookit plugins README. Modify and expand it as needed to include additional plugins or details about their usage.
