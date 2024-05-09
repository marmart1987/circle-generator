"use strict";




function generateArray(size) {
    if (size % 2 !== 0) {
        return null;
    }
    var array = [];

    function row() {
        var row = [];
        for (var x = 0; x < size; x++) {
            row.push("⬜");
        }
        return row;
    }
    for (var y = 0; y < size; y++) {
        array.push(row());
    }
    return array;
}

function getCell(point, array) {
    try {
        return array[point.y][point.x];
    } catch (error) {
        console.error(error, point);
    }
}

function setCell(point, value, array) {
    try {
        array[point.y][point.x] = value;
        return array;
    } catch (error) {
        console.error(error, point);
    }
}

function isDistanceCorrect(size, distance) {
    if (distance < 1000 && distance > 900) {
        return true;
    } else {
        return false;
    }
}

function createCircleRecursive(midpoint, size, array) {
    function getDistance(point2) {
        var point1 = midpoint;
        //c^2 = a^2 + b^2
        //distance^2 = xDiff^2 + yDiff^2
        var xDiff = point1.x - point2.x;
        var yDiff = point1.y - point2.y;
        var distanceSquared = Math.pow(xDiff, 2) + Math.pow(yDiff, 2);
        var distance = Math.sqrt(distanceSquared);
        return distance;
    }
    array.forEach(function (row, y) {
        row.forEach(function (element, x) {
            var point = {
                x: x,
                y: y
            };
            var distance = getDistance(point);
            distance = distance / (size / 2);
            //console.log(distance)
            //   if (distance < 1.00 && distance > 0.97) { setCell(point, "⬛", array) }
            if (isDistanceCorrect(size, distance * 1000)) {
                setCell(point, "⬛", array);
            }
        });
    });
}


function createCircle(size) {
    var startTime = Date.now();
    var array = generateArray(size);
    if (!array) {
        return false;
    }
    try {
        //get midpoint of circle
        var midpoint = {
            x: (size / 2),
            y: (size / 2)
        };
        createCircleRecursive(midpoint, size, array);
        var output_1 = "";
        var area_1 = 0;
        array.forEach(function (element, y) {
            var startX;
            element[element.findIndex(function (value, x) {
                if (value === "⏹") {
                    return true;
                }
                if (value === "⬛") {
                    startX = x;
                    return true;
                } else {
                    return false;
                }
            })] = "⏹";
            element[element.findLastIndex(function (value, x) {
                if (value === "⏹") {
                    return true;
                }
                if (value === "⬛") {
                    area_1 += (x - startX);
                    return true;
                } else {
                    return false;
                }
            })] = "⏹";
        });
        for (var x = 1; x < size; x++) { //Bottom - top
            var completed = false;
            for (var y = 0; y <= size / 2; y++) {
                if (array[y][x] === "⏹") {
                    completed = true;
                    continue;
                }
                if (completed) {
                    array[y][x] = "⬜";
                    continue;
                }
                if (array[y][x] === "⬛") {
                    array[y][x] = "⏹";
                    completed = true;
                    //break;
                }
            }
            completed = false;
            for (var y = size - 1; y > size / 2; y--) { //Top - Bottom
                if (array[y][x] === "⏹") {
                    completed = true;
                    continue;
                }
                if (completed) {
                    array[y][x] = "⬜";
                    continue;
                }
                if (array[y][x] === "⬛") {
                    array[y][x] = "⏹";
                    completed = true;
                }
            }
        }
        var pi = area_1 / (Math.pow((size / 2), 2));
        console.log(pi, area_1);
        array.forEach(function (element) {
            output_1 += element.join("");
            output_1 += "\n";
        }, array);
        var isNode = (typeof exports === 'object') ? true : false;
        console.log(isNode)
        // @ts-ignore
        if (!isNode) {
            if (document.getElementById("showResult").checked) {
                // @ts-ignore
                var out = document.getElementById("output");
                out.innerHTML = output_1;
                out.style.fontSize = 437 / size;
            }
        }
        console.log("Elapsed time", Date.now() - startTime);
        return array;
    } catch (error) {
        console.error(error, array);
    }
}