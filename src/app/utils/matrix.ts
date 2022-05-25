/**
 * @typedef {number} Cell
 * @typedef {Cell[][]|Cell[][][]} Matrix
 * @typedef {number[]} Shape
 * @typedef {number[]} CellIndices
 */

/**
 * Gets the matrix's shape.
 *
 * @param {Matrix} m
 * @returns {Shape}
 */
export const shape = (m: any) => {
    const shapes = [];
    let dimension = m;
    while (dimension && Array.isArray(dimension)) {
        shapes.push(dimension.length);
        dimension = (dimension.length && [...dimension][0]) || null;
    }
    return shapes;
};

/**
 * Checks if matrix has a correct type.
 *
 * @param {Matrix} m
 * @throws {Error}
 */
const validateType = (m: any) => {
    if (!m || !Array.isArray(m) || !Array.isArray(m[0])) {
        throw new Error('Invalid matrix format');
    }
};

/**
 * Checks if matrix is two dimensional.
 *
 * @param {Matrix} m
 * @throws {Error}
 */
const validate2D = (m: any) => {
    validateType(m);
    const aShape = shape(m);
    if (aShape.length !== 2) {
        throw new Error('Matrix is not of 2D shape');
    }
};

/**
 * Validates that matrices are of the same shape.
 *
 * @param {Matrix} a
 * @param {Matrix} b
 * @trows {Error}
 */
export const validateSameShape = (a: any, b: any) => {
    validateType(a);
    validateType(b);

    const aShape = shape(a);
    const bShape = shape(b);

    if (aShape.length !== bShape.length) {
        throw new Error('Matrices have different dimensions');
    }

    while (aShape.length && bShape.length) {
        if (aShape.pop() !== bShape.pop()) {
            throw new Error('Matrices have different shapes');
        }
    }
};

/**
 * Generates the matrix of specific shape with specific values.
 *
 * @param {Shape} mShape - the shape of the matrix to generate
 * @param {function({CellIndex}): Cell} fill - cell values of a generated matrix.
 * @returns {Matrix}
 */
export const generate = (mShape: any, fill: any) => {
    /**
     * Generates the matrix recursively.
     *
     * @param {Shape} recShape - the shape of the matrix to generate
     * @param {CellIndices} recIndices
     * @returns {Matrix}
     */
    const generateRecursively: any = (recShape: any, recIndices: any) => {
        if (recShape.length === 1) {
            return Array(recShape[0])
                .fill(null)
                .map((cellValue, cellIndex) => fill([...recIndices, cellIndex]));
        }
        const m = [];
        for (let i = 0; i < recShape[0]; i += 1) {
            m.push(generateRecursively(recShape.slice(1), [...recIndices, i]));
        }
        return m;
    };

    return generateRecursively(mShape, []);
};

/**
 * Generates the matrix of zeros of specified shape.
 *
 * @param {Shape} mShape - shape of the matrix
 * @returns {Matrix}
 */
export const zeros = (mShape: any) => {
    return generate(mShape, () => 0);
};

/**
 * @param {Matrix} a
 * @param {Matrix} b
 * @return Matrix
 * @throws {Error}
 */
export const dot = (a: any, b: any) => {
    // Validate inputs.
    validate2D(a);
    validate2D(b);

    // Check dimensions.
    const aShape = shape(a);
    const bShape = shape(b);
    if (aShape[1] !== bShape[0]) {
        throw new Error('Matrices have incompatible shape for multiplication');
    }

    // Perform matrix multiplication.
    const outputShape = [aShape[0], bShape[1]];
    const c = zeros(outputShape);

    for (let bCol = 0; bCol < b[0].length; bCol += 1) {
        for (let aRow = 0; aRow < a.length; aRow += 1) {
            let cellSum = 0;
            for (let aCol = 0; aCol < a[aRow].length; aCol += 1) {
                cellSum += a[aRow][aCol] * b[aCol][bCol];
            }
            c[aRow][bCol] = cellSum;
        }
    }

    return c;
};
