//Obtain the file through a CLI parameter, default to file in directory if not provided
const file = process.argv[2] || "input.txt"


/**
 * @desc reads a file and provides necessary inputs for cleaning dirt
 * @param string file - the path to file to be read
 * @return arrays for the gridSize, startingPosition, dirtPositions, and cardinal directions
 */
const readFile = (file) => {
  const fs = require('fs');
  const fileContent = fs.readFileSync(file, 'utf8');
  const fileArray = fileContent.split("\n")
  //Find the size of the room based on the first line of file
  //come back and create helper function
  const gridSize = fileArray[0].split(" ").map(num => parseInt(num))
  //Find the starting position of the robot
  const startingPosition = fileArray[1].split(" ").map(num => parseInt(num))
  //Find the directions for the robot
  const directions = fileArray[fileArray.length - 1].split("")
  //Find the positions where dirt will be throughout the room
  const dirtPositions = []
  for (i = 2; i <= fileArray.length - 2; i++) {
    dirtPositions.push(fileArray[i].split(" ").map(num => parseInt(num)))
  }
  return {
    gridSize,
    startingPosition,
    dirtPositions,
    directions
  }
}


//Calls readFile and makes inputs globally available
const {
  gridSize,
  startingPosition,
  dirtPositions,
  directions
} = readFile(file)


/**
 * @desc translates a cardinal direction to actionably grid positionn
 * @param string direction - single letter of cardinal direction
 * @return array of the next move vector
 */
const findDirection = (direction) => {
  switch (direction) {
    case 'N':
      return [0, 1];
      break;
    case 'S':
      return [0, -1];
      break;
    case 'E':
      return [1, 0]
      break;
    case 'W':
      return [-1, 0];
      break;
  }
}


/**
 * @desc solves how many dirt spaces the robot will clean over
 * @return array for currentPosition of the robot after all moves, and array of all positions traversed
 */
const solve = () => {
  let currentPosition = startingPosition
  let positionsHit = []
  positionsHit.push(startingPosition)
  //loop through the array of cardinal directions and move the robot
  for (i = 0; i < directions.length; i++) {
    let currentMoveVector = findDirection(directions[i])
    let currentX = currentPosition[0] + currentMoveVector[0]
    let currentY = currentPosition[1] + currentMoveVector[1]
    //check that the current position we're set to go to is in bounds
    if (currentX >= 0 && currentY >= 0 && currentX < (gridSize[0]) && currentY < (gridSize[0])) {
      positionsHit.push([currentX, currentY])
      currentPosition = [currentX, currentY]
    }
  }
  return {
    currentPosition,
    positionsHit
  }
}


/**
 * @desc solves how many dirt spaces the robot will clean over
 * @param array positionsHit for all the positions the robot moved over
 * @return Int of number of cleaned spaces
 */
const checkDirt = positionsHit => {
  let cleanedSpaces = 0
  for (i = 0; i < dirtPositions.length; i++) {
    for (j = 0; j < positionsHit.length; j++) {
      const dirtString = dirtPositions[i].toString()
      const positionsString = positionsHit[j].toString()
      if (dirtString === positionsString) {
        cleanedSpaces++
        //we can break out as soonn as one of the positions matches
        break;
      }
    }
  }
  return cleanedSpaces
}



const run = () => {
  const {
    currentPosition,
    positionsHit
  } = solve()
  const spacesCleaned = checkDirt(positionsHit)
  console.log(currentPosition[0] + " " + currentPosition[1])
  console.log(spacesCleaned)
}


run()
