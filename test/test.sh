#!/bin/bash
cd test/
# password 需要外网环境无法测试
# mocha password.js
mocha port.js
mocha connect.js
mocha cookies-fms.js
mocha handle.js
mocha static.js
mocha static-2.js
mocha static-3.js
mocha getHandle.js