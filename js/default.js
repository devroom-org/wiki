function LCS(str1, str2) {
  var table = generateLCSTable(str1, str2);

  if (this instanceof LCS) {
    this.getTable = function() {
      return table;
    };

    this.getLength = function() {
      return table[table.length - 1][table[0].length - 1].value;
    };

    this.getSequences = function() {
      return backTrack(table, str1, str2);
    };
  } else {
    return new LCS(str1, str2);
  }

}

// constants
var DIAGONAL = 1,
  UP = 2,
  LEFT = 3,
  UPORLEFT = 4;

function generateLCSTable(a, b) {
  var matrix = [],
    i, j,
    indexA, indexB,
    top, left,
    value, direction;

  // i is column
  // j is row
  for (i = 0; i < a.length + 1; i += 1) {
    matrix[i] = [{ value: 0, direction: null }];

    for (j = 0; j < b.length + 1; j += 1) {
      if (i == 0 || j == 0) {
        matrix[i][j] = { value: 0, direction: null };
      } else {

        indexA = i - 1;
        indexB = j - 1;

        // MATCH
        if (a[indexA] == b[indexB]) {
          // assign to diagonal top left, incremented by 1
          matrix[i][j] = {
            value: matrix[i-1][j-1].value + 1,
            direction: DIAGONAL
          };

        // NO MATCH
        } else {
          // assign to the longest of top or left
          top = matrix[i][j-1];
          left = matrix[i-1][j];

          if (top.value == left.value) {
            value = top.value;
            direction = UPORLEFT;
          } else if (top.value > left.value) {
            value = top.value;
            direction = UP;
          } else {
            value = left.value;
            direction = LEFT;
          }

          matrix[i][j] = {
            value: value,
            direction: direction
          };

        }

      }
    }
  }

  return matrix;
}

function backTrack(table, str1, str2) {

  var answers = [];

  backTrackHelper('', table, table.length - 1, table[0].length - 1);

  return uniq(answers);

  // acc is an accumulator string (the lcs)
  function backTrackHelper(acc, table, i, j) {
    if (i == 0 || j == 0) {
      answers.push(acc);
      return;
    }

    var currCell = table[i][j],
      top, left;

    if (currCell.direction == DIAGONAL) {
      backTrackHelper(str1[i - 1] + acc, table, i - 1, j - 1, str1, str2);
    } else if (currCell.direction == UP) {
      backTrackHelper(acc, table, i, j - 1, str1, str2);
    } else if (currCell.direction == LEFT) {
      backTrackHelper(acc, table, i - 1, j, str1, str2);
    } else {
      // we can go either up or left
      top = table[i][j-1];
      left = table[i-1][j-1];

      // left
      backTrackHelper(acc, table, i - 1, j, str1, str2),
      // top
      backTrackHelper(acc, table, i, j - 1, str1, str2)
    }
  }
}

function contains(arr, elem) {
  return arr.indexOf(elem) >= 0;
}

function uniq(arr) {
  var result = [];

  arr.forEach(function(elem) {
    if (!contains(result, elem)) {
      result.push(elem);
    }
  });

  return result;
}