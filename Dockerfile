FROM trufflesuite/ganache-cli

# RUN ganache-cli -p 7544
# EXPOSE 8545
RUN yarn global add truffle
# RUN ganache-cli -a 20 -e 1000
# RUN mkdir -p work
# COPY . ./work

CMD ganache-cli