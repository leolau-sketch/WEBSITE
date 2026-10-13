// Preserve the catalog: prioritize manufactured textile forms without inventing end products.
export const isFinishedProduct = product => !['Fiber', 'Yarn'].includes(product.form)
export const finishedFirst = items => [...items].sort((a,b) => Number(isFinishedProduct(b)) - Number(isFinishedProduct(a)))
