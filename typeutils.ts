function notNull<T>(param : T | null | undefined) : T {
  if (!param) throw new Error('Expected parameter not to be null or undefined')
  return param
}

function notNan(n: number) {
  if (isNaN(n)) throw new Error('Expected a number, but got NaN')
  return n
}
