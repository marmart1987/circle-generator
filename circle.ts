interface point {
    x: number,
    y: number
}

function generateArray(size: number) {
    if (size % 2 !== 0) {
        return null
    }
    let array = []

    function row() {
        let row: Array<any> = []
        for (let x = 0; x < size; x++) {
            row.push("⬜")
        }
        return row
    }
    for (let y = 0; y < size; y++) {
        array.push(row())
    }
    return array;
}

function getCell(point: point, array: any) {
    try {
        return array[point.y][point.x]
    } catch (error) {
        console.error(error, point)
    }
}

function setCell(point: point, value: "⬜" | "⬛" | any, array: any) {
    try {
        array[point.y][point.x] = value
        return array
    } catch (error) {
        console.error(error, point)
    }

}

function isDistanceCorrect(size: number, distance: number) {
    if (distance < 1000 && distance > 900) {
        return true
    } else {
        return false
    }
}

function createCircleRecursive(midpoint: point, size: number, array: Array<any>) {

    function getDistance(point2: point): number {
        let point1 = midpoint
        //c^2 = a^2 + b^2
        //distance^2 = xDiff^2 + yDiff^2
        const xDiff = point1.x - point2.x
        const yDiff = point1.y - point2.y
        const distanceSquared = xDiff ** 2 + yDiff ** 2
        const distance = Math.sqrt(distanceSquared)
        return distance
    }
    array.forEach(function (row: Array<any>, y: number) {
        row.forEach(function (element: string, x: number) {
            let point = {
                x: x,
                y: y
            }
            let distance = getDistance(point)
            distance = distance / (size / 2)
            //console.log(distance)
            //   if (distance < 1.00 && distance > 0.97) { setCell(point, "⬛", array) }
            if (isDistanceCorrect(size, distance * 1000)) {
                setCell(point, "⬛", array)
            }
        })
    })
}

function calculateNeighbors(cell: point, array: Array<any>) {
    if (getCell(cell, array) !== "⏹") { return 0 }
    let neighbors: number = 0;
    const pointsToCheck = [
        { x: cell.x, y: cell.y + 1 }, //up
        { x: cell.x, y: cell.y - 1 }, //down
        { x: cell.x - 1, y: cell.y }, //left
        { x: cell.x + 1, y: cell.y }, //right
        // { x: cell.x - 1, y: cell.y + 1 }, //upper left
        //{ x: cell.x + 1, y: cell.y + 1 }, //upper right
        //{ x: cell.x - 1, y: cell.y - 1 }, //lower left
        //{ x: cell.x + 1, y: cell.y - 1 }, //lower right
    ]
    pointsToCheck.forEach(function (point) {
        if (point.x > 0 && point.y > 0 && point.x < array.length - 1 && point.y < array.length - 1) {
            if (getCell(point, array) === "⏹") {
                neighbors++;
            }
        }
    })
    return neighbors
}
function createCircle(size: number) {
    let startTime = Date.now()

    let array = generateArray(size)
    if (!array) {
        return false
    }
    try {
        //get midpoint of circle
        const midpoint: point = {
            x: (size / 2),
            y: (size / 2)
        }

        createCircleRecursive(midpoint, size, array)
        let output = ""
        let area: number = 0;
        array.forEach(function (element, y) {
            let startX: number
            element[element.findIndex(function (value, x) { //Left - right
                if (value === "⏹") { return true }
                if (value === "⬛") {
                    startX = x;
                    return true;
                } else {
                    return false
                }
            })] = "⏹"
            element[element.findLastIndex(function (value, x) { //Right - left
                if (value === "⏹") { return true }
                if (value === "⬛") {
                    area += (x - startX)
                    return true;
                } else {
                    return false
                }
            })] = "⏹"

        })
        for (let x = 1; x < size; x++) { //Bottom - top
            let completed = false
            for (let y = 0; y <= size / 2; y++) {
                if (array[y][x] === "⏹") { completed = true; continue }
                if (completed) { array[y][x] = "⬜"; continue; }
                if (array[y][x] === "⬛") {
                    array[y][x] = "⏹"
                    completed = true
                    //break;
                }
            }
            completed = false
            for (let y = size - 1; y > size / 2; y--) { //Top - Bottom
                if (array[y][x] === "⏹") { completed = true; continue }
                if (completed) { array[y][x] = "⬜"; continue }
                if (array[y][x] === "⬛") {
                    array[y][x] = "⏹"
                    completed = true
                }
            }
        }
        let pi = area / ((size / 2) ** 2)
        console.log(pi, area)

        array.forEach(function (element) {
            output += element.join("")
            output += "\n"
        }, array)
        // @ts-ignore
        if (document.getElementById("showResult").checked) {
            // @ts-ignore
            let out = document.getElementById("output"); out.innerHTML = output; out.style.fontSize = 437 / size;
        }
        console.log("Elapsed time", Date.now() - startTime)
        return array
    } catch (error) {
        console.error(error, array)
    }


}