'use strict';

class Matrix {
    constructor(array) {
        this.matrix = [];
        for (var i = 0; i < array.length; i++) {
            this.matrix[i] = [];
            for (var j = 0; j < array[0].length; j++) {
                this.matrix[i][j] = array[i][j];
            }
        }
    }

    // итерирование по матрице
    iterate(callback) {
        for (const m in this.matrix) {
            for (const n in this.matrix[m]) {
                callback(this.matrix[m][n], this.matrix[n][m], m, n);
            }
        }
    }

    // узнаем квадратная ли матрица
    isSquare() {
        const s = this.size();
        return s.m === s.n;
    }

    // получение размера матрицы
    size() {
        const s = {m: 0, n: 0};
        s.m = this.matrix.length;
        if (!s.m) return s;
        s.n = this.matrix[0].length;
        return s;
    }

    // Транспонирование матрицы
    transpone()
    {
        return Matrix.transpone(this.matrix);
    }

    // Сложение матриц
    matrixSum(B) {
        return Matrix.matrixSum(this.matrix, B);
    }

    // Умножение матрицы на число
    multiplyNumber(n) {
        return Matrix.multiplyNumber(n, this.matrix);
    }

    // Умножение на матрицу слева
    multiplyMatrixLeft(A) {
        return Matrix.multiplyMatrix(A, this.matrix);
    }

    // Умножение на матрицу права
    multiplyMatrixRight(B) {
        return Matrix.multiplyMatrix(this.matrix, B);
    }

    // Возведение в степень
    pow(n) {
        return Matrix.pow(n, this.matrix);
    }

    // Получение детерминанта матрицы
    Determinant() {
        return Matrix.Determinant(this.matrix);
    }

    // определение ранга матрицы
    rank() {
        return Matrix.rank(this.matrix);
    }

    // поиск союзной матрицы
    adjugate() {
        return Matrix.adjugate(this.matrix);
    }

    // получение обратной матрицы
    inverse() {
        return Matrix.inverse(this.matrix);
    }

    // булевое отображение
    booling() {
        const A = this.matrix;
        for (let m = 0; m < A.length; m++) {
            for (let n = 0; n < A[m].length; n++) {
                A[m][n] = Number(!!A[m][n]);
            }
        }
    }

    bfs(a) {
        return Matrix.bfs(this.matrix, a);
    }
}

// (breadth first search) - алгоритм обхода в ширину
// G - 2д матрица
// а - начальная вершина
Matrix.bfs = function (G, a) {
    const matrix = Matrix.createZero(G.length);
    const visited = new Array(G.length).fill(false);
    visited[a] = true;
    const queqe = new Array();
    queqe.push(a);
    while (queqe.length) {
        const row = G[queqe[0]];
        for (let u = 0; u < row.length; u++) {
            if (row[u] && !visited[u]) {
                visited[u] = true;
                queqe.push(u);
                matrix[queqe[0]][u] = 1;
            }
        }
        queqe.shift();
    }
    return matrix;
}

// Поелементарное перемножение матриц
Matrix.multiplyMatrixElem = function (A, B) {
    const res = [];
    for (let i = 0; i < A.length; i++) {
        res.push([]);
        for (let j = 0; j < A[i].length; j++) {
            res[i].push(A[i][j] * B[i][j]);
        }
    }
    return res;
}

// Транспонирование  матрицы
// На входе двумерный массив
Matrix.transpone = function(A){
    var m = A.length, n = A[0].length, AT = [];
    for (var i = 0; i < n; i++) {
    AT[i] = [];
        for (var j = 0; j < m; j++) AT[i][j] = A[j][i];
    }
    return AT;
}

// Сложение  матриц
// На входе двумерные массивы одинаковой размерности
Matrix.matrixSum = function (A, B) {
    const m = A.length, n = A[0].length, C = [];
    for (let i = 0; i < m; i++) {
        C[i] = [];
        for (let j = 0; j < n; j++) {
            C[i][j] = A[i][j] + B[i][j];
        }
    }
    return C;
}

// Умножение матрицы на число
Matrix.multiplyNumber = function(a, A)  // a - число, A - матрица (двумерный массив)
{
    var m = A.length, n = A[0].length, B = [];
    for (var i = 0; i < m; i++) {
    B[i] = [];
        for (var j = 0; j < n; j++) B[i][j] = a * A[i][j];
    }
    return B;
}

// Умножение матриц
Matrix.multiplyMatrix = function(A, B) {
    var rowsA = A.length, colsA = A[0].length,
        rowsB = B.length, colsB = B[0].length,
        C = [];
    if (colsA != rowsB) return false;
    for (var i = 0; i < rowsA; i++) C[i] = [];
    for (var k = 0; k < colsB; k++) {
        for (var i = 0; i < rowsA; i++) {
            var t = 0;
            for (var j = 0; j < rowsB; j++) t += A[i][j] * B[j][k];
            C[i][k] = t;
        }
    }
    return C;
}

// Возведение матрицы в степень
Matrix.pow = function(n, A) {
    if (n == 1) {
        return A;
    } else {
        return Matrix.multiplyMatrix(A, Matrix.pow(n - 1, A));
    }
}

// Определитель матрицы
// Используется алгоритм Барейса, сложность O(n^3)
Matrix.Determinant = function (A) {
    var N = A.length, B = [], denom = 1, exchanges = 0;
    for (var i = 0; i < N; ++i) {
        B[i] = [];
        for (var j = 0; j < N; ++j) B[i][j] = A[i][j];
    }
    for (var i = 0; i < N - 1; ++i) {
        var maxN = i, maxValue = Math.abs(B[i][i]);
        for (var j = i + 1; j < N; ++j) {
            var value = Math.abs(B[j][i]);
            if (value > maxValue) { maxN = j; maxValue = value; }
        }
        if (maxN > i) {
            var temp = B[i]; B[i] = B[maxN]; B[maxN] = temp;
            ++exchanges;
        }
        else { if (maxValue == 0) return maxValue; }
        var value1 = B[i][i];
        for (var j = i + 1; j < N; ++j) {
            var value2 = B[j][i];
            B[j][i] = 0;
            for (var k = i + 1; k < N; ++k) B[j][k] = (B[j][k] * value1 - B[i][k] * value2) / denom;
        }
        denom = value1;
    }
    if (exchanges % 2) return -B[N - 1][N - 1];
    else return B[N - 1][N - 1];
}

// Ранг матрицы
Matrix.rank = function(A) {
    var m = A.length, n = A[0].length, k = (m < n ? m : n), r = 1, rank = 0;
    while (r <= k) {
        var B = [];
        for (var i = 0; i < r; i++) B[i] = [];
        for (var a = 0; a < m - r + 1; a++) {
            for (var b = 0; b < n - r + 1; b++) {
                for (var c = 0; c < r; c++) { for (var d = 0; d < r; d++) B[c][d] = A[a + c][b + d]; }
                if (Determinant(B) != 0) rank = r;
            }
        }
        r++;
    }
    return rank;
}

// Союзная матрица
// A - двумерный квадратный массив
Matrix.adjugate = function (A) {
    var N = A.length, adjA = [];
    for (var i = 0; i < N; i++) {
        adjA[i] = [];
        for (var j = 0; j < N; j++) {
            var B = [], sign = ((i + j) % 2 == 0) ? 1 : -1;
            for (var m = 0; m < j; m++) {
                B[m] = [];
                for (var n = 0; n < i; n++)   B[m][n] = A[m][n];
                for (var n = i + 1; n < N; n++) B[m][n - 1] = A[m][n];
            }
            for (var m = j + 1; m < N; m++) {
                B[m - 1] = [];
                for (var n = 0; n < i; n++)   B[m - 1][n] = A[m][n];
                for (var n = i + 1; n < N; n++) B[m - 1][n - 1] = A[m][n];
            }
            adjA[i][j] = sign * Determinant(B);   // Функцию Determinant см. выше
        }
    }
    return adjA;
}

// Обратная матрица
// A - двумерный квадратный массив
Matrix.inverse = function (A) {
    var det = Determinant(A);
    if (det == 0) return false;
    var N = A.length, A = AdjugateMatrix(A);
    for (var i = 0; i < N; i++) { for (var j = 0; j < N; j++) A[i][j] /= det; }
    return A;
}

Matrix.createUnit = function (n) {
    return (new Array(n).fill(0)).map(
        function (a, i) {
            return (new Array(n)).fill(0).map((b, j)  => (i == j) ? 1 : 0);
        }
    )
}

Matrix.toString = function (A) {
    let result = "\n";
    for (let i = 0; i < A.length; i++) {
        for (let j = 0; j < A[i].length; j++) {
            result += String(A[i][j]);
            result += "   ";
        }
        result += "\n";
    }
    return result;
}

Matrix.createZero = function (n) {
    return (new Array(n).fill(0)).map(
        function (a, i) {
            return (new Array(n)).fill(0);
        }
    )
}

Matrix.createInfinity = function (n) {
    return (new Array(n).fill(0)).map(
        function (a, i) {
            return (new Array(n)).fill(0).map((b, j) => (i == j) ? Infinity : 0);
        }
    )
}