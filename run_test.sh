#!/usr/bin/env bash

# docker-compose up --abort-on-container-exit

truffle migrate --reset && truffle test ./test/r1.test.js