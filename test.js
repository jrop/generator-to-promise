'use strict'

import test from 'ava'
import async from './index'

test('promise', async t => {
	const fn = async(function * () {
		return 'Hello ' + (yield new Promise(y => y('World'))) + (yield new Promise(y => y('!')))
	})

	t.is(await fn(), 'Hello World!')
})

test('error', async t => {
	const fn = async(function * () {
		const msg = yield new Promise(y => y('An error'))
		throw new Error(msg)
	})

	t.throws(fn(), 'An error')
})

test('rejection', async t => {
	const fn = async(function * () {
		yield new Promise((y, n) => n(new Error('An error')))
	})

	t.throws(fn(), 'An error')
})

test('input validation', t => {
	t.plan(3)
	t.throws(() => async())
	t.throws(() => async(function () { }))
	t.notThrows(() => async(function * () {}))
})
