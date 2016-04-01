'use strict'

function isGen(fn) {
	if (!(typeof fn == 'function')) return false
	return fn.constructor.name == 'GeneratorFunction'
}

module.exports = function generatorToPromise(generatorFunction) {
	if (!isGen(generatorFunction))
		throw new Error('The given function must be a generator function')

	return function invoker() {
		const deferred = Promise.defer()
		const generator = generatorFunction.call(this, arguments)

		;(function next(error, value) {
			let genState = null
			try {
				if (error)
					genState = generator.throw(error)
				else
					genState = generator.next(value)
			} catch (e) {
				genState = { value: Promise.reject(e), done: true }
			}

			if (genState.done) {
				deferred.resolve(genState.value)
			} else {
				Promise.resolve(genState.value)
				.then(promiseResult => next(null, promiseResult))
				.catch(error => next(error))
			}
		})()
		
		return deferred.promise
	}
}
