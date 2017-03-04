function notNull<T>(param : T | null | undefined) : T {
  if (!param)
    throw new Error('Expected parameter not to be null or undefined')
  return param
}
