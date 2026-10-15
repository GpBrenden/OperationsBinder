import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const config=JSON.parse(fs.readFileSync(new URL('../wrangler.jsonc',import.meta.url),'utf8'));
test('Worker config targets the confirmed existing service and domain',()=>{assert.equal(config.name,'operationsbinder');assert.deepEqual(config.routes,[{pattern:'binders.doyles-sheehan.com',custom_domain:true}]);});
test('Worker serves only generated static assets without data bindings',()=>{assert.equal(config.assets.directory,'./dist');for(const key of ['main','d1_databases','kv_namespaces','r2_buckets','durable_objects'])assert.equal(config[key],undefined);assert.equal(config.assets.binding,undefined);});
