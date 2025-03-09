// Moves instance away from another enemy (Provides Object Overlap Protection)
var dir;
var move_dis = 4;  // pixels to move away from other object in collision

// Determine horizontal direction only (either 0 or 180 degrees)
if (x < other.x)
    dir = 180;  // Move left
else if (x > other.x)
    dir = 0;    // Move right
else
    dir = choose(0, 180);  // If exactly same x position, choose randomly

// Calculate horizontal movement only
var dx = lengthdir_x(move_dis, dir);

// Check collisions and move only horizontally
if (!place_meeting(x+dx, y, oSpikes)) x += dx;
if (!place_meeting(x+dx, y, oDuck)) x += dx;