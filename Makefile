
test:
	@node_modules/.bin/mocha \
		--reporter spec \
		--harmony 

example:
	@node --harmony example

.PHONY: test

